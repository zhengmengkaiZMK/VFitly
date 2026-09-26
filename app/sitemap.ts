import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { quarantinedBlogSlugs } from "@/lib/blog-utils";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// 只收录匿名可访问、直接返回 200、且具备搜索价值的内容页。
// 不收录的两类：
// 1. 需要登录的 /dashboard、/dashboard/history、/settings —— 一律 307 跳登录页，
//    提交进站点地图会被 Google 判定为「网页会自动重定向」。
// 2. /login、/signup —— 纯表单页，没有可供检索的内容，只会浪费抓取预算。
const staticRoutes = [
  "",
  "/pricing",
  "/blog",
  "/docs",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/dashboard/try-on",
  "/dashboard/product-try-on",
  "/dashboard/wardrobe",
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

  // 博客条目来自数据库。数据库短暂不可用时，不能让整个站点地图变成 500 ——
  // Google 恰好在这个窗口抓取就会直接失败。这里降级为「本次响应不含博客条目」，
  // 站点其余地址照常输出；数据库恢复后博客会自动回到地图里。
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    blogEntries = (await getPublishedBlogPosts())
      .filter((post) => !quarantinedBlogSlugs.includes(post.slug))
      .map((post) => ({
        url: routeUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) satisfies MetadataRoute.Sitemap;
  } catch (error) {
    console.error("Sitemap: failed to load blog posts from the database, omitting them from this response.", error);
  }

  const docsEntries = getDocsRoutes().map((route) => ({
    url: routeUrl(route),
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "/docs" ? 0.7 : 0.5,
  })) satisfies MetadataRoute.Sitemap;

  const entries = [...staticEntries, ...blogEntries, ...docsEntries];
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
