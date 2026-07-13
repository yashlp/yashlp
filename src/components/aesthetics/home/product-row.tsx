import Link from "next/link";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import type { Product } from "@/lib/aesthetics/types";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  quickAdd?: boolean;
  bg?: "white" | "cream" | "pink";
};

const BG = {
  white: "bg-white",
  cream: "bg-[var(--aes-cream)]",
  pink: "bg-gradient-to-b from-pink-50 to-[var(--aes-cream)]",
};

export function ProductRow({
  title,
  subtitle,
  products,
  href,
  quickAdd = true,
  bg = "cream",
}: ProductRowProps) {
  return (
    <section className={`px-4 py-16 sm:px-6 sm:py-20 ${products.length ? "" : "hidden"} ${BG[bg]}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="aes-section-title text-[var(--aes-ink)]">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--aes-ink-muted)] sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} index={i} quickAdd={quickAdd} />
          ))}
        </div>

        {href && (
          <div className="mt-10 text-center">
            <Link
              href={href}
              className="aes-btn aes-btn-secondary inline-flex px-8 py-3"
            >
              View all
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
