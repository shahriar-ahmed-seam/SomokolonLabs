import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  services,
  engagement,
  contact,
  productCategories,
  productsByCategory,
} from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import ProductGrid from "@/components/ProductGrid";
import CropMarks from "@/components/CropMarks";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import Steps from "@/components/site/Steps";
import FinalCTA from "@/components/site/FinalCTA";
import OfferingIcon from "@/components/site/OfferingIcon";
import { FadeIn } from "@/components/site/motion";
import { SERVICE_CATEGORY, SERVICE_SCENE } from "@/components/site/serviceMeta";
import styles from "@/components/site/site.module.css";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];

  const others = services.filter((s) => s.slug !== slug);
  const categorySlug = SERVICE_CATEGORY[service.slug];
  const category = productCategories.find((c) => c.slug === categorySlug);
  const work = categorySlug ? productsByCategory(categorySlug).slice(0, 3) : [];

  return (
    <>
      <PageHero
        back={{ href: "/services", label: "All services" }}
        eyebrow={`Practice 0${index + 1} of 0${services.length}`}
        title={service.name}
        scene={SERVICE_SCENE[service.slug] ?? "flow"}
        lead={service.summary}
      >
        <ul className="flex flex-wrap gap-2">
          {service.offerings.map((o) => (
            <li
              key={o.title}
              className="border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 backdrop-blur"
            >
              {o.title}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Offerings */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro
            eyebrow="What we deliver"
            title="Where we"
            accent="go deep."
            lead={service.short}
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-ink/10 ring-1 ring-ink/10 md:grid-cols-2">
            {service.offerings.map((o, i) => (
              <li key={o.title} className="bg-white">
                <FadeIn delay={i * 0.06} className="flex h-full flex-col p-8 sm:p-10">
                  <div className="flex items-start justify-between">
                    <OfferingIcon title={o.title} index={index + i} />
                    <span className={`${styles.display} text-sm font-semibold text-ink-soft`}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    className={`${styles.display} mt-10 text-2xl font-semibold tracking-[-0.03em] text-ink`}
                  >
                    {o.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                    {o.description}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work that shows this practice, when a category maps to it. */}
      {category && work.length > 0 && (
        <section className="bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <SectionIntro
              eyebrow="Built by this practice"
              title="Running in"
              accent="production."
              lead={category.description}
              link={{ href: `/products/${category.slug}`, label: `All ${category.name.toLowerCase()}` }}
            />
            <div className="mt-16">
              <ProductGrid products={work} />
            </div>
          </div>
        </section>
      )}

      {/* Engagement */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <SectionIntro eyebrow="How we engage" title="A process built" accent="for clarity." />
          <div className="mt-20">
            <Steps steps={engagement} />
          </div>
        </div>
      </section>

      {/* Other practices */}
      <section className="border-t border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <FadeIn>
            <h2 className={`${styles.display} text-2xl font-semibold tracking-[-0.03em] text-ink`}>
              Other practices
            </h2>
          </FadeIn>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((s, i) => (
              <li key={s.slug}>
                <FadeIn delay={i * 0.06} className="h-full">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group relative flex h-full flex-col border border-ink/10 bg-white p-7 transition-[border-color,box-shadow] duration-500 hover:border-ink/20 hover:shadow-[0_30px_60px_-35px_rgba(11,21,36,0.45)]"
                  >
                    <CropMarks />
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center bg-ink text-white">
                        <Icon name={s.slug} size={19} />
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </div>
                    <h3
                      className={`${styles.display} mt-8 text-lg font-semibold tracking-[-0.02em] text-ink group-hover:text-accent`}
                    >
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.short}</p>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA email={contact.email} />
    </>
  );
}
