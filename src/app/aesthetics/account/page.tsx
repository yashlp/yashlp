"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";

type Customer = { id: string; name: string | null; email: string | null; phone: string | null };

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/commerce/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.customer) {
          router.replace("/aesthetics/account/login");
        } else {
          setCustomer(d.customer);
        }
      })
      .catch(() => router.replace("/aesthetics/account/login"));
  }, [router]);

  async function logout() {
    await fetch("/api/commerce/auth/logout", { method: "POST" });
    router.push("/aesthetics");
  }

  if (customer === undefined) {
    return <div className="min-h-dvh aes-site-bg" />;
  }

  return (
    <ConsumerPage tint="warm">
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">my account</h1>
        <div className="aes-panel-warm mt-8 p-8">
          <p className="text-sm text-[var(--aes-ink-muted)]">Signed in as</p>
          <p className="mt-1 text-xl font-bold text-[var(--aes-ink)]">{customer?.name || "Customer"}</p>
          {customer?.email && <p className="mt-2 text-sm text-[var(--aes-ink)]">{customer.email}</p>}
          {customer?.phone && <p className="text-sm text-[var(--aes-ink)]">{customer.phone}</p>}
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/aesthetics/shop">
              <Button className="w-full">Continue shopping</Button>
            </Link>
            <button type="button" onClick={logout} className="text-sm text-[var(--aes-ink-soft)] underline">
              Sign out
            </button>
          </div>
        </div>
      </main>
    </ConsumerPage>
  );
}
