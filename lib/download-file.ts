type SaveFilePickerWindow = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: Blob) => Promise<void>;
      close: () => Promise<void>;
    }>;
  }>;
};

function filenameFromUrl(url: string, fallbackName: string) {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const name = decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "");
    if (name.includes(".")) return name;
  } catch {
    // Ignore malformed URLs and use the fallback name.
  }

  return fallbackName.includes(".") ? fallbackName : `${fallbackName}.png`;
}

function extensionFromFilename(filename: string) {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] || ".png";
}

function mimeTypeFromFilename(filename: string) {
  const extension = extensionFromFilename(filename);
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".mp4") return "video/mp4";
  if (extension === ".webm") return "video/webm";
  return "image/png";
}

async function fetchMediaBlob(url: string) {
  try {
    const response = await fetch(url, { mode: "cors", credentials: "omit" });
    if (response.ok) return await response.blob();
  } catch {
    // Cross-origin assets often block this request; fall back to the same-origin proxy.
  }

  const response = await fetch(`/api/download-media?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Unable to download this image.");
  }

  return await response.blob();
}

async function saveBlob(blob: Blob, filename: string) {
  const mimeType = blob.type || mimeTypeFromFilename(filename);
  const picker = (window as SaveFilePickerWindow).showSaveFilePicker;

  if (typeof picker === "function") {
    try {
      const handle = await picker({
        suggestedName: filename,
        types: [
          {
            description: "Image",
            accept: { [mimeType]: [extensionFromFilename(filename)] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function downloadMediaFile(url: string, fallbackName: string) {
  const filename = filenameFromUrl(url, fallbackName);
  const blob = await fetchMediaBlob(url);
  await saveBlob(blob, filename);
}
