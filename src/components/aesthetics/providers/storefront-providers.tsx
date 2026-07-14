"use client";

import { Suspense } from "react";
import { CustomerProvider } from "@/components/aesthetics/providers/customer-provider";
import {
  NoticeProvider,
  AddToBagProvider,
  ThemeProvider,
  RouteProgress,
} from "@/components/aesthetics/motion";

export function StorefrontProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
