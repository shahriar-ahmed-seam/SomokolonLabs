import Image from "next/image";
import type { Metadata } from "next";
import { differentiators, engagement, getStats } from "@/lib/content";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About",
  description:
    "Somokolon Labs is an AI and software development studio based in Dhaka, Bangladesh, building intelligent systems engineered for production.",
};

export default async function AboutPage() {
  const photo = await getUnsplashPhoto("modern software development workspace");
  const stats = getStats();

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">About us</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              We are Somokolon Labs
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              A software solution provider building compelling AI, web, and
              cloud applications — engineered to work reliably in production.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Closing the gap between AI research and real software
            </h2>
            <div className="mt-6 space-y-5 text-ink-soft">
              <p className="leading-relaxed">
                Somokolon Labs is an independent AI and software studio based in
                Dhaka, Bangladesh. We craft web, mobile, and AI applications for
                the people who depend on them — from early-stage founders to
                established teams.
              </p>
              <p className="leading-relaxed">
                Our expertise spans front-end, backend, data, and infrastructure.
                We take the time to understand the particular challenges and
                needs of your business, then build software that addresses them —
                and keeps working as you grow.
              </p>
              <p className="leading-relaxed">
                The principle behind our work is simple: AI should be a core,
                observable part of production infrastructure, not an add-on
                bolted on at the end.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-background-soft">
              {photo.url ? (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-ink/5 to-accent/10" />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.05}>
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-white/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="eyebrow">Benefits of working with us</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            The advantages of a focused, senior-led studio
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl border border-border bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={item.icon} size={20} />
                </div>
                <h3 className="mt-5 font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              From first conversation to a running system
            </h2>
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
