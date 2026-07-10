import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { services, engagement } from "@/lib/content";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

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
  return { title: service.name, description: service.short };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const photo = await getUnsplashPhoto(service.imageQuery);
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent"
            >
              <ArrowLeft size={15} /> All services
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={service.slug} />
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {service.name}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-ink-soft">{service.summary}</p>
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

      {/* Offerings */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="eyebrow">What we deliver</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Our {service.name.toLowerCase()} expertise
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {service.offerings.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <div className="flex h-full gap-4 rounded-xl border border-border bg-white p-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-ink">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagement model (shared) */}
      <section className="border-y border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">How we engage</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              A process built for clarity
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {engagement.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <span className="text-sm font-bold text-accent">{step.step}</span>
                <h3 className="mt-3 font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Other services</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:bg-background-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={s.slug} size={18} />
                </div>
                <h3 className="mt-4 font-bold text-ink">{s.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.short}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
