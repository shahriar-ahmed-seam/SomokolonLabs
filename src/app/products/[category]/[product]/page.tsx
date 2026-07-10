import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { products, productCategories, productsByCategory } from "@/lib/content";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { Reveal } from "@/components/Reveal";
import CTABand from "@/components/CTABand";

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  const item = products.find((p) => p.slug === product);
  if (!item) return { title: "Product" };
  return { title: item.name, description: item.tagline };
}

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "In Development": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Prototype: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product } = await params;
  const item = products.find((p) => p.slug === product && p.category === category);
  if (!item) notFound();

  const cat = productCategories.find((c) => c.slug === category);
  const photo = await getUnsplashPhoto(item.imageQuery);
  const related = productsByCategory(category).filter((p) => p.slug !== product);

  const demoHref = `/contact?product=${encodeURIComponent(item.name)}`;

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <Link
              href={`/products/${category}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent"
            >
              <ArrowLeft size={15} /> {cat?.name ?? "Products"}
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">{item.name}</h1>
                <p className="mt-3 text-lg font-medium text-accent">{item.tagline}</p>
                <p className="mt-5 text-base leading-relaxed text-ink-soft">{item.description}</p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {item.demoAvailable ? (
                    <Link
                      href={demoHref}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                    >
                      Request a demo
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      href={demoHref}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                    >
                      Enquire about this product
                      <ArrowRight size={16} />
                    </Link>
                  )}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                  >
                    Talk to us
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-white">
                {photo.url ? (
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-ink/5 to-accent/10" />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features + spec */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <p className="eyebrow">Key features</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                What {item.name} does
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {item.features.map((f, i) => (
                <Reveal key={f} delay={i * 0.05}>
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check size={14} />
                    </span>
                    <p className="text-sm leading-relaxed text-ink">{f}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Tech spec sidebar */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-background-soft p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Built with</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.stack.map((t) => (
                  <span key={t} className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-ink">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</h3>
                <p className="mt-2 text-sm font-semibold text-ink">{item.status}</p>
              </div>
              <Link
                href={demoHref}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                Request a demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight text-ink">More in {cat?.name}</h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link
                    href={`/products/${category}/${p.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-ink/20"
                  >
                    <h3 className="font-bold text-ink">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-soft">{p.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      View <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </>
  );
}
