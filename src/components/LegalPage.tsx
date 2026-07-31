import type { ReactNode } from "react";

/**
 * Shared shell for legal / policy pages. Narrow measure, plain typography,
 * and a "last updated" line — the two things these pages actually need.
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
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 leading-relaxed text-ink-soft">{intro}</p>
          <p className="mt-6 text-sm text-ink-soft">
            Last updated{" "}
            <time dateTime={updated} className="font-medium text-ink">
              {updatedLabel}
            </time>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 [&_a]:font-medium [&_a]:text-accent [&_a:hover]:text-accent-dark [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:leading-relaxed [&_li]:text-ink-soft [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </>
  );
}
