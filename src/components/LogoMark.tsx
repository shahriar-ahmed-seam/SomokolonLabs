// Somokolon Labs mark: "S." — a geometric S (two stacked arcs, radial cut
// terminals) with a red full stop, on a rounded tile.
//
// `onDark` flips the tile to white so the mark stays a solid shape on the
// navy header and footer; on light backgrounds the tile is navy.
// Keep in sync with src/app/icon.svg and the OG card in src/lib/og.tsx.

export const LOGO_PATHS = {
  s: "M25.3 12.84A6.6 6.6 0 1 0 20.1 23.5A6.6 6.6 0 1 1 14.9 34.16",
  dot: { cx: 34.1, cy: 36.2, r: 3.1 },
  strokeWidth: 5.4,
  radius: 12,
} as const;

export default function LogoMark({
  className,
  onDark = false,
  title = "Somokolon Labs",
}: {
  className?: string;
  onDark?: boolean;
  /** Pass "" when the mark sits next to the written name (decorative). */
  title?: string;
}) {
  const tile = onDark ? "#ffffff" : "#0b1524";
  const letter = onDark ? "#0b1524" : "#ffffff";
  const decorative = title === "";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title })}
    >
      {!decorative && <title>{title}</title>}
      <rect width="48" height="48" rx={LOGO_PATHS.radius} fill={tile} />
      <path d={LOGO_PATHS.s} stroke={letter} strokeWidth={LOGO_PATHS.strokeWidth} />
      <circle {...LOGO_PATHS.dot} fill="#d92d20" />
    </svg>
  );
}
