// Single source of truth for all site copy. Edit here; pages render from it.

export type Service = {
  slug: string;
  name: string;
  short: string; // one line for cards
  summary: string; // intro paragraph on the service page
  imageQuery: string;
  offerings: { title: string; description: string }[];
};

export const services: Service[] = [
  {
    slug: "ai-llm",
    name: "AI & LLM Engineering",
    short:
      "Production LLM systems, RAG pipelines, agentic workflows, and model fine-tuning.",
    summary:
      "We design and ship applied-AI systems that hold up in production — from retrieval-augmented generation and agentic workflows to fine-tuned open models served behind real APIs.",
    imageQuery: "artificial intelligence machine learning abstract",
    offerings: [
      {
        title: "RAG & LLM Applications",
        description:
          "Retrieval-augmented systems with hybrid search, reranking, and evaluation — grounded answers over your own data.",
      },
      {
        title: "Agentic Workflows",
        description:
          "Multi-step agents that plan, use tools, and act safely, with human-in-the-loop where it matters.",
      },
      {
        title: "Model Fine-Tuning",
        description:
          "Task-specialized open models (LoRA/QLoRA) with reproducible evaluation against real baselines.",
      },
      {
        title: "On-Device & Edge AI",
        description:
          "Quantization and ONNX conversion for privacy-preserving, offline-first inference on constrained devices.",
      },
    ],
  },
  {
    slug: "web",
    name: "Web & Full-Stack Development",
    short:
      "Modern web applications built on React, Next.js, and robust backend services.",
    summary:
      "We build web applications end to end — accessible React/Next.js frontends backed by well-structured FastAPI and Node services, with data models designed to last.",
    imageQuery: "web development code screen dark",
    offerings: [
      {
        title: "Custom Web Applications",
        description:
          "Tailored products built from the ground up around your workflow, not a template.",
      },
      {
        title: "Redesign & Modernization",
        description:
          "Rework dated interfaces and legacy stacks into fast, maintainable, responsive apps.",
      },
      {
        title: "APIs & Integrations",
        description:
          "REST and GraphQL APIs, third-party integrations, and clean service boundaries.",
      },
      {
        title: "Business Systems",
        description:
          "Practical internal tools and POS/ERP-style systems for real operational needs.",
      },
    ],
  },
  {
    slug: "cloud",
    name: "Cloud & MLOps",
    short:
      "Containerized, observable infrastructure with CI/CD and model serving built in.",
    summary:
      "We treat infrastructure as part of the product. Services are containerized, deployed through CI/CD, and monitored — including the pipelines that train, serve, and watch machine-learning models.",
    imageQuery: "cloud infrastructure server data center",
    offerings: [
      {
        title: "Deployment & CI/CD",
        description:
          "Automated build-test-deploy pipelines with GitHub Actions and container registries.",
      },
      {
        title: "Model Serving & MLOps",
        description:
          "Scalable inference serving, drift monitoring, and retrain pipelines for ML in production.",
      },
      {
        title: "Observability",
        description:
          "Metrics, logging, and tracing so you can see how systems behave under real load.",
      },
      {
        title: "Event-Driven Systems",
        description:
          "Decoupled, fault-tolerant services with queues and message streams that scale independently.",
      },
    ],
  },
  {
    slug: "qa",
    name: "Quality Assurance & System Design",
    short:
      "Testing, evaluation, and architecture reviews that keep systems reliable.",
    summary:
      "Reliability is designed in, not bolted on. We bring testing, evaluation, and architecture review into the build so software behaves correctly — and keeps behaving correctly as it grows.",
    imageQuery: "software testing quality engineering",
    offerings: [
      {
        title: "Automated Testing",
        description:
          "Unit, integration, and end-to-end test suites wired into your CI pipeline.",
      },
      {
        title: "AI/LLM Evaluation",
        description:
          "Systematic evaluation harnesses for RAG and LLM systems — faithfulness, relevance, and cost.",
      },
      {
        title: "Architecture Review",
        description:
          "Design reviews focused on scalability, fault tolerance, and maintainability.",
      },
      {
        title: "Performance & Load",
        description:
          "Profiling and load testing to find bottlenecks before your users do.",
      },
    ],
  },
];

// "What we offer" — how the studio works (adapted from an IT-firm blueprint, kept honest for a boutique studio).
export const differentiators: { title: string; description: string; icon: string }[] = [
  {
    title: "Senior-Led Delivery",
    description:
      "You work directly with the engineer building your product — no layers, no handoffs, no lost context.",
    icon: "user-check",
  },
  {
    title: "End-to-End Ownership",
    description:
      "From problem framing to deployment and monitoring, one team owns the full lifecycle of what ships.",
    icon: "workflow",
  },
  {
    title: "Collaborative Process",
    description:
      "Regular check-ins, transparent progress, and code you can read. We work as an extension of your team.",
    icon: "users",
  },
  {
    title: "Built to Last",
    description:
      "Tested, documented, and observable software — not a prototype that breaks the moment it meets real users.",
    icon: "shield-check",
  },
];

// Engagement model (mirrors the IT-firm structure; honest and generic).
export const engagement: { step: string; title: string; description: string }[] = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start with your problem and constraints — what success looks like, and what it will take to get there.",
  },
  {
    step: "02",
    title: "Plan & Estimate",
    description:
      "A clear scope, milestones, and a realistic timeline, so you know what you're getting and when.",
  },
  {
    step: "03",
    title: "Build & Deploy",
    description:
      "Iterative delivery with working software at each step — containerized and shipped, not left in a notebook.",
  },
  {
    step: "04",
    title: "Support & Iterate",
    description:
      "Once it's live, we monitor, maintain, and improve it under real-world use.",
  },
];

export const stats: { value: string; label: string }[] = [
  { value: "End-to-end", label: "Research to production delivery" },
  { value: "4", label: "Core service areas" },
  { value: "AI-first", label: "Applied AI at the core, not bolted on" },
  { value: "Dhaka, BD", label: "Based in Bangladesh, building globally" },
];

export const techStack: string[] = [
  "Python",
  "TypeScript",
  "Next.js",
  "React",
  "FastAPI",
  "PyTorch",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "LangGraph",
  "Kafka",
  "AWS",
];

// ---------------------------------------------------------------------------
// Products — grouped into categories. Nav dropdown lists categories; each
// category page lists its products; each product has its own detail page with
// a "Request a demo" action.
// ---------------------------------------------------------------------------

export type ProductStatus = "Live" | "In Development" | "Prototype";

export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "ai",
    name: "AI Products",
    description:
      "Applied-AI platforms — agentic systems, RAG applications, and on-device intelligence.",
    icon: "brain",
  },
  {
    slug: "business",
    name: "Business Software",
    description:
      "Practical software for real operations — point-of-sale, dashboards, and internal tools.",
    icon: "briefcase",
  },
  {
    slug: "infrastructure",
    name: "Developer Infrastructure",
    description:
      "High-performance building blocks — inference platforms and data systems for engineers.",
    icon: "server",
  },
];

export type Product = {
  slug: string;
  category: string; // ProductCategory slug
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  stack: string[];
  features: string[];
  imageQuery: string;
  demoAvailable: boolean;
};

export const products: Product[] = [
  // --- AI Products ---
  {
    slug: "nexus-agent-orchestrator",
    category: "ai",
    name: "Nexus Agent Orchestrator",
    tagline: "Autonomous multi-agent platform for research and coding",
    description:
      "A platform that orchestrates autonomous AI agents through a plan → research → code → critique loop, with retrieval-augmented grounding over your documents. Designed to run fully offline with local models and no external API keys.",
    status: "In Development",
    stack: ["LangGraph", "FastAPI", "Next.js", "pgvector"],
    features: [
      "Multi-agent planning with safe tool use",
      "RAG over your own document corpus",
      "Runs fully offline with local models",
      "Real-time agent-graph visualization",
    ],
    imageQuery: "artificial intelligence neural network abstract",
    demoAvailable: true,
  },
  {
    slug: "aignis",
    category: "ai",
    name: "AIgnis",
    tagline: "AI-driven autonomous marketing campaign system",
    description:
      "An autonomous system that plans, generates, and optimizes marketing campaigns. Built for the INFINITE AI Builders hackathon, where it reached the final round in the MarTech & Branding category.",
    status: "Prototype",
    stack: ["LLMs", "Agentic AI", "FastAPI", "Next.js"],
    features: [
      "Autonomous campaign planning",
      "AI-generated content variants",
      "Performance-driven optimization",
      "Brand-aware guardrails",
    ],
    imageQuery: "digital marketing campaign analytics",
    demoAvailable: true,
  },
  {
    slug: "hilltrack-pulse",
    category: "ai",
    name: "HillTrack Pulse",
    tagline: "Offline-first healthcare platform for rural regions",
    description:
      "An outbreak-detection and medical-consultation platform designed for low-connectivity rural regions of Bangladesh, combining clustering-based detection with on-device and cloud AI consultation.",
    status: "Prototype",
    stack: ["DBSCAN", "FastAPI", "Ollama", "React"],
    features: [
      "Outbreak detection via spatial clustering",
      "On-device AI medical consultation",
      "Offline-first, low-connectivity design",
      "Multi-modal medical logistics",
    ],
    imageQuery: "healthcare technology rural clinic",
    demoAvailable: true,
  },
  {
    slug: "resonet",
    category: "ai",
    name: "ResoNet",
    tagline: "On-device respiratory screening from cough audio",
    description:
      "A privacy-preserving respiratory-disease screening app that runs entirely on-device. Audio preprocessing and a ResNet model were reimplemented in pure Dart with ONNX Runtime, cutting the app footprint from 600 MB+ to roughly 70 MB with no loss in accuracy.",
    status: "Prototype",
    stack: ["ONNX", "ResNet", "Dart", "Edge AI"],
    features: [
      "Fully on-device inference",
      "Pure-Dart audio preprocessing",
      "~70 MB footprint, down from 600 MB+",
      "Works offline for privacy",
    ],
    imageQuery: "mobile health app medical technology",
    demoAvailable: false,
  },
  // --- Business Software ---
  {
    slug: "pos-suite",
    category: "business",
    name: "POS Suite",
    tagline: "Point-of-sale software for small retail businesses",
    description:
      "A production point-of-sale system covering inventory, billing, and daily sales reporting for small retail shops — built and deployed end to end, from requirements gathering through support.",
    status: "Live",
    stack: ["Next.js", "FastAPI", "PostgreSQL"],
    features: [
      "Inventory and stock management",
      "Fast billing and checkout",
      "Daily sales and revenue reporting",
      "Deployed for real retail operations",
    ],
    imageQuery: "retail point of sale checkout store",
    demoAvailable: true,
  },
  // --- Developer Infrastructure ---
  {
    slug: "orionstream-ml",
    category: "infrastructure",
    name: "OrionStream ML",
    tagline: "Event-driven ML inference platform",
    description:
      "A Kubernetes-orchestrated, event-driven inference platform with decoupled services for ingest, inference, and delivery that scale and recover independently. Built for the BUET CSE Fest hackathon finals.",
    status: "Prototype",
    stack: ["Kubernetes", "Kafka", "FastAPI", "Prometheus"],
    features: [
      "Decoupled, independently scaling services",
      "Event-driven ingest and delivery",
      "Fault-tolerant with automatic recovery",
      "Metrics and monitoring built in",
    ],
    imageQuery: "server data center infrastructure",
    demoAvailable: true,
  },
  {
    slug: "vector-vault-db",
    category: "infrastructure",
    name: "Vector Vault DB",
    tagline: "High-performance vector database",
    description:
      "A vector database built from scratch in C++ with HNSW/IVF approximate-nearest-neighbor indexes, AVX-512 distance kernels, and a memory-mapped snapshot format, exposed through clean Python bindings.",
    status: "Prototype",
    stack: ["C++17", "AVX-512", "pybind11"],
    features: [
      "HNSW and IVF ANN indexes",
      "AVX-512 accelerated distance kernels",
      "Memory-mapped snapshot format",
      "Clean Python bindings",
    ],
    imageQuery: "database technology data storage abstract",
    demoAvailable: false,
  },
];

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export const contact = {
  email: "hello@somokolonlabs.com",
  phone: "+880 1700-942829",
  github: "https://github.com/somokolon-labs",
  linkedin: "https://www.linkedin.com/in/shahriar-ahmed-seam/",
  location: "Dhaka, Bangladesh",
};

export const nav: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];
