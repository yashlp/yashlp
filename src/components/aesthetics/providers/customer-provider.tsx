"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CustomerUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type CustomerContextValue = {
  customer: CustomerUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/commerce/auth/me", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      setCustomer(data.customer ?? null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/commerce/auth/logout", { method: "POST", credentials: "include" });
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({ customer, loading, refresh, logout }),
    [customer, loading, refresh, logout]
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  // Soft fallback — never crash the storefront shell if a tree omits the provider
  if (!ctx) {
    return {
      customer: null,
      loading: false,
      refresh: async () => undefined,
      logout: async () => undefined,
    };
  }
  return ctx;
}
