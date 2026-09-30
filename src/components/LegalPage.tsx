import type { ReactNode } from "react";
import PageHero from "@/components/site/PageHero";

/**
 * Shared shell for legal / policy pages. A compact dark hero, then a narrow
 * measure with plain typography and a "last updated" line.
 */
export default function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  /** ISO date, e.g. "2026-07-31". */
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  const updatedLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <>
      <PageHero eyebrow="Legal" title={title} titleSize="md" scene="plan" compact lead={intro}>
        <p className="text-sm text-white/55">
          Last updated{" "}
          <time dateTime={updated} className="font-semibold text-white">
            {updatedLabel}
          </time>
        </p>
      </PageHero>

      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/20 [&_a]:underline-offset-4 [&_a:hover]:text-accent [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] [&_h2]:text-ink [&_li]:leading-relaxed [&_li]:text-ink-soft [&_p]:mt-4 [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:marker:text-accent">
          {children}
        </div>
      </div>
    </>
  );
}
