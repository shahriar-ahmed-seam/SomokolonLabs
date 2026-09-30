import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock } from "lucide-react";
import { posts, getPost, sortedPosts, formatDate, type Block } from "@/lib/insights";
import { company, contact } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import CropMarks from "@/components/CropMarks";
import PageHero from "@/components/site/PageHero";
import FinalCTA from "@/components/site/FinalCTA";
import { FadeIn } from "@/components/site/motion";
import styles from "@/components/site/site.module.css";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: absoluteUrl(`/insights/${post.slug}`),
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          className={`${styles.display} mt-16 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-ink`}
        >
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mt-6 text-[18px] leading-[1.75] text-ink-soft">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-6 flex flex-col gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-7 text-[18px] leading-[1.7] text-ink-soft before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-4 before:bg-accent"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="mt-8 overflow-x-auto bg-ink p-6 ring-1 ring-ink/10">
          <code className={`language-${block.lang} font-mono text-[13.5px] leading-relaxed text-white/90`}>
            {block.code}
          </code>
        </pre>
      );
    case "quote":
      return (
        <blockquote
          className={`${styles.serif} mt-12 border-l-2 border-accent pl-7 text-[1.9rem] italic leading-[1.3] text-ink`}
        >
          {block.text}
        </blockquote>
      );
  }
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
    keywords: post.topics.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <PageHero
          back={{ href: "/insights", label: "All insights" }}
          title={post.title}
          titleSize="md"
          scene="discover"
          compact
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/65">
            <time dateTime={post.date} className="font-semibold text-white">
              {formatDate(post.date)}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              {post.readingMinutes} min read
            </span>
            <ul className="flex flex-wrap gap-2" aria-label="Topics">
              {post.topics.map((topic) => (
                <li
                  key={topic}
                  className="border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/75"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </PageHero>

        <div className="bg-background">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p
              className={`${styles.display} text-2xl font-medium leading-[1.45] tracking-[-0.015em] text-ink`}
            >
              {post.summary}
            </p>
            <div className="mt-10 h-px w-16 bg-accent" aria-hidden="true" />

            <div className="mt-4">
              {post.body.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>

            <p className="mt-16 border-t border-border pt-8 text-sm text-ink-soft">
              Written by the {company.name} team.{" "}
              <Link href="/contact" className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:text-accent">
                Working on something similar? Tell us about it.
              </Link>
            </p>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-border bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <FadeIn>
              <h2 className={`${styles.display} text-3xl font-semibold tracking-[-0.03em] text-ink`}>
                More notes
              </h2>
            </FadeIn>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {others.map((other, i) => (
                <li key={other.slug}>
                  <FadeIn delay={i * 0.06} className="h-full">
                    <Link
                      href={`/insights/${other.slug}`}
                      className="group relative flex h-full flex-col border border-ink/10 bg-white p-8 transition-[border-color,box-shadow] duration-500 hover:border-ink/20 hover:shadow-[0_30px_60px_-35px_rgba(11,21,36,0.45)]"
                    >
                      <CropMarks />
                      <div className="flex items-center justify-between">
                        <time dateTime={other.date} className="text-sm font-semibold text-ink-soft">
                          {formatDate(other.date)}
                        </time>
                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                          className="text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </div>
                      <h3
                        className={`${styles.display} mt-6 text-xl font-semibold leading-snug tracking-[-0.02em] text-ink group-hover:text-accent`}
                      >
                        {other.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{other.summary}</p>
                    </Link>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCTA email={contact.email} />
    </>
  );
}
