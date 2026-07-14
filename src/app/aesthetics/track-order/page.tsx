"use client";

import { useState } from "react";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <ConsumerPage room="ivory">
      <main className="mx-auto max-w-lg px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Orders</p>
        <h1 className="aes-gallery-title mt-3">Track Order</h1>
        <p className="aes-gallery-lead mt-4">
          Enter your order number and email from the confirmation message.
        </p>
        <form
          className="aes-panel mt-10 space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "We’re looking this up — you’ll also receive tracking by SMS/email once the parcel ships (usually within 24 hours of payment)."
            );
          }}
        >
          <Input
            placeholder="Order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email used at checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Track
          </Button>
          {message && <p className="text-sm text-[var(--gallery-muted,#6f6a63)]">{message}</p>}
        </form>
      </main>
    </ConsumerPage>
  );
}
