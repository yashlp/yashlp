import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ContactForm } from "@/components/aesthetics/contact/contact-form";
import { DEFAULT_SUPPORT_EMAIL, getConfiguredSupportEmail } from "@/lib/commerce/brand-defaults";
import { getBrandSettings } from "@/lib/commerce/brand-settings";

export const metadata = { title: "Contact us" };

export default async function ContactPage() {
  let email = getConfiguredSupportEmail() || DEFAULT_SUPPORT_EMAIL;
  try {
    const brand = await getBrandSettings();
    email = brand.supportEmail || email;
  } catch {
    // keep env / default
  }

  return (
    <ConsumerPage room="ivory">
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="aes-gallery-eyebrow">Contact us</p>
        <h1 className="aes-gallery-title mt-3">We’re here to help</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--gallery-muted,#6f6a63)] sm:text-base">
          Send a message for orders, shipping, returns, or refunds. It goes straight to{" "}
          <a href={`mailto:${email}`} className="text-[var(--aes-pink)] hover:underline">
            {email}
          </a>
          .
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </main>
    </ConsumerPage>
  );
}
