import Link from "next/link";
import { ArrowRight } from "lucide-react";

const suggestions = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start px-6 py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
        The link may be out of date, or we may have moved something. Here&apos;s
        where most people are heading:
      </p>

      <ul className="mt-8 flex flex-wrap gap-3">
        {suggestions.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Back to home
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
