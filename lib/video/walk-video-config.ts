export type WalkVideoConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export const walkVideoPrompt =
  "Use the Final try-on result image as the only visual reference to generate a fashion runway walking video. The person should complete a smooth 360-degree turn with natural walking motion. The person should not smile. The clothing material, color, silhouette, patterns, accessories, and all garment details must remain highly consistent with the input image, with no changes to the outfit design.";

export function getWalkVideoConfig(): WalkVideoConfig {
  const apiKey = process.env.WALK_VIDEO_API_KEY;
  const baseUrl = normalizeBaseUrl(process.env.WALK_VIDEO_BASE_URL);
  const model = process.env.WALK_VIDEO_MODEL || "grok-imagine-1.5";

  if (!apiKey || !baseUrl) {
    throw new Error("Walk video generation is not configured. Please set WALK_VIDEO_API_KEY and WALK_VIDEO_BASE_URL.");
  }

  return {
    apiKey,
    baseUrl,
    model,
  };
}

function normalizeBaseUrl(value?: string) {
  const baseUrl = value?.trim().replace(/^['\"]|['\"]$/g, "").replace(/\/+$/, "");
  if (!baseUrl) return "";

  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}
