import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Scene, { type SceneName } from "./Scene";
import styles from "./site.module.css";
import { Eyebrow, FadeIn, MaskLine } from "./motion";

/**
 * Dark opening section for every inner page, in the same world as the home
 * hero: Scene footage (gradient stand-in for now), scrims, and a headline
 * with an optional italic serif accent. The fixed header floats over it.
 *
 *   title   "Four practices."
 *   accent  "One team."        → rendered in the serif, red gradient
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  accentFirst = false,
  lead,
  back,
  scene = "flow",
  glow,
  aside,
  children,
  compact = false,
  titleSize = "lg",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  /** Put the accent words before the title instead of after. */
  accentFirst?: boolean;
  lead?: ReactNode;
  back?: { href: string; label: string };
  scene?: SceneName;
  /** Extra colour wash, e.g. a product's own brand colour. */
  glow?: string;
  /** Right-hand column (screenshot, facts). Copy narrows to make room. */
  aside?: ReactNode;
  /** Actions or meta under the lead. */
  children?: ReactNode;
  compact?: boolean;
  /** "md" for long titles such as article headlines. */
  titleSize?: "lg" | "md";
}) {
  const accentNode = accent ? (
    <span className={`${styles.serif} ${styles.accentText} italic tracking-[-0.02em]`}>{accent}</span>
  ) : null;

  return (
    <section
      className={`relative isolate flex flex-col overflow-hidden bg-ink text-white ${
        compact ? "min-h-[52svh]" : "min-h-[72svh]"
      }`}
    >
      <div className="absolute inset-0 -z-20">
        <Scene name={scene} />
      </div>
      {glow && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background: `radial-gradient(ellipse 55% 60% at 85% 35%, ${glow}, transparent 70%)`,
          }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0b1524_0%,rgba(11,21,36,0.55)_45%,rgba(11,21,36,0.2)_80%,rgba(11,21,36,0.5)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(11,21,36,0.85)_0%,rgba(11,21,36,0.25)_65%,transparent_100%)]"
      />

      <div
        className={`mx-auto mt-auto w-full max-w-7xl px-6 pt-36 ${compact ? "pb-14" : "pb-16 sm:pb-20"} ${
          aside ? "grid gap-12 lg:grid-cols-12 lg:items-end" : ""
        }`}
      >
        <div className={aside ? "lg:col-span-6" : ""}>
          {back && (
            <FadeIn y={8}>
              <Link
                href={back.href}
                className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                {back.label}
              </Link>
            </FadeIn>
          )}
          {eyebrow && (
            <FadeIn y={8}>
              <Eyebrow dark>{eyebrow}</Eyebrow>
            </FadeIn>
          )}

          <h1
            className={`${styles.display} ${eyebrow ? "mt-6" : ""} ${
              aside ? "max-w-3xl" : titleSize === "md" ? "max-w-4xl" : "max-w-5xl"
            } font-semibold tracking-[-0.045em] ${
              titleSize === "md"
                ? "text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.75rem]"
                : `text-[2.6rem] leading-[1.02] sm:text-6xl ${aside ? "lg:text-[4.25rem]" : "lg:text-[5.25rem]"}`
            }`}
          >
            <MaskLine delay={0.05}>
              {accentFirst && accentNode ? (
                <>
                  {accentNode} {title}
                </>
              ) : (
                <>
                  {title}
                  {accentNode ? <> {accentNode}</> : null}
                </>
              )}
            </MaskLine>
          </h1>

          {lead && (
            <FadeIn delay={0.25} y={14}>
              <div className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {lead}
              </div>
            </FadeIn>
          )}
          {children && (
            <FadeIn delay={0.35} y={14} className="mt-9">
              {children}
            </FadeIn>
          )}
        </div>

        {aside && (
          <FadeIn delay={0.3} y={24} className="lg:col-span-6">
            {aside}
          </FadeIn>
        )}
      </div>

      {/* Hairline where the hero meets the page. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.14),transparent)]"
      />
    </section>
  );
}
