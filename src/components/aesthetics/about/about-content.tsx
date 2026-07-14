"use client";

import Link from "next/link";
import { AboutLampHeading } from "@/components/aesthetics/about/about-lamp-heading";
import { EditorialItem, EditorialReveal } from "@/components/aesthetics/motion";

const VALUES = [
  { title: "Details matter", body: "Every object is chosen for craft, material honesty, and the small details that elevate a room." },
  { title: "Small-batch makers", body: "We partner with independent studios — not mass-market factories — so each piece feels personal." },
  { title: "Maker-vetted", body: "Our team reviews makers for quality, ethics, and consistency before anything reaches the shop." },
  { title: "Mood-first edits", body: "Collections are built around how a space should feel — calm, cozy, focused, or romantic." },
  { title: "Ships with care", body: "Pan-India delivery with protective packaging. Free shipping on orders above ₹999." },
];

export function AboutContent() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <AboutLampHeading>About us</AboutLampHeading>

      <EditorialReveal className="mt-6">
        <EditorialItem>
          <p className="aes-gallery-lead mx-auto text-center">
            Details matter · Small-batch makers · Maker-vetted · Mood-first edits · Ships with care
          </p>
        </EditorialItem>
      </EditorialReveal>

      <EditorialReveal className="aes-panel mt-14 space-y-6 p-8 sm:p-10" stagger>
        <EditorialItem>
          <p className="text-base leading-relaxed text-[var(--aes-ink-muted)] sm:text-lg">
            We are a direct-to-consumer brand based in India, curating objects from independent makers
            for homes that value intention over excess. Every product is selected for material quality,
            thoughtful design, and the mood it brings to your space.
          </p>
        </EditorialItem>
        <EditorialItem>
          <p className="text-base leading-relaxed text-[var(--aes-ink-muted)]">
            From slow mornings with pour-over ceramics to evening wind-down with lavender room mist —
            our edits help you build rituals, not clutter. All prices are in Indian Rupees (₹) and we
            ship pan-India.
          </p>
        </EditorialItem>
      </EditorialReveal>

      <section className="mt-16">
        <p className="aes-gallery-eyebrow text-center">What we stand for</p>
        <EditorialReveal className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <EditorialItem key={v.title} className="aes-panel aes-gallery-lift p-6 transition">
              <h3 className="font-semibold tracking-wide text-[var(--aes-ink)]">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{v.body}</p>
            </EditorialItem>
          ))}
        </EditorialReveal>
      </section>

      <div className="mt-14 text-center">
        <Link href="/aesthetics/shop" className="aes-btn aes-btn-primary px-10 py-4">
          Shop now
        </Link>
      </div>
    </main>
  );
}
