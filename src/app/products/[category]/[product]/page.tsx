import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import {
  products,
  productCategories,
  productsByCategory,
  productTones,
  company,
  contact,
  demoHref,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import ProductGrid from "@/components/ProductGrid";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import FinalCTA from "@/components/site/FinalCTA";
import TechChip from "@/components/site/TechChip";
import { FadeIn } from "@/components/site/motion";
import { logoFor } from "@/components/site/techLogos";
import { CATEGORY_SCENE } from "@/components/site/categoryMeta";
import styles from "@/components/site/site.module.css";

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { category, product } = await params;
  const item = products.find((p) => p.slug === product);
  if (!item) return { title: "Product" };

  const description = `${item.tagline}. ${item.description}`.slice(0, 300);

  return {
    title: item.name,
    description,
    alternates: { canonical: `/products/${category}/${item.slug}` },
    openGraph: {
      title: item.name,
      description,
      url: absoluteUrl(`/products/${category}/${item.slug}`),
      type: "website",
      ...(item.screenshot ? { images: [{ url: item.screenshot }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description: item.tagline,
    },
  };
}

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  Beta: "bg-amber-400/10 text-amber-200 ring-amber-400/30",
};

const FALLBACK_TONE = { deep: "#1b2638", light: "#b8c9f0" };

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product } = await params;
  const item = products.find((p) => p.slug === product && p.category === category);
  if (!item) notFound();

  const cat = productCategories.find((c) => c.slug === category);
  // Two related products: one row of large cards, no feature card.
  const related = productsByCategory(category)
    .filter((p) => p.slug !== product)
    .slice(0, 2);
  const metrics = item.metrics ?? [];
  const enquiryHref = `/contact?product=${encodeURIComponent(item.name)}`;
  const demo = demoHref(item);
  const demoHost = demo ? new URL(demo).host : null;
  const tone = productTones[item.slug] ?? FALLBACK_TONE;
  const stack = item.stack.map((name) => ({ name, logo: logoFor(name) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.name,
    description: item.description,
    applicationCategory: cat?.name ?? "Software",
    url: absoluteUrl(`/products/${category}/${item.slug}`),
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
    ...(item.screenshot ? { screenshot: absoluteUrl(item.screenshot) } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero
        back={{ href: `/products/${category}`, label: cat?.name ?? "Products" }}
        title={item.name}
        scene={CATEGORY_SCENE[category] ?? "flow"}
        glow={`${tone.light}55`}
        lead={<p className="text-white/80">{item.tagline}</p>}
        aside={
          <div
            className="p-2.5 ring-1 ring-white/10 sm:p-3.5"
            style={{ background: `linear-gradient(160deg, ${tone.light}38, ${tone.deep} 70%)` }}
          >
            <div className="overflow-hidden bg-[#0d1117] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden="true" />
                {demoHost && (
                  <span className="ml-3 truncate bg-white/[0.06] px-3 py-1 text-[11px] text-white/50">
                    {demoHost}
                  </span>
                )}
              </div>
              <div className="relative aspect-[16/10]">
                {item.screenshot ? (
                  <Image
                    src={item.screenshot}
                    alt={`${item.name} interface`}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 620px"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: `radial-gradient(circle at 50% 30%, ${tone.light}40, ${tone.deep})` }}
                  />
                )}
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(217,45,32,0.8)] transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Open live demo
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          <Link
            href={enquiryHref}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Talk to us about {item.name}
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
              statusStyles[item.status] ?? statusStyles.Live
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {item.status}
          </span>
        </div>
      </PageHero>

      {/* Measured results — only renders when there are real numbers to show. */}
      {metrics.length > 0 && (
        <section className="border-b border-border bg-background">
          <dl className="mx-auto grid max-w-7xl gap-x-8 gap-y-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => (
              <FadeIn key={metric.label} delay={i * 0.06} className="flex flex-col-reverse border-t border-ink/15 pt-6">
                <dt className="mt-3 text-sm leading-relaxed text-ink-soft">{metric.label}</dt>
                <dd
                  className={`${styles.display} text-5xl font-semibold tracking-[-0.05em] text-ink`}
                >
                  {metric.value}
                </dd>
              </FadeIn>
            ))}
          </dl>
        </section>
      )}

      {/* Overview, features and the tech sidebar */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIntro eyebrow="Overview" title={`What ${item.name}`} accent="does." />
            <FadeIn delay={0.1}>
              <p className="mt-8 text-lg leading-relaxed text-ink-soft">{item.description}</p>
            </FadeIn>
            <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {item.features.map((f, i) => (
                <li key={f}>
                  <FadeIn delay={(i % 2) * 0.06} className="flex gap-3 border-t border-border pt-5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check size={14} aria-hidden="true" />
                    </span>
                    <p className="text-[15px] leading-relaxed text-ink">{f}</p>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>

          <aside aria-label={`${item.name} details`} className="lg:col-span-4 lg:col-start-9">
            <FadeIn delay={0.1} className="bg-background-soft p-7 ring-1 ring-ink/5 lg:sticky lg:top-28">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Built with
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {stack.map((t) => (
                  <TechChip key={t.name} name={t.name} logo={t.logo} />
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 text-sm">
                <div>
                  <dt className="text-ink-soft">Category</dt>
                  <dd className="mt-1 font-semibold text-ink">{cat?.name}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Status</dt>
                  <dd className="mt-1 font-semibold text-ink">{item.status}</dd>
                </div>
              </dl>

              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
                >
                  Open live demo
                  <ArrowUpRight size={15} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </FadeIn>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <SectionIntro
              eyebrow="Keep exploring"
              title={`More in ${cat?.name ?? "this category"}`}
              link={{ href: `/products/${category}`, label: "View category" }}
            />
            <div className="mt-14">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}

      <FinalCTA email={contact.email} />
    </>
  );
}
