import type { MetadataRoute } from "next";
import { services, products, productCategories } from "@/lib/content";
import { posts } from "@/lib/insights";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "monthly", priority: 1 },
      { path: "/services", changeFrequency: "monthly", priority: 0.9 },
      { path: "/products", changeFrequency: "weekly", priority: 0.9 },
      { path: "/about", changeFrequency: "monthly", priority: 0.8 },
      { path: "/capabilities", changeFrequency: "monthly", priority: 0.7 },
      { path: "/open-source", changeFrequency: "weekly", priority: 0.7 },
      { path: "/insights", changeFrequency: "weekly", priority: 0.7 },
      { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
      { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
      { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    ] as const
  ).map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = productCategories.map((c) => ({
    url: `${siteUrl}/products/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/insights/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...postRoutes,
  ];
}
