import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  differentiators,
  engagement,
  services,
  getStats,
  techStack,
  featuredProducts,
  products,
  productCategories,
} from "@/lib/content";
import { sortedPosts, formatDate } from "@/lib/insights";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons/Icon";
import CTABand from "@/components/CTABand";

export default async function Home() {
  // The landing page uses editorial photography deliberately. Product
  // screenshots live on /products and the product detail pages, where a visitor
  // has already chosen to look at specific software.
  const heroPhoto = await getUnsplashPhoto(
    "software engineering team office modern"
  );
  const latestPosts = sortedPosts().slice(0, 2);
  const featured = featuredProducts();
  const stats = getStats();

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="dot-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="eyebrow">AI &amp; Software Development Studio</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Your trusted{" "}
                <span className="text-accent">software engineering</span> partner.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
                Somokolon Labs builds AI systems, web applications, and cloud
                infrastructure end to end — helping founders and teams turn ideas
                into software that works in the real world.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              {/*
                The header already carries "Start a project", and so does the
                closing band. The hero sends people to the evidence instead —
                for a studio with working products, that converts better than a
                third identical button.
              */}
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  See what we&apos;ve built
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                >
                  Explore services
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-background-soft">
              {heroPhoto.url ? (
                <Image
                  src={heroPhoto.url}
                  alt={heroPhoto.alt}
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
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.05}>
              <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="eyebrow">Our Services</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            What we build for our clients
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col bg-white p-8 transition-colors hover:bg-background-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={service.slug} />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{service.short}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Learn more
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/*
        Featured work. Every card is a real interface we shipped, screenshotted
        from the running deployment, and every one links to something a visitor
        can open. This is the section that makes the rest of the page credible.
      */}
      <section className="border-t border-border bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Selected work
            </p>
            <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Products we designed, built, and put in front of users
              </h2>
              <Link
                href="/products"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white hover:text-accent"
              >
                All {products.length} products
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.04}>
                <li className="h-full">
                  {/* Typographic cards, no screenshots — the imagery stays on
                      /products, so the landing page reads as editorial. */}
                  <Link
                    href={`/products/${product.category}/${product.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-accent/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        {productCategories.find((c) => c.slug === product.category)?.name}
                      </span>
                      {product.demoUrl && (
                        <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          Live
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-bold tracking-tight text-white group-hover:text-accent">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                      {product.tagline}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] font-medium text-white/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      View product
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Differentiators / What we offer */}
      <section className="border-y border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="eyebrow">Why Somokolon</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              What working with us looks like
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="flex h-full flex-col">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white text-accent">
                    <Icon name={item.icon} size={20} />
                  </div>
                  <h3 className="mt-5 font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement model */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="eyebrow">How we work</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            A clear path from idea to production
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {engagement.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.05}>
              <div className="relative">
                <span className="text-sm font-bold text-accent">{step.step}</span>
                <div className="mt-3 h-px w-full bg-border">
                  <div className="h-px w-8 bg-accent" />
                </div>
                <h3 className="mt-4 font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Insights — short, then out of the way */}
      <section className="border-t border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <Reveal>
              <p className="eyebrow">Engineering notes</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                How we think about the work
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Write-ups from systems we&apos;ve actually shipped — the
                decisions, the trade-offs, and the numbers that came out.
              </p>
              <Link
                href="/insights"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
              >
                Read all notes <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Reveal>

            <ul className="flex flex-col gap-4 lg:col-span-2">
              {latestPosts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.05}>
                  <li>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="group block rounded-xl border border-border bg-white p-6 transition-colors hover:border-accent/40"
                    >
                      <time
                        dateTime={post.date}
                        className="text-xs font-medium text-ink-soft"
                      >
                        {formatDate(post.date)}
                      </time>
                      <h3 className="mt-2 text-lg font-bold tracking-tight text-ink group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {post.summary}
                      </p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t border-border bg-background-soft">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <p className="text-center text-sm font-medium text-ink-soft">
              The tools and technologies we work with
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {techStack.map((tech) => (
                <span key={tech} className="text-base font-semibold text-ink/40 transition-colors hover:text-ink">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center">
              <Link
                href="/capabilities"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
              >
                See the full capability breakdown{" "}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
