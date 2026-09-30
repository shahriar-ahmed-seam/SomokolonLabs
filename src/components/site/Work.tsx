import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./site.module.css";
import { Eyebrow, FadeIn } from "./motion";
import type { MosaicItem } from "./types";

/**
 * Edge-to-edge mosaic of screenshot tiles and solid colour tiles (KAZ
 * "What companies have built" reference). Each colour tile takes its
 * product's own brand colour, which is what keeps the grid from reading as
 * one flat dark block.
 *
 * Layout cycles per row: [split | wide], [split | split], [wide | split].
 */

type Layout = "image-text" | "text-image" | "wide";
const LAYOUTS: Layout[] = ["image-text", "wide", "text-image", "text-image", "wide", "image-text"];

export default function Work({ items, total }: { items: MosaicItem[]; total: number }) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:pt-36">
        <FadeIn className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow dark>Selected work</Eyebrow>
            <h2
              className={`${styles.display} mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl`}
            >
              Products we designed, built, and run.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-white/60">
            Every screenshot is the real interface, captured from the running
            product. Open any of them and try it yourself.
          </p>
        </FadeIn>
      </div>

      <ul className="grid grid-cols-1 lg:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.slug}>
            <Tile item={item} layout={LAYOUTS[i % LAYOUTS.length]} />
          </li>
        ))}
      </ul>

      <div className="mx-auto flex max-w-7xl justify-end px-6 py-12">
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent"
        >
          See all {total} products
          <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function Tile({ item, layout }: { item: MosaicItem; layout: Layout }) {
  if (layout === "wide") {
    return (
      <Link
        href={item.href}
        className="group relative flex h-[22rem] items-center overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:h-[24rem]"
        style={{ backgroundColor: item.tone.deep }}
      >
        {/* The screenshot is tinted into the brand colour so its own text
            recedes and the tile copy reads cleanly on top. */}
        <div className="absolute inset-0 opacity-35 mix-blend-luminosity transition-opacity duration-700 group-hover:opacity-60">
          <Shot item={item} sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${item.tone.deep} 0%, ${item.tone.deep}f0 50%, ${item.tone.deep}40 100%)`,
          }}
        />
        <div className="relative max-w-sm p-8 lg:p-10">
          <Copy item={item} />
        </div>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:h-[24rem] sm:grid-cols-2">
      <Link
        href={item.href}
        tabIndex={-1}
        aria-hidden="true"
        className="group relative h-60 overflow-hidden sm:h-auto"
      >
        <Shot item={item} sizes="(max-width: 640px) 100vw, 25vw" />
      </Link>
      <Link
        href={item.href}
        className={`group flex flex-col justify-center p-8 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white lg:p-10 ${
          layout === "text-image" ? "sm:order-first" : ""
        }`}
        style={{ backgroundColor: item.tone.deep }}
      >
        <Copy item={item} />
      </Link>
    </div>
  );
}

function Shot({ item, sizes }: { item: MosaicItem; sizes: string }) {
  return (
    <Image
      src={item.screenshot}
      alt=""
      fill
      sizes={sizes}
      className="object-cover object-left-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
    />
  );
}

function Copy({ item }: { item: MosaicItem }) {
  return (
    <>
      <p
        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: item.tone.light }}
      >
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
        {item.categoryName}
        {item.live && <span className="text-white/50">· Live demo</span>}
      </p>
      <h3 className={`${styles.display} mt-3 text-2xl font-semibold tracking-[-0.03em] text-white lg:text-[1.75rem]`}>
        {item.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{item.tagline}</p>
      <span
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: item.tone.light }}
      >
        View product
        <ArrowUpRight
          size={15}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </>
  );
}
