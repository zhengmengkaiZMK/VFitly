import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-utils";
import { getAllZhBlogPosts } from "@/lib/blog-utils-zh";
import { SITE_URL } from "@/lib/seo";

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
  "/zh/pricing",
  "/zh/blog",
  "/zh/docs",
  "/zh/contact",
  "/zh/privacy",
  "/zh/terms",
  "/zh/dashboard",
  "/zh/settings",
];

function routeUrl(route: string) {
  return `${SITE_URL}${route}`;
}

function getDocsRoutes() {
  const docsDirectory = path.join(process.cwd(), "content", "docs");

  function walkDocs(dir: string, basePath = "", prefix = "/docs"): string[] {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir).flatMap((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        return walkDocs(fullPath, path.join(basePath, item), prefix);
      }

      if (!item.endsWith(".mdx") || item.startsWith("meta")) return [];

      const rawSlug = path.join(basePath, item.replace(/\.mdx$/, "")).split(path.sep).join("/");
      const cleanSlug = rawSlug.replace(/^\(root\)\//, "").replace(/^\(root\)$/, "");

      if (!cleanSlug || cleanSlug === "index") return [prefix];
      return [`${prefix}/${cleanSlug.replace(/\/index$/, "")}`];
    });
  }

  const englishDocs = walkDocs(docsDirectory, "", "/docs").filter((route) => !route.startsWith("/docs/zh"));
  const chineseDocs = walkDocs(path.join(docsDirectory, "zh"), "", "/zh/docs");

  return Array.from(new Set([...englishDocs, ...chineseDocs]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/dashboard") ? 0.8 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const blogEntries = [
    ...getAllBlogPosts().map((post) => ({
      url: routeUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllZhBlogPosts().map((post) => ({
      url: routeUrl(`/zh/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ] satisfies MetadataRoute.Sitemap;

  const docsEntries = getDocsRoutes().map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "/docs" ? 0.7 : 0.5,
  })) satisfies MetadataRoute.Sitemap;

  const entries = [...staticEntries, ...blogEntries, ...docsEntries];
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
