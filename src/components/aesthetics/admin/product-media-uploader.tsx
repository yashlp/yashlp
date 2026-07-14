"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { compressImageFile } from "@/lib/image-compress";
import { cn } from "@/lib/utils";

export type ProductMediaValue = {
  images: string[];
  videos: string[];
};

type Props = {
  value: ProductMediaValue;
  onChange: (next: ProductMediaValue) => void;
  minImages?: number;
  maxImages?: number;
  maxVideos?: number;
  disabled?: boolean;
};

async function uploadFile(file: File): Promise<{ url: string; type: "IMAGE" | "VIDEO" }> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data as { url: string; type: "IMAGE" | "VIDEO" };
}

export function ProductMediaUploader({
  value,
  onChange,
  minImages = 2,
  maxImages = 4,
  maxVideos = 1,
  disabled,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canAddImage = value.images.length < maxImages;
  const canAddVideo = value.videos.length < maxVideos;

  async function handleImages(files: FileList | null) {
    if (!files?.length || disabled) return;
    setError("");
    setBusy(true);
    try {
      const remaining = maxImages - value.images.length;
      const picked = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const file of picked) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are allowed in the photo slots.");
        }
        // Compress first for faster upload; fall back to original file
        try {
          const dataUrl = await compressImageFile(file, 1400, 0.84);
          const blob = await (await fetch(dataUrl)).blob();
          const compressed = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
            type: "image/jpeg",
          });
          const { url } = await uploadFile(compressed);
          uploaded.push(url);
        } catch {
          const { url } = await uploadFile(file);
          uploaded.push(url);
        }
      }
      onChange({ ...value, images: [...value.images, ...uploaded] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setBusy(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  async function handleVideo(files: FileList | null) {
    if (!files?.length || disabled) return;
    setError("");
    setBusy(true);
    try {
      const file = files[0];
      if (!file.type.startsWith("video/")) {
        throw new Error("Only MP4 / WebM / MOV videos are allowed.");
      }
      const { url, type } = await uploadFile(file);
      if (type !== "VIDEO") throw new Error("Expected a video file.");
      onChange({ ...value, videos: [url] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setBusy(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange({
      ...value,
      images: value.images.filter((_, i) => i !== index),
    });
  }

  function removeVideo() {
    onChange({ ...value, videos: [] });
  }

  const imagesOk = value.images.length >= minImages;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--aes-charcoal)]">
            Product photos
            <span className="ml-2 text-xs font-normal text-[var(--aes-charcoal-muted)]">
              {value.images.length}/{maxImages} · min {minImages} required
            </span>
          </p>
          <button
            type="button"
            disabled={disabled || busy || !canAddImage}
            onClick={() => imageInputRef.current?.click()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--aes-border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--aes-ink)] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Upload photos
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleImages(e.target.files)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--aes-border)] bg-[var(--aes-ivory)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Product ${i + 1}`} className="h-full w-full object-cover" />
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {i === 0 ? "Cover" : `#${i + 1}`}
              </span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                disabled={disabled || busy}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--aes-ink)] shadow"
                aria-label="Remove photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {canAddImage &&
            Array.from({ length: Math.min(2, maxImages - value.images.length) }).map((_, i) => (
              <button
                key={`empty-${i}`}
                type="button"
                disabled={disabled || busy}
                onClick={() => imageInputRef.current?.click()}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--aes-border)] bg-white/60 text-[var(--aes-charcoal-muted)]",
                  !imagesOk && value.images.length < minImages && "border-amber-400/70"
                )}
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add photo</span>
              </button>
            ))}
        </div>
        {!imagesOk && (
          <p className="mt-2 text-xs text-amber-700">
            Upload at least {minImages} photos before saving.
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--aes-charcoal)]">
            Product video
            <span className="ml-2 text-xs font-normal text-[var(--aes-charcoal-muted)]">
              optional · max {maxVideos}
            </span>
          </p>
          <button
            type="button"
            disabled={disabled || busy || !canAddVideo}
            onClick={() => videoInputRef.current?.click()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--aes-border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--aes-ink)] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {value.videos[0] ? "Replace video" : "Upload video"}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => handleVideo(e.target.files)}
          />
        </div>

        {value.videos[0] ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--aes-border)] bg-black">
            <video src={value.videos[0]} controls className="max-h-56 w-full" preload="metadata" />
            <button
              type="button"
              onClick={removeVideo}
              disabled={disabled || busy}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--aes-ink)] shadow"
              aria-label="Remove video"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => videoInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--aes-border)] bg-white/60 px-4 py-8 text-sm text-[var(--aes-charcoal-muted)]"
          >
            <Video className="h-5 w-5" />
            MP4 / WebM up to 40MB
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
