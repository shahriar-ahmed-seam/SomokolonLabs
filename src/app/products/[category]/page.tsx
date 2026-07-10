import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { productCategories, productsByCategory } from "@/lib/content";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export function generateStaticParams() {
  return productCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = productCategories.find((c) => c.slug === category);
  if (!cat) return { title: "Products" };
  return { title: cat.name, description: cat.description };
}

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "In Development": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Prototype: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = productCategories.find((c) => c.slug === category);
  if (!cat) notFound();

  const items = productsByCategory(cat.slug);

  // Fetch a photo per product in parallel.
  const photos = await Promise.all(items.map((p) => getUnsplashPhoto(p.imageQuery)));

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent">
              <ArrowLeft size={15} /> All products
            </Link>
            <div className="mt-8 flex items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon name={cat.icon} size={26} />
              </span>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{cat.name}</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{cat.description}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product list */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.05}>
              <Link
                href={`/products/${cat.slug}/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-28px_rgba(11,21,36,0.35)]"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-background-soft">
                  {photos[i].url ? (
                    <Image
                      src={photos[i].url}
                      alt={photos[i].alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-ink/5 to-accent/10" />
                  )}
                  <span
                    className={`absolute left-4 top-4 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold tracking-tight text-ink">{product.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{product.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {product.stack.map((t) => (
                      <span key={t} className="rounded bg-background-soft px-2 py-1 text-xs text-ink-soft">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    View product
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
