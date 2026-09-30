"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./site.module.css";
import { Eyebrow, FadeIn, Magnetic, SplitWords, trackPointer } from "./motion";

export default function FinalCTA({ email }: { email: string }) {
  return (
    <section
      onPointerMove={trackPointer}
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      <div aria-hidden="true" className={`${styles.gridLines} absolute inset-0 -z-10 rotate-180`} />
      <div aria-hidden="true" className={`${styles.blob} ${styles.blobCenter} -z-10`} />
      <div aria-hidden="true" className={`${styles.pointerGlow} absolute inset-0 -z-10`} />
      <div aria-hidden="true" className={`${styles.grain} absolute inset-0 -z-10`} />

      <div className="mx-auto max-w-5xl px-6 py-32 text-center md:py-44">
        <Eyebrow dark center>
          Let&apos;s talk
        </Eyebrow>
        <h2
          className={`${styles.display} mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl md:text-[6.5rem]`}
        >
          <SplitWords text="Have a problem worth" />{" "}
          <SplitWords
            text="solving?"
            delay={0.3}
            className={`${styles.serif} italic tracking-[-0.02em]`}
            wordClassName={styles.accentText}
          />
        </h2>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/65">
            Tell us what you&apos;re building. We&apos;ll help you scope it,
            build it, and ship it.
          </p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={0.4}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-md bg-accent py-5 pl-9 pr-5 text-base font-semibold text-white shadow-[0_20px_60px_-15px_rgba(217,45,32,0.8)] transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Tell us what you&apos;re building
              <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white text-accent">
                <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-45" />
              </span>
            </Link>
          </Magnetic>
          <a
            href={`mailto:${email}`}
            className="group text-sm text-white/60 transition-colors hover:text-white"
          >
            or email{" "}
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-white transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
              {email}
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
