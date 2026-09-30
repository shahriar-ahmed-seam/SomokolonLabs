import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { services, engagement, contact } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import Steps from "@/components/site/Steps";
import FinalCTA from "@/components/site/FinalCTA";
import OfferingIcon from "@/components/site/OfferingIcon";
import { FadeIn } from "@/components/site/motion";
import styles from "@/components/site/site.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI & LLM engineering, web and full-stack development, cloud & MLOps, and quality assurance from Somokolon Labs.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four practices."
        accent="One team that ships."
        scene="plan"
        lead="We work as an extension of your team, from the model to the interface to the infrastructure underneath. The people who scope the work are the people who build it."
      >
        <ul className="flex flex-wrap gap-2">
          {services.map((s, i) => (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
              >
                <span className="text-xs text-white/40">0{i + 1}</span>
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* One band per practice: sticky summary on the left, offerings on the right. */}
      <div className="bg-background">
        {services.map((service, i) => (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            className={`scroll-mt-20 ${i % 2 === 1 ? "bg-background-soft" : "bg-background"}`}
          >
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-12">
              {/* The grid cell is the sticky track; the reveal sits inside it. */}
              <div className="lg:col-span-5">
                <FadeIn className="lg:sticky lg:top-28">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center bg-ink text-white">
                      <Icon name={service.slug} size={22} />
                    </span>
                    <span className={`${styles.display} text-sm font-semibold text-ink-soft`}>
                      0{i + 1} / 0{services.length}
                    </span>
                  </div>
                  <h2
                    id={`${service.slug}-title`}
                    className={`${styles.display} mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl`}
                  >
                    {service.name}
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
                    {service.summary}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 rounded-md bg-ink py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
                  >
                    Explore {service.name}
                    <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-white/15">
                      <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:rotate-45" />
                    </span>
                  </Link>
                </FadeIn>
              </div>

              <ul className="grid gap-px overflow-hidden bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2 lg:col-span-7">
                {service.offerings.map((o, j) => (
                  <li key={o.title} className="bg-white">
                    <FadeIn delay={j * 0.06} className="flex h-full flex-col p-8">
                      <OfferingIcon title={o.title} index={i + j} />
                      <h3 className={`${styles.display} mt-8 text-lg font-semibold tracking-[-0.02em] text-ink`}>
                        {o.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro
            eyebrow="Engagement model"
            title="Fixed scope or ongoing."
            accent="Always in the open."
            lead="Whether it's a fixed-scope build or dedicated ongoing work, you get a clear plan, regular status updates, and code you can read."
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
