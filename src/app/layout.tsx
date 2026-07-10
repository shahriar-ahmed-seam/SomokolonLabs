import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://somokolonlabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Somokolon Labs — AI & Software Development Studio",
    template: "%s | Somokolon Labs",
  },
  description:
    "Somokolon Labs is an AI and software development studio building LLM systems, web applications, and cloud infrastructure — engineered for production.",
  openGraph: {
    title: "Somokolon Labs — AI & Software Development Studio",
    description:
      "Building intelligent software systems, from research to production.",
    url: siteUrl,
    siteName: "Somokolon Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Somokolon Labs — AI & Software Development Studio",
    description: "Building intelligent software systems, from research to production.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
