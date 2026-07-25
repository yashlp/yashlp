"use client";

import { cn } from "@/lib/utils";

type OnlyAestheticMarkProps = {
  className?: string;
  /** ink on light bg (default) or white on dark footer */
  tone?: "ink" | "light";
  title?: string;
};

/**
 * Only Aesthetic wordmark — "oa." script + ONLY AESTHETIC + taglines.
 * Transparent PNG so it blends on cream or dark surfaces.
 */
export function OnlyAestheticMark({
  className,
  tone = "ink",
  title = "Only Aesthetic",
}: OnlyAestheticMarkProps) {
  const src =
    tone === "light"
      ? "/brand/only-aesthetic-logo-light.png?v=oa2"
      : "/brand/only-aesthetic-logo.png?v=oa2";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      width={1024}
      height={1024}
      className={cn("oa-mark block h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
