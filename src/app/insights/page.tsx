import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { sortedPosts, formatDate } from "@/lib/insights";
import { contact } from "@/lib/content";
import PageHero from "@/components/site/PageHero";
import FinalCTA from "@/components/site/FinalCTA";
import { FadeIn } from "@/components/site/motion";
import styles from "@/components/site/site.module.css";

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
      <PageHero
        eyebrow="Insights"
        title="Notes from"
        accent="the build."
        scene="discover"
        compact
        lead="Writeups from work we've actually done: the decisions, the things that broke, and the numbers that came out. No trend pieces."
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold text-ink-soft">
            {all.length} {all.length === 1 ? "note" : "notes"}
          </p>
          <ol className="mt-6 border-b border-ink/15">
            {all.map((post, i) => (
              <li key={post.slug} className="border-t border-ink/15">
                <FadeIn delay={i * 0.05}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group grid gap-6 py-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:py-12 lg:grid-cols-12 lg:gap-8"
                  >
                    <div className="flex items-center gap-3 text-sm text-ink-soft lg:col-span-3 lg:flex-col lg:items-start lg:gap-1.5">
                      <time dateTime={post.date} className="font-semibold text-ink">
                        {formatDate(post.date)}
                      </time>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} aria-hidden="true" />
                        {post.readingMinutes} min read
                      </span>
                    </div>

                    <div className="lg:col-span-7">
                      <h2
                        className={`${styles.display} text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent sm:text-3xl md:text-[2.1rem]`}
                      >
                        {post.title}
                      </h2>
                      <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{post.summary}</p>
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                        {post.topics.map((topic) => (
                          <li
                            key={topic}
                            className="bg-background-soft px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-inset ring-ink/5"
                          >
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="hidden lg:col-span-2 lg:flex lg:justify-end">
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 items-center justify-center border border-ink/15 text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      >
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCTA email={contact.email} />
    </>
  );
}
