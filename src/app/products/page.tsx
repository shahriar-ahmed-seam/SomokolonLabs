import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { productCategories, productsByCategory } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore products built by Somokolon Labs across AI, business software, and developer infrastructure.",
};

const statusStyles: Record<string, string> = {
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "In Development": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Prototype: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default function ProductsPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="eyebrow">Our Products</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Software we&apos;ve built, ready to explore
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Browse our products by category. Pick any category to see what&apos;s
              inside — then request a demo of anything that fits your needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories with their products */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-20">
          {productCategories.map((category, ci) => {
            const items = productsByCategory(category.slug);
            return (
              <Reveal key={category.slug} delay={ci * 0.03}>
                <div>
                  <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon name={category.icon} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-ink">{category.name}</h2>
                        <p className="mt-1 max-w-xl text-sm text-ink-soft">{category.description}</p>
                      </div>
                    </div>
                    <Link
                      href={`/products/${category.slug}`}
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
                    >
                      View category <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${category.slug}/${product.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_16px_40px_-24px_rgba(11,21,36,0.3)]"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[product.status]}`}
                          >
                            {product.status}
                          </span>
                        </div>
                        <h3 className="mt-4 font-bold text-ink">{product.name}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{product.tagline}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {product.stack.slice(0, 3).map((t) => (
                            <span key={t} className="rounded bg-background-soft px-2 py-1 text-xs text-ink-soft">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                          View product <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTABand />
    </>
  );
}
