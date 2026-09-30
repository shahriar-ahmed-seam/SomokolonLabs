"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { services, productCategories } from "@/lib/content";
import { Icon } from "@/components/icons/Icon";
import Logo from "@/components/Logo";

type OpenMenu = "services" | "products" | null;

const simpleLinks = [
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

/**
 * Every page opens on a full-bleed dark hero, so the header always floats:
 * transparent at the top, dark glass once the page scrolls. "Start a project"
 * appears here and nowhere else above the fold.
 */
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

  // Escape closes the open dropdown or the mobile menu.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMenu, mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Active item: full white plus a thin accent rule under the label.
  const navClass = (active: boolean) =>
    `relative text-sm font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
      active
        ? "text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-accent"
        : "text-white/70"
    }`;
  const linkClass = (href: string) => navClass(isActive(href));

  /** Close the dropdown once focus leaves the whole nav region. */
  const handleNavBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu(null);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || mobileOpen
          ? "bg-ink/90 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Somokolon Labs, home"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Logo onDark />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex" onBlur={handleNavBlur}>
          <Dropdown
            id="services"
            label="Services"
            open={openMenu === "services"}
            onOpen={(v) => setOpenMenu(v ? "services" : null)}
            className={navClass(isActive("/services") || isActive("/capabilities"))}
          >
            <ul className="w-80 overflow-hidden bg-white p-2 shadow-[0_30px_70px_-25px_rgba(11,21,36,0.45)] ring-1 ring-black/5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex gap-3 px-3 py-3 hover:bg-background-soft"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-white">
                      <Icon name={s.slug} size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{s.name}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-ink-soft">
                        {s.short}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-1 flex border-t border-border pt-1">
                <Link
                  href="/services"
                  className="flex-1 px-3 py-2.5 text-sm font-semibold text-ink hover:bg-background-soft"
                >
                  All services
                </Link>
                <Link
                  href="/capabilities"
                  className="flex-1 px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-background-soft hover:text-ink"
                >
                  Tech stack
                </Link>
              </li>
            </ul>
          </Dropdown>

          <Dropdown
            id="products"
            label="Products"
            open={openMenu === "products"}
            onOpen={(v) => setOpenMenu(v ? "products" : null)}
            className={navClass(isActive("/products"))}
          >
            <ul className="w-[22rem] overflow-hidden bg-white p-2 shadow-[0_30px_70px_-25px_rgba(11,21,36,0.45)] ring-1 ring-black/5">
              {productCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="flex gap-3 px-3 py-3 hover:bg-background-soft"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent/10 text-accent">
                      <Icon name={c.icon} size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{c.name}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-ink-soft">
                        {c.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-border pt-1">
                <Link
                  href="/products"
                  className="block px-3 py-2.5 text-sm font-semibold text-ink hover:bg-background-soft"
                >
                  All products
                </Link>
              </li>
            </ul>
          </Dropdown>

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
            className="group inline-flex items-center gap-1.5 rounded-md bg-accent py-2.5 pl-5 pr-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(217,45,32,0.8)] transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start a project
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white lg:hidden"
        >
          {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/10 px-6 pb-8 pt-4 lg:hidden"
        >
          <MobileGroup label="Services">
            {services.map((s) => (
              <MobileLink key={s.slug} href={`/services/${s.slug}`}>
                {s.name}
              </MobileLink>
            ))}
            <MobileLink href="/capabilities">Tech stack</MobileLink>
          </MobileGroup>

          <MobileGroup label="Products">
            {productCategories.map((c) => (
              <MobileLink key={c.slug} href={`/products/${c.slug}`}>
                {c.name}
              </MobileLink>
            ))}
            <MobileLink href="/products">All products</MobileLink>
          </MobileGroup>

          <div className="mt-4 border-t border-white/10 pt-2">
            {simpleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="font-display block py-3 text-2xl font-semibold tracking-[-0.02em] text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3.5 text-sm font-semibold text-white"
          >
            Start a project
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </header>
  );
}

function Dropdown({
  id,
  label,
  open,
  onOpen,
  className,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onOpen: (open: boolean) => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={() => onOpen(true)} onMouseLeave={() => onOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`menu-${id}`}
        onClick={() => onOpen(!open)}
        className={`flex items-center gap-1 ${className}`}
      >
        {label}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={`menu-${id}`} className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block py-2 text-[15px] text-white/80 hover:text-white">
      {children}
    </Link>
  );
}
