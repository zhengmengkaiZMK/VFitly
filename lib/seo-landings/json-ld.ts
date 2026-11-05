import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { LandingPageContent } from "./types";

// 每个落地页输出三段结构化数据：
// 1. BreadcrumbList —— 告诉 Google 页面在站内的位置；
// 2. FAQPage —— 事实型 FAQ，参与富摘要并被 AI 搜索提取；
// 3. WebApplication —— 把该功能页和 VFitly 应用实体关联起来。
export function landingJsonLd(content: LandingPageContent) {
  const url = `${SITE_URL}${content.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: content.breadcrumb,
          item: url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${content.breadcrumb} - VFitly`,
      url,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: content.description,
      isPartOf: {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: SITE_URL,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];
}
