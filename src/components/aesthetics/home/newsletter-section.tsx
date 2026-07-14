"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="aes-bg-lavender px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="aes-gallery-eyebrow">Stay close</p>
        <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Newsletter</h2>
        <p className="mt-3 text-sm text-[var(--aes-ink-muted)]">
          New edits, maker stories, and early access — no clutter.
        </p>
        {done ? (
          <p className="mt-8 text-sm font-medium text-[var(--gallery-blue,#2c5aa0)]">You’re on the list.</p>
        ) : (
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="aes-input flex-1 !rounded-full"
            />
            <button type="submit" className="aes-btn aes-btn-primary rounded-full px-6 py-3">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
