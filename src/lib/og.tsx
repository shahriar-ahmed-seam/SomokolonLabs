import { ImageResponse } from "next/og";
import { LOGO_PATHS } from "@/components/LogoMark";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0b1524";
const ACCENT = "#d92d20";

/**
 * Shared Open Graph card renderer.
 *
 * Deliberately font-file free: ImageResponse ships a default sans, so we avoid a
 * network fetch during the build. Satori (which backs ImageResponse) supports a
 * flexbox subset only — every element here sets display explicitly.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          color: "#ffffff",
        }}
      >
        {/* Accent rule */}
        <div
          style={{
            display: "flex",
            width: 96,
            height: 8,
            background: ACCENT,
            borderRadius: 4,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: ACCENT,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: title.length > 60 ? 60 : 72,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: -1.5,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.66)",
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Logo mark "S." on a white tile (the on-dark variant). */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx={LOGO_PATHS.radius} fill="#ffffff" />
              <path d={LOGO_PATHS.s} stroke={INK} strokeWidth={LOGO_PATHS.strokeWidth} />
              <circle
                cx={LOGO_PATHS.dot.cx}
                cy={LOGO_PATHS.dot.cy}
                r={LOGO_PATHS.dot.r}
                fill={ACCENT}
              />
            </svg>
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              Somokolon Labs
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            somokolonlabs.com
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
