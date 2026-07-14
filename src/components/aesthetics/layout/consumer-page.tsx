import { cn } from "@/lib/utils";
import { ConsumerNav } from "./consumer-nav";
import { ConsumerFooter } from "./consumer-footer";

/**
 * Gallery rooms — complementary ivory/warm surfaces that extend the homepage brand.
 * Homepage must NOT use ConsumerPage (it renders its own hero palette).
 */
export type GalleryRoom =
  | "ivory"
  | "warm"
  | "editorial"
  | "calm";

/** @deprecated Use GalleryRoom — kept for call-site compatibility */
export type PageTint =
  | GalleryRoom
  | "base"
  | "blush"
  | "lavender"
  | "peach"
  | "sand"
  | "warm"
  | "testimonial"
  | "bundle";

const ROOM_CLASS: Record<string, string> = {
  ivory: "aes-gallery-room aes-gallery-room--ivory",
  warm: "aes-gallery-room aes-gallery-room--warm",
  editorial: "aes-gallery-room aes-gallery-room--editorial",
  calm: "aes-gallery-room aes-gallery-room--ivory",
  // legacy tints → map into gallery rooms (never reintroduce bright homepage washes on room pages)
  base: "aes-gallery-room aes-gallery-room--ivory",
  blush: "aes-gallery-room aes-gallery-room--ivory",
  lavender: "aes-gallery-room aes-gallery-room--editorial",
  peach: "aes-gallery-room aes-gallery-room--warm",
  sand: "aes-gallery-room aes-gallery-room--warm",
  testimonial: "aes-gallery-room aes-gallery-room--warm",
  bundle: "aes-gallery-room aes-gallery-room--editorial",
};

type ConsumerPageProps = {
  children: React.ReactNode;
  cartCount?: number;
  tint?: PageTint;
  room?: GalleryRoom;
  className?: string;
};

export function ConsumerPage({
  children,
  cartCount,
  tint = "ivory",
  room,
  className,
}: ConsumerPageProps) {
  const surface = room ?? tint;
  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <div className={cn("min-h-[50vh]", ROOM_CLASS[surface] || ROOM_CLASS.ivory, className)}>
        {children}
      </div>
      <ConsumerFooter />
    </>
  );
}
