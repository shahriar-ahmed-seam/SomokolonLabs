import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contact, services, company, productCategories } from "@/lib/content";
import { LinkedinIcon } from "@/components/icons/BrandIcons";
import Logo from "@/components/Logo";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Tech stack" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const columns = [
  {
    title: "Services",
    links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
  },
  {
    title: "Products",
    links: [
      ...productCategories.map((c) => ({ href: `/products/${c.slug}`, label: c.name })),
      { href: "/products", label: "All products" },
    ],
  },
  { title: "Company", links: companyLinks },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* Brand + direct contact */}
          <div className="lg:col-span-5">
            <Logo onDark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              An AI and software studio in {company.city}. We design, build,
              deploy, and look after software that people rely on.
            </p>

            <a
              href={`mailto:${contact.email}`}
              className="group font-display mt-10 inline-flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl"
            >
              {contact.email}
              <ArrowUpRight
                size={22}
                aria-hidden="true"
                className="text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
            <p className="mt-3 text-sm text-white/65">
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {contact.phone}
              </a>
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              {contact.location}
            </p>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${company.name} on LinkedIn`}
              className="mt-8 flex h-10 w-10 items-center justify-center border border-white/15 text-white/80 transition-colors hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <LinkedinIcon size={17} />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  {col.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge. Decorative. */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p
          data-wordmark="Somokolon"
          className="font-display mx-auto -mb-[0.24em] max-w-7xl whitespace-nowrap px-6 text-center text-[15.5vw] font-semibold leading-none tracking-[-0.06em] text-white/[0.045] before:content-[attr(data-wordmark)] after:text-accent/30 after:content-['.'] xl:text-[12.5rem]"
        />
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. {contact.location}.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
