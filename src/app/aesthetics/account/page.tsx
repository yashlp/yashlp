"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
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
    return <div className="min-h-dvh bg-[var(--aes-cream)]" />;
  }

  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="aes-section-title text-[var(--aes-ink)]">My account</h1>
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-md">
          <p className="text-sm text-[var(--aes-ink-muted)]">Signed in as</p>
          <p className="mt-1 text-xl font-bold text-[var(--aes-ink)]">{customer?.name || "Customer"}</p>
          {customer?.email && <p className="mt-2 text-sm">{customer.email}</p>}
          {customer?.phone && <p className="text-sm">{customer.phone}</p>}
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/aesthetics/discover">
              <Button className="w-full">Open discover mode</Button>
            </Link>
            <Link href="/aesthetics/shop">
              <Button variant="secondary" className="w-full">Continue shopping</Button>
            </Link>
            <button type="button" onClick={logout} className="text-sm text-[var(--aes-ink-soft)] underline">
              Sign out
            </button>
          </div>
        </div>
      </main>
      <ConsumerFooter />
    </>
  );
}
