import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contact, demoHref, productCategories, productsByCategory } from "@/lib/content";
import ProductGrid from "@/components/ProductGrid";
import PageHero from "@/components/site/PageHero";
import CategoryNav from "@/components/site/CategoryNav";
import FinalCTA from "@/components/site/FinalCTA";
import { CATEGORY_SCENE } from "@/components/site/categoryMeta";

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
  const live = items.filter((p) => demoHref(p)).length;

  return (
    <>
      <PageHero
        back={{ href: "/products", label: "All products" }}
        eyebrow={`${items.length} ${items.length === 1 ? "product" : "products"} · ${
          live === items.length ? "all with live demos" : `${live} with live demos`
        }`}
        title={cat.name}
        scene={CATEGORY_SCENE[cat.slug] ?? "flow"}
        lead={cat.description}
        compact
      />

      {/* Tab rail. The active tab is white and opens into the white grid below. */}
      <div className="bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <CategoryNav current={cat.slug} />
        </div>
      </div>

      <section className="bg-background" aria-label={`${cat.name} products`}>
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <ProductGrid products={items} priority={2} />
        </div>
      </section>

      <FinalCTA email={contact.email} />
    </>
  );
}
