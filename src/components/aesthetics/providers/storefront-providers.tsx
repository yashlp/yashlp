"use client";

import { CartAddedToast } from "@/components/aesthetics/shop/cart-added-toast";
import { CustomerProvider } from "@/components/aesthetics/providers/customer-provider";
import { useCart } from "@/components/aesthetics/providers/cart-provider";

function CartToastHost() {
  const { cartToast, clearCartToast } = useCart();
  return <CartAddedToast message={cartToast} onClear={clearCartToast} />;
}

export function StorefrontProviders({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>
      {children}
      <CartToastHost />
    </CustomerProvider>
  );
}
