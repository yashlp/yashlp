"use client";

import { useState } from "react";
import { company } from "@/lib/metals/company";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/metals/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: String(data.company || ""),
          contact: String(data.name || ""),
          phone: String(data.phone || ""),
          email: String(data.email || ""),
          note: String(data.message || ""),
          lines: [],
          grandTotal: 0,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not send");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send");
    }
  }

  return (
    <div className="jk-wrap grid gap-12 py-16 lg:grid-cols-2">
      <div>
        <p className="jk-kicker">Contact</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Talk to the warehouse.</h1>
        <p className="mt-4 text-neutral-400">
          Sales sits next to the racks. Call, WhatsApp, or send the size list — we confirm stock the same working day.
        </p>
        <dl className="mt-8 space-y-3 text-sm text-neutral-300">
          <div>
            <dt className="text-neutral-500">Phone</dt>
            <dd>
              <a href={`tel:${company.phonePrimaryTel}`}>{company.phonePrimary}</a>
              {" · "}
              <a href={`tel:${company.phoneSecondaryTel}`}>{company.phoneSecondary}</a>
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Email</dt>
            <dd>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">WhatsApp</dt>
            <dd>
              <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">
                {company.phonePrimary}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Address</dt>
            <dd>
              {company.addressLine}
              <br />
              {company.city}, {company.region} {company.postalCode}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Hours</dt>
            <dd>{company.hours}</dd>
          </div>
        </dl>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="jk-input" name="name" placeholder="Your name" required />
        <input className="jk-input" name="company" placeholder="Company" required />
        <input className="jk-input" name="phone" placeholder="Phone" required />
        <input className="jk-input" name="email" type="email" placeholder="Email" />
        <textarea className="jk-textarea" name="message" rows={6} placeholder="Grade, size, length, quantity" required minLength={10} />
        <button className="jk-btn jk-btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "sent" && <p className="text-sm text-emerald-400">Message received. We will call back.</p>}
        {status === "error" && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
