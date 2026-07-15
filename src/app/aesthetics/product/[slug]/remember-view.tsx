"use client";

import { useEffect } from "react";
import { rememberProductView } from "@/lib/aesthetics/recently-viewed";
import type { Product } from "@/lib/aesthetics/types";

export function RememberProductView({ product }: { product: Product }) {
  useEffect(() => {
    rememberProductView(product);
    void fetch("/api/commerce/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PRODUCT_VIEW", productId: product.id, path: `/aesthetics/product/${product.slug}` }),
    }).catch(() => {});
  }, [product.id, product.name, product.slug, product.price, product.images]);
  return null;
}
