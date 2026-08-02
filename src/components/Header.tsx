"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { services, productCategories } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import LogoMark from "@/components/LogoMark";

type OpenMenu = "services" | "products" | null;

const simpleLinks = [
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes everything. Adjusted during render rather than in an
  // effect — an effect here would cause a second render pass on every
  // navigation (react-hooks/set-state-in-effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Escape closes the open dropdown — expected behaviour for a disclosure menu.
  useEffect(() => {
    if (!openMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
      isActive(href) ? "text-accent" : "text-ink-soft"
    }`;

  /** Close the dropdown once focus leaves the whole nav region. */
  const handleNavBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu(null);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur transition-shadow ${
        scrolled
          ? "shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(11,21,36,0.15)]"
          : "border-b border-border"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label="Somokolon Labs — home"
        >
          <LogoMark className="h-8 w-auto" />
          <span className="text-[17px] font-bold tracking-tight text-ink">
            Somokolon<span className="text-accent"> Labs</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 lg:flex"
          onBlur={handleNavBlur}
        >
          {/* Services */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("services")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-expanded={openMenu === "services"}
              aria-controls="menu-services"
              onClick={() =>
                setOpenMenu((v) => (v === "services" ? null : "services"))
              }
              className={`flex items-center gap-1 ${linkClass("/services")}`}
            >
              Services
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={`transition-transform ${
                  openMenu === "services" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMenu === "services" && (
              <div
                id="menu-services"
                className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
              >
                <ul className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_20px_50px_-20px_rgba(11,21,36,0.25)]">
                  <li>
                    <Link
                      href="/services"
                      className="block border-b border-border bg-background-soft px-4 py-3 text-sm font-semibold text-accent hover:bg-background-soft/70"
                    >
                      All services
                    </Link>
                  </li>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="block border-b border-border px-4 py-3 text-sm font-semibold text-ink last:border-0 hover:bg-background-soft"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/capabilities"
                      className="block border-t border-border px-4 py-3 text-sm font-medium text-ink-soft hover:bg-background-soft"
                    >
                      Capabilities &amp; tech stack
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Products */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("products")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              aria-expanded={openMenu === "products"}
              aria-controls="menu-products"
              onClick={() =>
                setOpenMenu((v) => (v === "products" ? null : "products"))
              }
              className={`flex items-center gap-1 ${linkClass("/products")}`}
            >
              Products
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={`transition-transform ${
                  openMenu === "products" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMenu === "products" && (
              <div
                id="menu-products"
                className="absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-3"
              >
                <ul className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-[0_20px_50px_-20px_rgba(11,21,36,0.25)]">
                  {productCategories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/products/${c.slug}`}
                        className="flex gap-3 rounded-lg px-3 py-3 hover:bg-background-soft"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                          <Icon name={c.icon} size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {c.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-ink-soft">
                            {c.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/products"
                      className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-background-soft"
                    >
                      All products
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {simpleLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Start a project
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink lg:hidden"
        >
          {mobileOpen ? (
            <X size={18} aria-hidden="true" />
          ) : (
            <Menu size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-border bg-white px-6 py-4 lg:hidden"
        >
          <Link href="/" className="block py-2.5 text-sm font-medium text-ink">
            Home
          </Link>

          <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Services
          </p>
          <Link
            href="/services"
            className="block py-2 pl-3 text-sm font-medium text-accent"
          >
            All services
          </Link>
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block py-2 pl-3 text-sm text-ink-soft"
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/capabilities"
            className="block py-2 pl-3 text-sm text-ink-soft"
          >
            Capabilities &amp; tech stack
          </Link>

          <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Products
          </p>
          <Link
            href="/products"
            className="block py-2 pl-3 text-sm font-medium text-accent"
          >
            All products
          </Link>
          {productCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className="block py-2 pl-3 text-sm text-ink-soft"
            >
              {c.name}
            </Link>
          ))}

          {simpleLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="mt-1 block py-2.5 text-sm font-medium text-ink"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="mt-3 block rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Start a project
          </Link>
        </nav>
      )}
    </header>
  );
}
