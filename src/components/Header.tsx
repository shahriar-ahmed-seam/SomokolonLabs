"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { services, productCategories } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";

type OpenMenu = "services" | "products" | null;

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur transition-shadow ${
        scrolled
          ? "shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(11,21,36,0.15)]"
          : "border-b border-border"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">
            S
          </span>
          <span className="text-[17px] font-bold tracking-tight text-ink">
            Somokolon<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              pathname === "/" ? "text-accent" : "text-ink-soft"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              isActive("/about") ? "text-accent" : "text-ink-soft"
            }`}
          >
            About
          </Link>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("services")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              href="/services"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent ${
                isActive("/services") ? "text-accent" : "text-ink-soft"
              }`}
            >
              Services
              <ChevronDown size={15} className={`transition-transform ${openMenu === "services" ? "rotate-180" : ""}`} />
            </Link>
            {openMenu === "services" && (
              <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_20px_50px_-20px_rgba(11,21,36,0.25)]">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block border-b border-border px-4 py-3 last:border-0 hover:bg-background-soft"
                    >
                      <span className="text-sm font-semibold text-ink">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products mega-menu (categories) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("products")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              href="/products"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent ${
                isActive("/products") ? "text-accent" : "text-ink-soft"
              }`}
            >
              Products
              <ChevronDown size={15} className={`transition-transform ${openMenu === "products" ? "rotate-180" : ""}`} />
            </Link>
            {openMenu === "products" && (
              <div className="absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-xl border border-border bg-white p-2 shadow-[0_20px_50px_-20px_rgba(11,21,36,0.25)]">
                  {productCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products/${c.slug}`}
                      className="flex gap-3 rounded-lg px-3 py-3 hover:bg-background-soft"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <Icon name={c.icon} size={18} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{c.name}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-ink-soft">{c.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              isActive("/contact") ? "text-accent" : "text-ink-soft"
            }`}
          >
            Contact
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Start a project
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink lg:hidden"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-white px-6 py-4 lg:hidden">
          <Link href="/" className="block py-2.5 text-sm font-medium text-ink">Home</Link>
          <Link href="/about" className="block py-2.5 text-sm font-medium text-ink">About</Link>

          <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">Services</p>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="block py-2 pl-3 text-sm text-ink-soft">
              {s.name}
            </Link>
          ))}

          <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">Products</p>
          {productCategories.map((c) => (
            <Link key={c.slug} href={`/products/${c.slug}`} className="block py-2 pl-3 text-sm text-ink-soft">
              {c.name}
            </Link>
          ))}

          <Link href="/contact" className="mt-3 block py-2.5 text-sm font-medium text-ink">Contact</Link>
          <Link
            href="/contact"
            className="mt-2 block rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Start a project
          </Link>
        </nav>
      )}
    </header>
  );
}
