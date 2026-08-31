"use client";

import { useState } from "react";
import { GetMetalButton } from "./get-metal-button";
import { GRADE_CARDS, SHAPE_CARDS, CONTACT } from "@/lib/metals/catalog-data";

function ChemPills({ elements }: { elements: { num: number; symbol: string; value: string }[] }) {
  return (
    <div className="nox-chem-row">
      {elements.map((el) => (
        <div key={el.symbol} className="nox-chem-pill">
          <span className="nox-chem-num">{el.num}</span>
          <span className="nox-chem-sym">{el.symbol}</span>
          <span className="nox-chem-val">{el.value}</span>
        </div>
      ))}
    </div>
  );
}

export function NoxCatalog() {
  const [tab, setTab] = useState<"grade" | "shape">("grade");

  return (
    <section id="materials" className="nox-section">
      <div className="nox-container">
        <div className="nox-section-head">
          <div>
            <p className="nox-eyebrow">Cut to size</p>
            <h2 className="nox-h2">Shop steel by grade or shape</h2>
          </div>
          <div className="nox-tabs" role="tablist" aria-label="Shop by">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "grade"}
              className={tab === "grade" ? "nox-tab on" : "nox-tab"}
              onClick={() => setTab("grade")}
            >
              By grade
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "shape"}
              className={tab === "shape" ? "nox-tab on" : "nox-tab"}
              onClick={() => setTab("shape")}
            >
              By shape
            </button>
          </div>
        </div>

        {tab === "grade" ? (
          <div className="nox-catalog-grid">
            {GRADE_CARDS.map((card) => (
              <article key={card.id} className="nox-catalog-card">
                <div className="nox-card-top">
                  <p className="nox-card-tag">{card.tagline}</p>
                  <h3 className="nox-card-title">{card.name}</h3>
                </div>
                <p className="nox-card-desc">{card.description}</p>
                <div className="nox-badges">
                  {card.badges.map((b) => (
                    <span key={b} className="nox-badge">
                      {b}
                    </span>
                  ))}
                </div>
                <ChemPills elements={card.chemistry} />
                <div className="nox-card-actions">
                  <GetMetalButton
                    label="Get Metal"
                    prefill={{ grade: card.name.split(" / ")[0], shape: card.shapes[0] }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="nox-catalog-grid">
            {SHAPE_CARDS.map((card) => (
              <article key={card.id} className="nox-catalog-card">
                <h3 className="nox-card-title">{card.name}</h3>
                <p className="nox-card-desc">{card.description}</p>
                <div className="nox-badges">
                  {card.grades.map((g) => (
                    <span key={g} className="nox-badge">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="nox-card-actions">
                  <GetMetalButton label="Get Metal" prefill={{ shape: card.name }} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function NoxNav() {
  return (
    <header className="nox-nav">
      <div className="nox-container nox-nav-inner">
        <a href="/metals" className="nox-logo">
          JAGETIYA METALS
        </a>
        <nav className="nox-nav-links">
          <a href="#materials">Materials</a>
          <a href="#instant-quote">Instant Quote</a>
          <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>Contact</a>
        </nav>
        <GetMetalButton />
      </div>
    </header>
  );
}

export function NoxHero() {
  return (
    <section className="nox-hero">
      <div className="nox-container">
        <p className="nox-eyebrow">Vadodara, Gujarat</p>
        <h1 className="nox-h1">Metal at the speed of software</h1>
        <p className="nox-hero-sub">
          Alloy and carbon steel bars, cut to spec. Quotes in seconds, not days.
        </p>
        <div className="nox-hero-cta">
          <GetMetalButton label="Get Metal Fast" size="large" />
        </div>
      </div>
    </section>
  );
}

export function NoxNestSection() {
  return (
    <section className="nox-section nox-nest">
      <div className="nox-container nox-nest-grid">
        <div>
          <p className="nox-eyebrow accent">JAGETIYA LIVE</p>
          <h2 className="nox-h2">Every cut is a decision. Ours start with your enquiry.</h2>
          <p className="nox-body">
            Submit grade, size, and length — our team confirms every detail in live chat before
            payment. No phone-tag. No guessing. Just steel, cut to spec, shipped from Vadodara.
          </p>
        </div>
        <div className="nox-nest-cards">
          {[
            { t: "Instant Enquiry", d: "Grade, size, length, quantity — captured in one form" },
            { t: "Live Confirmation", d: "Chat walks through every field again before you pay" },
            { t: "Secure Payment", d: "Razorpay checkout when you're ready to confirm" },
          ].map((item) => (
            <div key={item.t} className="nox-nest-card">
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NoxMission() {
  return (
    <section className="nox-section">
      <div className="nox-container">
        <blockquote className="nox-quote">
          Every machine in Gujarat starts with a bar of steel somebody waited too long for.
        </blockquote>
        <p className="nox-body max-w-2xl">
          The tool shop in Makarpura. The fabrication buyer juggling ten suppliers. The production
          manager who lost a contract over a late shipment. We built Jagetiya Metals for them. No
          middlemen. No 3-week lead times. Just metal, cut to spec, shipped fast.
        </p>
      </div>
    </section>
  );
}

export function NoxInstantQuote() {
  return (
    <section id="instant-quote" className="nox-section nox-quote-section">
      <div className="nox-container nox-quote-inner">
        <div>
          <p className="nox-eyebrow">Instant Quote</p>
          <h2 className="nox-h2">Your supplier takes three days. We take sixty seconds.</h2>
          <p className="nox-body">
            Tell us what you need. Grade, shape, dimensions, quantity. Confirm in live chat and pay
            when you&apos;re ready.
          </p>
        </div>
        <GetMetalButton label="Get Metal" size="large" />
      </div>
    </section>
  );
}

export function NoxFooter() {
  return (
    <footer className="nox-footer">
      <div className="nox-container nox-footer-inner">
        <span className="nox-logo">JAGETIYA METALS</span>
        <div className="nox-footer-links">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>{CONTACT.phone}</a>
        </div>
        <p className="nox-footer-meta">
          {CONTACT.address} · GST {CONTACT.gst}
        </p>
      </div>
    </footer>
  );
}

export function NoxNewsBanner() {
  return (
    <div className="nox-news">
      <div className="nox-container nox-news-inner">
        <span className="nox-news-label">News</span>
        <span>Jagetiya Metals — live enquiry &amp; chat ordering now open</span>
      </div>
    </div>
  );
}
