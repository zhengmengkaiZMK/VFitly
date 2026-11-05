const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://www.vfitly.com").replace(/\/$/, "");

export const SITE_URL = siteUrl;
export const SITE_NAME = "VFitly";
export const IMAGE_ALT_TEXT = "VFitly，AI virtual try-on，generate try-on image and try-on video";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/banner.png`;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/icon.png"),
};

// 统一的品牌实体定义（GEO）：所有公开页面、社交主页、目录收录都使用同一套描述，
// 让 AI 搜索系统把 "AI virtual try-on"、"AI clothes changer"、"AI outfit generator"、
// "virtual wardrobe" 关联到同一个品牌实体。
export const SITE_ENTITY_DESCRIPTION =
  "VFitly is an AI virtual try-on tool that lets shoppers preview clothes, dresses, shoes, and outfits on their own photos before buying or styling them. It includes an AI clothes changer, an AI outfit generator, and a virtual wardrobe.";

// 每个重要页面顶部的可直接引用答案（40~80 词），同时服务搜索引擎摘要与 AI 搜索提取。
export const SITE_ANSWER_SNIPPET =
  "VFitly is an AI virtual try-on tool for previewing clothes on your own photo. Upload a clear photo of yourself and an image of a garment, then VFitly generates a visual preview of how the outfit may look. The preview is for style visualization and does not guarantee exact size, fit, color, or fabric appearance.";

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "VFitly is an AI virtual try-on platform for trying on clothes from your own photo and managing garment and wardrobe assets.",
};
