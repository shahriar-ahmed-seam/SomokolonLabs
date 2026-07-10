import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { services, engagement } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI & LLM engineering, web and full-stack development, cloud & MLOps, and quality assurance from Somokolon Labs.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Our Services</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Software teams that grow with you
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              We work as an extension of your team — from front-end to backend,
              data, and infrastructure — building software vital to your
              organization across AI, web, and cloud.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Service list */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-16">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.03}>
              <div className="grid grid-cols-1 gap-8 border-b border-border pb-16 last:border-0 last:pb-0 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={service.slug} />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink">{service.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                  >
                    View details <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
                  {service.offerings.map((o) => (
                    <div key={o.title} className="rounded-xl border border-border bg-white p-6">
                      <h3 className="font-semibold text-ink">{o.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagement model */}
      <section className="border-y border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">Engagement model</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Flexible, transparent, and built around your goals
            </h2>
            <p className="mt-4 max-w-2xl text-ink-soft">
              We adapt our engagement to fit your project — whether that&apos;s a
              fixed-scope build or dedicated ongoing work. Either way, you get
              clear plans, regular status updates, and code you can trust.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {engagement.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <span className="text-sm font-bold text-accent">{step.step}</span>
                <h3 className="mt-3 font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
