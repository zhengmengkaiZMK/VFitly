const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://www.vfitly.com").replace(/\/$/, "");

export const SITE_URL = siteUrl;
export const SITE_NAME = "VFitly";
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
  sameAs: [SITE_URL],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "VFitly is an AI virtual try-on and clothes changer platform for trying on clothes, glasses, hairstyles, and managing wardrobe assets.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
