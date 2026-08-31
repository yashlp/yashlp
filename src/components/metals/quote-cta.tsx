import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/metals/catalog";

export function QuoteCta() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-black p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                Get a Quote
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your supplier takes three days. We take sixty seconds.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-400">
                Tell us what you need — grade, shape, dimensions, quantity. Search live stock, check
                prices, and call us to confirm. Faster lead times aren&apos;t a promise — they&apos;re
                how we operate from Vadodara.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/metals/search" className="metals-btn-primary">
                  Search Stock Now
                </Link>
                <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="metals-btn-ghost">
                  <Phone size={16} />
                  Call Us
                </a>
              </div>
            </div>

            <div className="space-y-5 rounded-xl border border-neutral-800 bg-black/40 p-6">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#c8960c]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Phone</p>
                  <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="text-sm text-white hover:text-[#c8960c]">
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#c8960c]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email</p>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm text-white hover:text-[#c8960c]">
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#c8960c]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Address</p>
                  <p className="text-sm text-neutral-300">{CONTACT.address}</p>
                  <p className="mt-1 text-xs text-neutral-600">GST: {CONTACT.gst}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
