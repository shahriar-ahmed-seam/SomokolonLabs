import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./site.module.css";
import { Eyebrow, FadeIn } from "./motion";

/**
 * Section heading used across inner pages: eyebrow, display headline with an
 * optional serif accent, and a lead or link on the right at large sizes.
 */
export default function SectionIntro({
  eyebrow,
  title,
  accent,
  lead,
  link,
  dark = false,
  as: Heading = "h2",
  id,
}: {
  /** Heading id, for aria-labelledby on the enclosing section. */
  id?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: ReactNode;
  link?: { href: string; label: string };
  dark?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <FadeIn className="lg:col-span-7">
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <Heading
          id={id}
          className={`${styles.display} mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span
                className={`${styles.serif} italic tracking-[-0.02em] ${
                  dark ? styles.accentText : "text-accent"
                }`}
              >
                {accent}
              </span>
            </>
          )}
        </Heading>
      </FadeIn>
      {(lead || link) && (
        <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
          {lead && (
            <div className={`text-base leading-relaxed ${dark ? "text-white/65" : "text-ink-soft"}`}>
              {lead}
            </div>
          )}
          {link && (
            <Link
              href={link.href}
              className={`group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
                dark ? "text-white hover:text-white/80" : "text-ink hover:text-accent"
              }`}
            >
              {link.label}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </FadeIn>
      )}
    </div>
  );
}
