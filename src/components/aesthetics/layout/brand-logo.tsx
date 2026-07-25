import Link from "next/link";
import { cn } from "@/lib/utils";
import { OnlyAestheticMark } from "@/components/aesthetics/layout/only-aesthetic-mark";

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
          "oa-logo-wrap",
          isHero && "oa-logo-wrap--hero",
          !isHero && !isFooter && "oa-logo-wrap--nav",
          isFooter && "oa-logo-wrap--footer"
        )}
        aria-label="Only Aesthetic"
      >
        <OnlyAestheticMark tone={isFooter ? "light" : "ink"} />
      </div>
    </div>
  );

  if (isHero) return content;

  return (
    <Link href={href} className="block transition-opacity hover:opacity-85">
      {content}
    </Link>
  );
}
