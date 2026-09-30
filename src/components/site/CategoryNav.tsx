import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { productCategories, productsByCategory, products } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";

/**
 * Index-tab rail for moving between product categories.
 *
 * Each tab is a square cell: a mono index and count on top, icon and label
 * below. The active tab is white with an accent bar on its top edge and no
 * bottom border, so it opens into the white grid underneath like a folder
 * tab. Place it on the soft background, directly above a white section.
 */
export default function CategoryNav({ current }: { current?: string }) {
  const items = [
    { href: "/products", label: "All products", count: products.length, icon: null, active: !current },
    ...productCategories.map((c) => ({
      href: `/products/${c.slug}`,
      label: c.name,
      count: productsByCategory(c.slug).length,
      icon: c.icon,
      active: current === c.slug,
    })),
  ];

  return (
    <nav
      aria-label="Product categories"
      className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0"
    >
      <ul className="grid min-w-[52rem] grid-cols-5 border-b border-ink/10 lg:min-w-0">
        {items.map((item, i) => (
          <li key={item.href} className="relative -mb-px">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`group relative flex h-full flex-col gap-5 border-b px-5 pb-5 pt-6 transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                item.active
                  ? "border-b-white bg-white"
                  : "border-b-transparent hover:bg-white/60"
              }`}
            >
              {/* Hairlines: top edge and a divider on the left */}
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ink/10" />
              {i > 0 && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-ink/10" />}
              {/* Accent bar: full on the active tab, grows in on hover elsewhere */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 h-[2px] transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  item.active ? "w-full bg-accent" : "w-0 bg-ink/40 group-hover:w-full"
                }`}
              />

              <span
                aria-hidden="true"
                className="flex items-center justify-between font-mono text-[11px] tabular-nums text-ink-soft"
              >
                <span>{String(i).padStart(2, "0")}</span>
                <span>
                  {item.count} {item.count === 1 ? "product" : "products"}
                </span>
              </span>
              <span
                className={`font-display flex items-center gap-2.5 text-[15px] font-semibold leading-tight tracking-[-0.01em] transition-colors ${
                  item.active ? "text-ink" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                <span className={item.active ? "text-accent" : ""}>
                  {item.icon ? (
                    <Icon name={item.icon} size={18} />
                  ) : (
                    <LayoutGrid size={18} aria-hidden="true" />
                  )}
                </span>
                {item.label}
                <span className="sr-only">
                  , {item.count} {item.count === 1 ? "product" : "products"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
