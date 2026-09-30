import type { NextConfig } from "next";

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
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
