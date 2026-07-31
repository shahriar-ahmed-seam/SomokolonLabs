import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company, contact, services } from "@/lib/content";
import { siteUrl, absoluteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — AI & Software Development Studio`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  keywords: [
    "AI development studio",
    "LLM engineering",
    "RAG systems",
    "machine learning consultancy",
    "Next.js development",
    "MLOps",
    "software studio Bangladesh",
    "Dhaka software development",
  ],
  authors: [{ name: company.name, url: siteUrl }],
  creator: company.name,
  publisher: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${company.name} — AI & Software Development Studio`,
    description:
      "Building intelligent software systems, from research to production.",
    url: siteUrl,
    siteName: company.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — AI & Software Development Studio`,
    description:
      "Building intelligent software systems, from research to production.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // TODO(you): paste the Google Search Console verification token here after
  // adding the property, then redeploy.
  // verification: { google: "..." },
};

export const viewport: Viewport = {
  themeColor: "#0b1524",
  colorScheme: "light",
};

/**
 * Organization structured data. Helps search engines and AI assistants
 * associate the brand, the domain, and the GitHub org as one entity.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: company.name,
  legalName: company.legalName,
  url: siteUrl,
  logo: absoluteUrl("/icon.svg"),
  image: absoluteUrl("/opengraph-image"),
  description: company.description,
  foundingDate: company.founded,
  founder: { "@type": "Person", name: company.founder },
  email: contact.email,
  telephone: contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: company.city,
    addressCountry: "BD",
  },
  sameAs: [contact.github, contact.linkedin],
  knowsAbout: [
    "Large language models",
    "Retrieval-augmented generation",
    "Agentic AI systems",
    "Computer vision",
    "MLOps",
    "Distributed systems",
  ],
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      description: service.short,
      url: absoluteUrl(`/services/${service.slug}`),
    },
  })),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: siteUrl,
  name: company.name,
  publisher: { "@id": absoluteUrl("/#organization") },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Keyboard users land here first — lets them jump the nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
