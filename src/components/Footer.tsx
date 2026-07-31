import Link from "next/link";
import { contact, services, company, productCategories } from "@/lib/content";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Mail, Phone, MapPin } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/insights", label: "Insights" },
  { href: "/open-source", label: "Open source" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-auto" ink="#ffffff" />
              <span className="text-lg font-bold tracking-tight">
                Somokolon<span className="text-accent"> Labs</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              An AI and software studio building intelligent systems engineered
              for production.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${company.name} on GitHub`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${company.founder} on LinkedIn`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-white/40">
              Open source on GitHub as{" "}
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-white/60 underline decoration-white/20 underline-offset-2 hover:text-white"
              >
                {company.githubOrg}
              </a>
            </p>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Services
            </h2>
            <ul className="mt-4 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Products
            </h2>
            <ul className="mt-4 space-y-3">
              {productCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  All products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Company
            </h2>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((item) => (
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

            <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-white/50">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white/40" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-white/40" aria-hidden="true" />
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 text-white/40"
                  aria-hidden="true"
                />
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. {contact.location}.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/privacy" className="hover:text-white/70">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white/70">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
