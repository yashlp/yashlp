import { cn } from "@/lib/utils";
import { ConsumerNav } from "./consumer-nav";
import { ConsumerFooter } from "./consumer-footer";

export type PageTint =
  | "base"
  | "blush"
  | "lavender"
  | "peach"
  | "sand"
  | "warm"
  | "testimonial"
  | "bundle";

const TINT_CLASS: Record<PageTint, string> = {
  base: "",
  blush: "aes-bg-blush",
  lavender: "aes-bg-lavender",
  peach: "aes-bg-peach",
  sand: "aes-bg-sand",
  warm: "aes-bg-warm",
  testimonial: "aes-bg-testimonial",
  bundle: "aes-bg-bundle",
};

type ConsumerPageProps = {
  children: React.ReactNode;
  cartCount?: number;
  tint?: PageTint;
  className?: string;
};

export function ConsumerPage({
  children,
  cartCount,
  tint = "base",
  className,
}: ConsumerPageProps) {
  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <div className={cn("min-h-[50vh]", TINT_CLASS[tint], className)}>{children}</div>
      <ConsumerFooter />
    </>
  );
}
