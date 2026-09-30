"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Cloud,
  Database,
  LayoutTemplate,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import styles from "./site.module.css";
import { EASE, Eyebrow, FadeIn } from "./motion";
import type { TechGroup } from "./types";

/**
 * Tabbed logo wall (Nagorik "Tech Ecosystem" reference), built from
 * capabilityGroups. Follows the WAI-ARIA tabs pattern: arrow keys, Home and
 * End move between tabs; only the active tab is in the tab order.
 */

const GLYPHS: Record<string, LucideIcon> = {
  brain: Brain,
  database: Database,
  server: Server,
  layout: LayoutTemplate,
  cloud: Cloud,
  shield: ShieldCheck,
};

export default function TechTabs({ groups }: { groups: TechGroup[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  // Distinct tools: some (TypeScript) sit in more than one group.
  const total = new Set(groups.flatMap((g) => g.items.map((i) => i.name))).size;

  /** Activate a tab; keyboard moves focus with it. Keeps it in view on phones. */
  const select = (i: number, moveFocus = true) => {
    const next = (i + groups.length) % groups.length;
    setActive(next);
    const tab = tabRefs.current[next];
    if (moveFocus) tab?.focus({ preventScroll: true });
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(groups.length - 1),
    };
    const run = keys[e.key];
    if (run) {
      e.preventDefault();
      run();
    }
  };

  const group = groups[active];
  const Fallback = GLYPHS[group.icon] ?? Sparkles;

  return (
    <section className="relative overflow-hidden bg-background-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(58,98,170,0.12),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow center>Tech ecosystem</Eyebrow>
          <h2
            className={`${styles.display} mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl`}
          >
            The stack behind what we ship.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
            {total} tools in production across our products today. We pick them
            for the system in front of us, not for the trend.
          </p>
        </FadeIn>

        {/*
          Index-tab rail (same language as the product category tabs). The
          white block and its accent bar slide between tabs as one piece.
        */}
        <FadeIn delay={0.1}>
          <div className="-mx-6 mt-14 overflow-x-auto px-6 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
            <div
              role="tablist"
              aria-label="Technology areas"
              className="grid min-w-[62rem] grid-cols-6 border-b border-ink/10 lg:min-w-0"
            >
              {groups.map((g, i) => {
                const selected = i === active;
                const Glyph = GLYPHS[g.icon] ?? Sparkles;
                return (
                  <button
                    key={g.name}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${base}-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${base}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i, false)}
                    onKeyDown={onKeyDown}
                    className={`group relative flex flex-col gap-5 px-5 pb-5 pt-6 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                      selected ? "" : "hover:bg-white/50"
                    }`}
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ink/10" />
                    {i > 0 && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-ink/10" />}
                    {selected && (
                      <motion.span
                        layoutId={`${base}-tab`}
                        aria-hidden="true"
                        className="absolute inset-0 bg-white shadow-[0_18px_40px_-28px_rgba(11,21,36,0.45)]"
                        transition={{ type: "spring", bounce: 0.14, duration: 0.55 }}
                      >
                        <span className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
                      </motion.span>
                    )}

                    <span
                      aria-hidden="true"
                      className="relative flex items-center justify-between font-mono text-[11px] tabular-nums text-ink-soft"
                    >
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{g.items.length} tools</span>
                    </span>
                    <span
                      className={`font-display relative flex items-center gap-2.5 text-[15px] font-semibold leading-tight tracking-[-0.01em] transition-colors ${
                        selected ? "text-ink" : "text-ink-soft group-hover:text-ink"
                      }`}
                    >
                      <Glyph
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                        className={`shrink-0 transition-colors ${selected ? "text-accent" : ""}`}
                      />
                      {g.name}
                      <span className="sr-only">, {g.items.length} tools</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${active}`}
          className="mt-10 min-h-[36rem] sm:min-h-[20rem] lg:min-h-[12rem]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={group.name}
              className="flex flex-wrap justify-center gap-4"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04 } },
                exit: { opacity: 0, transition: { duration: 0.15 } },
              }}
            >
              {group.items.map((item) => (
                <motion.li
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, y: 16, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
                  }}
                  className="flex aspect-square w-[calc(50%-0.5rem)] flex-col items-center justify-center gap-4 bg-white p-4 text-center shadow-[0_1px_0_rgba(11,21,36,0.04)] ring-1 ring-border transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,21,36,0.4)] sm:w-36 lg:w-[8.75rem]"
                >
                  {item.logo ? (
                    <svg viewBox="0 0 24 24" className="h-11 w-11" aria-hidden="true" fill={item.logo.hex}>
                      <path d={item.logo.path} />
                    </svg>
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center bg-ink/5 text-ink">
                      <Fallback size={24} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  )}
                  <span className="text-sm font-medium leading-snug text-ink">{item.name}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-ink-soft">
            {group.description}
          </p>
        </div>
      </div>
    </section>
  );
}
