/**
 * Canonical site origin.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment. Vercel exposes
 * VERCEL_PROJECT_PRODUCTION_URL automatically, which we fall back to so preview
 * builds still emit absolute URLs that resolve.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "https://somokolonlabs.com";
}

export const siteUrl = resolveSiteUrl();

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}
