import * as icons from "simple-icons";
import type { Logo } from "./types";

/**
 * Server-only lookup from our capability names to Simple Icons marks
 * (CC0 package; the marks themselves remain their owners' trademarks and are
 * used here nominatively, to say which tools we work with).
 *
 * Only imported by the server page, so the full icon set never reaches the
 * client bundle — each tab receives just the SVG paths it renders.
 *
 * `null` means Simple Icons has no mark for it (AWS and Playwright were
 * withdrawn at the owners' request; the rest are techniques, not brands).
 * Those tiles fall back to the group's glyph.
 */
const SLUGS: Record<string, string | null> = {
  PyTorch: "pytorch",
  "Hugging Face Transformers": "huggingface",
  "PEFT / LoRA": null,
  LangGraph: "langgraph",
  Ollama: "ollama",
  "ONNX Runtime": "onnx",
  "scikit-learn": "scikitlearn",
  OpenCV: "opencv",
  pgvector: null,
  Qdrant: "qdrant",
  FAISS: null,
  PostgreSQL: "postgresql",
  Redis: "redis",
  Kafka: "apachekafka",
  FastAPI: "fastapi",
  Python: "python",
  "Node.js": "nodedotjs",
  TypeScript: "typescript",
  Go: "go",
  gRPC: null,
  WebSockets: null,
  "Next.js": "nextdotjs",
  React: "react",
  "Tailwind CSS": "tailwindcss",
  "Framer Motion": "framer",
  Flutter: "flutter",
  Docker: "docker",
  Kubernetes: "kubernetes",
  "GitHub Actions": "githubactions",
  Terraform: "terraform",
  Prometheus: "prometheus",
  Grafana: "grafana",
  AWS: null,
  Vercel: "vercel",
  pytest: "pytest",
  Playwright: null,
  ESLint: "eslint",
  "RAGAS-style evals": null,
  "Load testing": null,
};

const bySlug = new Map<string, Logo>(
  Object.values(icons)
    .filter((i): i is (typeof icons)["siReact"] => typeof i === "object" && i !== null && "slug" in i)
    .map((i) => [i.slug, { path: i.path, hex: `#${i.hex}` }])
);

/** Simple Icons' own slug rule: "Next.js" → "nextdotjs", "C++" → "cplusplus". */
function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

export function logoFor(name: string): Logo | null {
  // Curated names first (including deliberate nulls), then the slug rule for
  // anything else, such as the per-product stacks.
  if (name in SLUGS) {
    const slug = SLUGS[name];
    return slug ? (bySlug.get(slug) ?? null) : null;
  }
  return bySlug.get(toSlug(name)) ?? null;
}
