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
    <div
      className={cn(
        "flex flex-col items-center leading-none",
        isHero ? "text-center" : "",
        className
      )}
      aria-label="Only Aesthetics"
    >
      <span
        className={cn(
          "aes-brand-only",
          isHero && "text-base sm:text-lg",
          !isHero && !isFooter && "text-[10px] sm:text-[11px]",
          isFooter && "text-xs text-white/55"
        )}
      >
        only
      </span>
      <span
        className={cn(
          "aes-brand-wordmark",
          isHero && "aes-brand-wordmark-hero mt-2",
          !isHero && !isFooter && "aes-brand-wordmark-nav mt-1",
          isFooter && "aes-brand-wordmark-footer mt-1 text-white"
        )}
      >
        A E S T H E T I C S
      </span>
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
