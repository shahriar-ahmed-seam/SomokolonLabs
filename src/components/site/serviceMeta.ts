import type { SceneName } from "./Scene";

/** Background scene for each practice's hero, so the four pages differ. */
export const SERVICE_SCENE: Record<string, SceneName> = {
  "ai-llm": "discover",
  web: "build",
  cloud: "run",
  qa: "plan",
};

/**
 * The product category that best shows each practice's work. QA runs through
 * every product rather than owning a category, so it has none.
 */
export const SERVICE_CATEGORY: Record<string, string | undefined> = {
  "ai-llm": "ai",
  web: "business",
  cloud: "infrastructure",
};
