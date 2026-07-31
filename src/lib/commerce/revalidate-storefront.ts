import { revalidatePath } from "next/cache";

/** Bust storefront caches after catalog changes so new products appear immediately. */
export function revalidateStorefrontCatalog() {
  revalidatePath("/aesthetics");
  revalidatePath("/aesthetics/shop");
  revalidatePath("/api/commerce/products");
  revalidatePath("/api/commerce/homepage");
}
