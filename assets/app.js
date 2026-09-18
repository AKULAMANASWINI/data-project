/* Career tracker — state, day-plan generation, views and charts. */

const STORAGE_KEY = 'de-career-tracker-v1';
const MS_DAY = 86400000;

/* ---------- dates ---------- */

const parseISO = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const daysBetween = (a, b) => Math.round((parseISO(iso(b)) - parseISO(iso(a))) / MS_DAY);
const todayISO = () => iso(new Date());
const fmtLong = (d) => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = (d) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const fmtMonthYear = (d) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const ANCHOR = parseISO(PLAN.anchorMonday);
const TARGET = parseISO(PLAN.targetDate);
const START = parseISO(PLAN.startDate);

const weekIndexOf = (date) => Math.floor(daysBetween(ANCHOR, date) / 7);
const mondayOfWeek = (weekIndex) => addDays(ANCHOR, weekIndex * 7);

/* ---------- plan generation ---------- */

function phaseForWeek(weekIndex) {
  let cursor = 0;
  for (let i = 0; i < PLAN.phases.length; i++) {
    const phase = PLAN.phases[i];
    const span = phase.weeks;
    if (span === null || weekIndex < cursor + span) {
      return { phase, index: i, startWeek: cursor, weekInPhase: Math.max(0, weekIndex - cursor) };
    }
    cursor += span;
  }
  const last = PLAN.phases[PLAN.phases.length - 1];
  return { phase: last, index: PLAN.phases.length - 1, startWeek: cursor, weekInPhase: weekIndex - cursor };
}

function phaseBounds(phaseIndex) {
  let cursor = 0;
  for (let i = 0; i < phaseIndex; i++) cursor += PLAN.phases[i].weeks || 0;
  const phase = PLAN.phases[phaseIndex];
  const start = mondayOfWeek(cursor);
  const end = phase.weeks ? addDays(mondayOfWeek(cursor + phase.weeks), -1) : null;
  return { start, end, startWeek: cursor };
}

function buildDay(dateStr) {
  const date = parseISO(dateStr);
  const weekIndex = Math.max(0, weekIndexOf(date));
  const { phase, index: phaseIndex, weekInPhase } = phaseForWeek(weekIndex);
  const topics = phase.topics;
  const a = topics[(weekInPhase * 2) % topics.length];
  const b = topics[(weekInPhase * 2 + 1) % topics.length];
  const built = TEMPLATES[phase.kind](date.getDay(), a, b, phase);
  const tasks = built.tasks.map((task, i) => ({ ...task, id: `t${i}` }));
  return {
    date, dateStr, weekIndex, phase, phaseIndex, weekInPhase,
    topicA: a, topicB: b,
    focus: built.focus,
    tasks,
    totalMinutes: tasks.reduce((s, x) => s + x.minutes, 0),
  };
}

/* ---------- state ---------- */

let state = loadState();
let selectedDate = todayISO();
let activeView = 'today';

function loadStateFrom(parsed) {
  const blank = {
    v: 1, resetToken: PLAN.resetToken, days: {}, skills: {}, board: [], boardSeeded: false,
    stories: [], mistakes: [], mocks: [], apps: [], theme: 'auto',
  };
  const list = (v) => (Array.isArray(v) ? v : []);
  return {
    ...blank,
    ...parsed,
    // Always stamped with the current token, so an imported backup is not wiped on reload.
    resetToken: PLAN.resetToken,
    theme: parsed.theme || 'auto',
    days: parsed.days || {},
    skills: parsed.skills || {},
    board: list(parsed.board),
    stories: list(parsed.stories),
    mistakes: list(parsed.mistakes),
    mocks: list(parsed.mocks),
    apps: list(parsed.apps),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // A new reset token means the plan was restarted: keep the theme, drop the rest.
    if (parsed.resetToken !== PLAN.resetToken) {
      const fresh = loadStateFrom({ theme: parsed.theme });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return loadStateFrom(parsed);
  } catch {
    return loadStateFrom({});
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    toast('Could not save — browser storage is blocked or full.');
  }
}

const dayRecord = (dateStr) => state.days[dateStr] || { tasks: {}, note: '', done: false };

function updateDay(dateStr, patch) {
  state.days[dateStr] = { ...dayRecord(dateStr), ...patch };
  saveState();
}

function dayStats(dateStr) {
  const plan = buildDay(dateStr);
  const rec = dayRecord(dateStr);
  const doneMinutes = plan.tasks.reduce((s, task) => s + (rec.tasks[task.id] ? task.minutes : 0), 0);
  const doneCount = plan.tasks.filter((task) => rec.tasks[task.id]).length;
  const ratio = plan.totalMinutes ? doneMinutes / plan.totalMinutes : 0;
  const complete = rec.done || (plan.tasks.length > 0 && doneCount === plan.tasks.length);
  return { plan, rec, doneMinutes, doneCount, ratio, complete };
}

function streaks() {
  let current = 0;
  let cursor = parseISO(todayISO());
  if (!dayStats(todayISO()).complete) cursor = addDays(cursor, -1);
  while (daysBetween(START, cursor) >= 0 && dayStats(iso(cursor)).complete) {
    current++;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  let run = 0;
  const keys = Object.keys(state.days).sort();
  if (keys.length) {
    let d = parseISO(keys[0]);
    const last = parseISO(keys[keys.length - 1]);
    while (daysBetween(d, last) >= 0) {
      if (dayStats(iso(d)).complete) { run++; best = Math.max(best, run); } else { run = 0; }
      d = addDays(d, 1);
    }
  }
  return { current, best: Math.max(best, current) };
}

function overallStats() {
  let completeDays = 0;
  let minutes = 0;
  let tasksDone = 0;
  const now = new Date();
  for (const dateStr of Object.keys(state.days)) {
    const s = dayStats(dateStr);
    const inRange = daysBetween(START, parseISO(dateStr)) >= 0 && daysBetween(parseISO(dateStr), now) >= 0;
    if (s.complete && inRange) completeDays++;
    minutes += s.doneMinutes;
    tasksDone += s.doneCount;
  }
  const total = daysBetween(START, TARGET) + 1;
  const elapsed = Math.min(total, Math.max(1, daysBetween(START, now) + 1));
  const remaining = daysBetween(now, TARGET);
  return {
    completeDays, minutes, tasksDone, elapsed, total, remaining,
    consistency: Math.min(1, completeDays / elapsed),
    ...streaks(),
  };
}

/* ---------- small helpers ---------- */

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};
const $ = (sel) => document.querySelector(sel);
const hours = (m) => (m / 60).toFixed(m % 60 === 0 ? 0 : 1);

let toastTimer;
function toast(msg) {
  const node = $('#toast');
  node.textContent = msg;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 3200);
}

const tooltip = () => $('#tooltip');
function showTip(event, html) {
  const tip = tooltip();
  tip.innerHTML = html;
  tip.hidden = false;
  const rect = tip.getBoundingClientRect();
  let x = event.clientX + 14;
  let y = event.clientY - rect.height - 10;
  if (x + rect.width > window.innerWidth - 8) x = window.innerWidth - rect.width - 8;
  if (y < 8) y = event.clientY + 18;
  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
}
const hideTip = () => { tooltip().hidden = true; };

const RAMP = ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6', '#184f95'];
function rampStep(ratio) {
  if (ratio <= 0) return null;
  if (ratio < 0.25) return RAMP[0];
  if (ratio < 0.5) return RAMP[1];
  if (ratio < 0.75) return RAMP[2];
  if (ratio < 1) return RAMP[3];
  return RAMP[4];
}

/* ---------- header ---------- */

function renderHeader() {
  const stats = overallStats();
  $('#countdown-days').textContent = Math.max(0, stats.remaining);
  $('#countdown-sub').textContent = `days to ${fmtShort(TARGET)} ${TARGET.getFullYear()}`;
  $('#header-streak').textContent = `${stats.current}-day streak`;
  const pct = Math.min(100, Math.round((stats.elapsed / stats.total) * 100));
  $('#header-progress-fill').style.width = `${pct}%`;
  $('#header-progress-label').textContent = `Week ${weekIndexOf(new Date()) + 1} of ${Math.ceil(stats.total / 7)} · ${pct}% of the runway elapsed`;
}

/* ---------- today view ---------- */

function renderToday() {
  const root = $('#view-today');
  root.innerHTML = '';
  const { plan, rec, doneMinutes, ratio, complete } = dayStats(selectedDate);
  const isToday = selectedDate === todayISO();

  const nav = el('div', 'day-nav');
  const prev = el('button', 'btn ghost', '‹ Prev');
  prev.onclick = () => { selectedDate = iso(addDays(parseISO(selectedDate), -1)); render(); };
  const next = el('button', 'btn ghost', 'Next ›');
  next.onclick = () => { selectedDate = iso(addDays(parseISO(selectedDate), 1)); render(); };
  const picker = el('input', 'date-input');
  picker.type = 'date';
  picker.value = selectedDate;
  picker.onchange = () => { if (picker.value) { selectedDate = picker.value; render(); } };
  const today = el('button', 'btn ghost', 'Today');
  today.onclick = () => { selectedDate = todayISO(); render(); };
  nav.append(prev, picker, next, today);

  const head = el('div', 'card day-head');
  const title = el('div', 'day-head-main');
  title.append(el('p', 'eyebrow', `${plan.phase.name} · week ${plan.weekInPhase + 1}${plan.phase.weeks ? ` of ${plan.phase.weeks}` : ''}`));
  const h = el('h2', null, isToday ? `Today — ${fmtLong(plan.date)}` : fmtLong(plan.date));
  title.append(h, el('p', 'focus', `Focus: ${plan.focus}`));
  head.append(title, nav);

  const ring = el('div', 'day-ring');
  const pct = Math.round(ratio * 100);
  ring.innerHTML = `<div class="ring" style="--pct:${pct}"><span>${pct}%</span></div>
    <p class="muted small">${hours(doneMinutes)}h of ${hours(plan.totalMinutes)}h planned</p>`;
  head.append(ring);
  root.append(head);

  const list = el('div', 'card task-card');
  list.append(el('h3', null, `Schedule — ${plan.tasks.length} blocks, ${hours(plan.totalMinutes)}h total`));
  let clock = 0;
  plan.tasks.forEach((task) => {
    const row = el('label', `task${rec.tasks[task.id] ? ' is-done' : ''}`);
    const box = el('input');
    box.type = 'checkbox';
    box.checked = !!rec.tasks[task.id];
    box.onchange = () => {
      const tasks = { ...dayRecord(selectedDate).tasks, [task.id]: box.checked };
      if (!box.checked) delete tasks[task.id];
      updateDay(selectedDate, { tasks });
      render();
    };
    const body = el('div', 'task-body');
    const topLine = el('div', 'task-top');
    topLine.append(el('span', 'task-title', task.title), el('span', `tag tag-${task.tag}`, task.tag));
    body.append(topLine);
    if (task.detail) body.append(el('p', 'task-detail', task.detail));
    const meta = el('p', 'task-meta');
    const startMin = clock;
    clock += task.minutes;
    meta.textContent = `${task.minutes} min · block ${Math.floor(startMin / 60)}h${String(startMin % 60).padStart(2, '0')}–${Math.floor(clock / 60)}h${String(clock % 60).padStart(2, '0')} into the session`;
    body.append(meta);
    row.append(box, body);
    list.append(row);
  });

  const actions = el('div', 'day-actions');
  const markBtn = el('button', `btn ${complete ? 'btn-done' : 'primary'}`, complete ? '✓ Day complete' : 'Mark day complete');
  markBtn.onclick = () => {
    const nowDone = !complete;
    const tasks = { ...dayRecord(selectedDate).tasks };
    if (nowDone) plan.tasks.forEach((task) => { tasks[task.id] = true; });
    updateDay(selectedDate, { done: nowDone, tasks: nowDone ? tasks : {} });
    render();
    if (nowDone) toast('Logged. Streak updated.');
  };
  actions.append(markBtn);
  list.append(actions);
  root.append(list);

  const notes = el('div', 'card log-card');
  notes.append(el('h3', null, 'Progress log'));
  notes.append(el('p', 'muted small', 'What you actually did, what blocked you, what to carry into tomorrow. This is your interview story material.'));
  const area = el('textarea', 'note-input');
  area.rows = 5;
  area.placeholder = 'e.g. Window functions clicked — rewrote 4 self-joins. Still shaky on RANGE vs ROWS frames.';
  area.value = rec.note || '';
  let noteTimer;
  area.oninput = () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      updateDay(selectedDate, { note: area.value });
      $('#note-saved').textContent = 'Saved';
      setTimeout(() => { const n = $('#note-saved'); if (n) n.textContent = ''; }, 1500);
    }, 500);
  };
  notes.append(area);
  const saved = el('p', 'muted small', '');
  saved.id = 'note-saved';
  notes.append(saved);
  root.append(notes);

  const context = el('div', 'card context-card');
  context.append(el('h3', null, 'This week in context'));
  const grid = el('div', 'context-grid');
  grid.append(contextCell('Phase', plan.phase.name, plan.phase.subtitle));
  grid.append(contextCell('Topic A (Mon/Tue)', plan.topicA.name, plan.topicA.theory));
  grid.append(contextCell('Topic B (Wed/Thu)', plan.topicB.name, plan.topicB.theory));
  grid.append(contextCell('Phase milestone', plan.phase.milestone, plan.phase.project));
  context.append(grid);
  if (plan.phase.resources?.length) {
    const res = el('p', 'res-line');
    res.append(el('span', 'muted small', 'Primary sources: '));
    plan.phase.resources.forEach((r, i) => {
      const a = el('a', null, r.label);
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener';
      res.append(a);
      if (i < plan.phase.resources.length - 1) res.append(el('span', 'muted', ' · '));
    });
    context.append(res);
  }
  root.append(context);
}

function contextCell(label, value, detail) {
  const cell = el('div', 'context-cell');
  cell.append(el('p', 'eyebrow', label), el('p', 'context-value', value));
  if (detail) cell.append(el('p', 'muted small', detail));
  return cell;
}

/* ---------- week view ---------- */

function renderWeek() {
  const root = $('#view-week');
  root.innerHTML = '';
  const wIndex = Math.max(0, weekIndexOf(parseISO(selectedDate)));
  const monday = mondayOfWeek(wIndex);
  const { phase, weekInPhase } = phaseForWeek(wIndex);

  const head = el('div', 'card week-head');
  const left = el('div');
  left.append(el('p', 'eyebrow', `${phase.name} · week ${weekInPhase + 1}${phase.weeks ? ` of ${phase.weeks}` : ''}`));
  left.append(el('h2', null, `Week of ${fmtShort(monday)} – ${fmtShort(addDays(monday, 6))}`));
  left.append(el('p', 'muted', phase.subtitle));
  const nav = el('div', 'day-nav');
  const prev = el('button', 'btn ghost', '‹ Prev week');
  prev.onclick = () => { selectedDate = iso(addDays(parseISO(selectedDate), -7)); render(); };
  const next = el('button', 'btn ghost', 'Next week ›');
  next.onclick = () => { selectedDate = iso(addDays(parseISO(selectedDate), 7)); render(); };
  nav.append(prev, next);
  head.append(left, nav);
  root.append(head);

  const grid = el('div', 'week-grid');
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const dateStr = iso(d);
    const { plan, ratio, complete } = dayStats(dateStr);
    const card = el('button', `card day-card${dateStr === todayISO() ? ' is-today' : ''}${complete ? ' is-complete' : ''}`);
    card.onclick = () => { selectedDate = dateStr; setView('today'); };
    card.append(el('p', 'eyebrow', `${DAY_NAMES[d.getDay()].slice(0, 3)} · ${fmtShort(d)}`));
    card.append(el('p', 'day-card-focus', plan.focus));
    const bar = el('div', 'mini-bar');
    const fill = el('div', 'mini-bar-fill');
    fill.style.width = `${Math.round(ratio * 100)}%`;
    bar.append(fill);
    card.append(bar);
    card.append(el('p', 'muted small', `${plan.tasks.length} blocks · ${hours(plan.totalMinutes)}h${complete ? ' · done' : ''}`));
    grid.append(card);
  }
  root.append(grid);
}

/* ---------- roadmap view ---------- */

function renderRoadmap() {
  const root = $('#view-roadmap');
  root.innerHTML = '';
  const intro = el('div', 'card');
  intro.append(el('h2', null, 'The 15-month route'));
  intro.append(el('p', 'muted', `From ${fmtLong(START)} to ${PLAN.targetLabel} by ${fmtShort(TARGET)} ${TARGET.getFullYear()}. Each phase stacks on the one before it; the weekly shape stays the same so the habit never resets.`));
  root.append(intro);

  const currentWeek = weekIndexOf(new Date());
  const grid = el('div', 'phase-grid');
  root.append(grid);
  PLAN.phases.forEach((phase, i) => {
    const { start, end, startWeek } = phaseBounds(i);
    const isCurrent = currentWeek >= startWeek && (phase.weeks === null || currentWeek < startWeek + phase.weeks);
    const isPast = phase.weeks !== null && currentWeek >= startWeek + phase.weeks;
    const card = el('div', `card phase-card${isCurrent ? ' is-current' : ''}${isPast ? ' is-past' : ''}`);

    const head = el('div', 'phase-head');
    const titles = el('div');
    titles.append(el('p', 'eyebrow', `Phase ${i + 1} · ${fmtMonthYear(start)}${end ? ` – ${fmtMonthYear(end)}` : ' onward'} · ${phase.weeks ? `${phase.weeks} weeks` : 'open-ended'}`));
    titles.append(el('h3', null, phase.name));
    titles.append(el('p', 'muted', phase.subtitle));
    head.append(titles);
    if (isCurrent) head.append(el('span', 'pill pill-current', 'Current'));
    else if (isPast) head.append(el('span', 'pill', 'Done'));
    card.append(head);

    const milestone = el('p', 'milestone');
    milestone.append(el('strong', null, 'Milestone: '), document.createTextNode(phase.milestone));
    card.append(milestone);

    const topicList = el('ul', 'topic-list');
    phase.topics.forEach((topic) => {
      const li = el('li');
      li.append(el('span', 'topic-name', topic.name));
      li.append(el('span', 'muted small', topic.theory));
      topicList.append(li);
    });
    card.append(topicList);

    if (phase.weeks) {
      const stats = phaseProgress(start, end);
      const bar = el('div', 'mini-bar');
      const fill = el('div', 'mini-bar-fill');
      fill.style.width = `${Math.round(stats.ratio * 100)}%`;
      bar.append(fill);
      card.append(bar);
      card.append(el('p', 'muted small', `${stats.done} of ${stats.elapsed} elapsed days logged complete`));
    }
    grid.append(card);
  });
}

function phaseProgress(start, end) {
  const now = new Date();
  const last = end && daysBetween(end, now) > 0 ? end : now;
  const span = Math.max(0, daysBetween(start, last) + 1);
  let done = 0;
  for (let i = 0; i < span; i++) {
    if (dayStats(iso(addDays(start, i))).complete) done++;
  }
  return { done, elapsed: span, ratio: span ? done / span : 0 };
}

/* ---------- progress view ---------- */

function renderProgress() {
  const root = $('#view-progress');
  root.innerHTML = '';
  const s = overallStats();

  const tiles = el('div', 'tile-row');
  tiles.append(tile('Days to target', String(Math.max(0, s.remaining)), `until ${fmtShort(TARGET)} ${TARGET.getFullYear()}`));
  tiles.append(tile('Current streak', String(s.current), `best ${s.best}`));
  tiles.append(tile('Days logged', String(s.completeDays), `${Math.round(s.consistency * 100)}% of days so far`));
  tiles.append(tile('Focused hours', hours(s.minutes), `${s.tasksDone} blocks completed`));
  root.append(tiles);

  const heat = el('div', 'card');
  heat.append(el('h3', null, 'Daily consistency'));
  heat.append(el('p', 'muted small', 'Each cell is a day, shaded by the share of that day\'s planned minutes you completed. Click a cell to open it.'));
  heat.append(heatmap());
  const legend = el('div', 'legend');
  legend.append(el('span', 'muted small', 'Less'));
  [null, ...RAMP].forEach((c) => {
    const sw = el('span', 'legend-cell');
    if (c) sw.style.background = c;
    legend.append(sw);
  });
  legend.append(el('span', 'muted small', 'More'));
  heat.append(legend);
  root.append(heat);

  const weekly = el('div', 'card');
  weekly.append(el('h3', null, 'Hours completed per week'));
  weekly.append(el('p', 'muted small', 'Last 12 weeks. Bars show hours from completed blocks; the dashed line is the weekly plan.'));
  const { chart, table } = weeklyChart();
  weekly.append(chart);
  const toggle = el('button', 'btn ghost small-btn', 'Show data table');
  const tableWrap = el('div');
  tableWrap.hidden = true;
  tableWrap.append(table);
  toggle.onclick = () => {
    tableWrap.hidden = !tableWrap.hidden;
    toggle.textContent = tableWrap.hidden ? 'Show data table' : 'Hide data table';
  };
  weekly.append(toggle, tableWrap);
  root.append(weekly);

  const recent = el('div', 'card');
  recent.append(el('h3', null, 'Recent log entries'));
  const notes = Object.entries(state.days)
    .filter(([, rec]) => rec.note && rec.note.trim())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 8);
  if (!notes.length) {
    recent.append(el('p', 'muted', 'No entries yet. Write one at the end of today\'s session — it takes two minutes and becomes your STAR story bank.'));
  } else {
    notes.forEach(([dateStr, rec]) => {
      const item = el('div', 'log-item');
      item.append(el('p', 'eyebrow', fmtLong(parseISO(dateStr))));
      item.append(el('p', null, rec.note));
      recent.append(item);
    });
  }
  root.append(recent);
}

function tile(label, value, sub) {
  const node = el('div', 'card tile');
  node.append(el('p', 'eyebrow', label), el('p', 'tile-value', value), el('p', 'muted small', sub));
  return node;
}

function heatmap() {
  const wrap = el('div', 'heat-wrap');
  const grid = el('div', 'heat-grid');
  const currentWeek = Math.max(0, weekIndexOf(new Date()));
  const firstWeek = Math.max(0, currentWeek - 19);
  const lastWeek = Math.max(currentWeek + 1, firstWeek + 20);
  for (let w = firstWeek; w <= lastWeek; w++) {
    const col = el('div', 'heat-col');
    const monday = mondayOfWeek(w);
    const label = el('p', 'heat-label', monday.getDate() <= 7 ? fmtMonthYear(monday).split(' ')[0] : '');
    col.append(label);
    for (let d = 0; d < 7; d++) {
      const dateStr = iso(addDays(monday, d));
      const { ratio, plan, complete } = dayStats(dateStr);
      const cell = el('button', 'heat-cell');
      const color = rampStep(ratio);
      if (color) cell.style.background = color;
      if (dateStr === todayISO()) cell.classList.add('is-today');
      if (daysBetween(new Date(), parseISO(dateStr)) > 0) cell.classList.add('is-future');
      const beforeStart = daysBetween(START, parseISO(dateStr)) < 0;
      if (beforeStart) cell.classList.add('is-before');
      cell.setAttribute('aria-label', beforeStart ? `${dateStr}: before the plan started` : `${dateStr}: ${Math.round(ratio * 100)}% complete`);
      const tip = beforeStart
        ? `<strong>${fmtLong(parseISO(dateStr))}</strong><br>Before the plan started`
        : `<strong>${fmtLong(parseISO(dateStr))}</strong><br>${plan.focus}<br>${Math.round(ratio * 100)}% of ${hours(plan.totalMinutes)}h${complete ? ' · complete' : ''}`;
      cell.onmousemove = (e) => showTip(e, tip);
      cell.onmouseleave = hideTip;
      cell.onclick = () => { hideTip(); selectedDate = dateStr; setView('today'); };
      col.append(cell);
    }
    grid.append(col);
  }
  wrap.append(grid);
  return wrap;
}

function weeklyChart() {
  const currentWeek = Math.max(0, weekIndexOf(new Date()));
  const first = Math.max(0, currentWeek - 11);
  const last = Math.max(currentWeek, first + 7);
  const rows = [];
  for (let w = first; w <= last; w++) {
    const monday = mondayOfWeek(w);
    let done = 0;
    let planned = 0;
    for (let d = 0; d < 7; d++) {
      const s = dayStats(iso(addDays(monday, d)));
      done += s.doneMinutes;
      planned += s.plan.totalMinutes;
    }
    rows.push({ week: w, monday, done, planned });
  }
  const max = Math.max(...rows.map((r) => Math.max(r.done, r.planned)), 60);

  const chart = el('div', 'bar-chart');
  const plot = el('div', 'bar-plot');
  [0.5, 1].forEach((frac) => {
    const line = el('div', 'grid-line');
    line.style.bottom = `${frac * 100}%`;
    line.dataset.label = `${hours(max * frac)}h`;
    plot.append(line);
  });
  const plannedAvg = rows.reduce((s, r) => s + r.planned, 0) / rows.length;
  const guide = el('div', 'plan-guide');
  guide.style.bottom = `${(plannedAvg / max) * 100}%`;
  guide.dataset.label = `plan ~${hours(plannedAvg)}h`;
  plot.append(guide);

  rows.forEach((r) => {
    const col = el('div', 'bar-col');
    const bar = el('div', 'bar');
    bar.style.height = `${Math.max(1, (r.done / max) * 100)}%`;
    if (r.done === 0) bar.classList.add('is-empty');
    const tip = `<strong>Week of ${fmtShort(r.monday)}</strong><br>${hours(r.done)}h completed of ${hours(r.planned)}h planned`;
    col.onmousemove = (e) => showTip(e, tip);
    col.onmouseleave = hideTip;
    col.append(bar);
    const lbl = el('p', 'bar-label', fmtShort(r.monday));
    col.append(lbl);
    plot.append(col);
  });
  chart.append(plot);

  const table = el('table', 'data-table');
  table.innerHTML = '<thead><tr><th>Week of</th><th>Hours completed</th><th>Hours planned</th></tr></thead>';
  const tbody = el('tbody');
  rows.forEach((r) => {
    const tr = el('tr');
    tr.append(el('td', null, fmtShort(r.monday)), el('td', null, `${hours(r.done)}h`), el('td', null, `${hours(r.planned)}h`));
    tbody.append(tr);
  });
  table.append(tbody);
  return { chart, table };
}

/* ---------- skills view ---------- */

function renderSkills() {
  const root = $('#view-skills');
  root.innerHTML = '';
  const head = el('div', 'card');
  head.append(el('h2', null, 'Skill matrix'));
  head.append(el('p', 'muted', 'Rate yourself honestly at every Sunday retro. The dashed segments are the gap between where you are and the level the role needs — that gap is your interview risk list, in priority order.'));
  const legend = el('div', 'legend legend-inline');
  legend.append(el('span', 'seg is-filled legend-seg'), el('span', 'muted small', 'Where you are'));
  legend.append(el('span', 'seg is-gap legend-seg'), el('span', 'muted small', 'Gap to the target level'));
  head.append(legend);
  head.append(el('p', 'muted small', 'Click a segment to set the level.'));
  root.append(head);

  const card = el('div', 'card skill-list');
  PLAN.skills.forEach((skill) => {
    const row = el('div', 'skill-row');
    const top = el('div', 'skill-top');
    top.append(el('span', 'skill-name', skill.name));
    const levelText = el('span', 'skill-level');
    top.append(levelText);
    row.append(top);

    const track = el('div', 'skill-track');
    row.append(track);

    const paint = () => {
      const level = state.skills[skill.id] ?? 0;
      const met = level >= skill.target;
      levelText.textContent = met
        ? `${PLAN.levels[level]} ✓`
        : `${PLAN.levels[level]} → ${PLAN.levels[skill.target]}`;
      levelText.classList.toggle('is-met', met);
      track.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const seg = el('button', 'seg');
        if (i <= level) seg.classList.add('is-filled');
        else if (i <= skill.target) seg.classList.add('is-gap');
        if (i === skill.target) seg.classList.add('is-target');
        seg.setAttribute('aria-label', `${skill.name}: set to ${PLAN.levels[i]}`);
        seg.onmousemove = (e) => showTip(e, `<strong>${PLAN.levels[i]}</strong> (${i}/5)<br>${i === skill.target ? 'Target level for the role' : `Target: ${PLAN.levels[skill.target]}`}`);
        seg.onmouseleave = hideTip;
        seg.onclick = () => {
          state.skills[skill.id] = (state.skills[skill.id] ?? 0) === i ? i - 1 : i;
          saveState();
          paint();
        };
        track.append(seg);
      }
    };
    paint();
    card.append(row);
  });
  root.append(card);
}

/* ---------- reusable record dialog ---------- */

let formSave = null;
let formDelete = null;

function openForm({ title, fields, values = {}, onSave, onDelete }) {
  const wrap = $('#form-dialog-fields');
  wrap.innerHTML = '';
  $('#form-dialog-title').textContent = title;

  fields.forEach((f) => {
    const label = el('label', `field${f.full || f.type === 'textarea' ? ' full' : ''}`, f.label);
    let input;
    if (f.type === 'textarea') {
      input = el('textarea', 'note-input');
      input.rows = f.rows || 3;
    } else if (f.type === 'select') {
      input = el('select', 'date-input');
      f.options.forEach((o) => {
        const value = typeof o === 'string' ? o : o.value;
        const text = typeof o === 'string' ? o : o.label;
        const opt = el('option', null, text);
        opt.value = value;
        input.append(opt);
      });
    } else {
      input = el('input', 'date-input');
      input.type = f.type || 'text';
      if (f.type === 'number') { input.min = f.min ?? 0; input.max = f.max ?? 100; }
    }
    input.dataset.key = f.key;
    if (f.placeholder) input.placeholder = f.placeholder;
    if (f.required) input.required = true;
    if (f.maxlength) input.maxLength = f.maxlength;
    const val = values[f.key];
    input.value = val === undefined || val === null ? (f.default ?? '') : val;
    label.append(input);
    wrap.append(label);
  });

  formSave = () => {
    const out = {};
    wrap.querySelectorAll('[data-key]').forEach((node) => {
      out[node.dataset.key] = typeof node.value === 'string' ? node.value.trim() : node.value;
    });
    onSave(out);
  };
  formDelete = onDelete || null;
  $('#form-delete').hidden = !onDelete;
  $('#form-dialog').showModal();
  wrap.querySelector('input, textarea, select')?.focus();
}

const newId = () => `r${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

// Only http(s) links become anchors — anything else stays inert text.
const safeUrl = (url) => (/^https?:\/\//i.test(url || '') ? url : null);

function linkOrText(url, text) {
  const href = safeUrl(url);
  if (!href) return el('span', null, text);
  const a = el('a', null, text);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}

/* ---------- board ---------- */

const COLUMNS = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'week', name: 'This week' },
  { id: 'doing', name: 'In progress' },
  { id: 'blocked', name: 'Blocked' },
  { id: 'done', name: 'Done' },
];
const CARD_TYPES = ['epic', 'story', 'task'];

let boardFilter = 'all';

const epicOptions = () => [
  ...PLAN.phases.map((p, i) => ({ id: p.id, name: p.name, slot: i + 1 })),
  { id: 'general', name: 'General', slot: 8 },
];
const epicById = (id) => epicOptions().find((e) => e.id === id) || epicOptions()[epicOptions().length - 1];

function seedBoard() {
  if (state.boardSeeded) return;
  const currentWeek = Math.max(0, weekIndexOf(new Date()));
  const { phase: currentPhase } = phaseForWeek(currentWeek);
  const cards = PLAN.phases.map((phase, i) => ({
    id: `seed-${phase.id}`,
    title: phase.name,
    type: 'epic',
    epic: phase.id,
    status: phase.id === currentPhase.id ? 'doing' : 'backlog',
    note: phase.milestone,
    created: todayISO(),
    order: i,
  }));
  cards.push({
    id: `seed-${currentPhase.id}-project`,
    title: `Project: ${currentPhase.name}`,
    type: 'story',
    epic: currentPhase.id,
    status: 'week',
    note: currentPhase.project,
    created: todayISO(),
    order: cards.length,
  });
  state.board = cards;
  state.boardSeeded = true;
  saveState();
}

function renderBoard() {
  const root = $('#view-board');
  root.innerHTML = '';
  seedBoard();

  const head = el('div', 'card board-head');
  const left = el('div');
  left.append(el('h2', null, 'Board'));
  left.append(el('p', 'muted', 'Epics are the phases, stories are the things you ship, tasks are the next concrete moves. Drag a card between columns, or use the arrows on small screens.'));
  head.append(left);

  const controls = el('div', 'board-controls');
  const filter = el('select', 'date-input');
  filter.setAttribute('aria-label', 'Filter by epic');
  const optAll = el('option', null, 'All epics');
  optAll.value = 'all';
  filter.append(optAll);
  epicOptions().forEach((e) => {
    const opt = el('option', null, e.name);
    opt.value = e.id;
    filter.append(opt);
  });
  filter.value = boardFilter;
  filter.onchange = () => { boardFilter = filter.value; renderBoard(); };
  const addBtn = el('button', 'btn primary', '+ New card');
  addBtn.onclick = () => openCard(null, 'backlog');
  controls.append(filter, addBtn);
  head.append(controls);
  root.append(head);

  const visible = state.board.filter((c) => boardFilter === 'all' || c.epic === boardFilter);
  const board = el('div', 'board');
  COLUMNS.forEach((col) => {
    const column = el('div', 'board-col');
    const colHead = el('div', 'board-col-head');
    const items = visible.filter((c) => c.status === col.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    colHead.append(el('span', 'board-col-name', col.name), el('span', 'board-col-count', String(items.length)));
    column.append(colHead);

    const drop = el('div', 'board-drop');
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('is-over'); };
    drop.ondragleave = () => drop.classList.remove('is-over');
    drop.ondrop = (e) => {
      e.preventDefault();
      drop.classList.remove('is-over');
      moveCard(e.dataTransfer.getData('text/plain'), col.id);
    };
    items.forEach((item) => drop.append(boardCard(item, col.id)));
    if (!items.length) drop.append(el('p', 'board-empty', 'Nothing here'));
    column.append(drop);

    const add = el('button', 'btn ghost small-btn board-add', '+ Add');
    add.onclick = () => openCard(null, col.id);
    column.append(add);
    board.append(column);
  });
  root.append(board);
}

function boardCard(item, colId) {
  const epic = epicById(item.epic);
  const card = el('div', `board-card${item.status === 'done' ? ' is-done' : ''}`);
  card.draggable = true;
  card.ondragstart = (e) => {
    e.dataTransfer.setData('text/plain', item.id);
    card.classList.add('is-dragging');
  };
  card.ondragend = () => card.classList.remove('is-dragging');

  const top = el('div', 'board-card-top');
  const chip = el('span', 'epic-chip', epic.name);
  chip.style.setProperty('--chip', `var(--epic-${epic.slot})`);
  top.append(chip, el('span', `type-badge type-${item.type}`, item.type));
  card.append(top);

  const title = el('button', 'board-card-title', item.title);
  title.onclick = () => openCard(item.id);
  card.append(title);
  if (item.note) card.append(el('p', 'board-card-note', item.note));

  const foot = el('div', 'board-card-foot');
  const idx = COLUMNS.findIndex((c) => c.id === colId);
  const left = el('button', 'move-btn', '‹');
  left.title = 'Move left';
  left.disabled = idx === 0;
  left.onclick = () => moveCard(item.id, COLUMNS[idx - 1].id);
  const right = el('button', 'move-btn', '›');
  right.title = 'Move right';
  right.disabled = idx === COLUMNS.length - 1;
  right.onclick = () => moveCard(item.id, COLUMNS[idx + 1].id);
  foot.append(left, right);
  card.append(foot);
  return card;
}

function moveCard(id, status) {
  const item = state.board.find((c) => c.id === id);
  if (!item || item.status === status) return;
  item.status = status;
  item.order = Date.now();
  saveState();
  renderBoard();
}

function openCard(id, presetStatus) {
  const item = id ? state.board.find((c) => c.id === id) : null;
  const currentPhase = phaseForWeek(Math.max(0, weekIndexOf(new Date()))).phase;
  openForm({
    title: item ? 'Edit card' : 'New card',
    fields: [
      { key: 'title', label: 'Title', full: true, required: true, maxlength: 120, placeholder: 'e.g. Build the SCD-2 customer dimension' },
      { key: 'type', label: 'Type', type: 'select', options: CARD_TYPES, default: 'task' },
      { key: 'epic', label: 'Epic', type: 'select', options: epicOptions().map((e) => ({ value: e.id, label: e.name })), default: currentPhase.id },
      { key: 'status', label: 'Column', type: 'select', options: COLUMNS.map((c) => ({ value: c.id, label: c.name })), default: presetStatus || 'backlog' },
      { key: 'note', label: 'Notes', type: 'textarea', placeholder: 'Acceptance criteria, blockers, links' },
    ],
    values: item || {},
    onSave: (vals) => {
      if (!vals.title) return;
      if (item) Object.assign(item, vals);
      else state.board.push({ id: newId(), created: todayISO(), order: Date.now(), ...vals });
      saveState();
      renderBoard();
    },
    onDelete: item ? () => {
      state.board = state.board.filter((c) => c.id !== item.id);
      saveState();
      renderBoard();
      toast('Card deleted.');
    } : null,
  });
}

/* ---------- journal ---------- */

let journalQuery = '';
let journalPhase = 'all';

function renderJournal() {
  const root = $('#view-journal');
  root.innerHTML = '';

  const entries = Object.entries(state.days)
    .filter(([, rec]) => rec.note && rec.note.trim())
    .map(([dateStr, rec]) => {
      const plan = buildDay(dateStr);
      return { dateStr, note: rec.note, phase: plan.phase, focus: plan.focus };
    })
    .sort((a, b) => b.dateStr.localeCompare(a.dateStr));

  const q = journalQuery.toLowerCase();
  const shown = entries.filter((e) => {
    const matchesPhase = journalPhase === 'all' || e.phase.id === journalPhase;
    const matchesText = !q || e.note.toLowerCase().includes(q) || e.focus.toLowerCase().includes(q);
    return matchesPhase && matchesText;
  });

  const head = el('div', 'card board-head');
  const left = el('div');
  left.append(el('h2', null, 'Journal'));
  left.append(el('p', 'muted', 'Every progress-log entry you have written, newest first. Search it before an interview — this is where "tell me about a time you debugged something hard" comes from.'));
  head.append(left);

  const controls = el('div', 'board-controls');
  const search = el('input', 'date-input');
  search.type = 'search';
  search.placeholder = 'Search entries…';
  search.value = journalQuery;
  search.setAttribute('aria-label', 'Search journal');
  let timer;
  search.oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      journalQuery = search.value;
      renderJournal();
      $('#view-journal input[type="search"]').focus();
    }, 250);
  };
  const phaseSel = el('select', 'date-input');
  phaseSel.setAttribute('aria-label', 'Filter by phase');
  const all = el('option', null, 'All phases');
  all.value = 'all';
  phaseSel.append(all);
  PLAN.phases.forEach((p) => {
    const opt = el('option', null, p.name);
    opt.value = p.id;
    phaseSel.append(opt);
  });
  phaseSel.value = journalPhase;
  phaseSel.onchange = () => { journalPhase = phaseSel.value; renderJournal(); };
  controls.append(search, phaseSel);
  head.append(controls);
  root.append(head);

  const list = el('div', 'card');
  list.append(el('p', 'muted small', `${shown.length} of ${entries.length} entries`));
  if (!shown.length) {
    list.append(el('p', 'muted', entries.length
      ? 'Nothing matches that search.'
      : 'No entries yet. Write one line at the end of today\'s session — in a year this is the most valuable thing in the app.'));
  }
  shown.forEach((e) => {
    const item = el('div', 'journal-item');
    const top = el('div', 'journal-top');
    const date = el('button', 'journal-date', fmtLong(parseISO(e.dateStr)));
    date.onclick = () => { selectedDate = e.dateStr; setView('today'); };
    top.append(date, el('span', 'pill', e.phase.name));
    item.append(top);
    item.append(el('p', 'muted small', e.focus));
    item.append(el('p', 'journal-note', e.note));
    list.append(item);
  });
  root.append(list);
}

/* ---------- vault ---------- */

const STORY_THEMES = ['Impact', 'Conflict', 'Failure', 'Ambiguity', 'Collaboration', 'Leadership', 'Technical depth', 'Customer focus'];
const MISTAKE_AREAS = ['SQL', 'Python / DSA', 'Spark', 'Azure / Fabric', 'Data modeling', 'System design', 'Behavioral', 'Other'];
const MOCK_TYPES = ['SQL', 'Coding / DSA', 'System design', 'Data modeling', 'Behavioral', 'Full loop'];
const VAULT_SECTIONS = [
  { id: 'stories', name: 'STAR stories' },
  { id: 'mistakes', name: 'Mistakes log' },
  { id: 'mocks', name: 'Mock interviews' },
];

let vaultSection = 'stories';

function renderVault() {
  const root = $('#view-vault');
  root.innerHTML = '';

  const head = el('div', 'card board-head');
  const left = el('div');
  left.append(el('h2', null, 'Interview vault'));
  left.append(el('p', 'muted', 'The output of your Friday drills and Sunday retros, kept somewhere you can revise from. Stories to tell, mistakes to re-solve, mocks to measure.'));
  const seg = el('div', 'segmented');
  VAULT_SECTIONS.forEach((s) => {
    const btn = el('button', `seg-btn${vaultSection === s.id ? ' is-active' : ''}`, s.name);
    btn.onclick = () => { vaultSection = s.id; renderVault(); };
    seg.append(btn);
  });
  left.append(seg);
  head.append(left);

  const addBtn = el('button', 'btn primary', `+ New ${vaultSection === 'stories' ? 'story' : vaultSection === 'mistakes' ? 'mistake' : 'mock'}`);
  addBtn.onclick = () => {
    if (vaultSection === 'stories') openStory(null);
    else if (vaultSection === 'mistakes') openMistake(null);
    else openMock(null);
  };
  head.append(addBtn);
  root.append(head);

  if (vaultSection === 'stories') renderStories(root);
  if (vaultSection === 'mistakes') renderMistakes(root);
  if (vaultSection === 'mocks') renderMocks(root);
}

function renderStories(root) {
  const card = el('div', 'card');
  if (!state.stories.length) {
    card.append(el('p', 'muted', 'No stories yet. Sunday\'s retro asks for one STAR story a week — 30 by the time you interview. Situation, Task, Action, Result, and put numbers in the result.'));
  }
  state.stories.slice().sort((a, b) => (b.created || '').localeCompare(a.created || '')).forEach((s) => {
    const item = el('details', 'story');
    const summary = el('summary', 'story-summary');
    summary.append(el('span', 'story-title', s.title), el('span', 'pill', s.theme || 'Impact'));
    item.append(summary);
    [['Situation', s.situation], ['Task', s.task], ['Action', s.action], ['Result', s.result]].forEach(([label, text]) => {
      if (!text) return;
      const block = el('div', 'star-block');
      block.append(el('p', 'eyebrow', label), el('p', null, text));
      item.append(block);
    });
    const edit = el('button', 'btn ghost small-btn', 'Edit');
    edit.onclick = () => openStory(s.id);
    item.append(edit);
    card.append(item);
  });
  root.append(card);
}

function openStory(id) {
  const item = id ? state.stories.find((s) => s.id === id) : null;
  openForm({
    title: item ? 'Edit story' : 'New STAR story',
    fields: [
      { key: 'title', label: 'Title', full: true, required: true, maxlength: 120, placeholder: 'e.g. Cut the nightly load from 6h to 40min' },
      { key: 'theme', label: 'Theme', type: 'select', options: STORY_THEMES, full: true },
      { key: 'situation', label: 'Situation — the context', type: 'textarea' },
      { key: 'task', label: 'Task — what you owned', type: 'textarea' },
      { key: 'action', label: 'Action — what you actually did', type: 'textarea' },
      { key: 'result', label: 'Result — with numbers', type: 'textarea' },
    ],
    values: item || {},
    onSave: (vals) => {
      if (!vals.title) return;
      if (item) Object.assign(item, vals);
      else state.stories.push({ id: newId(), created: todayISO(), ...vals });
      saveState();
      renderVault();
    },
    onDelete: item ? () => {
      state.stories = state.stories.filter((s) => s.id !== item.id);
      saveState();
      renderVault();
      toast('Story deleted.');
    } : null,
  });
}

function renderMistakes(root) {
  const open = state.mistakes.filter((m) => m.status !== 'resolved');
  const done = state.mistakes.filter((m) => m.status === 'resolved');

  const card = el('div', 'card');
  if (!state.mistakes.length) {
    card.append(el('p', 'muted', 'Nothing logged. Every timed drill that goes wrong belongs here with the correction — re-solving these from scratch is what moves your pass rate.'));
  }
  if (open.length) card.append(el('p', 'eyebrow', `Open — ${open.length}`));
  open.sort((a, b) => (a.reviewOn || '9999').localeCompare(b.reviewOn || '9999')).forEach((m) => card.append(mistakeRow(m)));
  if (done.length) {
    card.append(el('p', 'eyebrow', `Re-solved — ${done.length}`));
    done.slice().reverse().forEach((m) => card.append(mistakeRow(m)));
  }
  root.append(card);
}

function mistakeRow(m) {
  const row = el('div', `mistake${m.status === 'resolved' ? ' is-resolved' : ''}`);
  const top = el('div', 'mistake-top');
  const title = el('button', 'mistake-title', m.title);
  title.onclick = () => openMistake(m.id);
  top.append(title, el('span', 'pill', m.area || 'Other'));
  const overdue = m.status !== 'resolved' && m.reviewOn && daysBetween(parseISO(m.reviewOn), new Date()) >= 0;
  if (m.reviewOn) {
    const due = el('span', `due${overdue ? ' is-overdue' : ''}`, `${overdue ? 'Re-solve due ' : 'Re-solve '}${fmtShort(parseISO(m.reviewOn))}`);
    top.append(due);
  }
  row.append(top);
  if (m.wrong) row.append(el('p', 'mistake-line', `Got wrong: ${m.wrong}`));
  if (m.fix) row.append(el('p', 'mistake-line', `Correction: ${m.fix}`));
  const toggle = el('button', 'btn ghost small-btn', m.status === 'resolved' ? 'Reopen' : 'Mark re-solved');
  toggle.onclick = () => {
    m.status = m.status === 'resolved' ? 'open' : 'resolved';
    saveState();
    renderVault();
  };
  row.append(toggle);
  return row;
}

function openMistake(id) {
  const item = id ? state.mistakes.find((m) => m.id === id) : null;
  openForm({
    title: item ? 'Edit mistake' : 'Log a mistake',
    fields: [
      { key: 'title', label: 'Problem', full: true, required: true, maxlength: 140, placeholder: 'e.g. Gaps and islands — consecutive login streaks' },
      { key: 'area', label: 'Area', type: 'select', options: MISTAKE_AREAS },
      { key: 'reviewOn', label: 'Re-solve on', type: 'date', default: iso(addDays(new Date(), 7)) },
      { key: 'wrong', label: 'What you got wrong', type: 'textarea' },
      { key: 'fix', label: 'The correction', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'open', label: 'Open' }, { value: 'resolved', label: 'Re-solved' }], default: 'open' },
    ],
    values: item || {},
    onSave: (vals) => {
      if (!vals.title) return;
      if (item) Object.assign(item, vals);
      else state.mistakes.push({ id: newId(), created: todayISO(), ...vals });
      saveState();
      renderVault();
    },
    onDelete: item ? () => {
      state.mistakes = state.mistakes.filter((m) => m.id !== item.id);
      saveState();
      renderVault();
      toast('Entry deleted.');
    } : null,
  });
}

function renderMocks(root) {
  const mocks = state.mocks.slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  if (mocks.length) {
    const chartCard = el('div', 'card');
    chartCard.append(el('h3', null, 'Scores over time'));
    chartCard.append(el('p', 'muted small', 'Each bar is one mock, oldest first. Self-graded 1–5; what matters is the direction.'));
    const chart = el('div', 'bar-chart');
    const plot = el('div', 'bar-plot');
    [0.6, 1].forEach((frac) => {
      const line = el('div', 'grid-line');
      line.style.bottom = `${frac * 100}%`;
      line.dataset.label = `${(5 * frac).toFixed(0)}/5`;
      plot.append(line);
    });
    mocks.slice(-16).forEach((m) => {
      const col = el('div', 'bar-col');
      const bar = el('div', 'bar');
      bar.style.height = `${Math.max(2, (Number(m.score || 0) / 5) * 100)}%`;
      const tip = `<strong>${m.date ? fmtLong(parseISO(m.date)) : 'No date'}</strong><br>${m.type || ''} — ${m.score || '?'}/5${m.source ? `<br>${m.source}` : ''}`;
      col.onmousemove = (e) => showTip(e, tip);
      col.onmouseleave = hideTip;
      col.append(bar, el('p', 'bar-label', m.date ? fmtShort(parseISO(m.date)) : '—'));
      plot.append(col);
    });
    chart.append(plot);
    chartCard.append(chart);
    root.append(chartCard);
  }

  const card = el('div', 'card');
  if (!mocks.length) {
    card.append(el('p', 'muted', 'No mocks logged. From Phase 6 you run these weekly — log the score and the three fixes each time, or the feedback evaporates.'));
  }
  mocks.slice().reverse().forEach((m) => {
    const row = el('div', 'mock');
    const top = el('div', 'mistake-top');
    const title = el('button', 'mistake-title', `${m.type || 'Mock'} — ${m.score || '?'}/5`);
    title.onclick = () => openMock(m.id);
    top.append(title);
    if (m.date) top.append(el('span', 'pill', fmtShort(parseISO(m.date))));
    if (m.source) top.append(el('span', 'muted small', m.source));
    row.append(top);
    if (m.feedback) row.append(el('p', 'mistake-line', `Feedback: ${m.feedback}`));
    if (m.fixes) row.append(el('p', 'mistake-line', `Fixes: ${m.fixes}`));
    card.append(row);
  });
  root.append(card);
}

function openMock(id) {
  const item = id ? state.mocks.find((m) => m.id === id) : null;
  openForm({
    title: item ? 'Edit mock' : 'Log a mock interview',
    fields: [
      { key: 'date', label: 'Date', type: 'date', default: todayISO() },
      { key: 'type', label: 'Round', type: 'select', options: MOCK_TYPES },
      { key: 'score', label: 'Score (1–5)', type: 'select', options: ['1', '2', '3', '4', '5'], default: '3' },
      { key: 'source', label: 'With whom', placeholder: 'Peer, mentor, AI interviewer' },
      { key: 'feedback', label: 'Feedback', type: 'textarea' },
      { key: 'fixes', label: 'Three fixes before the next one', type: 'textarea' },
    ],
    values: item || {},
    onSave: (vals) => {
      if (item) Object.assign(item, vals);
      else state.mocks.push({ id: newId(), created: todayISO(), ...vals });
      saveState();
      renderVault();
    },
    onDelete: item ? () => {
      state.mocks = state.mocks.filter((m) => m.id !== item.id);
      saveState();
      renderVault();
      toast('Mock deleted.');
    } : null,
  });
}

/* ---------- applications ---------- */

const STAGES = [
  { id: 'researching', name: 'Researching' },
  { id: 'applied', name: 'Applied' },
  { id: 'recruiter', name: 'Recruiter screen' },
  { id: 'technical', name: 'Technical screen' },
  { id: 'loop', name: 'Onsite loop' },
  { id: 'offer', name: 'Offer' },
  { id: 'rejected', name: 'Rejected' },
  { id: 'withdrawn', name: 'Withdrawn' },
];
const CLOSED_STAGES = ['rejected', 'withdrawn'];
const INTERVIEW_STAGES = ['recruiter', 'technical', 'loop', 'offer'];
const stageName = (id) => (STAGES.find((s) => s.id === id) || STAGES[0]).name;

function renderApps(root = $('#view-apps')) {
  root.innerHTML = '';
  const apps = state.apps;

  const head = el('div', 'card board-head');
  const left = el('div');
  left.append(el('h2', null, 'Applications'));
  left.append(el('p', 'muted', 'Every role you apply to, with the next action and who referred you. The conversion rates tell you what to fix: lots of applications and no screens is a resume problem, not a volume problem.'));
  head.append(left);
  const addBtn = el('button', 'btn primary', '+ New application');
  addBtn.onclick = () => openApp(null);
  head.append(addBtn);
  root.append(head);

  const applied = apps.filter((a) => a.stage !== 'researching');
  const reached = apps.filter((a) => INTERVIEW_STAGES.includes(a.stage));
  const offers = apps.filter((a) => a.stage === 'offer');
  const active = apps.filter((a) => !CLOSED_STAGES.includes(a.stage));
  const tiles = el('div', 'tile-row');
  tiles.append(tile('Applications', String(applied.length), `${apps.length} tracked in total`));
  tiles.append(tile('Active', String(active.length), 'not rejected or withdrawn'));
  tiles.append(tile('Reached a screen', String(reached.length), applied.length ? `${Math.round((reached.length / applied.length) * 100)}% of applications` : 'none yet'));
  tiles.append(tile('Offers', String(offers.length), offers.length ? 'nice work' : 'the one that counts'));
  root.append(tiles);

  const card = el('div', 'card');
  if (!apps.length) {
    card.append(el('p', 'muted', 'Nothing tracked yet. Worth starting early: add Microsoft teams you want to land in as "Researching", so by the time you apply you already know who does what.'));
    root.append(card);
    return;
  }

  const table = el('table', 'data-table app-table');
  table.innerHTML = '<thead><tr><th>Role</th><th>Stage</th><th>Applied</th><th>Next action</th><th>Referral</th></tr></thead>';
  const tbody = el('tbody');
  const order = (a) => (CLOSED_STAGES.includes(a.stage) ? 1 : 0);
  apps.slice().sort((a, b) => order(a) - order(b)
    || (a.nextActionOn || '9999').localeCompare(b.nextActionOn || '9999')
    || (b.appliedOn || '').localeCompare(a.appliedOn || '')).forEach((a) => {
    const tr = el('tr', 'app-row');
    const roleCell = el('td');
    const name = el('button', 'app-name', `${a.company}${a.role ? ` — ${a.role}` : ''}`);
    name.onclick = () => openApp(a.id);
    roleCell.append(name);
    const href = safeUrl(a.link);
    if (a.reqId || href) {
      const meta = el('p', 'muted small', '');
      const label = a.reqId ? `Req ${a.reqId}` : 'Job posting';
      meta.append(href ? linkOrText(href, label) : el('span', null, label));
      roleCell.append(meta);
    }
    tr.append(roleCell);

    const stageCell = el('td');
    stageCell.append(el('span', `stage stage-${a.stage}`, stageName(a.stage)));
    tr.append(stageCell);
    tr.append(el('td', null, a.appliedOn ? fmtShort(parseISO(a.appliedOn)) : '—'));

    const nextCell = el('td');
    if (a.nextAction) {
      const overdue = a.nextActionOn && !CLOSED_STAGES.includes(a.stage) && daysBetween(parseISO(a.nextActionOn), new Date()) >= 0;
      const text = el('span', overdue ? 'due is-overdue' : '', a.nextAction);
      nextCell.append(text);
      if (a.nextActionOn) nextCell.append(el('p', 'muted small', fmtShort(parseISO(a.nextActionOn))));
    } else {
      nextCell.append(el('span', 'muted', '—'));
    }
    tr.append(nextCell);
    tr.append(el('td', null, a.referral || '—'));
    tbody.append(tr);
  });
  table.append(tbody);
  card.append(table);
  root.append(card);
}

function openApp(id) {
  const item = id ? state.apps.find((a) => a.id === id) : null;
  openForm({
    title: item ? 'Edit application' : 'New application',
    fields: [
      { key: 'company', label: 'Company', required: true, maxlength: 80, placeholder: 'Microsoft' },
      { key: 'role', label: 'Role', maxlength: 120, placeholder: 'Data Engineer II, Azure Data' },
      { key: 'reqId', label: 'Req ID', maxlength: 40 },
      { key: 'link', label: 'Job posting URL', placeholder: 'https://…' },
      { key: 'stage', label: 'Stage', type: 'select', options: STAGES.map((s) => ({ value: s.id, label: s.name })), default: 'applied' },
      { key: 'appliedOn', label: 'Applied on', type: 'date', default: todayISO() },
      { key: 'referral', label: 'Referral / source', maxlength: 80, placeholder: 'Who referred you, or where you found it' },
      { key: 'nextAction', label: 'Next action', maxlength: 120, placeholder: 'Follow up with recruiter' },
      { key: 'nextActionOn', label: 'Next action on', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Questions asked, names, comp discussion' },
    ],
    values: item || {},
    onSave: (vals) => {
      if (!vals.company) return;
      if (item) Object.assign(item, vals);
      else state.apps.push({ id: newId(), created: todayISO(), ...vals });
      saveState();
      renderApps();
    },
    onDelete: item ? () => {
      state.apps = state.apps.filter((a) => a.id !== item.id);
      saveState();
      renderApps();
      toast('Application deleted.');
    } : null,
  });
}

/* ---------- data view ---------- */

function renderData() {
  const root = $('#view-data');
  root.innerHTML = '';
  const card = el('div', 'card');
  card.append(el('h2', null, 'Your data'));
  card.append(el('p', 'muted', 'Progress lives in this browser\'s local storage — it never leaves your machine and it is not synced. Export a backup regularly, and after switching browsers or devices, import it.'));

  const row = el('div', 'button-row');
  const exportBtn = el('button', 'btn primary', 'Export backup (JSON)');
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = `career-tracker-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Backup downloaded.');
  };

  const importBtn = el('button', 'btn', 'Import backup');
  const file = el('input');
  file.type = 'file';
  file.accept = 'application/json';
  file.hidden = true;
  file.onchange = () => {
    const f = file.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== 'object' || !parsed.days) throw new Error('bad file');
        const theme = state.theme;
        state = loadStateFrom(parsed);
        state.theme = theme;
        saveState();
        render();
        toast('Backup restored.');
      } catch {
        toast('That file is not a valid tracker backup.');
      }
      file.value = '';
    };
    reader.readAsText(f);
  };
  importBtn.onclick = () => file.click();

  const resetBtn = el('button', 'btn danger', 'Reset all progress');
  resetBtn.onclick = () => {
    if (confirm('Delete everything — logged days, notes, skill ratings, board cards, stories, mistakes, mocks and applications? Export a backup first if you want to keep them.')) {
      const theme = state.theme;
      state = loadStateFrom({});
      state.theme = theme;
      saveState();
      render();
      toast('Progress cleared.');
    }
  };
  row.append(exportBtn, importBtn, file, resetBtn);
  card.append(row);

  const stats = overallStats();
  card.append(el('p', 'muted small', `Stored: ${Object.keys(state.days).length} days, ${stats.tasksDone} completed blocks, ${state.board.length} board cards, ${state.stories.length} stories, ${state.mistakes.length} mistakes, ${state.mocks.length} mocks, ${state.apps.length} applications.`));
  root.append(card);

  const how = el('div', 'card');
  how.append(el('h3', null, 'How to use this'));
  const ol = el('ol', 'how-list');
  [
    'Open it every morning. The schedule for the day is already generated — no planning decisions to make before you start.',
    'Check blocks off as you finish them. Partial days still count toward the heatmap.',
    'Write one line in the progress log before you close the laptop. Those lines become your STAR stories.',
    'Sunday is the retro: update the skill matrix, read back the week\'s log, adjust.',
    'Export a backup at the end of every month.',
  ].forEach((s) => ol.append(el('li', null, s)));
  how.append(ol);
  root.append(how);
}

/* ---------- views & theme ---------- */

const VIEWS = ['today', 'week', 'board', 'journal', 'vault', 'apps', 'roadmap', 'progress', 'skills', 'data'];

function setView(view) {
  activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  renderHeader();
  VIEWS.forEach((v) => {
    const node = document.getElementById(`view-${v}`);
    node.hidden = v !== activeView;
    document.querySelector(`.tab[data-view="${v}"]`).classList.toggle('is-active', v === activeView);
  });
  if (activeView === 'today') renderToday();
  if (activeView === 'week') renderWeek();
  if (activeView === 'board') renderBoard();
  if (activeView === 'journal') renderJournal();
  if (activeView === 'vault') renderVault();
  if (activeView === 'apps') renderApps();
  if (activeView === 'roadmap') renderRoadmap();
  if (activeView === 'progress') renderProgress();
  if (activeView === 'skills') renderSkills();
  if (activeView === 'data') renderData();
}

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', state.theme);
  $('#theme-toggle').textContent = state.theme === 'dark' ? '☾ Dark' : state.theme === 'light' ? '☀ Light' : '◐ Auto';
}

function init() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.onclick = () => setView(btn.dataset.view);
  });
  $('#theme-toggle').onclick = () => {
    state.theme = state.theme === 'auto' ? 'light' : state.theme === 'light' ? 'dark' : 'auto';
    saveState();
    applyTheme();
  };
  $('#form-dialog-form').onsubmit = (e) => {
    e.preventDefault();
    formSave?.();
    $('#form-dialog').close();
  };
  $('#form-cancel').onclick = () => $('#form-dialog').close();
  $('#form-delete').onclick = () => { formDelete?.(); $('#form-dialog').close(); };

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowLeft' && activeView === 'today') { selectedDate = iso(addDays(parseISO(selectedDate), -1)); render(); }
    if (e.key === 'ArrowRight' && activeView === 'today') { selectedDate = iso(addDays(parseISO(selectedDate), 1)); render(); }
  });
  applyTheme();
  render();
}

document.addEventListener('DOMContentLoaded', init);
