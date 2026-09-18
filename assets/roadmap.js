/*
 * Curriculum for a Data & AI Engineering career track aimed at a Microsoft
 * data engineering role from Dec 2027 onward.
 *
 * Weeks are anchored to Mondays so every phase starts on a Monday and every
 * week closes with a Sunday retro. Phase date ranges are derived from
 * ANCHOR_MONDAY + week offsets, never hardcoded.
 */

const PLAN = {
  startDate: '2026-09-18',
  anchorMonday: '2026-09-14',
  targetDate: '2027-12-01',
  targetLabel: 'Microsoft Data Engineer — interview-ready',

  // Bumping this wipes stored progress on next load, for a clean restart.
  resetToken: '2026-09-18-fresh-start',

  levels: ['Not started', 'Aware', 'Beginner', 'Working', 'Proficient', 'Interview-ready'],

  skills: [
    { id: 'sql', name: 'Advanced SQL', target: 5 },
    { id: 'python', name: 'Python for DE', target: 5 },
    { id: 'modeling', name: 'Data modeling & warehousing', target: 5 },
    { id: 'pipelines', name: 'ETL/ELT pipeline design', target: 5 },
    { id: 'orchestration', name: 'Airflow / dbt orchestration', target: 4 },
    { id: 'spark', name: 'Apache Spark', target: 5 },
    { id: 'streaming', name: 'Streaming (Kafka / Event Hubs)', target: 4 },
    { id: 'azure', name: 'Azure core & storage', target: 4 },
    { id: 'adf', name: 'Data Factory / Fabric pipelines', target: 4 },
    { id: 'databricks', name: 'Databricks & Delta Lake', target: 5 },
    { id: 'fabric', name: 'Synapse / Fabric / OneLake', target: 4 },
    { id: 'governance', name: 'Security & governance', target: 3 },
    { id: 'devops', name: 'CI/CD, IaC & testing', target: 4 },
    { id: 'ai', name: 'AI/ML data engineering', target: 4 },
    { id: 'systemdesign', name: 'Data system design', target: 4 },
    { id: 'dsa', name: 'DSA & coding rounds', target: 4 },
    { id: 'behavioral', name: 'Behavioral & storytelling', target: 5 },
  ],

  phases: [
    {
      id: 'p1',
      name: 'Foundations',
      subtitle: 'SQL, Python, modeling and the engineering habits everything else sits on',
      weeks: 8,
      kind: 'learn',
      milestone: 'Solve 60 SQL problems unaided and ship a tested Python ingestion script',
      project: 'Mini project: a Python ingestion job that loads a public dataset into a local Postgres star schema, with tests and a Makefile',
      topics: [
        {
          name: 'Advanced SQL: window functions',
          skill: 'sql',
          theory: 'ROW_NUMBER/RANK/DENSE_RANK, LAG/LEAD, FIRST_VALUE, frame clauses (ROWS vs RANGE), running totals and moving averages.',
          lab: 'Rewrite 8 self-join queries as window queries; build a retention and a running-revenue query on a public dataset.',
        },
        {
          name: 'SQL performance & execution plans',
          skill: 'sql',
          theory: 'Indexes (B-tree, covering, partial), EXPLAIN ANALYZE, join algorithms, cardinality estimates, statistics.',
          lab: 'Take 5 slow queries, read the plan, add indexes or rewrite, and record before/after timings in a table.',
        },
        {
          name: 'Idiomatic Python for data engineering',
          skill: 'python',
          theory: 'Type hints, dataclasses, generators, context managers, virtualenv/uv, project layout, logging over print.',
          lab: 'Refactor a script into a package with typed functions, logging, CLI entry point and a pytest suite.',
        },
        {
          name: 'Python data handling at scale',
          skill: 'python',
          theory: 'pandas vs polars, chunked reads, memory profiling, retries and backoff, paginated API ingestion.',
          lab: 'Ingest a paginated REST API into Parquet with retries, schema validation and idempotent re-runs.',
        },
        {
          name: 'Linux, Bash & Git for data teams',
          skill: 'devops',
          theory: 'Shell pipelines, cron, file permissions, SSH, branching strategy, conventional commits, PR review etiquette.',
          lab: 'Automate a daily file-drop process with a Bash script + cron; put it in Git with a readable history.',
        },
        {
          name: 'Relational modeling fundamentals',
          skill: 'modeling',
          theory: 'Normal forms, primary/foreign keys, constraints, surrogate vs natural keys, referential integrity.',
          lab: 'Model an e-commerce OLTP schema in 3NF, load sample data and prove the constraints hold.',
        },
        {
          name: 'Dimensional modeling & SCDs',
          skill: 'modeling',
          theory: 'Kimball star schema, facts vs dimensions, grain, conformed dimensions, SCD type 1/2/3, snapshot facts.',
          lab: 'Convert the 3NF schema into a star schema with an SCD-2 customer dimension and a daily snapshot fact.',
        },
        {
          name: 'File formats & storage layout',
          skill: 'modeling',
          theory: 'Row vs columnar, Parquet internals (row groups, statistics), compression codecs, partition pruning, small-file problem.',
          lab: 'Write the same dataset as CSV, JSON and Parquet; measure size and scan time; test partitioned vs unpartitioned reads.',
        },
      ],
      resources: [
        { label: 'PostgreSQL docs', url: 'https://www.postgresql.org/docs/current/' },
        { label: 'Python docs', url: 'https://docs.python.org/3/' },
        { label: 'LeetCode SQL', url: 'https://leetcode.com/studyplan/top-sql-50/' },
      ],
    },

    {
      id: 'p2',
      name: 'Core Data Engineering',
      subtitle: 'Pipelines, orchestration, warehousing and data quality — the daily job',
      weeks: 12,
      kind: 'learn',
      milestone: 'An orchestrated, tested, incremental pipeline running on a schedule with data-quality gates',
      project: 'Project: Airflow + dbt pipeline — incremental ingestion into a warehouse, dbt models with tests, docs and freshness SLAs',
      topics: [
        {
          name: 'ETL vs ELT & pipeline architecture',
          skill: 'pipelines',
          theory: 'Batch vs streaming, push vs pull, staging layers, medallion (bronze/silver/gold), idempotency and replay.',
          lab: 'Draw the architecture for your project pipeline; write an ADR explaining each choice and its tradeoff.',
        },
        {
          name: 'Incremental ingestion & CDC',
          skill: 'pipelines',
          theory: 'High-watermarks, late-arriving data, soft deletes, log-based CDC, merge/upsert semantics, backfills.',
          lab: 'Implement watermark-based incremental loading plus a MERGE upsert; prove a re-run changes nothing.',
        },
        {
          name: 'Airflow fundamentals',
          skill: 'orchestration',
          theory: 'DAGs, tasks, operators, scheduling, execution dates, XComs, task dependencies, TaskFlow API.',
          lab: 'Build a 6-task DAG with branching and a sensor; schedule it daily and inspect run history.',
        },
        {
          name: 'Airflow in production',
          skill: 'orchestration',
          theory: 'Retries, SLAs, backfills, catchup, pools, deferrable operators, connections/secrets, DAG testing.',
          lab: 'Add retries, alerting and a documented backfill procedure; write unit tests for DAG integrity.',
        },
        {
          name: 'dbt fundamentals',
          skill: 'orchestration',
          theory: 'Models, ref/source, materializations (view/table/incremental/ephemeral), Jinja, seeds, project structure.',
          lab: 'Build staging → intermediate → mart models for your warehouse, including one incremental model.',
        },
        {
          name: 'dbt testing, snapshots & docs',
          skill: 'orchestration',
          theory: 'Generic and singular tests, snapshots for SCD-2, exposures, dbt docs and lineage graph, CI on PRs.',
          lab: 'Add tests to every mart model, a snapshot for a slowly changing source, and generate docs.',
        },
        {
          name: 'Warehouse internals',
          skill: 'modeling',
          theory: 'MPP architecture, distribution keys, partitioning vs clustering, columnstore, caching, cost per query.',
          lab: 'Run the same aggregate under two partition/distribution strategies and record the cost and runtime delta.',
        },
        {
          name: 'Table formats: Delta, Iceberg, Hudi',
          skill: 'databricks',
          theory: 'Transaction logs, ACID on object storage, time travel, schema evolution, compaction, Z-ordering.',
          lab: 'Create a Delta table, evolve its schema, time-travel to a prior version and compact small files.',
        },
        {
          name: 'Data quality & contracts',
          skill: 'pipelines',
          theory: 'Expectations, null/uniqueness/range checks, schema contracts, quarantine patterns, circuit breakers.',
          lab: 'Add a quality gate that fails the pipeline and routes bad rows to a quarantine table with reasons.',
        },
        {
          name: 'Observability & on-call',
          skill: 'devops',
          theory: 'Lineage, freshness SLAs, volume/anomaly monitoring, alert fatigue, runbooks, incident postmortems.',
          lab: 'Instrument the pipeline with run metrics and write a runbook for its two most likely failures.',
        },
        {
          name: 'Workflow patterns beyond Airflow',
          skill: 'orchestration',
          theory: 'Dagster/Prefect assets, event-driven triggers, fan-out/fan-in, dynamic task mapping, DAG anti-patterns.',
          lab: 'Rebuild one DAG as asset-oriented code and note what got simpler and what got harder.',
        },
        {
          name: 'Engineering practice for pipelines',
          skill: 'devops',
          theory: 'pytest fixtures, test data builders, integration vs unit tests for data, pre-commit, GitHub Actions CI.',
          lab: 'Wire CI that runs lint + tests + a dbt build on a sample warehouse for every pull request.',
        },
      ],
      resources: [
        { label: 'Airflow docs', url: 'https://airflow.apache.org/docs/' },
        { label: 'dbt docs', url: 'https://docs.getdbt.com/' },
        { label: 'Delta Lake', url: 'https://delta.io/' },
      ],
    },

    {
      id: 'p3',
      name: 'Microsoft Data Stack',
      subtitle: 'Azure, Fabric and Databricks — the stack the target job is graded on',
      weeks: 14,
      kind: 'learn',
      milestone: 'Pass the Microsoft data engineering certification (DP-700 Fabric track; confirm the current code on Microsoft Learn) and run an end-to-end Azure pipeline',
      project: 'Project: cloud rebuild — the Phase 2 pipeline re-implemented on Azure (ADLS + Data Factory/Fabric + Databricks) with CI/CD',
      topics: [
        {
          name: 'Azure fundamentals for data engineers',
          skill: 'azure',
          theory: 'Subscriptions, resource groups, regions, Entra ID, RBAC, pricing model, quotas, the portal vs CLI vs Bicep.',
          lab: 'Provision a resource group, storage account and key vault with the Azure CLI, then again with Bicep.',
        },
        {
          name: 'ADLS Gen2 & storage design',
          skill: 'azure',
          theory: 'Hierarchical namespace, containers vs folders, zone layout, access tiers, lifecycle rules, ACLs vs RBAC.',
          lab: 'Design and create a bronze/silver/gold container layout with lifecycle policies and scoped access.',
        },
        {
          name: 'Azure Data Factory pipelines',
          skill: 'adf',
          theory: 'Linked services, datasets, activities, integration runtimes, triggers, Copy activity at scale, monitoring.',
          lab: 'Build a parameterised Copy pipeline that ingests a source into bronze on a schedule, with failure alerts.',
        },
        {
          name: 'ADF mapping data flows & metadata-driven pipelines',
          skill: 'adf',
          theory: 'Data flows, expressions, ForEach/Lookup patterns, metadata-driven ingestion frameworks, parameterisation.',
          lab: 'Drive ingestion of 5 tables from a control table so adding a table means adding a row, not a pipeline.',
        },
        {
          name: 'Azure Databricks workspace & jobs',
          skill: 'databricks',
          theory: 'Clusters (job vs all-purpose), pools, notebooks vs repos, Workflows, Unity Catalog, cluster policies.',
          lab: 'Run a notebook as a scheduled Job against ADLS with a job cluster; register tables in a catalog.',
        },
        {
          name: 'Delta Lake on Databricks',
          skill: 'databricks',
          theory: 'MERGE, OPTIMIZE, Z-ORDER, VACUUM, liquid clustering, change data feed, streaming reads from Delta.',
          lab: 'Build bronze→silver with MERGE and change data feed; measure OPTIMIZE impact on a query.',
        },
        {
          name: 'Microsoft Fabric & OneLake',
          skill: 'fabric',
          theory: 'Workspaces, Lakehouse vs Warehouse, OneLake shortcuts, Direct Lake, pipelines, notebooks, semantic models.',
          lab: 'Create a Fabric lakehouse, shortcut to existing storage and serve a gold table to a Power BI report.',
        },
        {
          name: 'Synapse & serving layers',
          skill: 'fabric',
          theory: 'Dedicated vs serverless SQL pools, external tables, distribution strategies, when Synapse vs Fabric vs Databricks.',
          lab: 'Query Parquet in place with serverless SQL and compare cost/latency against a loaded table.',
        },
        {
          name: 'Real-time intelligence & KQL',
          skill: 'streaming',
          theory: 'Eventstreams, KQL databases, KQL query basics, time-series operators, hot/cold paths.',
          lab: 'Stream synthetic events into a KQL database and build a 5-minute windowed aggregation query.',
        },
        {
          name: 'Security for Azure data platforms',
          skill: 'governance',
          theory: 'Managed identity, service principals, Key Vault, private endpoints, network isolation, secret rotation.',
          lab: 'Remove every secret from your pipeline code and switch to managed identity + Key Vault references.',
        },
        {
          name: 'Governance with Purview',
          skill: 'governance',
          theory: 'Catalog, scanning, classification, lineage, glossary, sensitivity labels, data ownership models.',
          lab: 'Scan your storage and warehouse, classify PII columns and read the produced lineage graph.',
        },
        {
          name: 'CI/CD and IaC for data',
          skill: 'devops',
          theory: 'Azure DevOps vs GitHub Actions, environment promotion, ARM/Bicep/Terraform, Databricks asset bundles.',
          lab: 'Deploy your pipeline to dev and prod from a Git branch with an automated release pipeline.',
        },
        {
          name: 'Monitoring, cost and reliability',
          skill: 'devops',
          theory: 'Azure Monitor, Log Analytics, KQL for diagnostics, budgets and alerts, right-sizing clusters, reservation pricing.',
          lab: 'Build a cost dashboard for your project and cut one workload cost by 30% without losing SLA.',
        },
        {
          name: 'AI/ML data engineering on Azure',
          skill: 'ai',
          theory: 'Feature stores, vector stores and embeddings, RAG data pipelines, Azure OpenAI/AI Foundry integration, MLOps handoffs, evaluation data.',
          lab: 'Build a chunk→embed→index pipeline over your gold tables and expose it for retrieval with quality checks.',
        },
      ],
      resources: [
        { label: 'Microsoft Learn training', url: 'https://learn.microsoft.com/en-us/training/' },
        { label: 'Azure Data Factory docs', url: 'https://learn.microsoft.com/en-us/azure/data-factory/' },
        { label: 'Microsoft Fabric docs', url: 'https://learn.microsoft.com/en-us/fabric/' },
        { label: 'Databricks docs', url: 'https://docs.databricks.com/' },
      ],
    },

    {
      id: 'p4',
      name: 'Scale & Streaming',
      subtitle: 'Spark internals, streaming systems and the distributed-systems reasoning interviews probe',
      weeks: 10,
      kind: 'learn',
      milestone: 'Tune a deliberately slow Spark job by 5x and run a streaming pipeline with exactly-once semantics',
      project: 'Project: streaming lakehouse — events → Event Hubs/Kafka → Structured Streaming → Delta, with monitoring',
      topics: [
        {
          name: 'Spark architecture',
          skill: 'spark',
          theory: 'Driver/executors, jobs→stages→tasks, shuffle, lazy evaluation, memory model, cluster managers.',
          lab: 'Read the Spark UI for a real job: find the widest stage, the shuffle size and the skewed task.',
        },
        {
          name: 'DataFrame API & Catalyst',
          skill: 'spark',
          theory: 'Catalyst phases, adaptive query execution, predicate pushdown, broadcast joins, UDF cost.',
          lab: 'Compare a UDF against a native expression and an AQE-on vs AQE-off run; record the plans.',
        },
        {
          name: 'Spark performance tuning',
          skill: 'spark',
          theory: 'Partition sizing, salting for skew, caching strategy, join strategies, spill, file compaction.',
          lab: 'Take a deliberately slow job and cut runtime by 5x; document each change and its measured effect.',
        },
        {
          name: 'Structured Streaming',
          skill: 'streaming',
          theory: 'Micro-batch vs continuous, triggers, checkpoints, watermarks, stateful aggregation, exactly-once sinks.',
          lab: 'Build a windowed aggregation with a watermark; kill and restart it to prove checkpoint recovery.',
        },
        {
          name: 'Kafka fundamentals',
          skill: 'streaming',
          theory: 'Topics, partitions, offsets, consumer groups, replication, retention, ordering and delivery guarantees.',
          lab: 'Produce and consume with a consumer group; observe rebalancing and lag under a slow consumer.',
        },
        {
          name: 'Event Hubs & cloud streaming',
          skill: 'streaming',
          theory: 'Event Hubs (Kafka surface), throughput units, capture, Stream Analytics, autoscale, backpressure.',
          lab: 'Stream events into Event Hubs and land them in Delta via Autoloader with schema evolution on.',
        },
        {
          name: 'Lakehouse & medallion patterns at scale',
          skill: 'databricks',
          theory: 'Autoloader, incremental ingestion, streaming tables, materialized views, SCD in streams, replay strategy.',
          lab: 'Convert your batch bronze→silver to streaming and compare freshness, cost and failure modes.',
        },
        {
          name: 'Distributed systems for data engineers',
          skill: 'systemdesign',
          theory: 'CAP, consistency models, partitioning and replication, consensus, idempotency, retries and dedupe.',
          lab: 'Write a one-page failure analysis of your streaming pipeline: what breaks, what duplicates, what recovers.',
        },
        {
          name: 'Serving layers & NoSQL',
          skill: 'systemdesign',
          theory: 'Cosmos DB partition keys and RUs, Redis caching, OLAP vs OLTP vs HTAP, serving SLAs, API-facing data.',
          lab: 'Serve one gold table through a low-latency store and measure p50/p99 against direct warehouse reads.',
        },
        {
          name: 'Reliability & cost engineering',
          skill: 'devops',
          theory: 'SLOs for data, autoscaling, spot instances, cluster reuse, storage tiering, chargeback models.',
          lab: 'Define SLOs for your pipelines and build the alerting that fires before the SLO is breached.',
        },
      ],
      resources: [
        { label: 'Spark docs', url: 'https://spark.apache.org/docs/latest/' },
        { label: 'Kafka docs', url: 'https://kafka.apache.org/documentation/' },
        { label: 'Azure Event Hubs docs', url: 'https://learn.microsoft.com/en-us/azure/event-hubs/' },
      ],
    },

    {
      id: 'p5',
      name: 'Capstones & Portfolio',
      subtitle: 'Two production-grade projects, written up so a hiring manager can read them in five minutes',
      weeks: 8,
      kind: 'build',
      milestone: 'Two capstones live on GitHub with architecture diagrams, tests, CI/CD, cost notes and a written walkthrough',
      project: 'Capstone portfolio',
      topics: [
        { name: 'Capstone 1 — ingestion layer (bronze)', skill: 'pipelines', theory: 'Source selection, ingestion contract, schema handling, replayability.', lab: 'Build and test the bronze ingestion path end to end.' },
        { name: 'Capstone 1 — modeling (silver/gold)', skill: 'modeling', theory: 'Business grain, conformed dimensions, metric definitions.', lab: 'Build silver cleansing and gold marts with tests on every model.' },
        { name: 'Capstone 1 — orchestration, CI/CD & tests', skill: 'devops', theory: 'Environment promotion, secrets, deployment gates.', lab: 'Automate deploys and scheduled runs; make a green pipeline the merge condition.' },
        { name: 'Capstone 1 — serving, docs & cost', skill: 'fabric', theory: 'Dashboard or API serving, documentation as a product, unit economics.', lab: 'Ship the dashboard, the README, the diagram and a cost-per-run figure.' },
        { name: 'Capstone 2 — streaming ingestion', skill: 'streaming', theory: 'Event schema, partitioning, delivery guarantees, backpressure.', lab: 'Stand up the event source and streaming ingestion with checkpointing.' },
        { name: 'Capstone 2 — real-time serving & monitoring', skill: 'streaming', theory: 'Windowing, late data, alerting, dashboards on live data.', lab: 'Serve live aggregates and alert on freshness and lag.' },
        { name: 'AI capstone slice — RAG over your own data', skill: 'ai', theory: 'Chunking strategy, embeddings, vector index, retrieval evaluation, guardrails and cost.', lab: 'Add a retrieval layer over the gold tables with an evaluation set and measured answer quality.' },
        { name: 'Portfolio narrative & write-ups', skill: 'behavioral', theory: 'Problem→approach→tradeoffs→result framing; quantifying impact.', lab: 'Write a blog-style walkthrough per capstone and record a 3-minute demo.' },
      ],
      resources: [
        { label: 'GitHub Docs (Pages & Actions)', url: 'https://docs.github.com/' },
      ],
    },

    {
      id: 'p6',
      name: 'Interview Engine',
      subtitle: 'SQL and coding rounds, data system design, and the behavioral loop',
      weeks: 8,
      kind: 'interview',
      milestone: 'Consistently pass timed mock loops: SQL, Python/DSA, pipeline design, data modeling and behavioral',
      project: 'Mock interview loop',
      topics: [
        { name: 'SQL interview patterns', skill: 'sql', theory: 'Gaps and islands, dedupe, top-N per group, funnels, cohort retention, self-joins vs windows.', lab: 'Timed sets of 3 problems, 12 minutes each, with a written mistakes log.' },
        { name: 'Arrays, hashing & two pointers', skill: 'dsa', theory: 'Frequency maps, prefix sums, sliding window, sorting-based reductions.', lab: '3 problems timed at 25 minutes each; re-solve last week\'s misses from scratch.' },
        { name: 'Heaps, intervals & graphs', skill: 'dsa', theory: 'Top-K with heaps, interval merging, BFS/DFS, topological sort (DAG scheduling — very on-theme).', lab: '3 problems timed; explain the approach aloud before coding.' },
        { name: 'Pipeline system design', skill: 'systemdesign', theory: 'Requirements→volume estimates→architecture→tradeoffs→failure modes→cost; batch vs streaming decisions.', lab: 'One 45-minute case, whiteboarded and self-graded against a rubric.' },
        { name: 'Data modeling cases', skill: 'modeling', theory: 'Model the data for a product feature: grain, dimensions, metrics, late data, history.', lab: 'One modeling case with a written schema and the reasons for each choice.' },
        { name: 'Azure & Spark rapid-fire', skill: 'azure', theory: 'Depth questions on ADF, Fabric, Databricks, Delta, Spark tuning and cost.', lab: '25 flashcards spoken aloud in under 15 minutes, no notes.' },
        { name: 'Behavioral & Microsoft culture', skill: 'behavioral', theory: 'STAR structure, growth mindset, model-coach-care, customer obsession, collaboration and conflict stories.', lab: 'Rehearse 2 stories per session; record and cut them to 2 minutes each.' },
        { name: 'Resume, LinkedIn & narrative', skill: 'behavioral', theory: 'Impact bullets with numbers, keyword alignment to DE job descriptions, portfolio framing.', lab: 'Iterate one section per session against a real Microsoft job description.' },
      ],
      resources: [
        { label: 'LeetCode', url: 'https://leetcode.com/' },
        { label: 'Microsoft Careers', url: 'https://careers.microsoft.com/' },
      ],
    },

    {
      id: 'p7',
      name: 'Apply, Network & Close',
      subtitle: 'Applications, referrals, live loops and the offer',
      weeks: null,
      kind: 'apply',
      milestone: 'Offer in hand for a data engineering role at Microsoft',
      project: 'Job search execution',
      topics: [
        { name: 'Targeted applications', skill: 'behavioral', theory: 'Role targeting, req tracking, tailoring per team (Azure Data, Fabric, M365, Gaming, Cloud+AI).', lab: 'Apply to 3 well-matched roles with tailored resume bullets.' },
        { name: 'Referrals & networking', skill: 'behavioral', theory: 'Warm intros, alumni, community contributions, conversation openers that get replies.', lab: 'Send 3 personalised outreach messages; follow up on last week\'s.' },
        { name: 'Recruiter & screen prep', skill: 'behavioral', theory: 'Your 90-second pitch, compensation conversations, timeline management.', lab: 'Rehearse the pitch and the three questions you always get asked.' },
        { name: 'Loop simulation', skill: 'systemdesign', theory: 'Four back-to-back rounds under time pressure; energy and recovery management.', lab: 'Run a full simulated loop and debrief it in writing.' },
        { name: 'Skill maintenance', skill: 'dsa', theory: 'Spaced repetition on SQL, Spark, Azure and DSA so nothing decays during the search.', lab: 'Short daily drills: 2 problems plus 10 flashcards.' },
        { name: 'Offer & negotiation', skill: 'behavioral', theory: 'Levels and bands, total comp components, competing offers, graceful negotiation.', lab: 'Write your walk-away number and your negotiation script.' },
      ],
      resources: [
        { label: 'Microsoft Careers', url: 'https://careers.microsoft.com/' },
      ],
    },
  ],
};

/* ---------- daily plan templates ----------
 *
 * Budget: 300 minutes Mon–Fri, 480 minutes Sat–Sun. Every day below sums to
 * exactly its budget; the budget test in the repo README checks that.
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WEEKDAY_MINUTES = 300;
const WEEKEND_MINUTES = 480;
const budgetFor = (dow) => (dow === 0 || dow === 6 ? WEEKEND_MINUTES : WEEKDAY_MINUTES);

function t(title, minutes, tag, detail, skill) {
  return { title, minutes, tag, detail: detail || '', skill: skill || null };
}

const TEMPLATES = {
  learn(dow, a, b, phase) {
    switch (dow) {
      case 1: return {
        focus: a.name,
        tasks: [
          t('SQL warm-up: 3 query drills', 30, 'coding', 'Rotate the topic: windows, joins, aggregation, dedupe.', 'sql'),
          t(`Deep dive: ${a.name}`, 120, 'theory', a.theory, a.skill),
          t(`First pass at the lab: ${a.name}`, 90, 'lab', `Get the environment and the skeleton working. ${a.lab}`, a.skill),
          t('Turn today into 10 flashcards', 30, 'writing', 'Spaced repetition beats re-reading. Cards you will actually review.', a.skill),
          t('1 coding problem, timed', 30, 'coding', 'Python or SQL. 25 minutes on the clock, then read one better solution.', 'dsa'),
        ],
      };
      case 2: return {
        focus: `${a.name} — build it`,
        tasks: [
          t('SQL warm-up: 2 drills', 20, 'coding', 'Short and sharp before the long block.', 'sql'),
          t(`Lab: ${a.name}`, 150, 'lab', a.lab, a.skill),
          t('Commit it: README, tests, clean history', 40, 'project', 'Every lab lands in Git. Future-you and recruiters both read this.', 'devops'),
          t('2 coding problems, timed', 60, 'coding', 'One you can do, one that scares you.', 'dsa'),
          t('Write a 150-word learning note', 30, 'writing', 'Explain it in your own words — this becomes blog and interview material.', 'behavioral'),
        ],
      };
      case 3: return {
        focus: b.name,
        tasks: [
          t('SQL warm-up: 3 query drills', 30, 'coding', 'Rotate the topic from Monday.', 'sql'),
          t(`Deep dive: ${b.name}`, 120, 'theory', b.theory, b.skill),
          t('Read the official docs section', 45, 'theory', 'Primary sources over tutorials. Note the three things that surprised you.', b.skill),
          t(`First pass at the lab: ${b.name}`, 75, 'lab', b.lab, b.skill),
          t('Flashcard review: this week so far', 30, 'writing', 'Review beats collection. Cards you fail go to the front.', null),
        ],
      };
      case 4: return {
        focus: `${b.name} — build it`,
        tasks: [
          t(`Lab: ${b.name}`, 150, 'lab', b.lab, b.skill),
          t('Commit it: README, tests, clean history', 40, 'project', 'Tests included. A pipeline without tests is a demo.', 'devops'),
          t('2 coding problems, timed', 60, 'coding', 'Explain the approach out loud before you type.', 'dsa'),
          t('Write a 150-word learning note', 30, 'writing', 'What clicked, what is still fuzzy.', 'behavioral'),
          t('Flashcard review', 20, 'writing', 'Ten minutes twice beats twenty minutes once.', null),
        ],
      };
      case 5: return {
        focus: 'Interview drills & weak-area review',
        tasks: [
          t('SQL interview set: 4 problems, timed', 90, 'coding', 'No autocomplete, no docs. Log every mistake in the Vault.', 'sql'),
          t('Python/DSA: 2 problems, timed', 60, 'coding', 'Pattern practice — pick the pattern you are worst at.', 'dsa'),
          t('Re-solve this week\'s mistakes from scratch', 60, 'coding', 'Straight from the Vault mistakes log. This is the highest-value hour of the week.', null),
          t('Concept reading: this week\'s gaps', 50, 'theory', 'Go back to whatever you nodded along to without really understanding.', null),
          t('Consolidate the week\'s notes', 40, 'writing', 'Merge four days of notes into something you would actually re-read.', 'behavioral'),
        ],
      };
      case 6: return {
        focus: 'Project build day',
        tasks: [
          t('Project deep work — block 1', 180, 'project', phase.project, null),
          t('Project deep work — block 2', 150, 'project', 'Second push. Aim to finish a slice you can demo, not a slice you can describe.', null),
          t('Tests for what you built today', 60, 'project', 'Data tests and unit tests, not just a green run.', 'devops'),
          t('Push + update the README and diagram', 45, 'project', 'A visible commit history is part of the portfolio.', 'devops'),
          t('1 coding problem, timed', 45, 'coding', 'Keeps the interview reflexes alive on build days.', 'dsa'),
        ],
      };
      default: return {
        focus: 'Review, retro & the week ahead',
        tasks: [
          t('Weekly retro & plan next week', 45, 'career', 'What moved, what slipped, what changes. Update your skill ratings.', null),
          t('Behavioral: write 1 STAR story', 45, 'career', 'From this week\'s real work. Numbers in the result. Straight into the Vault.', 'behavioral'),
          t('Spaced repetition: the full week\'s cards', 45, 'theory', 'Everything from Monday onward, not just the recent ones.', null),
          t('Re-read the week\'s notes and fill the gaps', 60, 'theory', 'Every "I\'ll come back to this" from the week — come back to it.', null),
          t('Preview next week\'s topics', 120, 'theory', 'Skim the docs and one talk so Monday starts warm instead of cold.', null),
          t('Project or lab catch-up', 120, 'project', 'Whatever slipped this week. If nothing slipped, push the project further.', null),
          t('Networking: 2 meaningful touchpoints', 45, 'career', 'Share a learning note, comment substantively, or message someone in data engineering.', 'behavioral'),
        ],
      };
    }
  },

  build(dow, a, b, phase) {
    switch (dow) {
      case 1: return { focus: a.name, tasks: [
        t(`Capstone sprint: ${a.name}`, 180, 'project', a.lab, a.skill),
        t('Architecture diagram & design notes', 60, 'writing', a.theory, 'systemdesign'),
        t('Tests for today\'s slice', 30, 'project', 'Written today, not "later".', 'devops'),
        t('SQL drills: 2 problems', 30, 'coding', 'Maintenance so nothing decays during build weeks.', 'sql'),
      ]};
      case 2: return { focus: `${a.name} — finish the slice`, tasks: [
        t(`Capstone sprint: ${a.name} (continue)`, 180, 'project', 'Finish what you started, then make it re-runnable from scratch.', a.skill),
        t('Harden it: error handling, retries, idempotency', 60, 'project', 'The difference between a demo and a pipeline.', 'pipelines'),
        t('2 coding problems, timed', 60, 'coding', 'Interview maintenance.', 'dsa'),
      ]};
      case 3: return { focus: b.name, tasks: [
        t(`Capstone sprint: ${b.name}`, 180, 'project', b.lab, b.skill),
        t('Documentation pass', 60, 'writing', b.theory, 'behavioral'),
        t('2 coding problems, timed', 60, 'coding', 'Keep the clock on.', 'dsa'),
      ]};
      case 4: return { focus: `${b.name} — ship it`, tasks: [
        t(`Capstone sprint: ${b.name} (continue)`, 180, 'project', 'Close the loop: deployed, scheduled, monitored.', b.skill),
        t('CI/CD & deployment check', 60, 'project', 'Green build, automated deploy, secrets out of the code.', 'devops'),
        t('2 coding problems, timed', 60, 'coding', 'Interview maintenance.', 'dsa'),
      ]};
      case 5: return { focus: 'System design & interview maintenance', tasks: [
        t('Data system design case, timed', 90, 'theory', 'Requirements, volume estimate, architecture, tradeoffs, failure modes, cost.', 'systemdesign'),
        t('SQL interview set: 3 problems', 60, 'coding', 'Timed, no help.', 'sql'),
        t('Re-solve this week\'s mistakes', 60, 'coding', 'From the Vault. From scratch.', null),
        t('Blockers retro', 30, 'writing', 'What is actually blocking the capstone? Fix the process, not just the code.', null),
        t('Reading: the gap the design case exposed', 60, 'theory', 'Every case reveals something you half-know. Close it now.', 'systemdesign'),
      ]};
      case 6: return { focus: 'Milestone deep work', tasks: [
        t('Deep work: this week\'s deliverable', 240, 'project', phase.milestone, null),
        t('Demo recording or screenshots', 60, 'project', 'Proof that it runs beats a description that it runs.', 'behavioral'),
        t('Write-up: problem → approach → tradeoffs → result', 90, 'writing', 'With numbers. This is the portfolio piece, not the code.', 'behavioral'),
        t('2 coding problems, timed', 90, 'coding', 'Long day, but the drills do not skip.', 'dsa'),
      ]};
      default: return { focus: 'Retro, write-up & the week ahead', tasks: [
        t('Weekly retro & plan next week', 45, 'career', 'Update skill ratings and the capstone burndown on the Board.', null),
        t('Write the project blog section', 90, 'writing', 'Problem → approach → tradeoffs → result, with numbers.', 'behavioral'),
        t('Portfolio polish: README, diagrams, cost notes', 90, 'project', 'A hiring manager should get it in five minutes.', 'behavioral'),
        t('Networking: 2 touchpoints', 45, 'career', 'Share the week\'s progress publicly.', 'behavioral'),
        t('Preview next week\'s capstone slice', 90, 'theory', 'Read ahead so Monday is building, not researching.', null),
        t('Catch-up block', 120, 'project', 'Whatever slipped. If nothing slipped, pull work forward.', null),
      ]};
    }
  },

  interview(dow, a, b) {
    switch (dow) {
      case 1: return { focus: `DSA: ${a.name}`, tasks: [
        t(`DSA set: 4 problems — ${a.name}`, 120, 'coding', a.theory, a.skill),
        t('SQL drill set: 4 problems', 60, 'coding', 'Timed at 12 minutes each.', 'sql'),
        t('Re-solve last week\'s misses', 60, 'coding', 'From the Vault mistakes log, from scratch, no notes.', null),
        t('Azure/Spark rapid-fire: 25 cards', 60, 'coding', 'Spoken answers, under 45 seconds each.', 'azure'),
      ]};
      case 2: return { focus: 'System design', tasks: [
        t('Data system design: 1 timed case', 90, 'theory', 'Design a pipeline end to end and defend every tradeoff out loud.', 'systemdesign'),
        t('Write the design doc & self-grade', 45, 'writing', 'Grade against a rubric: requirements, scale, storage, processing, failure, cost.', 'systemdesign'),
        t('Close the gap the case exposed', 45, 'theory', 'Read properly about the thing you hand-waved.', 'systemdesign'),
        t('DSA: 2 problems, timed', 75, 'coding', 'Medium and hard.', 'dsa'),
        t('Behavioral: rehearse 1 STAR story', 45, 'career', 'Two minutes, out loud, no script in front of you.', 'behavioral'),
      ]};
      case 3: return { focus: `DSA & SQL: ${b.name}`, tasks: [
        t(`DSA set: 4 problems — ${b.name}`, 120, 'coding', b.theory, b.skill),
        t('SQL interview set: 4 hard problems', 90, 'coding', 'Window functions, gaps and islands, funnels, dedupe.', 'sql'),
        t('Re-solve from the mistakes log', 60, 'coding', 'The ones you have now failed twice go to the top.', null),
        t('Flashcard review', 30, 'theory', 'Azure, Spark, Delta, modeling — spoken, not read.', null),
      ]};
      case 4: return { focus: 'Mock interview day', tasks: [
        t('Mock interview: technical round', 75, 'coding', 'Peer, mentor or AI interviewer. Camera on, think out loud, keep to time.', null),
        t('Log it in the Vault: score, feedback, three fixes', 45, 'writing', 'Feedback is only useful if it changes the next session.', null),
        t('Work the three fixes', 60, 'coding', 'Immediately, while it still stings.', null),
        t('DSA: 2 problems, timed', 75, 'coding', 'Back on the horse.', 'dsa'),
        t('Behavioral: rehearse 2 STAR stories', 45, 'career', 'Record them. Cut each to two minutes.', 'behavioral'),
      ]};
      case 5: return { focus: 'Modeling case & positioning', tasks: [
        t('Data modeling case, timed', 75, 'theory', 'Grain, dimensions, metrics, history, late-arriving data.', 'modeling'),
        t('SQL interview set: 3 problems', 60, 'coding', 'Timed.', 'sql'),
        t('Resume / portfolio iteration', 45, 'career', 'One section, rewritten against a real job description.', 'behavioral'),
        t('Company research: Microsoft data orgs', 60, 'career', 'Teams, products, the stack they publish about, open reqs. Log the good ones in Apply.', 'behavioral'),
        t('Story bank: polish 1 story', 60, 'career', 'Tighten it, add the numbers, say it out loud.', 'behavioral'),
      ]};
      case 6: return { focus: 'Full loop simulation', tasks: [
        t('Simulated loop: 3 back-to-back rounds', 240, 'coding', 'Coding, design, behavioral, ten-minute breaks between. The fatigue is the point.', null),
        t('Post-mortem: where did you stall?', 60, 'writing', 'Question by question. Into the Vault.', null),
        t('Work the biggest gap', 90, 'coding', 'The single thing that would have failed you today.', null),
        t('2 coding problems, timed', 90, 'coding', 'Finish tired. That is the skill.', 'dsa'),
      ]};
      default: return { focus: 'Retro, stories & outreach', tasks: [
        t('Weekly retro & plan next week', 45, 'career', 'Track mock scores week over week in the Vault.', null),
        t('Polish the story bank', 60, 'career', 'Tighten two stories; add numbers to both.', 'behavioral'),
        t('Networking & referral outreach', 60, 'career', 'Three messages. Referrals move applications more than anything else.', 'behavioral'),
        t('Drill your weakest area', 120, 'coding', 'Whatever the mock scores say. Not the thing you enjoy.', null),
        t('Design case, timed', 90, 'theory', 'One more, spoken out loud, self-graded.', 'systemdesign'),
        t('Plan the week\'s mocks and applications', 60, 'career', 'Book them now or they will not happen.', 'behavioral'),
        t('Light reading: engineering blogs', 45, 'theory', 'Breadth. How real teams actually built it.', null),
      ]};
    }
  },

  apply(dow) {
    switch (dow) {
      case 1: return { focus: 'Application block', tasks: [
        t('Apply: 3 targeted roles', 90, 'career', 'Microsoft data engineering reqs plus two strong backups. Log each in Apply.', 'behavioral'),
        t('Tailor resume bullets per role', 60, 'career', 'Mirror the req language wherever it is honestly true.', 'behavioral'),
        t('DSA maintenance: 2 problems', 60, 'coding', 'Keep sharp while the pipeline runs.', 'dsa'),
        t('System design refresh case', 60, 'theory', 'One case, timed, out loud.', 'systemdesign'),
        t('Follow up on pending applications', 30, 'career', 'A polite nudge after 7–10 days is normal and it works.', 'behavioral'),
      ]};
      case 2: return { focus: 'Referrals & screens', tasks: [
        t('Referral outreach: 3 messages', 60, 'career', 'Personalised, short, with a specific ask.', 'behavioral'),
        t('Recruiter screen prep', 60, 'career', 'The 90-second pitch, your numbers, your timeline, your comp range.', 'behavioral'),
        t('SQL drills: 4 problems', 60, 'coding', 'Timed.', 'sql'),
        t('Mock interview prep or session', 60, 'coding', 'Whatever round is closest on the calendar.', null),
        t('Reading: the stack of the team you are targeting', 60, 'theory', 'Their engineering blog, their docs, their open source.', 'azure'),
      ]};
      case 3: return { focus: 'Applications & design', tasks: [
        t('Apply: 3 targeted roles', 90, 'career', 'Log date, req ID and contact for every one.', 'behavioral'),
        t('System design case, timed', 75, 'theory', 'Spoken out loud, self-graded against the rubric.', 'systemdesign'),
        t('Follow-ups and thank-you notes', 45, 'career', 'Same day, every time.', 'behavioral'),
        t('DSA: 2 problems, timed', 60, 'coding', 'Maintenance.', 'dsa'),
        t('Update the interview tracker', 30, 'career', 'Every conversation, every name, every next step.', null),
      ]};
      case 4: return { focus: 'Mock & rehearsal', tasks: [
        t('Mock interview: technical', 75, 'coding', 'Whatever round is closest on the calendar.', null),
        t('Log it and work the fixes', 60, 'writing', 'Score, feedback, three fixes, into the Vault.', null),
        t('Azure/Spark rapid-fire', 45, 'coding', 'Depth answers without notes.', 'azure'),
        t('DSA: 2 problems, timed', 60, 'coding', 'Maintenance.', 'dsa'),
        t('Behavioral rehearsal', 60, 'career', 'Three stories, two minutes each, recorded.', 'behavioral'),
      ]};
      case 5: return { focus: 'Debrief & gap patching', tasks: [
        t('Debrief every live round this week', 60, 'career', 'Questions asked, what went well, what did not. Write it down while it is fresh.', null),
        t('DSA: 2 problems, timed', 60, 'coding', 'Maintenance.', 'dsa'),
        t('Patch the top gap from feedback', 90, 'theory', 'Feedback is only useful if it changes the next round.', null),
        t('Portfolio or blog update', 45, 'project', 'Keep the public record fresh while interviewing.', 'behavioral'),
        t('Networking: 2 touchpoints', 45, 'career', 'Keep the warm network warm.', 'behavioral'),
      ]};
      case 6: return { focus: 'Loop simulation or deep patch', tasks: [
        t('Full loop simulation, or deep skill patch', 240, 'coding', 'Whichever the last debrief says you need more.', null),
        t('Portfolio or blog update', 90, 'project', 'One solid piece beats five thin ones.', 'behavioral'),
        t('Drill the weakest round type', 90, 'coding', 'The one you would fail tomorrow.', null),
        t('Review the week\'s pipeline', 60, 'career', 'Applications out, responses in, conversion rate. What needs changing?', null),
      ]};
      default: return { focus: 'Reset & the week ahead', tasks: [
        t('Weekly retro & plan next week', 45, 'career', 'Applications out, responses in, conversion rate.', null),
        t('Networking: 3 touchpoints', 60, 'career', 'Referrals still move more than applications do.', 'behavioral'),
        t('Story bank polish', 60, 'career', 'The stories you will actually be asked for.', 'behavioral'),
        t('Study the weakest area', 150, 'theory', 'The gap your debriefs keep naming.', null),
        t('Prep the week\'s interviews', 90, 'career', 'Company research, questions to ask, logistics.', 'behavioral'),
        t('Portfolio or blog update', 75, 'project', 'Momentum is visible to the people reading your profile.', 'behavioral'),
      ]};
    }
  },
};
