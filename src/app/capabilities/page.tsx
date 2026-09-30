import type { Metadata } from "next";
import { capabilityGroups, contact, engagement, products } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import Steps from "@/components/site/Steps";
import FinalCTA from "@/components/site/FinalCTA";
import { FadeIn } from "@/components/site/motion";
import { logoFor } from "@/components/site/techLogos";
import styles from "@/components/site/site.module.css";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "The languages, frameworks, and infrastructure Somokolon Labs works with day to day — across AI/ML, retrieval, backend, frontend, and MLOps.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  const tools = new Set(capabilityGroups.flatMap((g) => g.items));

  return (
    <>
      <PageHero
        eyebrow="Tech stack"
        title="What we work with, and"
        accent="what we do with it."
        scene="plan"
        lead="A stack list on its own proves nothing. These are the tools we reach for, grouped by the problem they solve, and every one of them appears somewhere in the products we've shipped."
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          {[
            { value: tools.size, label: "Technologies" },
            { value: capabilityGroups.length, label: "Areas" },
            { value: products.length, label: "Products shipped" },
          ].map((s) => (
            <div key={s.label}>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">{s.label}</dt>
              <dd className="font-display mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="bg-background-soft">
        <ul className="mx-auto grid max-w-7xl gap-6 px-6 py-24 md:grid-cols-2 md:py-32">
          {capabilityGroups.map((group, i) => (
            <li key={group.name}>
              <FadeIn delay={(i % 2) * 0.08} className="flex h-full flex-col bg-white p-8 ring-1 ring-ink/10 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center bg-ink text-white">
                    <Icon name={group.icon} size={22} />
                  </span>
                  <span className={`${styles.display} text-sm font-semibold text-ink/30`}>
                    0{i + 1}
                  </span>
                </div>
                <h2 className={`${styles.display} mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink`}>
                  {group.name}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{group.description}</p>

                <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {group.items.map((name) => {
                    const logo = logoFor(name);
                    return (
                      <li
                        key={name}
                        className="flex items-center gap-3 bg-background-soft px-3.5 py-3 text-sm font-medium text-ink ring-1 ring-inset ring-ink/5"
                      >
                        {logo ? (
                          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" fill={logo.hex}>
                            <path d={logo.path} />
                          </svg>
                        ) : (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-ink-soft">
                            <Icon name={group.icon} size={16} />
                          </span>
                        )}
                        <span className="min-w-0 leading-tight">{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </FadeIn>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro
            eyebrow="How the work runs"
            title="Every engagement follows"
            accent="the same four steps."
            link={{ href: "/services", label: "See the services we offer" }}
          />
          <div className="mt-20">
            <Steps steps={engagement} />
          </div>
        </div>
      </section>

      <FinalCTA email={contact.email} />
    </>
  );
}
