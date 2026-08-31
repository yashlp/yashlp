"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import styles from "./metals.module.css";

type Grade = {
  name: string;
  summary: string;
  applications: string;
  elements: Array<{ symbol: string; value: string }>;
  forms: string[];
};

type ProductShape = {
  name: string;
  summary: string;
  inventory: string;
  mark: "round" | "square" | "flat" | "hex" | "nonferrous";
};

const featuredGrades: Grade[] = [
  {
    name: "EN-8 / EN-8D",
    summary: "Dependable medium-carbon steel with balanced strength and machinability.",
    applications: "Shafts, studs, keys, gears and general engineering parts.",
    elements: [
      { symbol: "C", value: "0.36–0.44" },
      { symbol: "Mn", value: "0.60–1.00" },
      { symbol: "Si", value: "0.15–0.35" },
    ],
    forms: ["ROLLED", "BRIGHT", "FORGED"],
  },
  {
    name: "EN-19 / 4140",
    summary: "High tensile alloy steel built for fatigue and impact resistance.",
    applications: "Axles, connecting rods, high-load shafts and fasteners.",
    elements: [
      { symbol: "Cr", value: "0.80–1.10" },
      { symbol: "Mo", value: "0.15–0.25" },
      { symbol: "C", value: "0.38–0.43" },
    ],
    forms: ["ROLLED", "IMPORTED", "FORGED"],
  },
  {
    name: "EN-24",
    summary: "Nickel-chromium-molybdenum steel for demanding, high-stress components.",
    applications: "Heavy-duty gears, crankshafts, spindles and machine parts.",
    elements: [
      { symbol: "Ni", value: "1.30–1.70" },
      { symbol: "Cr", value: "1.00–1.40" },
      { symbol: "Mo", value: "0.20–0.30" },
    ],
    forms: ["ROD", "FORGED"],
  },
  {
    name: "WPS / D3",
    summary: "Wear-resistant tool steel for parts that work hard and hold their edge.",
    applications: "Dies, punches, blades, gauges and wear components.",
    elements: [
      { symbol: "C", value: "0.65–0.75" },
      { symbol: "Cr", value: "0.90–1.10" },
      { symbol: "Mn", value: "0.40–0.60" },
    ],
    forms: ["ROUND", "SQUARE", "FLAT"],
  },
];

const productShapes: ProductShape[] = [
  {
    name: "Round bar",
    summary: "Bright, black, rolled, imported and forged bars across engineering grades.",
    inventory: "4–450 mm",
    mark: "round",
  },
  {
    name: "Square bar",
    summary: "EN-8, WPS (D3) and MS Bright square sections for direct machining.",
    inventory: "8–155 mm",
    mark: "square",
  },
  {
    name: "Flat bar",
    summary: "Rolled and forged flats in EN-8, WPS, MS Bright and MS Black.",
    inventory: "5–105 mm thick",
    mark: "flat",
  },
  {
    name: "Hex bar",
    summary: "MS Bright hexagonal bar in a practical range of across-flat sizes.",
    inventory: "12–75 mm",
    mark: "hex",
  },
  {
    name: "Non-ferrous",
    summary: "Brass, copper, aluminium HE30 / 6802 and stainless steel grades.",
    inventory: "Multiple forms",
    mark: "nonferrous",
  },
];

const catalogGroups = [
  {
    label: "Engineering steel",
    values: ["EN-8D", "EN-8 / C-45", "EN-9", "EN-19 (4140)", "EN-24", "20MnCr5", "EN-353", "EN-31"],
  },
  {
    label: "Tool & mild steel",
    values: ["WPS (D3)", "MS Bright", "MS Black", "Centerless ground"],
  },
  {
    label: "Non-ferrous & stainless",
    values: [
      "Brass",
      "Copper EC",
      "Aluminium HE30 / 6802",
      "SS 304 / 304L",
      "SS 316 / 316L",
      "SS 321",
      "SS 410 / 420",
      "SS 430F / 431",
      "SS 440C",
      "SS 17-4 PH",
    ],
  },
];

function BrandMark() {
  return (
    <span className={styles.brandMark} aria-hidden="true">
      <span>JM</span>
    </span>
  );
}

function ShapeMark({ type }: { type: ProductShape["mark"] }) {
  return (
    <span className={`${styles.shapeMark} ${styles[type]}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function MetalsPage() {
  const [shopMode, setShopMode] = useState<"grade" | "shape">("grade");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const visibleProducts = useMemo(
    () => (shopMode === "grade" ? featuredGrades : productShapes),
    [shopMode]
  );

  function handleQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className={styles.site}>
      <div className={styles.announcement}>
        <span>Serving Indian industry from Vadodara, Gujarat</span>
        <a href="#catalog">
          Explore the stock range <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>

      <section className={styles.hero}>
        <header className={styles.header}>
          <a className={styles.brand} href="#top" aria-label="Jagetiya Metals home">
            <BrandMark />
            <span>
              <strong>JAGETIYA</strong>
              <small>METALS</small>
            </span>
          </a>
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
            <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#capabilities" onClick={() => setMenuOpen(false)}>Capabilities</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <a className={styles.headerCta} href="#quote">
            Request a quote <ArrowRight size={16} aria-hidden="true" />
          </a>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className={styles.heroBody} id="top">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>SPECIAL & ALLOY STEEL STOCKISTS</span>
            <h1>Metal that keeps <em>industry moving.</em></h1>
            <p>
              Engineering steel, tool steel and non-ferrous stock in the grades and
              sizes your next job demands.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#quote">
                Get a fast quote <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className={styles.textLink} href="#products">
                View products <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.metalVisual} aria-label="Abstract illustration of precision metal stock">
            <div className={styles.visualGrid} />
            <div className={styles.roundStock}><span /></div>
            <div className={styles.squareStock} />
            <div className={styles.flatStock} />
            <div className={styles.visualNote}>
              <span>READY STOCK</span>
              <strong>4–450</strong>
              <small>MM RANGE</small>
            </div>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div><strong>40+</strong><span>stock variants</span></div>
          <div><strong>5</strong><span>product forms</span></div>
          <div><strong>1</strong><span>reliable source</span></div>
          <div className={styles.locationStat}><MapPin size={17} /><span>Makarpura G.I.D.C.<br />Vadodara</span></div>
        </div>
      </section>

      <section className={styles.products} id="products">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>READY FOR YOUR DRAWING</span>
            <h2>Shop steel by grade or shape</h2>
          </div>
          <div className={styles.switcher} role="tablist" aria-label="Browse products">
            <button
              className={shopMode === "grade" ? styles.activeTab : ""}
              type="button"
              role="tab"
              aria-selected={shopMode === "grade"}
              onClick={() => setShopMode("grade")}
            >
              By grade
            </button>
            <button
              className={shopMode === "shape" ? styles.activeTab : ""}
              type="button"
              role="tab"
              aria-selected={shopMode === "shape"}
              onClick={() => setShopMode("shape")}
            >
              By shape
            </button>
          </div>
        </div>

        <div className={styles.productGrid} key={shopMode}>
          {shopMode === "grade"
            ? (visibleProducts as Grade[]).map((grade, index) => (
                <article className={styles.gradeCard} key={grade.name}>
                  <span className={styles.cardIndex}>0{index + 1}</span>
                  <div>
                    <h3>{grade.name}</h3>
                    <p>{grade.summary}</p>
                  </div>
                  <div className={styles.elements}>
                    {grade.elements.map((element) => (
                      <div key={element.symbol}>
                        <span>{element.symbol}</span>
                        <strong>{element.value}%</strong>
                      </div>
                    ))}
                  </div>
                  <p className={styles.application}>{grade.applications}</p>
                  <div className={styles.formTags}>
                    {grade.forms.map((form) => <span key={form}>{form}</span>)}
                  </div>
                </article>
              ))
            : (visibleProducts as ProductShape[]).map((shape, index) => (
                <article className={styles.shapeCard} key={shape.name}>
                  <span className={styles.cardIndex}>0{index + 1}</span>
                  <ShapeMark type={shape.mark} />
                  <div>
                    <h3>{shape.name}</h3>
                    <p>{shape.summary}</p>
                  </div>
                  <span className={styles.inventory}>{shape.inventory} <ChevronRight size={16} /></span>
                </article>
              ))}
        </div>

        <div className={styles.catalog} id="catalog">
          {catalogGroups.map((group) => (
            <div key={group.label}>
              <span>{group.label}</span>
              <p>{group.values.join("  ·  ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.capabilities} id="capabilities">
        <div className={styles.capabilityIntro}>
          <span className={styles.kicker}>BUILT AROUND YOUR REQUIREMENT</span>
          <h2>From a size on paper to metal on your floor.</h2>
          <p>
            Tell us the grade, form and size. We check the available stock, match
            the right make and get your requirement moving.
          </p>
        </div>
        <div className={styles.steps}>
          <article>
            <span>01</span>
            <Ruler aria-hidden="true" />
            <h3>Specify</h3>
            <p>Share grade, dimensions, quantity and any preferred make.</p>
          </article>
          <article>
            <span>02</span>
            <Sparkles aria-hidden="true" />
            <h3>Match</h3>
            <p>We identify the closest stock size and suitable product form.</p>
          </article>
          <article>
            <span>03</span>
            <ShieldCheck aria-hidden="true" />
            <h3>Supply</h3>
            <p>Your confirmed requirement is prepared for dependable dispatch.</p>
          </article>
        </div>
      </section>

      <section className={styles.inventorySection}>
        <div className={styles.inventoryPanel}>
          <div className={styles.inventoryGraphic} aria-hidden="true">
            <div className={styles.sheetOne} />
            <div className={styles.sheetTwo} />
            <div className={styles.cutLine} />
            <span className={styles.dimensionOne}>125 MM</span>
            <span className={styles.dimensionTwo}>32 MM</span>
          </div>
          <div className={styles.inventoryCopy}>
            <span className={styles.kicker}>STOCK INTELLIGENCE</span>
            <h2>Find the right section before the machine waits.</h2>
            <p>
              Our range spans bright bars, black bars, rolled stock, imported
              sections, forged rods and centerless-ground material.
            </p>
            <ul>
              <li><Check size={17} /> Exact and nearby stock-size matching</li>
              <li><Check size={17} /> Multiple trusted makes across core grades</li>
              <li><Check size={17} /> Grade chemistry available for comparison</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.story} id="about">
        <span className={styles.storyLabel}>JAGETIYA METALS · VADODARA</span>
        <blockquote>
          Every component starts with a piece of metal someone had to source
          <em> correctly.</em>
        </blockquote>
        <div className={styles.storyBody}>
          <p>
            The maintenance team chasing uptime. The machine shop planning its next
            batch. The manufacturer who cannot afford a material mismatch.
          </p>
          <p>
            We keep a practical range of special steels and non-ferrous metals
            close to Gujarat&apos;s industrial heart—so the conversation starts with
            what your job needs.
          </p>
        </div>
      </section>

      <section className={styles.resources}>
        <div className={styles.resourceHeading}>
          <span className={styles.kicker}>MATERIAL NOTES</span>
          <h2>Specify with confidence.</h2>
        </div>
        <div className={styles.resourceGrid}>
          <article>
            <span>GRADE GUIDE</span>
            <h3>EN-8 vs EN-19</h3>
            <p>Choosing between everyday machinability and higher tensile performance.</p>
            <a href="#quote">Ask our team <ArrowRight size={15} /></a>
          </article>
          <article>
            <span>FORM GUIDE</span>
            <h3>Rolled, bright or forged?</h3>
            <p>Match surface condition and production route to your machining plan.</p>
            <a href="#quote">Ask our team <ArrowRight size={15} /></a>
          </article>
          <article>
            <span>SIZE GUIDE</span>
            <h3>Choosing stock allowance</h3>
            <p>Leave the right machining allowance without buying unnecessary weight.</p>
            <a href="#quote">Ask our team <ArrowRight size={15} /></a>
          </article>
        </div>
      </section>

      <section className={styles.quote} id="quote">
        <div className={styles.quoteCopy}>
          <span className={styles.kicker}>REQUEST A QUOTE</span>
          <h2>Your requirement, clearly understood.</h2>
          <p>Send the essentials. Our team will follow up to confirm availability and pricing.</p>
          <div className={styles.contactDetails} id="contact">
            <a href="tel:+919824012344"><Phone size={17} /> +91 98240 12344</a>
            <a href="mailto:Kamlesh@jkmetal.in"><Mail size={17} /> Kamlesh@jkmetal.in</a>
            <span><MapPin size={17} /> 502/1-A G.I.D.C., Makarpura, Vadodara</span>
          </div>
        </div>

        {submitted ? (
          <div className={styles.successCard} role="status">
            <span><Check size={27} /></span>
            <h3>Requirement captured.</h3>
            <p>
              Please call or email us to send the requirement directly. We&apos;ll
              confirm stock and pricing with you.
            </p>
            <a href="mailto:Kamlesh@jkmetal.in?subject=Metal%20stock%20requirement">
              Email the requirement <ArrowRight size={16} />
            </a>
            <button type="button" onClick={() => setSubmitted(false)}>Start another request</button>
          </div>
        ) : (
          <form className={styles.quoteForm} onSubmit={handleQuote}>
            <label>
              Your name
              <input name="name" autoComplete="name" placeholder="Name / company" required maxLength={80} />
            </label>
            <div className={styles.formRow}>
              <label>
                Phone
                <input name="phone" type="tel" autoComplete="tel" placeholder="+91" required maxLength={20} />
              </label>
              <label>
                Product form
                <select name="form" defaultValue="" required>
                  <option value="" disabled>Select form</option>
                  {productShapes.map((shape) => <option key={shape.name}>{shape.name}</option>)}
                </select>
              </label>
            </div>
            <label>
              Material requirement
              <textarea
                name="requirement"
                placeholder="Grade, size, quantity and preferred make"
                required
                maxLength={500}
                rows={4}
              />
            </label>
            <button type="submit">Prepare request <ArrowRight size={17} /></button>
            <small>No payment or sensitive information is collected here.</small>
          </form>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <BrandMark />
          <span><strong>JAGETIYA</strong><small>METALS</small></span>
        </div>
        <p>Special & alloy steel stockists · Vadodara, Gujarat, India</p>
        <p>GST 24AGIPS3207M1Z7</p>
      </footer>
    </main>
  );
}
