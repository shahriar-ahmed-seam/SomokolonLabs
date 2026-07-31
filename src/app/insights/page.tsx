import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { sortedPosts, formatDate } from "@/lib/insights";
import { Reveal } from "@/components/Reveal";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Engineering notes from Somokolon Labs — build writeups and lessons from shipping AI systems, inference platforms, and retrieval pipelines.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const all = sortedPosts();

  return (
    <>
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Insights</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Notes from the build
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Writeups from work we&apos;ve actually done — the decisions, the
              things that broke, and the numbers that came out. No trend pieces.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <ul className="flex flex-col gap-4">
          {all.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.04}>
              <li>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-white p-8 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-soft">
                    <time dateTime={post.date} className="font-medium">
                      {formatDate(post.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} aria-hidden="true" />
                      {post.readingMinutes} min read
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
                    {post.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <ul className="flex flex-wrap gap-2">
                      {post.topics.map((topic) => (
                        <li
                          key={topic}
                          className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium text-ink-soft"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Read the note <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <CTABand />
    </>
  );
}
