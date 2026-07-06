const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB per image
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validatePhotoDataUrls(urls: string[]): { ok: true } | { ok: false; error: string } {
  if (urls.length > 2) {
    return { ok: false, error: "Maximum 2 photos allowed" };
  }

  for (const url of urls) {
    if (!url.startsWith("data:image/")) {
      return { ok: false, error: "Photos must be image files" };
    }

    const match = url.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
    if (!match) {
      return { ok: false, error: "Invalid photo format" };
    }

    const mime = match[1].toLowerCase();
    if (!ALLOWED_MIME.has(mime)) {
      return { ok: false, error: "Only JPEG, PNG, WebP, or GIF images are allowed" };
    }

    const base64 = match[2];
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const bytes = Math.floor((base64.length * 3) / 4) - padding;
    if (bytes > MAX_PHOTO_BYTES) {
      return { ok: false, error: "Each photo must be under 2 MB" };
    }
  }

  return { ok: true };
}
