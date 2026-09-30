import styles from "./site.module.css";
import { CountUp, Eyebrow, FadeIn, ScrollWords } from "./motion";
import type { Stat } from "./types";

export default function Manifesto({
  founder,
  stats,
}: {
  founder: string;
  stats: Stat[];
}) {
  const initials = founder
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <Eyebrow>Who we are</Eyebrow>

        <ScrollWords
          className={`${styles.display} mt-10 text-[1.85rem] font-medium leading-[1.2] tracking-[-0.025em] text-ink sm:text-4xl md:text-5xl lg:text-[3.35rem]`}
          text="Somokolon Labs is a senior-led studio in Dhaka. We take ideas from a whiteboard to software people rely on: AI that is measured, not guessed, web apps that stay fast, and infrastructure you can actually see into."
          highlight={["senior-led", "rely", "measured"]}
        />

        <FadeIn className="mt-12 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            {initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{founder}</p>
            <p className="text-sm text-ink-soft">Founder, Somokolon Labs</p>
          </div>
        </FadeIn>

        <dl
          className={`mt-24 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 ${
            stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.08}
              className="flex flex-col-reverse border-t border-border pt-6"
            >
              <dt className="mt-3 max-w-[14rem] text-sm leading-relaxed text-ink-soft">
                {stat.label}
              </dt>
              <dd
                className={`${styles.display} text-6xl font-semibold tracking-[-0.05em] text-ink md:text-7xl`}
              >
                <CountUp to={stat.value} />
                <span aria-hidden="true" className="text-accent">
                  .
                </span>
              </dd>
            </FadeIn>
          ))}
        </dl>
      </div>
    </section>
  );
}
