"use client";

import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AestheticProduct } from "@/lib/aesthetic-demo/products";

type ShopGridProps = {
  products: AestheticProduct[];
  cartIds: Set<string>;
  onAdd: (product: AestheticProduct) => void;
  onPass: (product: AestheticProduct) => void;
  topVibes: string[];
};

export function ShopGrid({ products, cartIds, onAdd, onPass, topVibes }: ShopGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <p className="text-2xl font-semibold italic text-[#1b3a6b]">Nothing here yet</p>
        <p className="aesthetic-mono mt-2 text-xs text-[#4a7cbb]/70">
          Try another filter or switch back to reels.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2">
      {topVibes.length > 0 && (
        <p className="aesthetic-mono mb-4 text-[10px] text-[#4a7cbb]/70">
          picked for you · {topVibes.join(" · ")}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const inCart = cartIds.has(product.id);
          return (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-[#1b3a6b]/8 bg-[#fffef7] aesthetic-card-shadow transition hover:border-[#4a7cbb]/25"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a1628]/50 to-transparent" />
                <span className="aesthetic-mono absolute left-2 top-2 rounded-full bg-[#fffef7]/90 px-2 py-0.5 text-[8px] uppercase tracking-wider text-[#1b3a6b]">
                  {product.tags[0]}
                </span>
              </div>
              <div className="p-3">
                <p className="aesthetic-mono truncate text-[9px] uppercase tracking-wider text-[#4a7cbb]">
                  {product.brand}
                </p>
                <h3 className="mt-0.5 truncate text-base font-semibold leading-tight text-[#0a1628]">
                  {product.name}
                </h3>
                <p className="mt-2 text-lg font-semibold text-[#1b3a6b]">${product.price}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAdd(product)}
                    disabled={inCart}
                    className={cn(
                      "aesthetic-mono flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[10px] uppercase tracking-wider transition active:scale-95",
                      inCart
                        ? "bg-[#4a7cbb]/15 text-[#4a7cbb]"
                        : "bg-[#1b3a6b] text-[#fffef7] shadow-md shadow-[#1b3a6b]/15"
                    )}
                  >
                    {inCart ? (
                      <>
                        <Heart className="h-3 w-3 fill-current" />
                        in cart
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        add
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onPass(product)}
                    className="aesthetic-mono rounded-xl border border-[#1b3a6b]/10 px-3 py-2 text-[10px] uppercase tracking-wider text-[#8a7355] transition hover:bg-[#f5f0e8] active:scale-95"
                    aria-label="Not interested"
                  >
                    pass
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
