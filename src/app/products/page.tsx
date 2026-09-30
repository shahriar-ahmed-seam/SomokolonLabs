import type { Metadata } from "next";
import {
  contact,
  demoHref,
  productCategories,
  productsByCategory,
  products,
} from "@/lib/content";
import ProductGrid from "@/components/ProductGrid";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import CategoryNav from "@/components/site/CategoryNav";
import FinalCTA from "@/components/site/FinalCTA";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Products built and deployed by Somokolon Labs across applied AI, business systems, developer infrastructure, and computer vision. Every one has a live demo.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const liveCount = products.filter((p) => demoHref(p)).length;
  const everyOneLive = liveCount === products.length;

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={`${products.length} products.`}
        accent="All of them running."
        scene="build"
        lead={
          <>
            Everything here is deployed and open to try,{" "}
            {everyOneLive ? "every one" : `${liveCount} of them`} with a live demo
            you can use right now, no sign-up. Each started as a real problem in
            retail, finance, healthcare, agriculture, or engineering operations.
          </>
        }
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {productCategories.map((c) => (
            <div key={c.slug}>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                {c.name}
              </dt>
              <dd className="font-display mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                {productsByCategory(c.slug).length}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Tab rail. The active tab is white and opens into the white section below. */}
      <div className="bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <CategoryNav />
        </div>
      </div>

      {productCategories.map((category, ci) => {
        const items = productsByCategory(category.slug);
        return (
          <section
            key={category.slug}
            id={category.slug}
            aria-labelledby={`${category.slug}-title`}
            className={ci % 2 === 1 ? "bg-background-soft" : "bg-background"}
          >
            <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
              <SectionIntro
                id={`${category.slug}-title`}
                eyebrow={`0${ci + 1} · ${items.length} ${items.length === 1 ? "product" : "products"}`}
                title={category.name}
                lead={category.description}
                link={{ href: `/products/${category.slug}`, label: "View category" }}
              />
              <div className="mt-14">
                <ProductGrid products={items} priority={ci === 0 ? 1 : 0} />
              </div>
            </div>
          </section>
        );
      })}

      <FinalCTA email={contact.email} />
    </>
  );
}
