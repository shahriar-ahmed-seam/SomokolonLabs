import type { Metadata } from "next";
import { company, contact, differentiators, engagement, getStats } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import Steps from "@/components/site/Steps";
import FinalCTA from "@/components/site/FinalCTA";
import { Eyebrow, FadeIn } from "@/components/site/motion";
import styles from "@/components/site/site.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Somokolon Labs is an AI and software development studio based in Dhaka, Bangladesh, building intelligent systems engineered for production.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const stats = getStats();
  const initials = company.founder
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Closing the gap between AI research and"
        accent="real software."
        scene="discover"
        lead="Somokolon Labs is an independent AI and software studio in Dhaka. We build web, mobile, and AI applications for the people who depend on them, from early-stage founders to established teams."
      />

      {/* Story */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:py-32 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <Eyebrow>Who we are</Eyebrow>
            <h2
              className={`${styles.display} mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl`}
            >
              A small senior team, on purpose.
            </h2>
            <div className="mt-10 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{company.founder}</p>
                <p className="text-sm text-ink-soft">Founder, {company.name}</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              Our expertise spans front-end, backend, data, and infrastructure.
              We take the time to understand the particular challenges and needs
              of your business, then build software that addresses them, and
              keeps working as you grow.
            </p>
            <p>
              You work directly with the engineers building your product. No
              account layer, no hand-offs between a sales team and a delivery
              team, and no context lost along the way.
            </p>
          </FadeIn>
        </div>

        <dl className="mx-auto grid max-w-7xl gap-x-8 gap-y-12 px-6 pb-24 sm:grid-cols-2 md:pb-32 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.06} className="flex flex-col-reverse border-t border-ink/15 pt-6">
              <dt className="mt-3 max-w-[15rem] text-sm leading-relaxed text-ink-soft">{stat.label}</dt>
              <dd className={`${styles.display} text-4xl font-semibold tracking-[-0.045em] text-ink md:text-5xl`}>
                {stat.value}
              </dd>
            </FadeIn>
          ))}
        </dl>
      </section>

      {/* Principle */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div aria-hidden="true" className={`${styles.gridLines} absolute inset-0 -z-10`} />
        <div aria-hidden="true" className={`${styles.blob} ${styles.blobRed} -z-10 opacity-60`} />
        <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
          <FadeIn>
            <Eyebrow dark center>
              The principle
            </Eyebrow>
            <blockquote
              className={`${styles.display} mt-10 text-3xl font-medium leading-[1.2] tracking-[-0.03em] sm:text-4xl md:text-5xl`}
            >
              AI should be a core, observable part of production infrastructure,{" "}
              <span className={`${styles.serif} ${styles.accentText} italic`}>
                not an add-on bolted on at the end.
              </span>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Why teams work with us */}
      <section className="bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro
            eyebrow="Why work with us"
            title="The advantages of a focused,"
            accent="senior-led studio."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, i) => (
              <li key={item.title} className="bg-white">
                <FadeIn delay={i * 0.06} className="flex h-full flex-col p-8">
                  <span className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <h3 className={`${styles.display} mt-10 text-xl font-semibold tracking-[-0.02em] text-ink`}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro
            eyebrow="How we work"
            title="From first conversation to a"
            accent="running system."
            link={{ href: "/services", label: "See our services" }}
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
