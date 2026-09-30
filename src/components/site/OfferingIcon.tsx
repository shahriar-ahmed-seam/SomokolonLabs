import { Sparkles } from "lucide-react";
import { OFFERING_ICON, TINTS } from "./Services";

/** Offering glyph with the offset tint shape from the home services grid. */
export default function OfferingIcon({ title, index }: { title: string; index: number }) {
  const Glyph = OFFERING_ICON[title] ?? Sparkles;
  return (
    <span className="relative flex h-12 w-12 items-end justify-start">
      <span
        aria-hidden="true"
        className={`absolute right-0 top-0 h-8 w-8 ${TINTS[index % TINTS.length]}`}
      />
      <Glyph size={26} strokeWidth={1.6} aria-hidden="true" className="relative text-ink" />
    </span>
  );
}
