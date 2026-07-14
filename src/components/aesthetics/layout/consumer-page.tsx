import { cn } from "@/lib/utils";
import { ConsumerNav } from "./consumer-nav";
import { ConsumerFooter } from "./consumer-footer";

/**
 * Inner storefront pages — same colour palette as the homepage
 * (cream site gradient + blush / lavender / peach / sand washes).
 */
export type PageTint =
  | "base"
  | "blush"
  | "lavender"
  | "peach"
  | "sand"
  | "warm"
  | "testimonial"
  | "bundle"
  | "ivory"
  | "editorial"
  | "calm";

/** Alias for call sites that still pass `room=` */
export type GalleryRoom = PageTint;

const TINT_CLASS: Record<string, string> = {
  base: "aes-site-bg",
  ivory: "aes-site-bg",
  calm: "aes-site-bg",
  blush: "aes-bg-blush",
  lavender: "aes-bg-lavender",
  editorial: "aes-bg-lavender",
  peach: "aes-bg-peach",
  warm: "aes-bg-warm",
  sand: "aes-bg-sand",
  testimonial: "aes-bg-testimonial",
  bundle: "aes-bg-bundle",
};

type ConsumerPageProps = {
  children: React.ReactNode;
  cartCount?: number;
  tint?: PageTint;
  room?: PageTint;
  className?: string;
};

export function ConsumerPage({
  children,
  cartCount,
  tint = "base",
  room,
  className,
}: ConsumerPageProps) {
  const surface = room ?? tint;
  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <div className={cn("min-h-[50vh] text-[var(--aes-ink)]", TINT_CLASS[surface] || TINT_CLASS.base, className)}>
        {children}
      </div>
      <ConsumerFooter />
    </>
  );
}
