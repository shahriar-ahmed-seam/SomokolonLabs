import Link from "next/link";
import {
  Activity,
  AppWindow,
  ArrowUpRight,
  Bot,
  Building2,
  Cpu,
  FileSearch,
  FlaskConical,
  Gauge,
  Network,
  Plug,
  RefreshCw,
  Rocket,
  Server,
  SlidersHorizontal,
  Sparkles,
  Waypoints,
  Zap,
  type LucideIcon,
} from "lucide-react";
import styles from "./site.module.css";
import { Eyebrow, FadeIn } from "./motion";
import type { Practice } from "./types";

/**
 * Services as a 4 × 4 grid: one column per practice, four offerings each
 * (Vivasoft reference). The offset tint behind each icon is what gives the
 * reference its designed feel; here the tints alternate brand red and navy.
 */

export const OFFERING_ICON: Record<string, LucideIcon> = {
  "RAG & LLM Applications": FileSearch,
  "Agentic Workflows": Bot,
  "Model Fine-Tuning": SlidersHorizontal,
  "On-Device & Edge AI": Cpu,
  "Custom Web Applications": AppWindow,
  "Redesign & Modernization": RefreshCw,
  "APIs & Integrations": Plug,
  "Business Systems": Building2,
  "Deployment & CI/CD": Rocket,
  "Model Serving & MLOps": Server,
  Observability: Activity,
  "Event-Driven Systems": Waypoints,
  "Automated Testing": FlaskConical,
  "AI/LLM Evaluation": Gauge,
  "Architecture Review": Network,
  "Performance & Load": Zap,
};

// Tint + shape pairs, cycled per offering so neighbours never match.
export const TINTS = [
  "bg-accent/15 rounded-full",
  "bg-[#3a62aa]/15",
  "bg-[#3a62aa]/15 rounded-full",
  "bg-accent/15",
];

export default function Services({ practices }: { practices: Practice[] }) {
  return (
    <section className="relative overflow-hidden bg-background-soft">
      {/* Faint vertical rules, as in the reference. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,21,36,0.045)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-accent/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-4 top-14 h-28 w-28 rounded-tr-full bg-[#3a62aa]/10" />

      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <Eyebrow>What we do</Eyebrow>
            <h2
              className={`${styles.display} mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl`}
            >
              Four practices. One team that ships.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-relaxed text-ink-soft">
              From the model to the interface to the infrastructure underneath,
              the same people carry the work from the first call to production.
            </p>
            <Link
              href="/services"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent"
            >
              All services
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </FadeIn>
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((practice, col) => (
            <FadeIn key={practice.slug} delay={col * 0.08}>
              <Link
                href={`/services/${practice.slug}`}
                className="group flex items-center justify-between gap-3 border-b border-ink/15 pb-4"
              >
                <h3 className={`${styles.display} text-lg font-semibold tracking-[-0.02em] text-ink group-hover:text-accent`}>
                  {practice.name}
                </h3>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>

              <ul className="mt-8 space-y-10">
                {practice.offerings.map((offering, row) => {
                  const Glyph = OFFERING_ICON[offering.title] ?? Sparkles;
                  return (
                    <li key={offering.title}>
                      <span className="relative flex h-10 w-10 items-end justify-start">
                        <span
                          aria-hidden="true"
                          className={`absolute right-0 top-0 h-7 w-7 ${TINTS[(col + row) % TINTS.length]}`}
                        />
                        <Glyph size={22} strokeWidth={1.6} aria-hidden="true" className="relative text-ink" />
                      </span>
                      <h4 className="mt-4 text-[15px] font-semibold text-ink">{offering.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {offering.description}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
