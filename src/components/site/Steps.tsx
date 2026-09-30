import styles from "./site.module.css";
import { FadeIn } from "./motion";
import type { Step } from "./types";

/**
 * The four engagement steps as a compact row. The home page tells this story
 * with pinned scenes; inner pages use this lighter version.
 */
export default function Steps({ steps, dark = false }: { steps: Step[]; dark?: boolean }) {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.step} className="relative pt-8">
          {/* Rule with an accent segment that marks progress through the row. */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-px ${dark ? "bg-white/15" : "bg-ink/15"}`}
          />
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-px bg-accent"
            style={{ width: `${((i + 1) / steps.length) * 100}%` }}
          />
          <FadeIn delay={i * 0.08}>
            <span
              className={`${styles.display} block text-5xl font-semibold tracking-[-0.05em] ${
                dark ? "text-white/40" : "text-ink/50"
              }`}
            >
              {step.step}
            </span>
            <h3
              className={`${styles.display} mt-6 text-xl font-semibold tracking-[-0.02em] ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              {step.title}
            </h3>
            <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-white/60" : "text-ink-soft"}`}>
              {step.description}
            </p>
          </FadeIn>
        </li>
      ))}
    </ol>
  );
}
