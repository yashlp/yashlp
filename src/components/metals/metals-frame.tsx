"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { company, announcement } from "@/lib/metals/company";

const NAV = [
  { href: "/metals/materials", label: "Materials" },
  { href: "/metals/quote", label: "Quote" },
  { href: "/metals/guides", label: "Guides" },
  { href: "/metals/about", label: "About" },
  { href: "/metals/contact", label: "Contact" },
];

export function MetalsFrame({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hideNews, setHideNews] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {!hideNews && (
        <div className="jk-announcement">
          <div className="jk-wrap">
            <Link
              href={announcement.href}
              className="group flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 py-2 pr-8 text-center text-xs sm:text-sm"
            >
              <span className="inline-block rounded-sm bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                {announcement.label}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="underline-offset-2 group-hover:underline">{announcement.text}</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
          <button
            type="button"
            aria-label="Dismiss announcement"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-white/80 hover:bg-white/15"
            onClick={() => setHideNews(true)}
          >
            ×
          </button>
        </div>
      )}

      <nav className="jk-nav">
        <div className="jk-wrap flex h-20 items-center justify-between">
          <Link href="/metals" className="jk-logo">
            {company.name.toUpperCase()}
          </Link>
          <div className="jk-desktop-nav hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors hover:text-white ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-white"
                    : "text-neutral-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/metals/quote" className="jk-btn jk-btn-primary ml-2">
              Instant Quote
            </Link>
          </div>
          <button
            type="button"
            className="jk-mobile-toggle jk-btn jk-btn-ghost lg:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-6 py-4 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm text-neutral-300"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/metals/quote" className="jk-btn jk-btn-primary mt-3 w-full" onClick={() => setOpen(false)}>
              Instant Quote
            </Link>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="mt-8 border-t border-white/[0.06] py-14">
        <div className="jk-wrap grid gap-10 md:grid-cols-4">
          <div>
            <div className="jk-logo mb-3">{company.name.toUpperCase()}</div>
            <p className="text-sm leading-relaxed text-neutral-400">
              {company.addressLine}
              <br />
              {company.city}, {company.region} {company.postalCode}
            </p>
          </div>
          <div>
            <p className="jk-kicker mb-3">Quick links</p>
            <ul className="space-y-2 text-sm text-neutral-400">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="jk-kicker mb-3">Products</p>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/metals/materials/en-8" className="hover:text-white">
                  EN-8 / EN-8D
                </Link>
              </li>
              <li>
                <Link href="/metals/materials/en-19" className="hover:text-white">
                  EN-19 (4140)
                </Link>
              </li>
              <li>
                <Link href="/metals/materials/en-24" className="hover:text-white">
                  EN-24
                </Link>
              </li>
              <li>
                <Link href="/metals/materials/wps-d3" className="hover:text-white">
                  WPS (D3)
                </Link>
              </li>
              <li>
                <Link href="/metals/materials" className="hover:text-white">
                  All materials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="jk-kicker mb-3">Contact</p>
            <p className="text-sm text-neutral-400">
              <a href={`tel:${company.phonePrimaryTel}`} className="hover:text-white">
                {company.phonePrimary}
              </a>
              <br />
              <a href={`tel:${company.phoneSecondaryTel}`} className="hover:text-white">
                {company.phoneSecondary}
              </a>
              <br />
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </p>
          </div>
        </div>
        <div className="jk-wrap mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-neutral-500">
          <span>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </span>
          <span>GSTIN {company.gstin} · Mill certs on every lot · Cut 16–550 mm</span>
        </div>
      </footer>
    </>
  );
}
