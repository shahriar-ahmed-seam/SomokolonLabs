// Single source of truth for all site copy. Edit here; pages render from it.
// The product catalogue lives in ./products and is re-exported below.

export * from "./products";

import { products } from "./products";

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

/**
 * Headline figures.
 *
 * The product count is derived from the catalogue rather than hardcoded, so the
 * number on the site cannot drift away from the number of products we actually
 * list. Every other value here is a statement of fact, not a projection.
 */
export function getStats(): { value: string; label: string }[] {
  return [
    {
      value: `${products.length}`,
      label: "Products built, deployed, and publicly demoable",
    },
    { value: "4", label: "Practice areas, from applied AI to infrastructure" },
    { value: "End-to-end", label: "Discovery through production and support" },
    { value: "Dhaka, BD", label: "Working with teams anywhere" },
  ];
}

export const contact = {
  email: "hello@somokolonlabs.com",
  phone: "+880 1700-942829",
  linkedin: "https://www.linkedin.com/in/shahriar-ahmed-seam/",
  location: "Dhaka, Bangladesh",
};

/** Organization facts. Used for JSON-LD, the footer, and legal pages. */
export const company = {
  name: "Somokolon Labs",
  legalName: "Somokolon Labs",
  tagline: "AI & software development studio",
  description:
    "Somokolon Labs is an AI and software development studio building LLM systems, web applications, and cloud infrastructure — engineered for production.",
  founded: "2025",
  founder: "Shahriar Ahmed Seam",
  city: "Dhaka",
  country: "Bangladesh",
  // TODO(you): set this to a real mailbox before launch — it is published in
  // SECURITY.md and on the privacy page.
  securityEmail: "security@somokolonlabs.com",
};

export const nav: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

// ---------------------------------------------------------------------------
// Capabilities — the tech stack, grouped so it reads as competence rather than
// a keyword dump.
// ---------------------------------------------------------------------------

export type CapabilityGroup = {
  name: string;
  description: string;
  icon: string;
  items: string[];
};

export const capabilityGroups: CapabilityGroup[] = [
  {
    name: "AI & machine learning",
    description:
      "Model training, fine-tuning, and inference — from transformers to diffusion and on-device CNNs.",
    icon: "brain",
    items: [
      "PyTorch",
      "Hugging Face Transformers",
      "PEFT / LoRA",
      "LangGraph",
      "Ollama",
      "ONNX Runtime",
      "scikit-learn",
      "OpenCV",
    ],
  },
  {
    name: "Retrieval & data",
    description:
      "Vector search, hybrid retrieval, and the storage layers underneath them.",
    icon: "database",
    items: ["pgvector", "Qdrant", "FAISS", "PostgreSQL", "Redis", "Kafka"],
  },
  {
    name: "Backend & APIs",
    description:
      "Typed, documented services built to be called by something other than a demo script.",
    icon: "server",
    items: ["FastAPI", "Python", "Node.js", "TypeScript", "Go", "gRPC", "WebSockets"],
  },
  {
    name: "Frontend",
    description:
      "Accessible, fast interfaces — server-rendered by default, interactive where it matters.",
    icon: "layout",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Flutter"],
  },
  {
    name: "Infrastructure & MLOps",
    description:
      "Containerized services, reproducible deploys, and the observability to know they work.",
    icon: "cloud",
    items: [
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Terraform",
      "Prometheus",
      "Grafana",
      "AWS",
      "Vercel",
    ],
  },
  {
    name: "Quality & evaluation",
    description: "Tests for the software, evals for the models. Both run in CI.",
    icon: "shield",
    items: ["pytest", "Playwright", "ESLint", "RAGAS-style evals", "Load testing"],
  },
];
