import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BRAND = {
  icon: {
    src: "/brand/civiclens-icon.png",
    width: 512,
    height: 512,
    alt: "CivicLens",
  },
  header: {
    src: "/brand/civiclens-logo-header.png",
    width: 634,
    height: 482,
    alt: "CivicLens",
  },
  full: {
    src: "/brand/civiclens-logo.png",
    width: 634,
    height: 632,
    alt: "CivicLens — Aware today, better tomorrow",
  },
} as const;

type BrandLogoProps = {
  variant?: keyof typeof BRAND;
  href?: string | false;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "header",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const asset = BRAND[variant];
  const img = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      unoptimized
      className={cn(
        variant === "icon" && "h-9 w-9 object-contain",
        variant === "header" && "h-9 w-auto max-w-[200px] object-contain object-left sm:max-w-[240px]",
        variant === "full" && "h-auto w-full max-w-sm object-contain",
        imageClassName
      )}
    />
  );

  if (href === false) {
    return <div className={cn("inline-flex shrink-0 items-center", className)}>{img}</div>;
  }

  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      {img}
    </Link>
  );
}
