import { createHash } from "crypto";

export type ExtractedProductGarment = {
  id: string;
  imageUrl: string;
  label: string;
  source: "meta" | "json-ld" | "html" | "amazon" | "ebay" | "tiktok-shop" | "shopee" | "temu" | "aliexpress" | "taobao";
};

type ProductPlatform = "amazon" | "ebay" | "tiktok-shop" | "shopee" | "temu" | "aliexpress" | "taobao" | "generic";

const MAX_IMAGES = 24;
const MIN_IMAGE_SIZE_HINT = 180;
const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|avif)(\?|#|$)/i;
const BLOCKED_PATTERNS = /(sprite|icon|logo|avatar|favicon|payment|badge|star|rating|placeholder|loader|spinner|tracking|analytics|grey-pixel|play-button|nav2|\/G\/01\/)/i;

export async function extractProductGarments(productUrl: string): Promise<ExtractedProductGarment[]> {
  const url = normalizeProductUrl(productUrl);
  const platform = detectProductPlatform(url);
  const urlDerivedImages = extractUrlDerivedImages(platform, url);
  let candidates: Omit<ExtractedProductGarment, "id">[] = [];

  try {
    const { html, finalUrl } = await fetchProductHtml(url);
    const platformImages = extractPlatformImages(platform, html, finalUrl);
    candidates = platformImages.length > 0 ? [...platformImages, ...urlDerivedImages] : [...urlDerivedImages, ...extractGenericProductImages(html, url)];
  } catch (error) {
    if (urlDerivedImages.length === 0) {
      if (platform === "taobao") {
        candidates = await extractTaobaoApiImagesFromUrl(url);
      } else {
        throw error;
      }
    } else {
      candidates = urlDerivedImages;
    }
  }

  if (platform === "taobao" && candidates.length === 0) {
    candidates = await extractTaobaoApiImagesFromUrl(url);
  }

  const unique = dedupeImages(candidates).filter((item) => isLikelyProductImage(item.imageUrl));

  if (unique.length === 0) {
    throw new Error("No product clothing images were found from this link. The site may block crawling or render images only after login.");
  }

  return unique.slice(0, MAX_IMAGES).map((item, index) => ({
    ...item,
    id: `garment-${index + 1}`,
    label: item.label || `Product image ${index + 1}`,
  }));
}

function detectProductPlatform(productUrl: string) {
  try {
    const url = new URL(productUrl);
    if (isAmazonHost(url.hostname) && Boolean(extractAmazonAsin(url))) return "amazon";
    if (isEbayHost(url.hostname)) return "ebay";
    if (isTikTokShopHost(url.hostname, url.pathname)) return "tiktok-shop";
    if (isShopeeHost(url.hostname)) return "shopee";
    if (isTemuHost(url.hostname)) return "temu";
    if (isAliExpressHost(url.hostname)) return "aliexpress";
    if (isTaobaoHost(url.hostname)) return "taobao";
  } catch {
    // Fall back to generic extraction.
  }

  return "generic";
}

function extractPlatformImages(platform: ProductPlatform, html: string, finalUrl: string) {
  switch (platform) {
    case "amazon":
      return extractAmazonImages(html, finalUrl);
    case "ebay":
      return extractEbayImages(html, finalUrl);
    case "tiktok-shop":
      return extractTikTokShopImages(html, finalUrl);
    case "shopee":
      return extractShopeeImages(html, finalUrl);
    case "temu":
      return extractTemuImages(html, finalUrl);
    case "aliexpress":
      return extractAliExpressImages(html, finalUrl);
    case "taobao":
      return extractTaobaoImages(html, finalUrl);
    default:
      return [];
  }
}

function extractUrlDerivedImages(platform: ProductPlatform, productUrl: string): Omit<ExtractedProductGarment, "id">[] {
  switch (platform) {
    case "ebay":
      return extractEbayImagesFromUrl(productUrl);
    case "temu":
      return extractTemuImagesFromUrl(productUrl);
    case "aliexpress":
      return extractPlatformImagesFromUrl(productUrl, "aliexpress", isAliExpressImageUrl);
    case "taobao":
      return extractPlatformImagesFromUrl(productUrl, "taobao", isTaobaoImageUrl);
    default:
      return [];
  }
}

function extractGenericProductImages(html: string, baseUrl: string) {
  return [
    ...extractMetaImages(html, baseUrl),
    ...extractJsonLdImages(html, baseUrl),
    ...extractHtmlImages(html, baseUrl),
  ];
}

function isEbayHost(hostname: string) {
  return /(^|\.)ebay\./i.test(hostname);
}

function isTikTokShopHost(hostname: string, pathname: string) {
  return (/tiktok/i.test(hostname) && /(shop|product|item|detail)/i.test(pathname)) || /(^|\.)tiktok(?:shop)?\./i.test(hostname);
}

function isShopeeHost(hostname: string) {
  return /(^|\.)shopee\./i.test(hostname) || /shopee\.(?:com|co)\./i.test(hostname) || /susercontent\./i.test(hostname);
}

function isTemuHost(hostname: string) {
  return /(^|\.)temu\./i.test(hostname) || /(^|\.)kwcdn\.com$/i.test(hostname);
}

function isAliExpressHost(hostname: string) {
  return /(^|\.)aliexpress\./i.test(hostname) || /(^|\.)aliexpress-media\.com$/i.test(hostname) || /(^|\.)alicdn\.com$/i.test(hostname);
}

function isTaobaoHost(hostname: string) {
  return /(^|\.)(?:taobao|tmall)\./i.test(hostname) || /(^|\.)tb\.cn$/i.test(hostname) || /(^|\.)alicdn\.com$/i.test(hostname);
}

function normalizeProductUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Please enter a product link.");

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Please enter a valid product link starting with http:// or https://.");
  }

  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http and https links are supported.");
  return url.toString();
}

async function fetchProductHtml(productUrl: string) {
  const urls = buildProductFetchUrls(productUrl);
  const failures: string[] = [];

  for (const candidateUrl of urls) {
    try {
      const response = await fetch(candidateUrl, {
        headers: buildFetchHeaders(candidateUrl),
        redirect: "follow",
      });
      const text = await response.text();

      if (!response.ok) {
        failures.push(`${shortenUrl(candidateUrl)} -> HTTP ${response.status}`);
        continue;
      }

      if (!text) {
        failures.push(`${shortenUrl(candidateUrl)} -> empty response`);
        continue;
      }

      if (isBlockedProductPage(text, candidateUrl)) {
        failures.push(`${shortenUrl(candidateUrl)} -> blocked/verification page`);
        continue;
      }

      return { html: text, finalUrl: response.url || candidateUrl };
    } catch (error) {
      failures.push(`${shortenUrl(candidateUrl)} -> ${error instanceof Error ? error.message : "fetch failed"}`);
    }
  }

  throw new Error(`Unable to fetch product page. Tried ${urls.length} route(s): ${failures.slice(0, 4).join("; ")}`);
}

function buildProductFetchUrls(productUrl: string) {
  const urls = [productUrl];
  const parsed = new URL(productUrl);

  if (isAmazonHost(parsed.hostname)) {
    const asin = extractAmazonAsin(parsed);
    if (asin) {
      const origin = `${parsed.protocol}//${parsed.hostname}`;
      urls.unshift(`${origin}/gp/aw/d/${asin}?th=1&psc=1&language=en_US`);
      urls.push(`${origin}/dp/${asin}?th=1&psc=1&language=en_US`);
    }
  }

  if (isEbayHost(parsed.hostname)) {
    const canonicalUrl = productUrl.replace(/\?.*$/, "");
    const canonicalWithoutProtocol = canonicalUrl.replace(/^https?:\/\//i, "");
    urls.unshift(canonicalUrl);
    urls.push(`https://r.jina.ai/http://${canonicalWithoutProtocol}`);
    urls.push(`https://r.jina.ai/http://https://${canonicalWithoutProtocol}`);
  }

  if (isShopeeHost(parsed.hostname)) {
    parsed.searchParams.delete("sp_atk");
    parsed.searchParams.delete("xptdk");
    urls.unshift(parsed.toString());

    const productIds = extractShopeeProductIds(parsed);
    if (productIds) {
      urls.unshift(`${parsed.origin}/api/v4/pdp/get_pc?shop_id=${productIds.shopId}&item_id=${productIds.itemId}&by=1`);
      urls.unshift(`${parsed.origin}/api/v4/item/get?shopid=${productIds.shopId}&itemid=${productIds.itemId}`);
      urls.unshift(`${parsed.origin}/api/v2/item/get?shopid=${productIds.shopId}&itemid=${productIds.itemId}`);
    }
  }

  if (isAliExpressHost(parsed.hostname)) {
    const canonicalUrl = productUrl.replace(/\?.*$/, "");
    const canonicalWithoutProtocol = canonicalUrl.replace(/^https?:\/\//i, "");
    urls.unshift(canonicalUrl);
    urls.push(`https://r.jina.ai/http://${canonicalWithoutProtocol}`);
    urls.push(`https://r.jina.ai/http://https://${canonicalWithoutProtocol}`);
  }

  if (isTaobaoHost(parsed.hostname)) {
    const itemId = extractTaobaoItemId(parsed);
    if (itemId) {
      urls.unshift(`https://item.taobao.com/item.htm?id=${itemId}`);
      urls.unshift(...buildTaobaoApiFetchUrls(itemId));
      urls.push(`https://h5.m.taobao.com/awp/core/detail.htm?id=${itemId}`);
      urls.push(`https://main.m.taobao.com/detail/index.html?id=${itemId}`);
    }
  }

  return Array.from(new Set(urls));
}

function extractTaobaoItemId(url: URL) {
  const queryId = url.searchParams.get("id") || url.searchParams.get("itemId") || url.searchParams.get("item_id");
  if (queryId && /^\d{8,}$/.test(queryId)) return queryId;

  const pathId = url.pathname.match(/(?:item|i)(\d{8,})|\/(\d{8,})(?:\.html)?$/i);
  return pathId?.[1] || pathId?.[2] || "";
}

function buildTaobaoApiFetchUrls(itemId: string) {
  const encodedDetailData = encodeURIComponent(JSON.stringify({ itemNumId: itemId }));
  const encodedPcData = encodeURIComponent(JSON.stringify({ id: itemId }));
  return [
    `https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?jsv=2.7.4&appKey=12574478&t=${Date.now()}&sign=000000&api=mtop.taobao.detail.getdetail&v=6.0&type=json&dataType=json&data=${encodedDetailData}`,
    `https://h5api.m.taobao.com/h5/mtop.taobao.pcdetail.data.get/1.0/?jsv=2.7.4&appKey=12574478&t=${Date.now()}&sign=000000&api=mtop.taobao.pcdetail.data.get&v=1.0&type=json&dataType=json&data=${encodedPcData}`,
  ];
}

function buildFetchHeaders(candidateUrl: string) {
  const url = new URL(candidateUrl);
  const platform = detectProductPlatform(candidateUrl);
  const accept = url.pathname.includes("/h5/mtop.") || (platform === "shopee" && url.pathname.includes("/api/"))
    ? "application/json, text/plain, */*"
    : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";

  return {
    Accept: accept,
    "Accept-Encoding": "identity",
    "Accept-Language": platform === "taobao" ? "zh-CN,zh;q=0.9,en;q=0.8" : "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cache-Control": "no-cache",
    DNT: "1",
    Pragma: "no-cache",
    Priority: "u=0, i",
    Referer: platform === "taobao" ? "https://h5.m.taobao.com/" : `${url.origin}/`,
    "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    "Sec-Ch-Ua-Mobile": platform === "taobao" || platform === "shopee" || platform === "tiktok-shop" ? "?1" : "?0",
    "Sec-Ch-Ua-Platform": platform === "taobao" || platform === "shopee" || platform === "tiktok-shop" ? '"iOS"' : '"macOS"',
    "Sec-Fetch-Dest": url.pathname.includes("/api/") || url.pathname.includes("/h5/mtop.") ? "empty" : "document",
    "Sec-Fetch-Mode": url.pathname.includes("/api/") || url.pathname.includes("/h5/mtop.") ? "cors" : "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Upgrade-Insecure-Requests": url.pathname.includes("/api/") || url.pathname.includes("/h5/mtop.") ? "0" : "1",
    "User-Agent": getFetchUserAgent(candidateUrl),
  };
}

function extractShopeeProductIds(url: URL) {
  const path = decodeURIComponent(url.pathname);
  const pathMatch = path.match(/(?:-|\.)i\.(\d+)\.(\d+)(?:[/?#]|$)/i) || path.match(/\/(\d+)\/(\d+)(?:[/?#]|$)/);
  const shopId = url.searchParams.get("shopid") || url.searchParams.get("shop_id") || pathMatch?.[1] || "";
  const itemId = url.searchParams.get("itemid") || url.searchParams.get("item_id") || pathMatch?.[2] || "";

  return shopId && itemId ? { shopId, itemId } : null;
}

function getFetchUserAgent(candidateUrl: string) {
  const isMobilePreferred = /\/gp\/aw\/d\//i.test(candidateUrl) || /shopee|tiktok/i.test(candidateUrl);
  return isMobilePreferred
    ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
}

function isBlockedProductPage(html: string, candidateUrl = "") {
  const target = `${candidateUrl}\n${html.slice(0, 2000)}`;
  return /automated access to Amazon data|Robot Check|captcha|verify you are human|Access Denied|unusual traffic|sorry, you have been blocked|enable javascript and cookies|csrf token/i.test(target);
}

function shortenUrl(value: string) {
  return value.length > 140 ? `${value.slice(0, 137)}...` : value;
}

function isAmazonHost(hostname: string) {
  return /(^|\.)amazon\./i.test(hostname);
}

function extractAmazonAsin(url: URL) {
  const match = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/ASIN)\/([A-Z0-9]{10})(?:[/?#]|$)/i);
  return match?.[1]?.toUpperCase() || "";
}

function extractAmazonImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const seenColors = new Set<string>();

  const appendRepresentativeImage = (color: string, items: Array<Record<string, unknown>>) => {
    const normalizedColor = color.trim().toLowerCase();
    if (!normalizedColor || seenColors.has(normalizedColor)) return;

    const item = pickAmazonRepresentativeImageItem(items, baseUrl);
    if (!item) return;

    const imageUrl = pickAmazonImageUrl(item, baseUrl);
    if (!imageUrl) return;

    const altText = typeof item.altText === "string" && item.altText.trim() ? item.altText.trim() : "";
    images.push({ imageUrl, label: altText || `Amazon ${color} style image`, source: "amazon" });
    seenColors.add(normalizedColor);
  };

  for (const { color, items } of extractAmazonImageBlockGroups(html)) {
    appendRepresentativeImage(color, items);
  }

  for (const { color, items } of extractAmazonColorImageGroups(html)) {
    appendRepresentativeImage(color, items);
  }

  if (images.length > 0) return images;

  for (const jsonText of extractAmazonColorImagePayloads(html)) {
    try {
      const items = JSON.parse(jsonText) as Array<Record<string, unknown>>;
      appendRepresentativeImage("Product", items);
    } catch {
      continue;
    }
  }

  if (images.length > 0) return images;

  const dynamicImageRegex = /data-a-dynamic-image=(['"])(.*?)\1/gi;
  let match: RegExpExecArray | null;
  while ((match = dynamicImageRegex.exec(html))) {
    try {
      const data = JSON.parse(decodeHtml(match[2])) as Record<string, [number, number]>;
      const imageUrl = pickLargestAmazonDynamicImage(data, baseUrl);
      if (imageUrl) images.push({ imageUrl, label: "Amazon product image", source: "amazon" });
    } catch {
      continue;
    }
  }

  return images;
}

function pickAmazonRepresentativeImageItem(items: Array<Record<string, unknown>>, baseUrl: string) {
  const rankedVariants = ["MAIN", "PT01", "P01"];

  for (const variant of rankedVariants) {
    const matched = items.find((item) => item.variant === variant && pickAmazonImageUrl(item, baseUrl));
    if (matched) return matched;
  }

  return items.find((item) => Boolean(pickAmazonImageUrl(item, baseUrl)));
}

function extractAmazonColorImagePayloads(html: string) {
  const payloads: string[] = [];
  const regex = /'colorImages'\s*:\s*\{\s*'initial'\s*:\s*A\.\$\.parseJSON\('([\s\S]*?)'\)\s*[,}]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html))) {
    payloads.push(unescapeAmazonJsonString(match[1]));
  }
  return payloads;
}

function extractAmazonImageBlockGroups(html: string) {
  const groups: Array<{ color: string; items: Array<Record<string, unknown>> }> = [];
  const regex = /jQuery\.parseJSON\('([\s\S]*?)'\)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    try {
      const data = JSON.parse(unescapeAmazonJsonString(match[1])) as { colorImages?: Record<string, Array<Record<string, unknown>>> };
      if (!data.colorImages) continue;

      for (const [color, items] of Object.entries(data.colorImages)) {
        if (Array.isArray(items)) groups.push({ color, items });
      }
    } catch {
      continue;
    }
  }

  return groups;
}

function extractAmazonColorImageGroups(html: string) {
  const groups: Array<{ color: string; items: Array<Record<string, unknown>> }> = [];
  const marker = "colorImages =";
  let searchFrom = 0;

  while (true) {
    const markerIndex = html.indexOf(marker, searchFrom);
    if (markerIndex === -1) break;

    const objectStart = html.indexOf("{", markerIndex + marker.length);
    if (objectStart === -1) break;

    const objectText = readBalancedBlock(html, objectStart, "{", "}");
    if (!objectText) break;

    try {
      const data = JSON.parse(objectText) as Record<string, Array<Record<string, unknown>>>;
      for (const [color, items] of Object.entries(data)) {
        if (Array.isArray(items)) groups.push({ color, items });
      }
    } catch {
      // Continue scanning; Amazon can include multiple similarly named snippets.
    }

    searchFrom = objectStart + objectText.length;
  }

  return groups;
}

function readBalancedBlock(value: string, startIndex: number, open: string, close: string) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let i = startIndex; i < value.length; i += 1) {
    const char = value[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === open) depth += 1;
    if (char === close) depth -= 1;
    if (depth === 0) return value.slice(startIndex, i + 1);
  }

  return "";
}

function pickAmazonImageUrl(item: Record<string, unknown>, baseUrl: string) {
  const hiRes = typeof item.hiRes === "string" ? item.hiRes : "";
  if (hiRes) return absolutizeImageUrl(hiRes, baseUrl);

  if (item.main && typeof item.main === "object") {
    return pickLargestAmazonDynamicImage(item.main as Record<string, [number, number]>, baseUrl);
  }

  const large = typeof item.large === "string" ? item.large : "";
  return large ? normalizeAmazonImageSize(absolutizeImageUrl(large, baseUrl)) : "";
}

function pickLargestAmazonDynamicImage(images: Record<string, [number, number]>, baseUrl: string) {
  let bestUrl = "";
  let bestArea = 0;

  for (const [imageUrl, dimensions] of Object.entries(images)) {
    const [width, height] = Array.isArray(dimensions) ? dimensions : [0, 0];
    const area = Number(width || 0) * Number(height || 0);
    if (area > bestArea) {
      bestArea = area;
      bestUrl = imageUrl;
    }
  }

  return bestUrl ? normalizeAmazonImageSize(absolutizeImageUrl(bestUrl, baseUrl)) : "";
}

function normalizeAmazonImageSize(value: string) {
  return value.replace(/\._AC_[^./]+_\./, "._AC_SL1500_.");
}

function unescapeAmazonJsonString(value: string) {
  return decodeHtml(value)
    .replace(/\\'/g, "'")
    .replace(/\\\//g, "/")
    .replace(/\\n/g, "")
    .replace(/\\r/g, "")
    .replace(/\\t/g, "");
}

function extractEbayImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "ebay" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "ebay" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "ebay", isEbayImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "ebay", isEbayImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractEbayImagesFromUrl(productUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const match = productUrl.match(/[?&]hash=item[a-z0-9]+:g:([a-zA-Z0-9_-]+)/i);
  if (!match) return [];

  const imageUrl = `https://i.ebayimg.com/images/g/${match[1]}/s-l1600.jpg`;
  return [{ imageUrl, label: "eBay product image", source: "ebay" }];
}

function extractTemuImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractTemuImagesFromUrl(baseUrl),
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "temu" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "temu" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "temu", isTemuImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "temu", isTemuImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractTemuImagesFromUrl(productUrl: string): Omit<ExtractedProductGarment, "id">[] {
  try {
    const url = new URL(productUrl);
    const images = [
      url.searchParams.get("top_gallery_url"),
      ...String(url.searchParams.get("_oak_gallery_order") || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .map((id) => `https://img.kwcdn.com/product/fancy/${id}.jpg`),
    ];

    return images
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl && isTemuImageUrl(imageUrl)))
      .map((imageUrl) => ({ imageUrl, label: "Temu product image", source: "temu" as const }));
  } catch {
    return [];
  }
}

function extractAliExpressImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractPlatformImagesFromUrl(baseUrl, "aliexpress", isAliExpressImageUrl),
    ...extractShareCardImages(html, baseUrl, "aliexpress", isAliExpressImageUrl),
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "aliexpress" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "aliexpress" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "aliexpress", isAliExpressImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "aliexpress", isAliExpressImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractTaobaoImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractPlatformImagesFromUrl(baseUrl, "taobao", isTaobaoImageUrl),
    ...extractTaobaoApiImages(html, baseUrl),
    ...extractShareCardImages(html, baseUrl, "taobao", isTaobaoImageUrl),
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "taobao" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "taobao" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "taobao", isTaobaoImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "taobao", isTaobaoImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractTaobaoApiImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const text = stripJsonp(decodeHtml(html).trim());
  if (isTaobaoBlockedApiResponse(text)) return [];

  try {
    collectProductImagesFromJson(JSON.parse(text), baseUrl, "taobao", images, isTaobaoImageUrl);
  } catch {
    pushImagesFromLooseText(images, text, baseUrl, "taobao", isTaobaoImageUrl);
  }

  return images;
}

async function extractTaobaoApiImagesFromUrl(productUrl: string): Promise<Omit<ExtractedProductGarment, "id">[]> {
  try {
    const itemId = extractTaobaoItemId(new URL(productUrl));
    if (!itemId) return [];

    const detail = await fetchSignedTaobaoMtopImages("mtop.taobao.detail.getdetail", "6.0", { itemNumId: itemId }, productUrl);
    if (detail.length > 0) return detail;

    return fetchSignedTaobaoMtopImages("mtop.taobao.pcdetail.data.get", "1.0", { id: itemId }, productUrl);
  } catch {
    return [];
  }
}

async function fetchSignedTaobaoMtopImages(
  api: string,
  version: string,
  data: Record<string, string>,
  productUrl: string,
): Promise<Omit<ExtractedProductGarment, "id">[]> {
  const appKey = "12574478";
  const dataText = JSON.stringify(data);
  const unsignedUrl = buildTaobaoMtopUrl(api, version, appKey, Date.now().toString(), "000000", dataText);
  const first = await fetch(unsignedUrl, { headers: buildTaobaoApiHeaders() });
  const cookie = first.headers.get("set-cookie") || "";
  const token = cookie.match(/_m_h5_tk=([^_;]+)/)?.[1] || "";
  await first.text();
  if (!token) return [];

  const timestamp = Date.now().toString();
  const sign = createHash("md5").update(`${token}&${timestamp}&${appKey}&${dataText}`).digest("hex");
  const signedUrl = buildTaobaoMtopUrl(api, version, appKey, timestamp, sign, dataText);
  const response = await fetch(signedUrl, {
    headers: {
      ...buildTaobaoApiHeaders(),
      Cookie: cookie.split(",").map((part) => part.split(";")[0].trim()).filter(Boolean).join("; "),
    },
  });
  if (!response.ok) return [];

  const text = await response.text();
  if (isBlockedProductPage(text, signedUrl)) return [];

  return extractTaobaoApiImages(text, productUrl);
}

function buildTaobaoMtopUrl(api: string, version: string, appKey: string, timestamp: string, sign: string, dataText: string) {
  return `https://h5api.m.taobao.com/h5/${api}/${version}/?jsv=2.7.4&appKey=${appKey}&t=${timestamp}&sign=${sign}&api=${api}&v=${version}&type=json&dataType=json&data=${encodeURIComponent(dataText)}`;
}

function buildTaobaoApiHeaders() {
  return {
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "identity",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    Referer: "https://h5.m.taobao.com/",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  };
}

function stripJsonp(value: string) {
  const match = value.match(/^[\w$]+\(([^]*)\);?$/);
  return match ? match[1] : value;
}

function isTaobaoBlockedApiResponse(value: string) {
  return /RGV587_ERROR|____tmd_____|x5referer|login\.taobao\.com|令牌过期|FAIL_SYS_TOKEN/i.test(value);
}

function extractShareCardImages(
  html: string,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
) {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const decoded = decodeHtml(html);
  const patterns = [
    /["'](?:shareImg|shareImage|share_image|sharePic|share_pic|firstImg|firstImage|mainImage|mainPic|imagePath|imageUrl|imgUrl|picUrl|thumbnail|thumbnailUrl|productImage|productImages|gallery|skuImage)["']\s*[:=]\s*["']([^"']+)["']/gi,
    /(?:shareImg|shareImage|share_image|sharePic|share_pic|firstImg|firstImage|mainImage|mainPic|imagePath|imageUrl|imgUrl|picUrl|thumbnail|thumbnailUrl|productImage|skuImage)=([^&"'<>\s]+)/gi,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(decoded))) {
      pushCandidateImage(images, match[1], baseUrl, source, accepts, "Shared product image");
    }
  }

  return images;
}

function extractPlatformImagesFromUrl(
  productUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
): Omit<ExtractedProductGarment, "id">[] {
  try {
    const images: Omit<ExtractedProductGarment, "id">[] = [];
    const url = new URL(productUrl);
    const keys = [
      "image",
      "img",
      "pic",
      "picture",
      "photo",
      "thumbnail",
      "thumb",
      "cover",
      "mainImage",
      "mainPic",
      "shareImage",
      "shareImg",
      "firstImg",
      "top_gallery_url",
    ];

    for (const key of keys) {
      const value = url.searchParams.get(key);
      if (value) pushCandidateImage(images, value, productUrl, source, accepts, "Product image from link");
    }

    const encodedParams = ["utparam", "utparam-url", "pdp_ext_f", "x_object_id"];
    for (const key of encodedParams) {
      const value = url.searchParams.get(key);
      if (!value) continue;
      pushImagesFromLooseText(images, value, productUrl, source, accepts);
      try {
        pushImagesFromLooseText(images, decodeURIComponent(value), productUrl, source, accepts);
      } catch {
        // Ignore malformed encoded query fragments.
      }
    }

    return dedupeImages(images);
  } catch {
    return [];
  }
}

function pushImagesFromLooseText(
  images: Omit<ExtractedProductGarment, "id">[],
  value: string,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
) {
  const decoded = decodeHtml(value).replace(/\\\//g, "/");
  const regex = /(?:https?:)?\/\/[^\s"'<>\\]+?(?:png|jpe?g|webp|avif)(?:\?[^\s"'<>\\]*)?|(?:https?:)?\/\/(?:[^\s"'<>\\]+?)(?:alicdn\.com|tbcdn\.cn|taobaocdn\.com|aliexpress-media\.com)[^\s"'<>\\]*/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(decoded))) {
    pushCandidateImage(images, match[0], baseUrl, source, accepts, "Product image from link");
  }
}

function pushCandidateImage(
  images: Omit<ExtractedProductGarment, "id">[],
  rawValue: string,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
  label: string,
) {
  const candidates = normalizeImageCandidates(rawValue);
  for (const candidate of candidates) {
    try {
      const imageUrl = absolutizeImageUrl(candidate, baseUrl);
      if (accepts(imageUrl)) images.push({ imageUrl, label, source });
    } catch {
      continue;
    }
  }
}

function normalizeImageCandidates(value: string) {
  const cleaned = decodeHtml(value)
    .trim()
    .replace(/\\\//g, "/")
    .replace(/^['"]+|['";,]+$/g, "");
  if (!cleaned || cleaned.startsWith("data:")) return [];

  const values = new Set<string>([cleaned]);
  try {
    values.add(decodeURIComponent(cleaned));
  } catch {
    // Keep original value when it is not URI encoded.
  }

  return Array.from(values).flatMap((item) => {
    const normalized = item.startsWith("//") ? `https:${item}` : item;
    return [normalized, normalized.replace(/_(?:\d+x\d+q\d+|\d+x\d+|\d+x\d+q\d+_?\.webp|\d+x\d+_?\.webp)$/i, "")];
  });
}

function extractTikTokShopImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "tiktok-shop" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "tiktok-shop" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "tiktok-shop", isTikTokShopImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "tiktok-shop", isTikTokShopImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractShopeeImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  return dedupeImages([
    ...extractShopeeApiImages(html, baseUrl),
    ...extractMetaImages(html, baseUrl).map((item) => ({ ...item, source: "shopee" as const })),
    ...extractJsonLdImages(html, baseUrl).map((item) => ({ ...item, source: "shopee" as const })),
    ...extractImagesFromJsonScripts(html, baseUrl, "shopee", isShopeeImageUrl),
    ...extractImageUrlsByRegex(html, baseUrl, "shopee", isShopeeImageUrl),
  ]).slice(0, MAX_IMAGES);
}

function extractShopeeApiImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  try {
    const data = JSON.parse(html) as unknown;
    const imageIds = new Set<string>();
    collectShopeeImageIds(data, imageIds);
    return Array.from(imageIds).map((imageId) => ({
      imageUrl: buildShopeeImageUrl(imageId, baseUrl),
      label: "Shopee product image",
      source: "shopee" as const,
    }));
  } catch {
    return [];
  }
}

function collectShopeeImageIds(value: unknown, imageIds: Set<string>) {
  if (!value) return;

  if (typeof value === "string") {
    const imageId = normalizeShopeeImageId(value);
    if (imageId) imageIds.add(imageId);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectShopeeImageIds(item, imageIds));
    return;
  }

  if (typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  for (const [key, item] of Object.entries(record)) {
    if (/image|img|thumbnail|cover|picture|photo|media/i.test(key)) collectShopeeImageIds(item, imageIds);
  }
}

function normalizeShopeeImageId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/(?:https?:\/\/[^\s"'<>]+\/file\/)?([a-f0-9]{32,}|sg-111342\d{2}-[a-z0-9-]+)/i);
  return match?.[1] || "";
}

function isShopeeImageId(value: string) {
  return Boolean(normalizeShopeeImageId(value));
}

function buildShopeeImageUrl(imageId: string, baseUrl: string) {
  const region = getShopeeImageRegion(baseUrl);
  return `https://down-${region}.img.susercontent.com/file/${imageId}`;
}

function getShopeeImageRegion(baseUrl: string) {
  try {
    const hostname = new URL(baseUrl).hostname;
    if (/shopee\.sg$/i.test(hostname)) return "sg";
    if (/shopee\.com\.my$/i.test(hostname)) return "my";
    if (/shopee\.co\.th$/i.test(hostname)) return "th";
    if (/shopee\.co\.id$/i.test(hostname)) return "id";
    if (/shopee\.ph$/i.test(hostname)) return "ph";
    if (/shopee\.vn$/i.test(hostname)) return "vn";
    if (/shopee\.tw$/i.test(hostname)) return "tw";
    if (/shopee\.com\.br$/i.test(hostname)) return "br";
  } catch {
    // Use Singapore CDN as a common fallback.
  }

  return "sg";
}

function extractImagesFromJsonScripts(
  html: string,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
) {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html))) {
    const script = decodeHtml(match[1]).trim();
    const jsonTexts = extractEmbeddedJsonTexts(script);

    for (const jsonText of jsonTexts) {
      try {
        collectProductImagesFromJson(JSON.parse(jsonText), baseUrl, source, images, accepts);
      } catch {
        continue;
      }
    }
  }

  return images;
}

function extractEmbeddedJsonTexts(script: string) {
  const jsonTexts: string[] = [];
  const trimmed = script.trim();

  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    jsonTexts.push(trimmed);
  }

  const assignmentRegex = /(?:window\.)?(?:__INITIAL_STATE__|__NEXT_DATA__|__NUXT__|SIGI_STATE|__APOLLO_STATE__|__PRODUCT_DETAIL__|__data)\s*=\s*({[\s\S]*?})(?:;|<\/script>|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = assignmentRegex.exec(script))) {
    jsonTexts.push(match[1]);
  }

  return jsonTexts;
}

function collectProductImagesFromJson(
  value: unknown,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  images: Omit<ExtractedProductGarment, "id">[],
  accepts: (imageUrl: string) => boolean,
) {
  if (!value) return;

  if (typeof value === "string") {
    if (looksLikeImage(value)) {
      const imageUrl = absolutizeImageUrl(value, baseUrl);
      if (accepts(imageUrl)) images.push({ imageUrl, label: "Product image", source });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectProductImagesFromJson(item, baseUrl, source, images, accepts));
    return;
  }

  if (typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  for (const [key, item] of Object.entries(record)) {
    if (/image|img|picture|photo|thumbnail|gallery|media|cover|url/i.test(key)) {
      collectProductImagesFromJson(item, baseUrl, source, images, accepts);
    } else if (typeof item === "object" && item) {
      collectProductImagesFromJson(item, baseUrl, source, images, accepts);
    }
  }
}

function extractImageUrlsByRegex(
  html: string,
  baseUrl: string,
  source: ExtractedProductGarment["source"],
  accepts: (imageUrl: string) => boolean,
) {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const regex = /https?:\\?\/\\?\/[^\s"'<>\\]+?(?:png|jpe?g|webp|avif)(?:\?[^\s"'<>\\]*)?|https?:\\?\/\\?\/(?:[^\s"'<>\\]+?)(?:alicdn\.com|tbcdn\.cn|taobaocdn\.com|aliexpress-media\.com)[^\s"'<>\\]*/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const raw = match[0].replace(/\\\//g, "/");
    const imageUrl = absolutizeImageUrl(raw, baseUrl);
    if (accepts(imageUrl)) images.push({ imageUrl, label: "Product image", source });
  }

  return images;
}

function isEbayImageUrl(imageUrl: string) {
  return /i\.ebayimg\.com|ir\.ebaystatic\.com/i.test(imageUrl) && !/s-l(?:64|96|140|160)\./i.test(imageUrl);
}

function isTikTokShopImageUrl(imageUrl: string) {
  return /tiktok|byteimg|ibyteimg|muscdn|p16-/i.test(imageUrl) && !/avatar|logo|icon|sprite/i.test(imageUrl);
}

function isShopeeImageUrl(imageUrl: string) {
  return /shopee|susercontent|cf\.shopee/i.test(imageUrl) && !/avatar|logo|icon|sprite/i.test(imageUrl);
}

function isTemuImageUrl(imageUrl: string) {
  return /img\.kwcdn\.com|temu/i.test(imageUrl) && !/avatar|logo|icon|sprite|badge|payment/i.test(imageUrl);
}

function isAliExpressImageUrl(imageUrl: string) {
  return /alicdn\.com|aliexpress-media\.com|ae01\.alicdn\.com|ae-pic-a1\.alicdn\.com/i.test(imageUrl) && /\/kf\/|\/productf\/|\/bao\/|\/img\//i.test(imageUrl) && !/avatar|logo|icon|sprite|badge|payment|store|seller|\.js(?:\?|$)|\.css(?:\?|$)/i.test(imageUrl);
}

function isTaobaoImageUrl(imageUrl: string) {
  return /(?:img|gw)\.alicdn\.com|tbcdn\.cn|taobaocdn\.com/i.test(imageUrl) && /\/imgextra\/|\/bao\/uploaded|\/i\d+\//i.test(imageUrl) && !/gtms\d*\.alicdn\.com|\/tps\/|avatar|logo|icon|sprite|badge|payment|shop|seller|\.js(?:\?|$)|\.css(?:\?|$)/i.test(imageUrl);
}

function extractMetaImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const regex = /<meta\s+[^>]*(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*>/gi;
  for (const tag of html.match(regex) || []) {
    const content = getAttribute(tag, "content");
    if (content) images.push({ imageUrl: absolutizeImageUrl(content, baseUrl), label: "Main product image", source: "meta" });
  }
  return images;
}

function extractJsonLdImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const jsonText = decodeHtml(match[1]).trim();
    try {
      const data = JSON.parse(jsonText);
      collectJsonImages(data, baseUrl, images);
    } catch {
      continue;
    }
  }

  return images;
}

function collectJsonImages(value: unknown, baseUrl: string, images: Omit<ExtractedProductGarment, "id">[]) {
  if (!value) return;

  if (typeof value === "string") {
    if (looksLikeImage(value)) images.push({ imageUrl: absolutizeImageUrl(value, baseUrl), label: "Structured product image", source: "json-ld" });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonImages(item, baseUrl, images));
    return;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.image) collectJsonImages(record.image, baseUrl, images);
    if (record.thumbnailUrl) collectJsonImages(record.thumbnailUrl, baseUrl, images);
    if (record.offers) collectJsonImages(record.offers, baseUrl, images);
    if (record.hasVariant) collectJsonImages(record.hasVariant, baseUrl, images);
  }
}

function extractHtmlImages(html: string, baseUrl: string): Omit<ExtractedProductGarment, "id">[] {
  const images: Omit<ExtractedProductGarment, "id">[] = [];
  const regex = /<(?:img|source)\s+[^>]*>/gi;

  for (const tag of html.match(regex) || []) {
    const source = getAttribute(tag, "data-zoom-image") || getAttribute(tag, "data-src") || getAttribute(tag, "data-original") || getAttribute(tag, "src") || firstFromSrcSet(getAttribute(tag, "srcset"));
    if (!source) continue;

    const width = Number(getAttribute(tag, "width") || 0);
    const height = Number(getAttribute(tag, "height") || 0);
    const alt = getAttribute(tag, "alt") || getAttribute(tag, "title") || "Product image";

    if ((width && width < MIN_IMAGE_SIZE_HINT) || (height && height < MIN_IMAGE_SIZE_HINT)) continue;

    images.push({ imageUrl: absolutizeImageUrl(source, baseUrl), label: alt.slice(0, 80), source: "html" });
  }

  return images;
}

function dedupeImages(items: Omit<ExtractedProductGarment, "id">[]) {
  const seen = new Set<string>();
  const result: Omit<ExtractedProductGarment, "id">[] = [];

  for (const item of items) {
    const normalized = normalizeImageForDedupe(item.imageUrl);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(item);
  }

  return result;
}

function getAttribute(tag: string, name: string) {
  const regex = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i");
  const match = tag.match(regex);
  return match ? decodeHtml(match[2]) : "";
}

function firstFromSrcSet(value: string) {
  if (!value) return "";
  return value.split(",").map((item) => item.trim().split(/\s+/)[0]).filter(Boolean).pop() || "";
}

function absolutizeImageUrl(value: string, baseUrl: string) {
  const cleaned = decodeHtml(value).trim();
  return new URL(cleaned, baseUrl).toString();
}

function looksLikeImage(value: string) {
  return IMAGE_EXTENSIONS.test(value) || /^https?:\/\/[^\s]+/i.test(value);
}

function isLikelyProductImage(value: string) {
  if (!value || BLOCKED_PATTERNS.test(value)) return false;
  if (/%22|%27|["']|\+image\+|\+firstImg\+/i.test(value)) return false;
  if (/gtms\d*\.alicdn\.com|\/tps\//i.test(value)) return false;
  return IMAGE_EXTENSIONS.test(value) || /image|img|photo|product|media|cdn/i.test(value);
}

function normalizeImageForDedupe(value: string) {
  try {
    const url = new URL(value);
    ["width", "height", "w", "h", "size", "quality", "q", "format", "fit", "crop"].forEach((key) => url.searchParams.delete(key));
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return value;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
