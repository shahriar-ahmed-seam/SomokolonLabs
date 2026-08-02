import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { productCategories, productsByCategory } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import ProductCard from "@/components/ProductCard";
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
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/products/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = productCategories.find((c) => c.slug === category);
  if (!cat) notFound();

  const items = productsByCategory(cat.slug);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent"
            >
              <ArrowLeft size={15} aria-hidden="true" /> All products
            </Link>
            <div className="mt-8 flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon name={cat.icon} size={26} />
              </span>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {cat.name}
                </h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  {cat.description}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product list */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.05}>
              <li className="h-full">
                <ProductCard product={product} />
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <CTABand />
    </>
  );
}
