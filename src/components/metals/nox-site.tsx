"use client";

import { useState } from "react";
import { GetMetalButton } from "./get-metal-button";
import { GRADE_CARDS, SHAPE_CARDS, CONTACT } from "@/lib/metals/catalog-data";

export function NoxCatalog() {
  const [tab, setTab] = useState<"grade" | "shape">("grade");

  return (
    <section id="products" className="nox-section">
      <div className="nox-container">
        <div className="nox-section-head">
          <div>
            <p className="nox-eyebrow">Product list</p>
            <h2 className="nox-h2">Shop steel by grade or shape</h2>
            <p className="nox-body" style={{ marginTop: "0.75rem", maxWidth: "36rem" }}>
              Stocked grades and bar shapes from our Vadodara catalog. Select a product and tap Get
              Metal to enquire.
            </p>
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
                <p className="nox-card-shapes">
                  Shapes: {card.shapes.join(" · ")}
                </p>
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
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#chemistry">Chemistry</a>
          <a href="#instant-quote">Enquire</a>
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
        <p className="nox-eyebrow">Vadodara, Gujarat · Since 1990</p>
        <h1 className="nox-h1">Premium alloy &amp; carbon steel</h1>
        <p className="nox-hero-sub">
          With over 30 years of industry leadership, Jagetiya Metals delivers top-tier steel
          solutions — cut to spec, quoted in seconds.
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
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#chemistry">Chemistry</a>
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
