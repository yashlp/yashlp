"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/metals#shop", label: "Shop" },
  { href: "/metals/search", label: "Stock Search" },
  { href: "/metals#smart-stock", label: "Smart Stock" },
  { href: "/metals#contact", label: "Contact" },
];

export function MetalsNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/metals" className="group flex flex-col">
          <span className="text-sm font-bold tracking-[0.2em] text-white">JAGETIYA</span>
          <span className="text-[10px] font-medium tracking-[0.35em] text-neutral-500 group-hover:text-neutral-400">
            METALS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/metals/search" className="metals-btn-primary !py-2.5 !px-5 !text-sm">
            Search Stock
          </Link>
        </nav>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-800 bg-black px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-300"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/metals/search"
              className="metals-btn-primary w-full !text-sm"
              onClick={() => setOpen(false)}
            >
              Search Stock
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
