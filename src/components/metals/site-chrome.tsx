"use client";

import Link from "next/link";
import { useState } from "react";
import { COMPANY } from "@/lib/metals/catalog";

const LINKS = [
  { href: "/metals/materials", label: "Materials" },
  { href: "/metals/cutting", label: "Cutting" },
  { href: "/metals/quote", label: "Quote" },
  { href: "/metals/about", label: "About" },
  { href: "/metals/contact", label: "Contact" },
];

export function MetalsChrome({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="jk-ticker">
        <span className="jk-ticker-k">Stock</span>
        <Link href="/metals/materials">
          Ready stock to Ø 550 mm · Hydraulic bandsaw cut-to-size · Mill certs on request
        </Link>
      </div>
      <header className="jk-nav">
        <Link href="/metals" className="jk-logo">
          JAGETIYA METALS
        </Link>
        <nav className="jk-nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/metals/quote" className="jk-nav-cta">
            Get Metal
          </Link>
          <button type="button" className="jk-menu" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            ☰
          </button>
        </div>
      </header>
      <div className={`jk-drawer${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
      {children}
      <footer className="jk-footer">
        <div className="jk-footer-inner">
          <div>
            <Link href="/metals" className="jk-logo">
              JAGETIYA METALS
            </Link>
            <p>{COMPANY.addressLine}</p>
            <p>{COMPANY.city}</p>
            <p>Cuts and ships across Gujarat and India</p>
          </div>
          <div>
            <h4>Site</h4>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Stock</h4>
            <Link href="/metals/materials/en-8">EN-8 / C45</Link>
            <Link href="/metals/materials/en-19">EN-19 (4140)</Link>
            <Link href="/metals/materials/en-24">EN-24</Link>
            <Link href="/metals/materials/wps-d3">WPS (D3)</Link>
            <Link href="/metals/materials/stainless">Stainless</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            <a href={`tel:${COMPANY.phonePrimaryTel}`}>{COMPANY.phonePrimary}</a>
            <a href={`tel:${COMPANY.phoneSecondaryTel}`}>{COMPANY.phoneSecondary}</a>
            <p>GST {COMPANY.gst}</p>
          </div>
        </div>
        <div className="jk-legal">
          <span>© {new Date().getFullYear()} Jagetiya Metals. All rights reserved.</span>
          <span>Since {COMPANY.founded} · Makarpura GIDC, Vadodara</span>
        </div>
      </footer>
    </>
  );
}
