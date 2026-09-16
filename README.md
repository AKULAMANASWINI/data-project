# Data & AI Engineering → Microsoft — career tracker

A single-page site that turns "get a data engineering job at Microsoft after Dec 2027" into a
schedule you can actually follow: every day already has a plan, you tick blocks off as you do
them, and progress accumulates into a streak, a heatmap and a skill matrix.

Start date **16 Sep 2026** · target **1 Dec 2027** — 63 weeks, split into 7 phases.

## Run it

No build step, no dependencies. Either:

```bash
# open directly
open index.html          # macOS   (xdg-open on Linux, start on Windows)

# or serve it
python3 -m http.server 8000   # then http://localhost:8000
```

To have it on your phone and laptop, enable GitHub Pages on this repo
(Settings → Pages → deploy from branch, root folder) and bookmark the URL.

## What's in it

| Tab | What it does |
|---|---|
| **Today** | The day's schedule — 3–4 timed blocks with what to study and what to build, a checklist, a completion ring and a progress log. Arrow keys move between days. |
| **Week** | All 7 days of the current week at a glance, with completion state. |
| **Roadmap** | The 7 phases: dates, topics, milestones, primary sources, and how many elapsed days in each you've logged. |
| **Progress** | Days-to-target, streak, consistency, focused hours, a daily heatmap, hours-per-week chart and your recent log entries. |
| **Skills** | 17 skills rated 0–5 against the level the role needs. The dashed gap is your interview risk list. |
| **Data** | Export/import a JSON backup, or reset. |

## How the daily plan is generated

Nothing is hardcoded per date. `assets/roadmap.js` defines phases; each phase holds a pool of
topics with a *theory* and a *lab* description. `assets/app.js` works out which phase and week a
date falls in, picks two topics for that week, and fills a fixed weekly shape:

| Day | Shape |
|---|---|
| Mon | SQL warm-up → topic A deep dive → flashcards |
| Tue | Topic A hands-on lab → commit it → 1 coding problem |
| Wed | SQL warm-up → topic B deep dive → primary docs |
| Thu | Topic B lab → written learning note → 1 coding problem |
| Fri | Timed SQL set + DSA problem + weak-area review |
| Sat | 3-hour project block on the phase project |
| Sun | Retro, a STAR story, networking, light reading |

Later phases swap that shape for project sprints, then interview drills, then applications.
Weeks are anchored to Mondays, so every phase starts on a Monday and ends with a Sunday retro.

## The phases

1. **Foundations** (8w) — advanced SQL, Python, Linux/Git, relational and dimensional modeling.
2. **Core Data Engineering** (12w) — ETL/ELT, incremental loads and CDC, Airflow, dbt, warehouse internals, table formats, data quality, observability.
3. **Microsoft Data Stack** (14w) — Azure core, ADLS Gen2, Data Factory, Databricks, Delta, Fabric/OneLake, Synapse, KQL, security, Purview, CI/CD, cost — plus AI/ML data engineering. Milestone: the Microsoft data engineering certification (DP-700 Fabric track — **check the current exam code on Microsoft Learn**, the certification lineup changes).
4. **Scale & Streaming** (10w) — Spark internals and tuning, Structured Streaming, Kafka, Event Hubs, lakehouse patterns, distributed systems, serving layers.
5. **Capstones & Portfolio** (8w) — a batch lakehouse, a streaming pipeline, a RAG slice over your own gold tables, all written up.
6. **Interview Engine** (8w) — SQL patterns, DSA, pipeline system design, modeling cases, Azure/Spark rapid-fire, behavioral and Microsoft culture.
7. **Apply, Network & Close** (open-ended) — targeted applications, referrals, loops, offer.

Edit `assets/roadmap.js` to change any of it — phase lengths, topics, the daily shape, the skill
list. The dates recompute from `anchorMonday` automatically.

## Where your data lives

In `localStorage`, in the browser you use — it never leaves your machine, and it does not sync
between devices or browsers. **Export a backup from the Data tab at the end of each month**, and
import it after switching browsers.

## Files

```
index.html          markup and tab shell
assets/styles.css   styling, light/dark themes, chart CSS
assets/roadmap.js   the curriculum: phases, topics, skills, daily templates
assets/app.js       state, plan generation, views, charts
```
