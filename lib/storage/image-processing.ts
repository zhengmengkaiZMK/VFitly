export type ImageInput = { buffer: Buffer; mimeType: string };
type ImageFormat = "image/png" | "image/webp";
type ImagesBinding = {
  input: (stream: ReadableStream<Uint8Array>) => {
    transform: (options: { width?: number; fit?: "scale-down" }) => {
      output: (options: { format: ImageFormat; quality?: number }) => Promise<{ response: () => Response }>;
    };
  };
};

function imagesBinding(): ImagesBinding | undefined {
  // OpenNext installs the Cloudflare request context on the global scope. Avoid
  // calling getCloudflareContext during static generation or ordinary Node builds.
  const context = (globalThis as typeof globalThis & {
    [key: symbol]: { env?: { IMAGES?: ImagesBinding } } | undefined;
  })[Symbol.for("__cloudflare-context__")];
  return context?.env?.IMAGES;
}

export function imageMimeType(buffer: Buffer, hintedType?: string): string {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "image/jpeg";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (buffer.length >= 6 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) return "image/gif";
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp" && /^(avif|avis)$/.test(buffer.toString("ascii", 8, 12))) return "image/avif";
  const prefix = buffer.toString("utf8", 0, Math.min(buffer.length, 512)).trimStart();
  if (/^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(prefix)) return "image/svg+xml";
  // Never trust a remote Content-Type enough to relabel unsupported bytes.
  throw new Error(`Unsupported image format${hintedType ? ` (${hintedType})` : ""}. Please use a PNG, JPEG, WebP, GIF or AVIF image.`);
}

export function imageInput(buffer: Buffer, hintedType?: string): ImageInput {
  return { buffer, mimeType: imageMimeType(buffer, hintedType) };
}

export async function convertImage(input: ImageInput, format: ImageFormat, width?: number, quality?: number): Promise<ImageInput> {
  const binding = imagesBinding();
  if (binding) {
    const stream = new Blob([new Uint8Array(input.buffer)]).stream();
    const output = await binding.input(stream).transform(width ? { width, fit: "scale-down" } : {}).output({ format, ...(quality ? { quality } : {}) });
    const response = output.response();
    if (!response.ok) throw new Error(`Image conversion failed (${response.status}).`);
    return { buffer: Buffer.from(await response.arrayBuffer()), mimeType: format };
  }

  // Local Next.js/Node.js keeps its existing image processing behavior. The
  // native package is never loaded on the Cloudflare request path.
  const { default: sharp } = await import("sharp");
  const pipeline = sharp(input.buffer, { limitInputPixels: 25000000 }).rotate();
  if (width) pipeline.resize({ width, withoutEnlargement: true });
  const buffer = format === "image/png"
    ? await pipeline.png().toBuffer()
    : await pipeline.webp({ quality: quality ?? 85 }).toBuffer();
  return { buffer, mimeType: format };
}

export function imageFile(input: ImageInput, name: string): File {
  const extension = input.mimeType === "image/png" ? "png" : input.mimeType === "image/jpeg" ? "jpg" : input.mimeType === "image/webp" ? "webp" : input.mimeType === "image/gif" ? "gif" : "avif";
  return new File([new Uint8Array(input.buffer)], `${name}.${extension}`, { type: input.mimeType });
}
