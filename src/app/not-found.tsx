import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Scene from "@/components/site/Scene";
import styles from "@/components/site/site.module.css";

const suggestions = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-20">
        <Scene name="plan" priority />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,21,36,0.2),#0b1524_75%)]"
      />

      <div className="mx-auto my-auto w-full max-w-3xl px-6 pb-20 pt-36 text-center">
        <p
          aria-hidden="true"
          className={`${styles.display} text-[7rem] font-semibold leading-none tracking-[-0.06em] text-white/90 sm:text-[10rem]`}
        >
          4<span className={`${styles.serif} ${styles.accentText} italic`}>0</span>4
        </p>
        <h1 className={`${styles.display} mt-8 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl`}>
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65">
          The link may be out of date, or we may have moved something. Here&apos;s
          where most people are heading:
        </p>

        <ul className="mt-9 flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 rounded-md bg-accent py-3 pl-7 pr-3 text-sm font-semibold text-white shadow-[0_14px_40px_-14px_rgba(217,45,32,0.8)] transition-colors hover:bg-accent-dark"
        >
          Back to home
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-accent">
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-45" />
          </span>
        </Link>
      </div>
    </section>
  );
}
