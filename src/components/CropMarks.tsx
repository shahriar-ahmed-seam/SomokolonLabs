/**
 * Viewfinder crop marks that slide out from a card's four corners on hover
 * or keyboard focus. Drop inside any `group relative` element that doesn't
 * clip its overflow (the marks sit 8px outside the box). Decorative only.
 */

const BASE =
  "pointer-events-none absolute z-[3] h-[11px] w-[11px] opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-opacity";

const CORNERS = [
  "-left-2 -top-2 translate-x-[7px] translate-y-[7px] border-l border-t",
  "-right-2 -top-2 -translate-x-[7px] translate-y-[7px] border-r border-t",
  "-bottom-2 -left-2 translate-x-[7px] -translate-y-[7px] border-b border-l",
  "-bottom-2 -right-2 -translate-x-[7px] -translate-y-[7px] border-b border-r",
];

export default function CropMarks({ dark = false }: { dark?: boolean }) {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`${BASE} ${corner} ${dark ? "border-white/70" : "border-ink"}`}
        />
      ))}
    </>
  );
}
