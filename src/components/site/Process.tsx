"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./site.module.css";
import { EASE, Eyebrow } from "./motion";
import Scene, { type SceneName } from "./Scene";
import type { Step } from "./types";

/**
 * Pinned footage with the process scrolling over it (KAZ reference: the clip
 * under the hero that holds while sections pass). The background is sticky
 * for the whole section and cuts between one scene per step.
 */

// The intro panel ("How we work") has its own scene, then one per step.
const INTRO_SCENE: SceneName = "process";
const STEP_SCENES: SceneName[] = ["discover", "plan", "build", "run"];

export default function Process({ steps }: { steps: Step[] }) {
  // -1 = the intro panel, 0… = the steps.
  const [active, setActive] = useState(-1);
  const scenes = [INTRO_SCENE, ...STEP_SCENES.slice(0, steps.length)];
  const sceneIndex = active + 1;

  return (
    <section className="relative bg-ink text-white" aria-labelledby="process-heading">
      {/* Pinned media layer */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {scenes.map((name, i) => (
          <motion.div
            key={name}
            className={`absolute inset-0 ${
              i === sceneIndex ? "" : "[&_*]:[animation-play-state:paused]"
            }`}
            initial={false}
            animate={{ opacity: i === sceneIndex ? 1 : 0, scale: i === sceneIndex ? 1 : 1.05 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <Scene name={name} active={i === sceneIndex} />
          </motion.div>
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,21,36,0.92)_0%,rgba(11,21,36,0.55)_45%,rgba(11,21,36,0.1)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent"
        />

      </div>

      {/* Scrolling copy, pulled up over the pinned layer */}
      <div className="relative -mt-[100svh]">
        <Panel index={-1} onActive={setActive}>
          <Eyebrow dark>How we work</Eyebrow>
          <h2
            id="process-heading"
            className={`${styles.display} mt-6 text-5xl font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl`}
          >
            From first call to running system.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            Four stages, one team, and working software at every checkpoint, so
            you always know where the project stands.
          </p>
        </Panel>

        {steps.map((step, i) => (
          <Panel key={step.step} index={i} onActive={setActive}>
            <p className="flex items-baseline gap-4">
              <span className={`${styles.display} text-7xl font-semibold tracking-[-0.05em] text-accent md:text-8xl`}>
                {step.step}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Step {i + 1} of {steps.length}
              </span>
            </p>
            <h3 className={`${styles.display} mt-6 text-4xl font-semibold tracking-[-0.04em] md:text-6xl`}>
              {step.title}
            </h3>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
              {step.description}
            </p>
            {i === steps.length - 1 && (
              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Book a discovery call
                <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </Panel>
        ))}
      </div>
    </section>
  );
}

/** One viewport-tall block of copy. Reports itself active when mostly in view. */
function Panel({
  index,
  onActive,
  children,
}: {
  index: number;
  onActive: (index: number) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55 });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-[100svh] items-center">
      <motion.div
        className="mx-auto w-full max-w-7xl px-6 py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="max-w-xl">{children}</div>
      </motion.div>
    </div>
  );
}
