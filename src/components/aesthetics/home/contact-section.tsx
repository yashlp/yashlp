import Link from "next/link";
import { ContactForm } from "@/components/aesthetics/contact/contact-form";

/** Homepage contact — form emails customer care */
export async function ContactSection() {
  return (
    <section
      id="contact"
      className="aes-bg-sand px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="oa-contact-heading"
    >
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--aes-ink-muted)] sm:text-[11px]">
            Contact us
          </p>
          <h2 id="oa-contact-heading" className="mt-3 text-xl font-bold text-[var(--aes-ink)] sm:text-2xl">
            We’re here for orders and refunds
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base">
            We usually reply within one business day.
          </p>
        </div>
        <div className="mt-8">
          <ContactForm compact />
        </div>
        <p className="mt-6 text-center text-xs text-[var(--aes-ink-soft)]">
          Or open the full page:{" "}
          <Link href="/aesthetics/contact" className="text-[var(--aes-pink)] hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
