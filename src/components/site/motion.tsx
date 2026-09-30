"use client";

/**
 * Motion primitives for the design preview.
 *
 * Reduced motion is handled in two layers:
 *  - <MotionConfig reducedMotion="user"> (see PreviewShell) makes every
 *    entrance animation skip its transform and only fade.
 *  - Scroll-linked and looping effects read usePrefersReducedMotion() and
 *    fall back to a resting value.
 *
 * usePrefersReducedMotion is built on useSyncExternalStore with a server
 * snapshot of `false`, so hydration always matches the server HTML and the
 * real preference is applied on the next render. (Branching on
 * framer-motion's useReducedMotion during render is what causes the blank
 * hydration mismatch on the current site's <Reveal>.)
 */

import { Fragment, useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import {
  animate,
  motion,
  transform,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import styles from "./site.module.css";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ------------------------------------------------------------ Preferences

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

/**
 * Maps a scroll progress value onto an output range, or pins it to `rest`
 * when the visitor prefers reduced motion. Uses a transformer function, so a
 * change in `reduce` is picked up on the next render.
 */
export function useScrollRange(
  value: MotionValue<number>,
  input: number[],
  output: number[],
  rest: number,
  reduce: boolean
) {
  return useTransform(value, (v: number) =>
    reduce ? rest : transform(v, input, output)
  );
}

// ------------------------------------------------------------- Reveals

/** Fade + slide in once when scrolled into view. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      // Bottom-only inset: a uniform negative margin also trims the left and
      // right edges, so narrow items near the edge of a phone never "enter".
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A single line that rises out of a mask on first paint. Used in heroes.
 *
 * Pure CSS, so the headline animates as soon as the HTML arrives instead of
 * waiting for JavaScript to hydrate (on a slow phone that wait is seconds,
 * and it delays the page's largest paint). Off under reduced motion.
 */
export function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <span className={`block ${styles.maskRise}`} style={{ "--delay": `${delay}s` } as CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/**
 * Fade-and-rise entrance for above-the-fold content, in CSS for the same
 * reason as MaskLine. Use FadeIn for content further down the page.
 */
export function Enter({
  children,
  className = "",
  delay = 0,
  fade = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Opacity only, no movement. */
  fade?: boolean;
}) {
  return (
    <div
      className={`${fade ? styles.fadeOnly : styles.enter} ${className}`}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Splits text into words that rise out of a mask, staggered, when in view.
 * `wordClassName` lands on the element that holds each word's text; use it
 * for background-clip:text gradients, which can't reach text inside
 * transformed children from the outer span.
 */
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] pr-[0.08em] -mr-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}

// Words start part-faded rather than nearly invisible, so the text meets WCAG
// AA contrast for large text (3:1) at every scroll position, not only once
// fully revealed. Accent words need a higher floor because red on white has
// less contrast to spare.
const FLOOR = 0.5;
const ACCENT_FLOOR = 0.72;

/**
 * Paragraph whose words brighten one by one as it scrolls through the
 * viewport. Words listed in `highlight` switch to the serif accent.
 */
export function ScrollWords({
  text,
  className = "",
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  const marked = new Set(highlight.map((w) => w.toLowerCase()));

  return (
    <p ref={ref} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const bare = word.replace(/[^\p{L}\p{N}-]/gu, "").toLowerCase();
        const accent = marked.has(bare);
        return (
          <ScrollWord
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            reduce={reduce}
            floor={accent ? ACCENT_FLOOR : FLOOR}
            className={accent ? `${styles.serif} italic text-accent` : undefined}
          >
            {word}
          </ScrollWord>
        );
      })}
    </p>
  );
}

function ScrollWord({
  children,
  progress,
  range,
  reduce,
  floor,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
  floor: number;
  className?: string;
}) {
  const opacity = useScrollRange(progress, range, [floor, 1], 1, reduce);
  return (
    <>
      <motion.span style={{ opacity }} className={className}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  duration = 2.2,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduce = usePrefersReducedMotion();
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, to, duration, value]);

  return (
    <span className={className}>
      {/* Assistive tech gets the final number, not the animation. */}
      <span className="sr-only">{to}</span>
      <motion.span ref={ref} aria-hidden="true">
        {rounded}
      </motion.span>
    </span>
  );
}

// ------------------------------------------------------------ Movement

/** Wrapper that leans toward the pointer. Mouse only; off for reduced motion. */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Thin accent bar across the top of the viewport showing page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

/** Sets --mx / --my on the element so CSS glows can follow the pointer. */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// ------------------------------------------------------------ Small parts

export function Eyebrow({
  children,
  dark = false,
  center = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
        dark ? "text-white/75" : "text-ink-soft"
      } ${center ? "justify-center" : ""} ${className}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}
