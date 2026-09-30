import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  demoHref,
  productCategories,
  productTones,
  type Product,
} from "@/lib/products";
import ProductCardFrame from "@/components/ProductCardFrame";
import CropMarks from "@/components/CropMarks";
import s from "./ProductCard.module.css";

const FALLBACK_TONE = { deep: "#1b2638", light: "#b8c9f0" };

/** "Care Connect" → "CC", "CoreGrid" → "CG", "Forge" → "F". */
function monogram(name: string) {
  const words = name.split(/[\s-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const caps = name.match(/[A-Z]/g) ?? [];
  return (caps.length >= 2 ? caps.slice(0, 2).join("") : name[0]).toUpperCase();
}

const CHIP =
  "inline-flex items-center gap-2 border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md";

/**
 * Shared product card.
 *
 *  - "card": the screenshot takes the whole top of the card at its native
 *    16:10, with a slim bar underneath (monogram, name, tagline, actions).
 *  - "feature": a wide card for the first product in an odd-sized grid. The
 *    screenshot takes two thirds of the row; the rest carries the detail.
 *
 * The whole card is one link (stretched from the title) and the live demo is
 * a separate link layered above it, so nothing interactive is nested.
 */
export default function ProductCard({
  product,
  variant = "card",
  priority = false,
}: {
  product: Product;
  variant?: "card" | "feature";
  priority?: boolean;
}) {
  const feature = variant === "feature";
  const demo = demoHref(product);
  const tone = productTones[product.slug] ?? FALLBACK_TONE;
  const category = productCategories.find((c) => c.slug === product.category);
  const href = `/products/${product.category}/${product.slug}`;

  const mark = (size: string) => (
    <span
      aria-hidden="true"
      className={`font-display flex shrink-0 items-center justify-center font-semibold tracking-[-0.02em] ${size}`}
      style={{ backgroundColor: tone.deep, color: tone.light }}
    >
      {monogram(product.name)}
    </span>
  );

  const title = (className: string) => (
    <h3 className={`font-display font-semibold tracking-[-0.025em] text-ink ${className}`}>
      <Link
        href={href}
        className={`${s.stretch} outline-none after:absolute after:inset-0 after:z-[2] after:content-['']`}
      >
        {product.name}
      </Link>
    </h3>
  );

  return (
    <ProductCardFrame
      className={`group ${s.card} flex h-full flex-col ${feature ? "lg:grid lg:grid-cols-12" : ""}`}
      style={{ "--glow": tone.light } as CSSProperties}
    >
      <CropMarks />

      {/* Screenshot */}
      <div
        className={`relative aspect-[16/10] overflow-hidden ${feature ? "lg:col-span-8" : ""}`}
        style={{ backgroundColor: tone.deep }}
      >
        {product.screenshot ? (
          <Image
            src={product.screenshot}
            alt=""
            fill
            priority={priority}
            className={`${s.shot} object-cover object-top`}
            sizes={
              feature
                ? "(max-width: 1024px) 92vw, 820px"
                : "(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 600px"
            }
          />
        ) : (
          // No capture yet: the monogram, large, on the product's colour.
          <div
            aria-hidden="true"
            className="font-display absolute inset-0 flex items-center justify-center text-[5.5rem] font-semibold tracking-[-0.05em]"
            style={{
              color: tone.light,
              backgroundImage: `linear-gradient(to right, ${tone.light}14 1px, transparent 1px), linear-gradient(to bottom, ${tone.light}14 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          >
            {monogram(product.name)}
          </div>
        )}

        {/* Scrim only behind the chips, so the interface stays clear. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(5,8,14,0.5),transparent)]"
        />
        <div className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
          {demo && (
            <span className={CHIP}>
              <span aria-hidden="true" className={s.pulse} />
              Live
            </span>
          )}
          {product.status === "Beta" && <span className={`${CHIP} text-amber-100`}>Beta</span>}
        </div>

        {!feature && (
          <div
            className={`${s.reveal} pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 bg-[linear-gradient(to_top,rgba(5,8,14,0.85),transparent)] px-4 pb-4 pt-10`}
          >
            <span className="sr-only">Built with</span>
            {product.stack.slice(0, 4).map((t) => (
              <span key={t} className={CHIP}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {feature ? (
        /* Detail column */
        <div className="flex flex-1 flex-col border-t border-ink/10 p-5 sm:p-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-10">
          <div className="flex items-center gap-3">
            {mark("h-12 w-12 text-base")}
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              {category?.name}
            </span>
          </div>
          {title("mt-5 text-2xl leading-tight sm:mt-8 sm:text-3xl lg:text-[2.1rem]")}
          <p className="mt-3 text-[15px] leading-relaxed text-ink sm:text-base">{product.tagline}</p>
          {/* Phones keep the screenshot dominant: detail copy starts at md. */}
          <p className="mt-4 hidden text-sm leading-relaxed text-ink-soft md:line-clamp-4">
            {product.description}
          </p>
          <ul className="mt-6 hidden flex-wrap gap-1.5 md:flex" aria-label="Built with">
            {product.stack.slice(0, 4).map((t) => (
              <li
                key={t}
                className="border border-ink/10 bg-background-soft px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft"
              >
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6 sm:pt-8">
            <span
              aria-hidden="true"
              className={`${s.go} inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-accent`}
            >
              View product
              <ArrowRight size={15} />
            </span>
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                className="relative z-[4] inline-flex items-center gap-2 border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Live demo
                <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Slim bar */
        <div className="flex flex-1 items-center gap-4 border-t border-ink/10 px-5 py-4 sm:px-6">
          {mark("h-11 w-11 text-sm")}
          <div className="min-w-0 flex-1">
            {title("text-lg leading-tight")}
            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-soft">{product.tagline}</p>
          </div>
          <span className="flex shrink-0 items-center gap-2">
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the ${product.name} live demo (new tab)`}
                title="Open live demo"
                className="relative z-[4] flex h-9 w-9 items-center justify-center border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            <span
              aria-hidden="true"
              className={`${s.go} flex h-9 w-9 items-center justify-center bg-ink text-white transition-colors duration-300 group-hover:bg-accent`}
            >
              <ArrowRight size={16} />
            </span>
          </span>
        </div>
      )}
    </ProductCardFrame>
  );
}
