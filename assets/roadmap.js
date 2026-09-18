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

/* ---------- daily plan templates ---------- */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function t(title, minutes, tag, detail, skill) {
  return { title, minutes, tag, detail: detail || '', skill: skill || null };
}

const TEMPLATES = {
  learn(dow, a, b, phase) {
    switch (dow) {
      case 1: return {
        focus: a.name,
        tasks: [
          t('SQL warm-up: 2 query drills', 20, 'coding', 'Keep the SQL muscle warm before the deep work.', 'sql'),
          t(`Deep dive: ${a.name}`, 90, 'theory', a.theory, a.skill),
          t('Turn notes into 10 flashcards', 20, 'writing', 'Spaced repetition beats re-reading. Cards you will actually review.', a.skill),
        ],
      };
      case 2: return {
        focus: `${a.name} — hands on`,
        tasks: [
          t(`Lab: ${a.name}`, 120, 'lab', a.lab, a.skill),
          t('Commit the lab with a short README', 20, 'project', 'Every lab lands in Git. Future-you and recruiters both read this.', 'devops'),
          t('1 coding problem (easy/medium)', 30, 'coding', 'Python or SQL. Time it at 25 minutes, then read one better solution.', 'dsa'),
        ],
      };
      case 3: return {
        focus: b.name,
        tasks: [
          t('SQL warm-up: 2 query drills', 20, 'coding', 'Rotate topic: windows, joins, aggregation, dedupe.', 'sql'),
          t(`Deep dive: ${b.name}`, 90, 'theory', b.theory, b.skill),
          t('Read the official docs section', 30, 'theory', 'Primary sources over tutorials. Note the three things that surprised you.', b.skill),
        ],
      };
      case 4: return {
        focus: `${b.name} — hands on`,
        tasks: [
          t(`Lab: ${b.name}`, 120, 'lab', b.lab, b.skill),
          t('Write a 150-word learning note', 20, 'writing', 'Explain today in your own words — this becomes blog and interview material.', 'behavioral'),
          t('1 coding problem (medium)', 30, 'coding', 'Explain the approach out loud before you type.', 'dsa'),
        ],
      };
      case 5: return {
        focus: 'Interview drills & weak-area review',
        tasks: [
          t('SQL interview set: 2 problems', 45, 'coding', 'Timed, no autocomplete, no docs. Log every mistake.', 'sql'),
          t('Python/DSA problem', 45, 'coding', 'Pattern practice — pick the pattern you are worst at.', 'dsa'),
          t('Review the week: weak areas & mistakes log', 40, 'theory', 'Re-solve the two things you got wrong this week.', null),
        ],
      };
      case 6: return {
        focus: 'Project build block',
        tasks: [
          t('Project deep work', 180, 'project', phase.project, null),
          t('Push code + update project README', 30, 'project', 'A visible commit history is part of the portfolio.', 'devops'),
        ],
      };
      default: return {
        focus: 'Retro, story bank & reset',
        tasks: [
          t('Weekly retro & plan next week', 40, 'career', 'What moved, what slipped, what changes next week. Update your skill ratings.', null),
          t('Behavioral: write 1 STAR story', 30, 'career', 'Situation, Task, Action, Result — from this week\'s real work.', 'behavioral'),
          t('Networking: 2 meaningful touchpoints', 25, 'career', 'Comment, share a learning note, or message someone in data engineering.', 'behavioral'),
          t('Light reading: newsletter, paper or talk', 30, 'theory', 'Breadth day. No laptop required.', null),
        ],
      };
    }
  },

  build(dow, a, b, phase) {
    switch (dow) {
      case 1: return { focus: a.name, tasks: [
        t(`Capstone sprint: ${a.name}`, 150, 'project', a.lab, a.skill),
        t('Update architecture diagram & design notes', 30, 'writing', a.theory, 'systemdesign'),
        t('SQL drill: 2 problems', 20, 'coding', 'Maintenance so nothing decays during build weeks.', 'sql'),
      ]};
      case 2: return { focus: `${a.name} — tests & hardening`, tasks: [
        t(`Capstone sprint: ${a.name} (continue)`, 150, 'project', 'Finish the slice you started, then make it re-runnable.', a.skill),
        t('Add tests for what you built', 30, 'project', 'Data tests and unit tests. A pipeline without tests is a demo.', 'devops'),
        t('1 coding problem', 30, 'coding', 'Timed at 25 minutes.', 'dsa'),
      ]};
      case 3: return { focus: b.name, tasks: [
        t(`Capstone sprint: ${b.name}`, 150, 'project', b.lab, b.skill),
        t('Documentation pass', 30, 'writing', b.theory, 'behavioral'),
      ]};
      case 4: return { focus: `${b.name} — ship it`, tasks: [
        t(`Capstone sprint: ${b.name} (continue)`, 150, 'project', 'Close the loop: deployed, scheduled, monitored.', b.skill),
        t('CI/CD & deployment check', 30, 'project', 'Green build, automated deploy, secrets out of code.', 'devops'),
        t('1 coding problem', 30, 'coding', 'Keep the interview reflexes alive.', 'dsa'),
      ]};
      case 5: return { focus: 'System design & interview maintenance', tasks: [
        t('Data system design case (timed 45 min)', 60, 'theory', 'Requirements, volume estimate, architecture, tradeoffs, failure modes, cost.', 'systemdesign'),
        t('SQL interview set: 2 problems', 45, 'coding', 'Timed, no help.', 'sql'),
        t('Blockers retro', 20, 'writing', 'What is actually blocking the capstone? Fix the process, not just the code.', null),
      ]};
      case 6: return { focus: 'Milestone deep work', tasks: [
        t('Deep work: close out this week\'s deliverable', 180, 'project', phase.milestone, null),
        t('Demo recording or screenshots', 30, 'project', 'Proof that it runs beats a description that it runs.', 'behavioral'),
      ]};
      default: return { focus: 'Retro, write-up & reset', tasks: [
        t('Weekly retro & plan next week', 40, 'career', 'Update skill ratings and the capstone burndown.', null),
        t('Write the project blog section', 45, 'writing', 'Problem → approach → tradeoffs → result, with numbers.', 'behavioral'),
        t('Networking: 2 touchpoints', 25, 'career', 'Share the week\'s progress publicly.', 'behavioral'),
      ]};
    }
  },

  interview(dow, a, b) {
    switch (dow) {
      case 1: return { focus: `DSA: ${a.name}`, tasks: [
        t(`DSA set: 3 problems — ${a.name}`, 90, 'coding', a.theory, a.skill),
        t('SQL drill set: 3 problems', 30, 'coding', 'Timed 10 minutes each.', 'sql'),
        t('Review the mistakes log', 20, 'theory', 'Re-solve one problem you failed last week.', null),
      ]};
      case 2: return { focus: 'System design', tasks: [
        t('Data system design: 1 timed case (45 min)', 60, 'theory', 'Design a pipeline end to end and defend the tradeoffs.', 'systemdesign'),
        t('Write the design doc & self-grade', 30, 'writing', 'Grade against a rubric: requirements, scale, storage, processing, failure, cost.', 'systemdesign'),
        t('Azure/Spark rapid-fire: 20 cards', 30, 'coding', 'Spoken answers, under 45 seconds each.', 'azure'),
      ]};
      case 3: return { focus: `DSA & SQL: ${b.name}`, tasks: [
        t(`DSA set: 3 problems — ${b.name}`, 90, 'coding', b.theory, b.skill),
        t('SQL interview set: 3 problems', 45, 'coding', 'Hard set: window functions, gaps and islands, funnels.', 'sql'),
      ]};
      case 4: return { focus: 'Mock interview day', tasks: [
        t('Mock interview: technical round (60 min)', 60, 'coding', 'Peer, mentor or AI interviewer. Camera on, think out loud.', null),
        t('Feedback notes & fix list', 30, 'writing', 'Three concrete fixes before the next mock.', null),
        t('Behavioral: rehearse 2 STAR stories', 30, 'career', 'Two minutes each, out loud, no script in front of you.', 'behavioral'),
      ]};
      case 5: return { focus: 'Modeling case & positioning', tasks: [
        t('Data modeling case (timed)', 60, 'theory', 'Grain, dimensions, metrics, history, late-arriving data.', 'modeling'),
        t('Resume / portfolio iteration', 30, 'career', 'One section, rewritten against a real job description.', 'behavioral'),
        t('Company research: Microsoft data orgs', 30, 'career', 'Teams, products, the stack they publish about, open reqs.', 'behavioral'),
      ]};
      case 6: return { focus: 'Full loop simulation', tasks: [
        t('Simulated loop: 2 back-to-back rounds', 150, 'coding', 'Coding + design, with a 10-minute break between. Time pressure is the point.', null),
        t('Post-mortem notes', 30, 'writing', 'Where did you stall? What phrase did you fumble?', null),
      ]};
      default: return { focus: 'Retro, stories & outreach', tasks: [
        t('Weekly retro & plan next week', 40, 'career', 'Track mock scores week over week.', null),
        t('Polish the story bank', 30, 'career', 'Tighten two STAR stories; add numbers.', 'behavioral'),
        t('Networking & referral outreach', 40, 'career', 'Three messages. Referrals move applications more than anything else.', 'behavioral'),
      ]};
    }
  },

  apply(dow) {
    switch (dow) {
      case 1: return { focus: 'Application block', tasks: [
        t('Apply: 3 targeted roles', 60, 'career', 'Microsoft data engineering reqs plus two strong backups.', 'behavioral'),
        t('Tailor resume bullets per role', 40, 'career', 'Mirror the req language where it is honestly true.', 'behavioral'),
        t('DSA maintenance: 2 problems', 40, 'coding', 'Keep sharp while the pipeline runs.', 'dsa'),
      ]};
      case 2: return { focus: 'Referrals & screens', tasks: [
        t('Referral outreach: 3 messages', 40, 'career', 'Personalised, short, with a specific ask.', 'behavioral'),
        t('Recruiter screen prep', 40, 'career', 'The 90-second pitch, your numbers, your timeline.', 'behavioral'),
        t('SQL drills: 3 problems', 30, 'coding', 'Timed.', 'sql'),
      ]};
      case 3: return { focus: 'Applications & design refresh', tasks: [
        t('Apply: 3 targeted roles', 60, 'career', 'Log every application with date, req ID and contact.', 'behavioral'),
        t('System design refresh case', 45, 'theory', 'One case, timed, spoken out loud.', 'systemdesign'),
        t('Follow up on pending applications', 20, 'career', 'A polite nudge after 7-10 days is normal and works.', 'behavioral'),
      ]};
      case 4: return { focus: 'Mock & rehearsal', tasks: [
        t('Mock interview: technical', 60, 'coding', 'Whatever round is closest on the calendar.', null),
        t('Behavioral rehearsal', 30, 'career', 'Two stories, two minutes each.', 'behavioral'),
        t('Azure/Spark rapid-fire', 30, 'coding', 'Depth answers without notes.', 'azure'),
      ]};
      case 5: return { focus: 'Debrief & gap patching', tasks: [
        t('Debrief & update the interview tracker', 40, 'career', 'Every round: questions asked, what went well, what did not.', null),
        t('DSA maintenance: 2 problems', 40, 'coding', 'Timed.', 'dsa'),
        t('Patch the top gap from feedback', 40, 'theory', 'Feedback is only useful if it changes the next session.', null),
      ]};
      case 6: return { focus: 'Loop simulation or deep patch', tasks: [
        t('Full loop simulation or deep skill patch', 150, 'coding', 'Whichever the last debrief says you need more.', null),
        t('Portfolio or blog update', 30, 'project', 'Keep the public record fresh while interviewing.', 'behavioral'),
      ]};
      default: return { focus: 'Retro & reset', tasks: [
        t('Weekly retro & plan next week', 40, 'career', 'Applications out, responses in, conversion rate.', null),
        t('Networking: 3 touchpoints', 30, 'career', 'Keep the warm network warm.', 'behavioral'),
        t('Rest & reset', 30, 'career', 'A rested candidate interviews better. This is a real task.', null),
      ]};
    }
  },
};
