import type { Metadata } from "next";
import { LandingPage } from "@/components/seo/landing-page";
import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { landingJsonLd } from "./json-ld";
import type { LandingPageContent } from "./types";

// 所有 SEO 落地页共用的 metadata 工厂：
// 每页拿到唯一 Title / Description / canonical / Open Graph / Twitter 卡片。
export function createLandingMetadata(content: LandingPageContent): Metadata {
  const url = `${SITE_URL}${content.slug}`;
  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: {
      canonical: content.slug,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      siteName: SITE_NAME,
      images: [DEFAULT_OG_IMAGE],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

// 页面视图：结构化数据 + 共用落地页模板。
export function LandingPageView({ content }: { content: LandingPageContent }) {
  return (
    <>
      <JsonLd data={landingJsonLd(content)} />
      <LandingPage content={content} />
    </>
  );
}
