import Link from "next/link";
import { company } from "@/lib/metals/company";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="jk-wrap py-16">
      <p className="jk-kicker">About Jagetiya Metals</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        Ferrous and non-ferrous supply for Gujarat&apos;s shops, since 1990.
      </h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5 text-lg leading-relaxed text-neutral-300">
          <p>
            Founded in 1990 as Dashera, Jagetiya Metals is a warehouse and cut house in Makarpura GIDC, Vadodara.
            We stock the grades the industrial belt actually runs — EN-8, EN-19 (4140), EN-24, 20MnCr5, EN-353, EN-31,
            WPS (D3), mild steel, stainless, brass, copper, and aluminium — in round, square, hex, and flat.
          </p>
          <p>
            Hydraulic bandsaws from 16 mm to 550 mm turn mill bars into blanks the same day. Mill certificates and
            heat numbers travel with the material. The quote sheet on this site is the same inventory the floor uses.
          </p>
          <p>
            We supply Makarpura, Por, Halol, Savli, Panchmahal, and shops further afield that would rather buy a cut
            than a six-metre bar they cannot store.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {[
            ["30+ years", "Industry leadership from Vadodara"],
            ["Ø 550 mm", "Forging rod ready stock"],
            ["16–550 mm", "Hydraulic bandsaw capacity"],
            ["MTC", "Heat traceability on every lot"],
          ].map(([k, v]) => (
            <div key={k} className="border border-white/10 p-5">
              <dt className="text-2xl font-semibold">{k}</dt>
              <dd className="mt-2 text-sm text-neutral-400">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-12 text-neutral-400">
        {company.addressLine}, {company.city} {company.postalCode}. GSTIN {company.gstin}.
      </p>
      <Link href="/metals/contact" className="jk-btn jk-btn-primary mt-6 inline-flex">
        Contact the floor
      </Link>
    </div>
  );
}
