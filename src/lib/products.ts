/**
 * Product catalogue.
 *
 * Every entry here is deployed and publicly reachable — `demoUrl` was verified
 * live before being added. If a deployment goes down, remove the URL rather than
 * leaving a dead link; a broken demo reads worse than no demo.
 *
 * `screenshot` points at a real capture of the product's own interface, produced
 * by `scripts/capture-screenshots.mjs`. No stock photography on product pages.
 */

export type ProductStatus = "Live" | "Beta";

export type ProductMetric = { value: string; label: string };

export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "ai",
    name: "AI & LLM Platforms",
    description:
      "Retrieval, agents, and model infrastructure — applied AI that runs behind a real API and gets evaluated.",
    icon: "brain",
  },
  {
    slug: "business",
    name: "Business Systems",
    description:
      "Operational software for how organisations actually run — retail, finance, healthcare, and logistics.",
    icon: "briefcase",
  },
  {
    slug: "infrastructure",
    name: "Developer Infrastructure",
    description:
      "The layer underneath: serving, messaging, orchestration, and the tooling that keeps it observable.",
    icon: "server",
  },
  {
    slug: "vision",
    name: "Vision & Edge AI",
    description:
      "Computer vision that runs where the data is — in the browser, on the device, at the edge.",
    icon: "gauge",
  },
];

export type Product = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  stack: string[];
  features: string[];
  /** Verified reachable. Omit if the deployment is down. */
  demoUrl?: string;
  /**
   * Branded host for the demo, e.g. "cartograph.somokolonlabs.com".
   *
   * Once the subdomain is attached in Vercel and DNS resolves, set this and the
   * site links here instead of the *.vercel.app URL. Flip products over one at
   * a time — `demoUrl` stays as the fallback until you do.
   * See docs/demo-domains.md for the setup.
   */
  demoDomain?: string;
  /** Path under /public. Omit if no capture exists yet. */
  screenshot?: string;
  /** Only numbers we can defend. Omit rather than estimate. */
  metrics?: ProductMetric[];
};

// NOTE: Verity (multi-tenant document intelligence) is deliberately absent.
// Its former deployment URL now serves an unrelated third-party site — the
// Vercel subdomain was reclaimed. Re-add it only once it is redeployed on a
// domain we control, and re-verify the URL before doing so.

export const products: Product[] = [
  // ---------------------------------------------------------------- AI & LLM
  {
    slug: "cartograph",
    category: "ai",
    name: "Cartograph",
    tagline: "Codebase Q&A that cites real files and line numbers",
    description:
      "New engineers ask where things live and how they work. Cartograph answers from the repository itself and cites file and line, resolving each citation to a permalink — so the answer can be checked in seconds rather than trusted on faith.",
    status: "Live",
    stack: ["Python", "AST parsing", "Hybrid retrieval", "FastAPI"],
    features: [
      "AST-aware chunking that respects function and class boundaries",
      "Three-arm hybrid retrieval instead of embeddings alone",
      "Citations resolve to file and line permalinks",
      "Built-in citation-accuracy evaluation",
    ],
    demoUrl: "https://cartograph-code.vercel.app",
    screenshot: "/work/cartograph.webp",
  },
  {
    slug: "forge",
    category: "ai",
    name: "Forge",
    tagline: "A multi-agent team that turns a spec into a tested repository",
    description:
      "Planner, coder, tester, and reviewer agents work a specification into a working repository with tests. Code executes in a sandbox rather than on the host, and results are measured against a held-out benchmark rather than demonstrated on cherry-picked examples.",
    status: "Live",
    stack: ["LangGraph", "FastAPI", "Next.js", "Docker"],
    features: [
      "Planner, coder, tester, and reviewer agents with distinct roles",
      "Sandboxed code execution, isolated from the host",
      "Scored against a held-out benchmark, not demo cases",
      "Full run history so you can see how a result was reached",
    ],
    demoUrl: "https://forge-console-mocha.vercel.app",
    screenshot: "/work/forge.webp",
    metrics: [
      { value: "4 agents", label: "Planner, coder, tester, reviewer in one loop" },
    ],
  },
  {
    slug: "sentinel",
    category: "ai",
    name: "Sentinel",
    tagline: "Model gateway that routes every request to the cheapest capable model",
    description:
      "Most requests do not need your most expensive model. Sentinel predicts, per tier, whether a cheaper model will answer well, routes accordingly, and keeps an auditable ledger of what each request cost. It speaks the OpenAI API, so it drops in front of existing code.",
    status: "Live",
    stack: ["FastAPI", "OpenAI-compatible API", "Redis", "OpenTelemetry"],
    features: [
      "Calibrated per-tier prediction of whether a cheaper model suffices",
      "Per-request cost accounting with an auditable ledger",
      "W3C trace context propagation for end-to-end tracing",
      "Circuit breakers and load-tested failure behaviour",
      "OpenAI-compatible, so integration is a base-URL change",
    ],
    demoUrl: "https://sentinel-console-xi.vercel.app",
    screenshot: "/work/sentinel.webp",
  },
  {
    slug: "autoresearch-ai",
    category: "ai",
    name: "AutoResearch",
    tagline: "Five agents turn a question into a citation-backed report",
    description:
      "A research question goes in; a written report with checkable citations comes out. Separate agents plan the enquiry, search, vet what they find, write, and cite — with progress streamed live so the process is visible rather than a spinner.",
    status: "Live",
    stack: ["Next.js", "LangGraph", "Server-sent events", "FastAPI"],
    features: [
      "Distinct plan, search, vet, write, and cite stages",
      "Sources vetted before they reach the draft",
      "Live progress streamed over SSE",
      "Every claim carries a citation",
    ],
    demoUrl: "https://autoresearch-ai-rho.vercel.app",
    screenshot: "/work/autoresearch-ai.webp",
  },
  {
    slug: "lumos",
    category: "ai",
    name: "Lumos",
    tagline: "Plain-English prompts to production React components",
    description:
      "Describe a component and get React and Tailwind back, rendered live in a sandbox so you can see it before you keep it. Runs across several model providers with automatic fallback, so a single provider outage does not stop work.",
    status: "Live",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Multi-provider LLM"],
    features: [
      "Live sandboxed rendering of generated components",
      "Conversational iteration rather than one-shot generation",
      "Version history for every component",
      "Provider fallback across hosted and local models",
    ],
    demoUrl: "https://lumos-cyan.vercel.app",
    screenshot: "/work/lumos.webp",
  },

  // ------------------------------------------------------- Business systems
  {
    slug: "coregrid",
    category: "business",
    name: "CoreGrid",
    tagline: "AI-native ERP for organisations that outgrew spreadsheets",
    description:
      "HR, CRM, inventory, finance, and projects in one system, with AI that runs on your own hardware rather than sending operational data to a third party. Built for organisations that need real processes without an enterprise implementation budget.",
    status: "Live",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "On-device LLM"],
    features: [
      "HR, CRM, inventory, finance, and project modules in one system",
      "Private on-device AI — operational data stays in your infrastructure",
      "Runs standalone for evaluation without a deployment project",
      "Role-based access across every module",
    ],
    demoUrl: "https://coregrid.vercel.app",
    screenshot: "/work/coregrid.webp",
  },
  {
    slug: "counterflow",
    category: "business",
    name: "CounterFlow",
    tagline: "Point of sale that keeps selling when the internet drops",
    description:
      "Retail counters cannot stop because a connection did. CounterFlow runs offline first, syncing when the network returns — barcode checkout, live inventory, and thermal receipts, plus a close-of-day analyst that summarises the day's trading.",
    status: "Live",
    stack: ["React", "Vite", "IndexedDB", "Thermal printing"],
    features: [
      "Offline-first — the till keeps working without a connection",
      "Barcode checkout with live inventory deduction",
      "Thermal receipt printing",
      "AI close-of-day analysis of the day's trading",
    ],
    demoUrl: "https://counterflow-pi.vercel.app/",
    screenshot: "/work/counterflow.webp",
    metrics: [
      { value: "Offline-first", label: "Trades through a network outage" },
    ],
  },
  {
    slug: "stockpilot",
    category: "business",
    name: "StockPilot",
    tagline: "Inventory intelligence for multi-location retail",
    description:
      "A command centre for stock: what is moving, what is about to run out, and what is sitting still. Alerts arrive before a shelf is empty rather than after, and the analysis runs on a local model so stock data does not leave the business.",
    status: "Live",
    stack: [".NET 10", "Next.js", "PostgreSQL", "Local LLM"],
    features: [
      "Real-time stock position across locations",
      "Low-stock alerts ahead of stockouts",
      "AI insights generated by a locally hosted model",
      "Movement and dead-stock analysis",
    ],
    demoUrl: "https://stockpilot-tau-virid.vercel.app/",
    screenshot: "/work/stockpilot.webp",
  },
  {
    slug: "ledger-core",
    category: "business",
    name: "Ledger Core",
    tagline: "Core banking engine built for correctness under concurrency",
    description:
      "Money movement where the accounting has to be right every time. Double-entry bookkeeping with database row-level locking, so simultaneous transfers cannot corrupt a balance, behind JWT and role-based access control.",
    status: "Live",
    stack: ["Java", "Spring Boot", "PostgreSQL", "React"],
    features: [
      "Double-entry bookkeeping as the core data model",
      "Row-level locking for concurrency-safe transfers",
      "JWT authentication with role-based access control",
      "Internet-banking dashboard for account holders",
    ],
    demoUrl: "https://ledger-core-banking.vercel.app",
    screenshot: "/work/ledger-core.webp",
  },
  {
    slug: "care-connect",
    category: "business",
    name: "CareConnect",
    tagline: "Telemedicine and records for clinics in Bangladesh",
    description:
      "Video consultations, encrypted patient records, and digital prescriptions in one platform, designed around how clinics here actually operate rather than assuming a Western practice-management stack.",
    status: "Live",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "WebRTC"],
    features: [
      "WebRTC video consultations without a third-party meeting tool",
      "AES-256 encrypted patient records",
      "Digital prescriptions issued as PDFs",
      "Built around local clinical workflows",
    ],
    demoUrl: "https://care-connect-emr.vercel.app/",
    screenshot: "/work/care-connect.webp",
  },
  {
    slug: "fleet-command",
    category: "business",
    name: "Fleet Command",
    tagline: "Live fleet tracking with optimised routing",
    description:
      "Where every vehicle is, whether it has left the area it should be in, and the shortest way to cover today's stops. Geo-fencing runs in the database and routing through a dedicated optimiser, with the latency-sensitive path written in Go.",
    status: "Live",
    stack: ["Go", "NestJS", "PostGIS", "OR-Tools", "React"],
    features: [
      "Live vehicle tracking on one operational map",
      "PostGIS geo-fencing with entry and exit alerts",
      "Route optimisation via OR-Tools",
      "Go hot path for high-frequency position updates",
    ],
    demoUrl: "https://fleet-command-center-eight.vercel.app",
    screenshot: "/work/fleet-command.webp",
  },

  // ------------------------------------------------ Developer infrastructure
  {
    slug: "vector-vault",
    category: "infrastructure",
    name: "Vector Vault DB",
    tagline: "A vector database written from scratch in C++17",
    description:
      "Approximate nearest-neighbour search without the dependency footprint of a hosted vector service. HNSW and IVF indexes, hand-written AVX-512 distance kernels, a custom arena allocator, and a memory-mapped snapshot format, exposed through Python bindings.",
    status: "Live",
    stack: ["C++17", "AVX-512", "pybind11", "Python"],
    features: [
      "HNSW and IVF approximate-nearest-neighbour indexes",
      "AVX-512 distance kernels for vectorised search",
      "Custom arena allocator to control allocation cost",
      "Memory-mapped snapshots for fast restart",
      "Clean Python bindings over the C++ core",
    ],
    demoUrl: "https://pypi.org/project/vector-vault-db/",
    metrics: [{ value: "On PyPI", label: "Installable as a published package" }],
  },
  {
    slug: "flywheel",
    category: "infrastructure",
    name: "Flywheel",
    tagline: "MLOps control plane that closes the loop",
    description:
      "Models decay quietly. Flywheel versions the data, gates training runs, releases by canary, watches for drift, and retrains or rolls back on its own — so a degrading model is caught by the system rather than by a customer.",
    status: "Live",
    stack: ["Python", "Docker", "Prometheus", "Next.js"],
    features: [
      "Versioned datasets tied to the models trained on them",
      "Gated training runs with promotion criteria",
      "Canary releases before full rollout",
      "Drift detection with automated retraining",
      "Automatic rollback when a release regresses",
    ],
    demoUrl: "https://flywheel-console.vercel.app",
    screenshot: "/work/flywheel.webp",
  },
  {
    slug: "blast-notify",
    category: "infrastructure",
    name: "Blast",
    tagline: "Notification engine built for volume spikes",
    description:
      "Sending a million messages is a queueing problem, not a sending problem. Blast uses durable RabbitMQ queues so nothing is lost on restart, atomic Redis rate limiting so downstream providers are not overrun, and exponential-backoff retries for the ones that fail.",
    status: "Live",
    stack: ["FastAPI", "RabbitMQ", "Redis", "Next.js"],
    features: [
      "Durable queueing — a restart loses no messages",
      "Atomic Redis rate limiting to respect provider limits",
      "Exponential-backoff retries with a dead-letter path",
      "Real-time console for throughput and failures",
    ],
    demoUrl: "https://blast-notify-engine.vercel.app",
    screenshot: "/work/blast-notify.webp",
    metrics: [
      { value: "1M messages", label: "Dispatched in five minutes under load test" },
    ],
  },
  {
    slug: "code-sandbox",
    category: "infrastructure",
    name: "Sandbox",
    tagline: "Ephemeral isolated execution for AI-generated code",
    description:
      "If an agent writes code, something has to run it safely. Sandbox executes untrusted code in short-lived Docker containers with hard resource limits, behind an API — so a runaway or hostile program is contained rather than hosted.",
    status: "Live",
    stack: ["Docker", "FastAPI", "Next.js", "TypeScript"],
    features: [
      "One isolated container per execution, destroyed afterwards",
      "Hard CPU, memory, and wall-clock limits",
      "API gateway for agent integration",
      "Playground for interactive testing",
    ],
    demoUrl: "https://ai-code-sandbox-one.vercel.app/",
    screenshot: "/work/code-sandbox.webp",
  },
  {
    slug: "kubepulse",
    category: "infrastructure",
    name: "KubePulse",
    tagline: "Kubernetes observability with chaos testing built in",
    description:
      "See every pod, then break one on purpose and watch the cluster heal. Chaos experiments run from the same console as the monitoring, which is the only honest way to know whether your recovery actually works.",
    status: "Live",
    stack: ["React", "FastAPI", "Kubernetes", "Prometheus"],
    features: [
      "Live topology view of pods and services",
      "Fault injection from the console",
      "Observed self-healing behaviour after failure",
      "AI-assisted incident analysis",
    ],
    demoUrl: "https://kubepulse.vercel.app",
    screenshot: "/work/kubepulse.webp",
  },
  {
    slug: "streammind",
    category: "infrastructure",
    name: "StreamMind",
    tagline: "Real-time recommendations on streaming features",
    description:
      "Two-stage retrieval and ranking over features that update as users act, rather than as a nightly batch. Kafka carries the feature pipeline, FAISS handles candidate retrieval, and the whole path is instrumented.",
    status: "Live",
    stack: ["Python", "Kafka", "FAISS", "FastAPI"],
    features: [
      "Two-stage candidate retrieval then ranking",
      "Streaming feature pipelines over Kafka",
      "FAISS vector search for candidate generation",
      "Online metrics on serving latency and quality",
    ],
    demoUrl: "https://streammind-topaz.vercel.app/",
    screenshot: "/work/streammind.webp",
  },

  // ------------------------------------------------------- Vision & edge AI
  {
    slug: "kestrel",
    category: "vision",
    name: "Kestrel",
    tagline: "Crowd and traffic analytics that runs without a GPU",
    description:
      "Counting people and vehicles from a video feed in real time, on ordinary CPU hardware. Detection runs through ONNX Runtime rather than a training framework, which is what makes commodity hardware sufficient — and keeps deployment cost proportionate to the problem.",
    status: "Live",
    stack: ["YOLOX", "ONNX Runtime", "OpenCV", "WebSockets"],
    features: [
      "Detection and tracking with line crossing counts",
      "Zone occupancy and heatmaps over time",
      "Results streamed live over WebSockets",
      "CPU-only — no GPU in the deployment footprint",
    ],
    demoUrl: "https://kestrel-vision.vercel.app",
    screenshot: "/work/kestrel.webp",
    metrics: [{ value: "CPU only", label: "Real-time tracking without a GPU" }],
  },
  {
    slug: "leafwise",
    category: "vision",
    name: "LeafWise",
    tagline: "Crop disease detection that works with no signal",
    description:
      "A farmer photographs a leaf and gets an answer without a network round trip, because the model runs in the browser. A 9.25 MB model covers 38 disease classes across 14 crops, and accuracy is published against field photographs as well as the training set — because a single number would flatter it.",
    status: "Live",
    stack: ["MobileNetV2", "ONNX Runtime Web", "TypeScript", "PWA"],
    features: [
      "Runs entirely in the browser, offline after first load",
      "38 disease classes across 14 crops",
      "Cross-dataset accuracy published, not just in-sample",
      "No image ever leaves the device",
    ],
    demoUrl: "https://leafwise-scan.vercel.app",
    screenshot: "/work/leafwise.webp",
    metrics: [
      { value: "9.25 MB", label: "Model size, running fully in-browser" },
      { value: "38 classes", label: "Across 14 crop types" },
    ],
  },
  // NOTE: Edge Node (INT8 on-device surveillance) is not listed. Its console is
  // behind a sign-in wall, so there is no page a visitor could usefully see —
  // linking a login form as a "demo" is worse than omitting the product. Add it
  // back if a public demo mode is built.
  {
    slug: "kinetix",
    category: "vision",
    name: "Kinetix",
    tagline: "Movement analysis in the browser, on-device",
    description:
      "Counting a repetition is easy; judging whether it was done properly is the useful part. Kinetix reads 33 pose landmarks from a webcam, computes joint angles, and checks form — all locally, so no video of anyone leaves the browser.",
    status: "Live",
    stack: ["MediaPipe", "TypeScript", "WebGL", "React"],
    features: [
      "33 pose landmarks extracted from a live camera feed",
      "Joint angle computation with form checks, not just counting",
      "Repetition counting validated by tests rather than asserted",
      "Entirely on-device — no video leaves the browser",
    ],
    demoUrl: "https://kinetix-pose.vercel.app",
    screenshot: "/work/kinetix.webp",
    metrics: [{ value: "33 landmarks", label: "Tracked per frame, on-device" }],
  },
];

/**
 * Where a product's "Open live demo" button points.
 *
 * Prefers our own branded subdomain when one is configured, falling back to the
 * raw deployment URL. Every link in the UI goes through this, so moving a
 * product onto somokolonlabs.com is a one-line change in the catalogue.
 */
export function demoHref(product: Product): string | undefined {
  if (product.demoDomain) return `https://${product.demoDomain}`;
  return product.demoUrl;
}

/** The subdomain a product should get. Used by scripts/plan-demo-domains.mjs. */
export function intendedDemoDomain(product: Product): string {
  return `${product.slug}.somokolonlabs.com`;
}

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProduct(category: string, slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.category === category);
}

/**
 * Brand colours per product, sampled from each product's own interface
 * (the dominant saturated colour in its /public/work screenshot), then
 * darkened for `deep` and lifted for `light`.
 *
 *   deep  — background for a text tile; white text passes contrast on it.
 *   light — eyebrow / link tint used on top of `deep`.
 *
 * Re-sample if a product's UI changes colour.
 */
export const productTones: Record<string, { deep: string; light: string }> = {
  "autoresearch-ai": { deep: "#104635", light: "#89e6c9" },
  "blast-notify": { deep: "#103346", light: "#7cc8f3" },
  "care-connect": { deep: "#104346", light: "#8bdfe4" },
  cartograph: { deep: "#242a32", light: "#90b1df" },
  "code-sandbox": { deep: "#103246", light: "#8bc3e4" },
  coregrid: { deep: "#113045", light: "#8dc0e2" },
  counterflow: { deep: "#181046", light: "#8c7bf4" },
  "fleet-command": { deep: "#153042", light: "#90bfdf" },
  flywheel: { deep: "#364611", light: "#cae38d" },
  forge: { deep: "#442313", light: "#e0aa8f" },
  kestrel: { deep: "#433314", light: "#dfc590" },
  kinetix: { deep: "#314512", light: "#c1e28d" },
  kubepulse: { deep: "#103f46", light: "#8ad8e5" },
  leafwise: { deep: "#402117", light: "#dfa490" },
  "ledger-core": { deep: "#124537", light: "#8de2cb" },
  lumos: { deep: "#461031", light: "#e48bc1" },
  sentinel: { deep: "#103f46", light: "#86dce9" },
  stockpilot: { deep: "#241542", light: "#ab90df" },
  streammind: { deep: "#462410", light: "#e7ab89" },
};
