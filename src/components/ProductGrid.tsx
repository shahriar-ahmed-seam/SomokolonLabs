import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { FadeIn } from "@/components/site/motion";

/**
 * Two large cards per row. When the count is odd, the first product becomes
 * a full-width feature card so the grid never ends on a lone half card.
 */
export default function ProductGrid({
  products,
  priority = 0,
}: {
  products: Product[];
  /** How many leading screenshots to load eagerly (above the fold). */
  priority?: number;
}) {
  const featured = products.length % 2 === 1;

  return (
    <ul className="grid gap-x-8 gap-y-10 md:grid-cols-2">
      {products.map((product, i) => {
        const big = featured && i === 0;
        const column = (featured ? i - 1 : i) % 2;
        return (
          <li key={product.slug} className={big ? "md:col-span-2" : ""}>
            <FadeIn delay={big ? 0 : column * 0.08} className="h-full">
              <ProductCard
                product={product}
                variant={big ? "feature" : "card"}
                priority={i < priority}
              />
            </FadeIn>
          </li>
        );
      })}
    </ul>
  );
}
