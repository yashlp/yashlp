"use client";

import { useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
  compact?: boolean;
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultEmail?: string;
};

export function ContactForm({
  className,
  compact,
  defaultFirstName = "",
  defaultLastName = "",
  defaultEmail = "",
}: ContactFormProps) {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/commerce/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not send message. Please try again.");
        return;
      }
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Could not send message. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className={cn("text-sm text-[var(--aes-ink-muted)]", className)} role="status">
        <p className="font-medium text-[var(--aes-ink)]">Message sent.</p>
        <p className="mt-2">
          Thanks — our customer care team will reply to {email || "your email"} soon.
        </p>
        <button
          type="button"
          className="mt-4 text-sm text-[var(--aes-pink)] underline"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4 text-left", className)}>
      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--aes-ink-muted)]">
            First name
          </span>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
            maxLength={80}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--aes-ink-muted)]">
            Surname
          </span>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
            maxLength={80}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--aes-ink-muted)]">
          Email
        </span>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          maxLength={200}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-[var(--aes-ink-muted)]">
          Message
        </span>
        <textarea
          className="aes-input min-h-[140px] w-full resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={4000}
          placeholder="How can we help with your order, return, or question?"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
