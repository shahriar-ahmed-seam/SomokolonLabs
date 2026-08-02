import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

/**
 * Shared product card. Used on the products index and on category pages so the
 * catalogue looks like one set rather than three different designs.
 *
 * The screenshot is a real capture of the product's own interface — the whole
 * point of the card is that the visitor sees the actual thing before clicking.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_20px_50px_-28px_rgba(11,21,36,0.35)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background-soft">
        {product.screenshot ? (
          <Image
            src={product.screenshot}
            alt={`${product.name} interface`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink/5 to-accent/10 text-sm font-semibold text-ink-soft">
            {product.name}
          </div>
        )}

        {product.demoUrl && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            Live demo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold tracking-tight text-ink group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.tagline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {product.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-background-soft px-2 py-0.5 text-[11px] font-medium text-ink-soft"
            >
              {tech}
            </span>
          ))}
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          View product
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
