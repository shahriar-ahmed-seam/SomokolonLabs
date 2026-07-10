// Somokolon Labs logo mark: < S > — angle brackets with a two-tone S.
// Recreated as SVG so it stays crisp at any size and matches the brand palette.
// `ink` is the dark colour (navy by default; pass white on dark backgrounds).

export default function LogoMark({
  className,
  ink = "#0b1524",
  accent = "#d92d20",
  title = "Somokolon Labs",
}: {
  className?: string;
  ink?: string;
  accent?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Left chevron < (ink) */}
      <polyline
        points="66,20 30,60 66,100"
        stroke={ink}
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right chevron > (accent) */}
      <polyline
        points="134,20 170,60 134,100"
        stroke={accent}
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* S — upper bowl (ink) */}
      <path
        d="M120 40 C120 27 108 22 98 22 C85 22 77 30 77 41 C77 53 89 57 100 61"
        stroke={ink}
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* S — lower bowl (accent) */}
      <path
        d="M100 61 C111 65 123 69 123 81 C123 92 115 100 102 100 C92 100 80 95 80 82"
        stroke={accent}
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
