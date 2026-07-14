import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

export const COMMERCE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "commerce");
export const COMMERCE_UPLOAD_PUBLIC = "/uploads/commerce";

const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

export function mediaKind(mime: string): "IMAGE" | "VIDEO" | null {
  if (IMAGE_TYPES.has(mime)) return "IMAGE";
  if (VIDEO_TYPES.has(mime)) return "VIDEO";
  return null;
}

function extFor(mime: string, fallbackName: string): string {
  const fromName = path.extname(fallbackName).replace(".", "").toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "video/mp4") return "mp4";
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  return "bin";
}

/** Persist an uploaded file and return a public URL. Prefer Vercel Blob when configured. */
export async function saveCommerceUpload(file: File): Promise<{ url: string; type: "IMAGE" | "VIDEO" }> {
  const type = mediaKind(file.type);
  if (!type) {
    throw new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, or WebM.");
  }
  if (type === "IMAGE" && file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 8MB or smaller.");
  }
  if (type === "VIDEO" && file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video must be 40MB or smaller.");
  }

  const ext = extFor(file.type, file.name);
  const filename = `commerce/${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || undefined,
    });
    return { url: blob.url, type };
  }

  await mkdir(COMMERCE_UPLOAD_DIR, { recursive: true });
  const localName = `${randomUUID()}.${ext}`;
  const abs = path.join(COMMERCE_UPLOAD_DIR, localName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, buffer);
  return { url: `${COMMERCE_UPLOAD_PUBLIC}/${localName}`, type };
}

export function isAllowedMediaUrl(url: string): boolean {
  if (!url || url.length > 2_000_000) return false;
  if (url.startsWith("/uploads/commerce/")) return true;
  if (url.startsWith("https://") || url.startsWith("http://")) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  if (url.startsWith("data:image/")) return true;
  return false;
}
