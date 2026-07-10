import Link from "next/link";
import { contact, services } from "@/lib/content";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-sm font-bold text-ink">
                S
              </span>
              <span className="text-lg font-bold tracking-tight">
                Somokolon<span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              An AI and software studio building intelligent systems engineered for production.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Services</h3>
            <ul className="mt-4 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-white/70 transition-colors hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-sm text-white/70 hover:text-white">About</Link></li>
              <li><Link href="/services" className="text-sm text-white/70 hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white/40" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-white/40" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">{contact.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-white/40" />
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Somokolon Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
