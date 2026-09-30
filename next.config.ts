import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Vercel injects its toolbar (comments, feedback) into preview deployments.
const isPreview = process.env.VERCEL_ENV === "preview";

/**
 * Content Security Policy, without nonces.
 *
 * Nonces would force every page to render per request (see Next's CSP guide),
 * giving up static generation. Instead everything is limited to our own
 * origin: every script, stylesheet, font, image, video and fetch the site uses
 * is same-origin (the chat, contact form, Vercel Analytics in production and
 * the videos all are). 'unsafe-inline' stays for scripts because the App
 * Router streams its data in inline <script> tags, and for styles because
 * server-rendered HTML carries style attributes.
 *
 * If a new third-party script, embed or font is added, allow its origin here.
 */
function contentSecurityPolicy() {
  const toolbar = isPreview ? " https://vercel.live" : "";
  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${toolbar}`,
    "style-src": `'self' 'unsafe-inline'${toolbar}`,
    "img-src": `'self' data: blob:${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
    "font-src": `'self'${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
    "connect-src": `'self'${isDev ? " ws: wss:" : ""}${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
    "media-src": "'self'",
    "frame-src": isPreview ? "https://vercel.live" : "'none'",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
  };
  const policy = Object.entries(directives).map(([name, value]) => `${name} ${value}`);
  // Local production builds are served over http; upgrading would break them.
  if (!isDev && process.env.VERCEL) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

const nextConfig: NextConfig = {
  // Emits .next/standalone/server.js so the Docker image can run without
  // node_modules. Harmless on Vercel, which ignores it.
  output: "standalone",

  // Trims the "x-powered-by: Next.js" fingerprint.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Force HTTPS for a year, including subdomains.
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Stop browsers from MIME-sniffing a response into something else.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Disallow framing — no clickjacking surface on a marketing site.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // We use none of these APIs; deny them explicitly.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
          // Pages opened from here (demos, LinkedIn) can't reach back into this window.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
