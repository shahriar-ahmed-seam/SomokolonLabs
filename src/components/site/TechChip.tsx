import type { Logo } from "./types";

/** A tool name with its brand mark when one exists (resolved server-side). */
export default function TechChip({ name, logo }: { name: string; logo: Logo | null }) {
  return (
    <li className="inline-flex items-center gap-2 bg-white px-3.5 py-2 text-sm font-medium text-ink ring-1 ring-inset ring-ink/10">
      {logo ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill={logo.hex}>
          <path d={logo.path} />
        </svg>
      ) : (
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      )}
      {name}
    </li>
  );
}
