"use client";

import { useEffect } from "react";
import { rememberProductView } from "@/lib/aesthetics/recently-viewed";
import type { Product } from "@/lib/aesthetics/types";

export function RememberProductView({ product }: { product: Product }) {
  useEffect(() => {
    rememberProductView(product);
  }, [product.id, product.name, product.slug, product.price, product.images]);
  return null;
}
