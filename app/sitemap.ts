import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const staticRoutes = [
  "",
  "/pricing",
  "/blog",
  "/docs",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
  "/dashboard",
  "/dashboard/try-on",
  "/dashboard/product-try-on",
  "/dashboard/wardrobe",
  "/dashboard/history",
  "/settings",
];

function routeUrl(route: string) {
  return `${SITE_URL}${route}`;
}

function getDocsRoutes() {
  const visibleDocSlugs = [
    "quick-start",
    "getting-started",
    "ai-clothes-changer",
    "product-try-on",
    "virtual-wardrobe",
    "360-try-on-video",
    "history-results",
    "credits-and-plans",
  ];

  return [
    "/docs",
    ...visibleDocSlugs.map((slug) => `/docs/${slug}`),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/dashboard") ? 0.8 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const blogEntries = (await getPublishedBlogPosts()).map((post) => ({
    url: routeUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })) satisfies MetadataRoute.Sitemap;

  const docsEntries = getDocsRoutes().map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "/docs" ? 0.7 : 0.5,
  })) satisfies MetadataRoute.Sitemap;

  const entries = [...staticEntries, ...blogEntries, ...docsEntries];
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
