"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import styles from "./site.module.css";
import { EASE, Enter, Magnetic, MaskLine, usePrefersReducedMotion, useScrollRange } from "./motion";
import Scene from "./Scene";

const ROTATING = ["AI systems", "web platforms", "ML pipelines", "business software"];

/**
 * Full-viewport hero over background footage (KAZ reference).
 * The header floats over this section. "Start a project" lives in the header
 * only, so the first screen has one primary action of each kind.
 */
export default function Hero({ practices }: { practices: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Footage pushes in slightly; copy lifts and fades as the section leaves.
  const mediaScale = useScrollRange(scrollYProgress, [0, 1], [1, 1.12], 1, reduce);
  const copyY = useScrollRange(scrollYProgress, [0, 0.7], [0, -90], 0, reduce);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
    >
      <motion.div style={{ scale: mediaScale }} className="absolute inset-0 -z-20">
        <Scene name="flow" priority />
      </motion.div>

      {/* Scrims keep the headline legible over any frame of footage. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0b1524_0%,rgba(11,21,36,0.6)_38%,rgba(11,21,36,0.15)_75%,rgba(11,21,36,0.45)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(11,21,36,0.8)_0%,rgba(11,21,36,0.2)_60%,transparent_100%)]"
      />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto mt-auto w-full max-w-7xl px-6 pb-16 pt-40 sm:pb-20"
      >
        <h1
          className={`${styles.display} max-w-5xl text-[2.9rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl lg:text-[6.75rem]`}
        >
          <span className="sr-only">
            We engineer AI systems, web platforms, ML pipelines, and business
            software for production.
          </span>
          <span aria-hidden="true">
            <MaskLine delay={0.1}>We engineer</MaskLine>
            <MaskLine delay={0.22}>
              <RotatingWord words={ROTATING} reduce={reduce} />
            </MaskLine>
            <MaskLine delay={0.34}>for production.</MaskLine>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Enter delay={0.35}>
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Somokolon Labs takes products from first sketch to a system real
              users rely on: designed, built, deployed, and monitored by one
              senior team.
            </p>
          </Enter>

          <Enter delay={0.5} className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(217,45,32,0.8)] transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                See what we&apos;ve built
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
          </Enter>
        </div>
      </motion.div>

      {/* Practice strip + scroll cue */}
      <Enter fade delay={0.7} className="hidden border-t border-white/10 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-white/55">
            {practices.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span className="hidden shrink-0 items-center gap-2 text-xs font-medium text-white/55 sm:inline-flex">
            Scroll
            <ArrowDown size={14} aria-hidden="true" className="motion-safe:animate-bounce" />
          </span>
        </div>
      </Enter>
    </section>
  );
}

/**
 * All words share one grid cell, so the line is always as wide as the
 * longest word and nothing reflows while it cycles.
 */
function RotatingWord({ words, reduce }: { words: string[]; reduce: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  const previous = (index - 1 + words.length) % words.length;

  return (
    <span className="inline-grid overflow-hidden pb-[0.08em] align-bottom">
      {words.map((word, i) => (
        <motion.span
          key={word}
          initial={false}
          animate={{
            y: i === index ? "0%" : i === previous ? "-105%" : "105%",
            opacity: i === index ? 1 : 0,
          }}
          transition={{ duration: 0.75, ease: EASE }}
          className={`${styles.serif} ${styles.accentText} col-start-1 row-start-1 whitespace-nowrap text-[1.1em] italic tracking-[-0.02em]`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
