import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { productCategories, productsByCategory, products } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import ProductCard from "@/components/ProductCard";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Products built and deployed by Somokolon Labs across applied AI, business systems, developer infrastructure, and computer vision. Every one has a live demo.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const liveCount = products.filter((p) => p.demoUrl).length;

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Our Products</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {products.length} products, all of them running
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Everything below is deployed and open to try — {liveCount} with a
              live demo you can use right now, no sign-up. Each one started as a
              real problem in retail, finance, healthcare, agriculture, or
              engineering operations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories with their products */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-24">
          {productCategories.map((category, ci) => {
            const items = productsByCategory(category.slug);
            return (
              <div key={category.slug}>
                <Reveal delay={ci * 0.03}>
                  <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon name={category.icon} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-ink">
                          {category.name}
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-ink-soft">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/products/${category.slug}`}
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                    >
                      View category <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>

                <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((product, i) => (
                    <Reveal key={product.slug} delay={i * 0.04}>
                      <li className="h-full">
                        <ProductCard product={product} />
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <CTABand />
    </>
  );
}
