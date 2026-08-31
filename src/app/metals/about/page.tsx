import Link from "next/link";
import { COMPANY } from "@/lib/metals/catalog";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="jk-page">
      <p className="jk-kicker">About</p>
      <h1>About Jagetiya Metals</h1>
      <div className="jk-prose">
        <p>
          Jagetiya Metals is a Vadodara stockist of engineering steels and non-ferrous bar. We cut EN-8, EN-9, EN-19
          (4140), EN-24, 20MnCr5, EN-353, EN-31, WPS (D3), mild steel, stainless, brass, copper, and aluminium to size
          for machine shops, forgers, and plants across Gujarat.
        </p>
        <p>
          Founded in {COMPANY.founded} as Dashera, the house has supplied Makarpura GIDC, Por, Halol, Savli, and
          Panchmahal for three decades. The pitch is simple: the size you need is already on the rack, or we will tell
          you the nearest mill lot in the same call.
        </p>
        <h2>How it works</h2>
        <p>
          You pick grade, shape, and dimensions. We match live stock, cut on hydraulic bandsaw (16–550 mm), and
          dispatch with mill certs. Quotes are a stock check, not a mill enquiry that takes three days.
        </p>
        <h2>What we stock</h2>
        <p>
          Round, square, hex, and flat bar. Rolled lots through roughly Ø 200 mm. Forging and imported cover through
          Ø 450–550 mm. Stainless rod from 304 to 17-4PH. Brass, EC copper, and HE30 / 6082 aluminium on the
          non-ferrous side.
        </p>
        <h2>Where we are</h2>
        <p>
          {COMPANY.addressLine}, {COMPANY.city}. GST {COMPANY.gst}.
        </p>
        <p>
          <Link href="/metals/contact">Contact the floor</Link> · {COMPANY.phonePrimary} · {COMPANY.email}
        </p>
      </div>
    </div>
  );
}
