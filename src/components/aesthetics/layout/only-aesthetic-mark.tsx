"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type OnlyAestheticMarkProps = {
  className?: string;
  /** ink on light bg (default) or white on dark footer */
  tone?: "ink" | "light";
  title?: string;
};

/**
 * Circular seal logo — transparent background.
 * Ink (#121212) + luxury gold (#b58e4a / --aes-luxury) to blend with cream / dark surfaces.
 */
export function OnlyAestheticMark({
  className,
  tone = "ink",
  title = "Only Aesthetic",
}: OnlyAestheticMarkProps) {
  const uid = useId().replace(/:/g, "");
  const topId = `oaTop-${uid}`;
  const bottomId = `oaBot-${uid}`;
  const ink = tone === "light" ? "#ffffff" : "#121212";
  const accent = "#b58e4a";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 520"
      className={cn("oa-mark block h-auto w-full", className)}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <path id={topId} d="M 78 260 A 182 182 0 0 1 442 260" />
        <path id={bottomId} d="M 78 260 A 182 182 0 0 0 442 260" />
      </defs>

      <g fill={ink}>
        <text
          fontFamily="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
          fontSize="17"
          fontWeight={500}
          letterSpacing="0.32em"
          textAnchor="middle"
        >
          <textPath href={`#${topId}`} startOffset="50%">
            CURATED OBJECTS
          </textPath>
        </text>

        <text
          fontFamily="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
          fontSize="17"
          fontWeight={500}
          letterSpacing="0.26em"
          textAnchor="middle"
        >
          <textPath href={`#${bottomId}`} startOffset="50%">
            INTENTIONAL LIVING
          </textPath>
        </text>

        <circle cx="78" cy="260" r="3.5" />
        <circle cx="442" cy="260" r="3.5" />

        <text
          x="260"
          y="268"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', 'Bodoni MT', Didot, serif"
          fontSize="40"
          fontWeight={400}
          letterSpacing="0.02em"
        >
          only aesthetic
        </text>
      </g>

      <g fill={accent}>
        <path d="M260 148 L266.8 178.5 L298 185 L266.8 191.5 L260 222 L253.2 191.5 L222 185 L253.2 178.5 Z" />
        <rect x="258.5" y="292" width="3" height="36" rx="1.5" />
      </g>
    </svg>
  );
}
