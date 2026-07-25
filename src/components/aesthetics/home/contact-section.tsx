import { getBrandSettings } from "@/lib/commerce/brand-settings";

/** Homepage contact — customer care email for orders, help, and refunds */
export async function ContactSection() {
  const brand = await getBrandSettings();
  const email = brand.supportEmail;

  return (
    <section className="aes-bg-sand px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="oa-contact-heading">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--aes-ink-muted)] sm:text-[11px]">
          Contact
        </p>
        <h2 id="oa-contact-heading" className="mt-3 text-xl font-bold text-[var(--aes-ink)] sm:text-2xl">
          We’re here for orders and refunds
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--aes-ink-muted)] sm:text-base">
          Email customer care for shipping questions, returns, and refund requests. We usually reply within one
          business day.
        </p>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent("Only Aesthetic — order / refund help")}`}
          className="aes-btn aes-btn-primary mt-8 inline-flex px-8 py-3.5 text-xs"
        >
          {email}
        </a>
        <p className="mt-4 text-xs text-[var(--aes-ink-soft)]">
          Use this address for refunds and all customer queries.
        </p>
      </div>
    </section>
  );
}
