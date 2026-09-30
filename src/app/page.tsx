import {
  capabilityGroups,
  company,
  contact,
  demoHref,
  engagement,
  getProduct,
  productCategories,
  productTones,
  products,
  services,
  type Product,
} from "@/lib/content";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import Services from "@/components/site/Services";
import Work from "@/components/site/Work";
import Industries from "@/components/site/Industries";
import Process from "@/components/site/Process";
import TechTabs from "@/components/site/TechTabs";
import FinalCTA from "@/components/site/FinalCTA";
import { logoFor } from "@/components/site/techLogos";
import type { Industry, MosaicItem, TechGroup } from "@/components/site/types";

/*
  Home page, built from the section references in template.md.

  Section rhythm alternates dark and light:
  Hero (dark) · Manifesto · Services · Work (dark) · Industries ·
  Process (dark) · Tech · Final CTA (dark)

  Background footage: each Scene plays its clip once it's registered by
  scripts/prepare-video.mjs, and a gradient stand-in until then.
*/

// Six products for the mosaic, chosen so neighbouring colour tiles differ.
const MOSAIC = ["forge", "sentinel", "counterflow", "care-connect", "kestrel", "lumos"];

function toMosaic(p: Product): MosaicItem {
  return {
    slug: p.slug,
    href: `/products/${p.category}/${p.slug}`,
    name: p.name,
    tagline: p.tagline,
    categoryName: productCategories.find((c) => c.slug === p.category)?.name ?? "",
    screenshot: p.screenshot ?? "",
    tone: productTones[p.slug] ?? { deep: "#1b2638", light: "#b8c9f0" },
    live: Boolean(demoHref(p)),
  };
}

/** Link to a product by slug. Throws at build time if the catalogue changes under us. */
function productLink(slug: string) {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`home: unknown product "${slug}"`);
  const found = getProduct(p.category, p.slug);
  return { name: found?.name ?? p.name, href: `/products/${p.category}/${p.slug}` };
}

const INDUSTRIES: Industry[] = [
  {
    name: "Retail",
    icon: "store",
    description:
      "Point of sale that keeps trading when the network drops, and stock intelligence across locations.",
    products: [productLink("counterflow"), productLink("stockpilot")],
  },
  {
    name: "Banking & fintech",
    icon: "landmark",
    description:
      "Double-entry ledgers with row-level locking, so concurrent transfers can't corrupt a balance.",
    products: [productLink("ledger-core")],
  },
  {
    name: "Healthcare & fitness",
    icon: "health",
    description:
      "Telemedicine and encrypted records built for clinics here, plus on-device movement analysis.",
    products: [productLink("care-connect"), productLink("kinetix")],
  },
  {
    name: "Logistics",
    icon: "truck",
    description:
      "Live vehicle tracking, geofencing in the database, and optimised routes for the day's stops.",
    products: [productLink("fleet-command")],
  },
  {
    name: "Agriculture",
    icon: "sprout",
    description:
      "Crop disease detection that runs in the browser on a phone, with no signal needed in the field.",
    products: [productLink("leafwise")],
  },
  {
    name: "Enterprise operations",
    icon: "building",
    description:
      "HR, CRM, inventory, finance, and projects in one system, with AI that runs on your own hardware.",
    products: [productLink("coregrid")],
  },
  {
    name: "Smart cities",
    icon: "city",
    description:
      "Crowd and traffic counting from ordinary camera feeds, on CPU hardware rather than GPUs.",
    products: [productLink("kestrel")],
  },
  {
    name: "AI & engineering teams",
    icon: "code",
    description:
      "Model gateways, agent pipelines, and codebase search for teams putting LLMs into their products.",
    products: [productLink("sentinel"), productLink("forge"), productLink("cartograph")],
  },
];

export default function HomePage() {
  const liveCount = products.filter((p) => demoHref(p)).length;
  const allTools = new Set(capabilityGroups.flatMap((g) => g.items));

  const stats =
    liveCount === products.length
      ? [{ value: products.length, label: "Products shipped, every one with a live demo" }]
      : [
          { value: products.length, label: "Products designed, built, and deployed" },
          { value: liveCount, label: "With a live demo you can open, no sign-up" },
        ];

  const mosaic = MOSAIC.map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p?.screenshot))
    .map(toMosaic);

  const techGroups: TechGroup[] = capabilityGroups.map((g) => ({
    name: g.name,
    description: g.description,
    icon: g.icon,
    items: g.items.map((name) => ({ name, logo: logoFor(name) })),
  }));

  return (
    <>
      <Hero practices={services.map((s) => s.name)} />
      <Manifesto
        founder={company.founder}
        stats={[
          ...stats,
          { value: allTools.size, label: "Technologies across our production stack" },
          { value: services.length, label: "Practice areas, from applied AI to infrastructure" },
        ]}
      />
      <Services
        practices={services.map((s) => ({ slug: s.slug, name: s.name, offerings: s.offerings }))}
      />
      <Work items={mosaic} total={products.length} />
      <Industries industries={INDUSTRIES} />
      <Process steps={engagement} />
      <TechTabs groups={techGroups} />
      <FinalCTA email={contact.email} />
    </>
  );
}
