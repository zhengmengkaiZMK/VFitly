/**
 * 文章地址（slug）处理工具，前后端共用。
 *
 * 目标：后台只填标题时，链接自动跟随标题，避免出现 none 这类无意义地址。
 */

/** 这些写法只代表“我没填”，不是真正的文章地址。 */
const placeholderSlugs = new Set(["none", "null", "undefined", "nil", "na", "n/a"]);

/**
 * 把标题、完整 URL 或手写 slug 统一转换成合法的单段路径：
 * 中文保留、大写转小写、空格与标点转连字符、去掉首尾连字符。
 */
export function normalizeBlogSlug(input: string, maxLength = 180): string {
  let value = String(input ?? "").trim();

  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname.split("/").filter(Boolean).pop() || "";
    } catch {
      return "";
    }
  }

  try {
    value = decodeURIComponent(value);
  } catch {
    // 不是合法百分号编码时按原样处理。
  }

  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLength)
    .replace(/^-+|-+$/g, "");
}

/** 判断是否为空白或占位写法。 */
export function isPlaceholderBlogSlug(slug: string): boolean {
  return !slug || placeholderSlugs.has(slug);
}

/** 用标题生成文章地址，标题没有可用字符时退回日期。 */
export function blogSlugFromTitle(title: string, now: Date = new Date()): string {
  return normalizeBlogSlug(title) || `article-${now.toISOString().slice(0, 10)}`;
}
