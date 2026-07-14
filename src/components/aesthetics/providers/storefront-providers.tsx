"use client";

import { Suspense } from "react";
import { CustomerProvider } from "@/components/aesthetics/providers/customer-provider";
import {
  NoticeProvider,
  AddToBagProvider,
  RouteProgress,
} from "@/components/aesthetics/motion";

export function StorefrontProviders({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>
      <NoticeProvider>
        <AddToBagProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
        </AddToBagProvider>
      </NoticeProvider>
    </CustomerProvider>
  );
}
