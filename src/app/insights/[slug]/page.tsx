import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { posts, getPost, sortedPosts, formatDate, type Block } from "@/lib/insights";
import { company } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import CTABand from "@/components/CTABand";

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
        <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-6 text-[17px] leading-relaxed text-ink-soft before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-ink p-5">
          <code className={`language-${block.lang} font-mono text-[13px] leading-relaxed text-white/90`}>
            {block.code}
          </code>
        </pre>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-accent pl-6 text-lg font-medium italic leading-relaxed text-ink">
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
        <header className="border-b border-border bg-background-soft">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-accent"
            >
              <ArrowLeft size={15} aria-hidden="true" /> All insights
            </Link>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-[42px]">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
              <time dateTime={post.date} className="font-medium">
                {formatDate(post.date)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-ink-soft"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="border-l-2 border-accent pl-6 text-lg leading-relaxed text-ink">
            {post.summary}
          </p>

          <div className="mt-10">
            {post.body.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-y border-border bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                More notes
              </h2>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {others.map((other, i) => (
                <Reveal key={other.slug} delay={i * 0.05}>
                  <li>
                    <Link
                      href={`/insights/${other.slug}`}
                      className="group block h-full rounded-2xl border border-border bg-white p-7 transition-colors hover:border-accent/40"
                    >
                      <time
                        dateTime={other.date}
                        className="text-xs font-medium text-ink-soft"
                      >
                        {formatDate(other.date)}
                      </time>
                      <h3 className="mt-3 text-lg font-bold tracking-tight text-ink group-hover:text-accent">
                        {other.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {other.summary}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Read <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTABand />
    </>
  );
}
