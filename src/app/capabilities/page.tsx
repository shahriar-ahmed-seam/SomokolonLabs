import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { capabilityGroups, engagement } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "The languages, frameworks, and infrastructure Somokolon Labs works with day to day — across AI/ML, retrieval, backend, frontend, and MLOps.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <>
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Capabilities</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              What we work with, and what we do with it
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              A stack list on its own proves nothing. These are the tools we
              reach for, grouped by the problem they solve — and every one of
              them appears somewhere in the products we&apos;ve shipped.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {capabilityGroups.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-border bg-white p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={group.icon} />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-ink">
                  {group.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {group.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium text-ink-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How the work runs — ties capability to delivery */}
      <section className="border-y border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">How the work runs</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Every engagement follows the same four steps
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {engagement.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <span className="text-sm font-bold text-accent">{step.step}</span>
                <h3 className="mt-3 font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link
              href="/services"
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              See the services we offer <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
