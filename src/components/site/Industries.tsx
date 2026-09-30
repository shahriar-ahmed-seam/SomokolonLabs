import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Cctv,
  CodeXml,
  Landmark,
  Sparkles,
  Sprout,
  Stethoscope,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";
import CropMarks from "@/components/CropMarks";
import styles from "./site.module.css";
import { Eyebrow, FadeIn } from "./motion";
import type { Industry } from "./types";

/**
 * 3 × 3 industry cards (reference: "Industries We Power"), flipped to a light
 * ground so the page alternates dark and light. Each card names the products
 * we have actually built for that sector, so the claim is checkable; the
 * ninth card is the call to action.
 */

const ICONS: Record<string, LucideIcon> = {
  store: Store,
  landmark: Landmark,
  health: Stethoscope,
  truck: Truck,
  sprout: Sprout,
  building: Building2,
  city: Cctv,
  code: CodeXml,
};

export default function Industries({ industries }: { industries: Industry[] }) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow center>Industries</Eyebrow>
          <h2
            className={`${styles.display} mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl md:text-6xl`}
          >
            Industries we&apos;ve built for
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
            Every sector here has a working product behind it that you can open
            and try.
          </p>
        </FadeIn>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const Glyph = ICONS[industry.icon] ?? Sparkles;
            return (
              <li key={industry.name}>
                <FadeIn delay={(i % 3) * 0.06} className="h-full">
                <div className="group relative flex h-full flex-col border border-border bg-background-soft p-7 transition-[border-color,background-color,box-shadow] duration-300 hover:border-ink/15 hover:bg-white hover:shadow-[0_24px_60px_-30px_rgba(11,21,36,0.35)]">
                  <CropMarks />
                  <span className="flex h-12 w-12 items-center justify-center bg-white text-ink ring-1 ring-border transition-colors group-hover:bg-ink group-hover:text-white group-hover:ring-ink">
                    <Glyph size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className={`${styles.display} mt-6 text-2xl font-semibold tracking-[-0.03em] text-ink`}>
                    {industry.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {industry.description}
                  </p>
                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft/80">
                    Built
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {industry.products.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          className="inline-flex items-center gap-1 border border-border bg-white px-3 py-1 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {p.name}
                          <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                </FadeIn>
              </li>
            );
          })}

          <li>
          <FadeIn delay={0.12} className="h-full">
            <div className="relative flex h-full min-h-[16rem] flex-col items-center justify-center overflow-hidden bg-ink p-7 text-center text-white">
              <div aria-hidden="true" className="absolute -bottom-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl" />
              <p className={`${styles.display} relative text-2xl font-semibold tracking-[-0.03em]`}>
                Is your industry here?
              </p>
              <p className="relative mt-2 max-w-[16rem] text-sm leading-relaxed text-white/65">
                If it isn&apos;t yet, tell us about the problem. That&apos;s how
                most of these started.
              </p>
              <Link
                href="/contact"
                className="relative mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Let&apos;s talk
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </FadeIn>
          </li>
        </ul>
      </div>
    </section>
  );
}
