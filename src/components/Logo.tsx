import LogoMark from "@/components/LogoMark";

/** Mark + wordmark lockup used in the header and footer. */
export default function Logo({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" onDark={onDark} title="" />
      <span
        className={`font-display text-[18px] font-semibold tracking-[-0.025em] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        Somokolon{" "}
        <span className={`font-medium ${onDark ? "text-white/60" : "text-ink/60"}`}>Labs</span>
      </span>
    </span>
  );
}
