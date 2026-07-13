import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "nav" | "hero" | "footer";
  className?: string;
  href?: string;
};

export function BrandLogo({ variant = "nav", className, href = "/aesthetics" }: BrandLogoProps) {
  const isHero = variant === "hero";
  const isFooter = variant === "footer";

  const content = (
    <div className={cn(isHero ? "text-center" : "", className)}>
      <div
        className={cn(
          "aes-brand-lockup",
          isHero && "aes-brand-lockup-hero",
          !isHero && !isFooter && "aes-brand-lockup-nav",
          isFooter && "aes-brand-lockup-footer"
        )}
        aria-label="Only Aesthetics"
      >
        <span className={cn("aes-brand-only", isFooter && "text-white/55")}>only</span>
        <span className={cn("aes-brand-wordmark", isFooter && "text-white")}>
          A E S T H E T I C S
        </span>
      </div>
      {isHero && (
        <p className="aes-brand-tagline mt-8 max-w-md text-sm sm:text-base">
          Because Details Matter.
        </p>
      )}
    </div>
  );

  if (isHero) return content;

  return (
    <Link href={href} className="block transition-opacity hover:opacity-85">
      {content}
    </Link>
  );
}
