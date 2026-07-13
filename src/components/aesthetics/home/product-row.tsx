import { ProductCard } from "@/components/aesthetics/shop/product-card";
import type { Product } from "@/lib/aesthetics/types";

type ProductRowProps = {
  title: string;
  titleLine2?: string;
  titleStyle?: "upper" | "lower";
  products: Product[];
  bg?: "white" | "cream" | "pink";
  quickAdd?: boolean;
};

const BG = {
  white: "bg-white",
  cream: "bg-[var(--aes-cream)]",
  pink: "bg-[var(--aes-cream)]",
};

export function ProductRow({
  title,
  titleLine2,
  titleStyle = "upper",
  products,
  bg = "cream",
  quickAdd = true,
}: ProductRowProps) {
  if (!products.length) return null;

  return (
    <section className={`px-4 py-14 sm:px-6 sm:py-20 ${BG[bg]}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          {titleStyle === "upper" ? (
            <h2 className="aes-joy-title-upper text-[var(--aes-ink)]">
              {title}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h2>
          ) : (
            <h2 className="aes-joy-title-lower text-[var(--aes-ink)]">{title}</h2>
          )}
        </div>

        <div className="aes-joy-scroll -mx-4 px-4 sm:-mx-6 sm:px-6">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              priority={i < 4}
              index={i}
              quickAdd={quickAdd}
              variant="joy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
