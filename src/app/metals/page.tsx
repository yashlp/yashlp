import Link from "next/link";
import { AlloyShop } from "@/components/metals/alloy-shop";
import { COMPANY, GUIDES } from "@/lib/metals/catalog";

export default function MetalsHomePage() {
  return (
    <>
      <section className="jk-hero">
        <h1>
          Metal at the speed of <em>stock</em>
        </h1>
        <p className="jk-hero-lead">
          Alloy steel, cut to spec. Quotes from live inventory in Vadodara — not days of phone-tag.
        </p>
        <div className="jk-hero-actions">
          <Link className="jk-btn jk-btn-solid" href="/metals/quote">
            Get Metal Fast
          </Link>
          <Link className="jk-btn jk-btn-ghost" href="/metals/materials">
            Cut to size
          </Link>
        </div>
      </section>

      <AlloyShop />

      <section className="jk-section" id="cutting">
        <div className="jk-section-inner jk-cut">
          <div className="jk-cut-copy">
            <p className="jk-kicker">JK CUT</p>
            <h2 className="jk-h2">Every cut is a decision. Ours are made on the saw.</h2>
            <p>
              Jagetiya Metals takes your size against ready stock on the Makarpura floor. Hydraulic bandsaw from 16 mm
              to 550 mm. Rolled lots, bright bars, and forging rod — considered against what you need next, not what a
              mill wants to roll in three weeks.
            </p>
            <div className="jk-feat">
              <div>
                <h3>Ready stock</h3>
                <p>EN-8, EN-19, EN-24, 20MnCr5, EN-31, WPS (D3), MS — sizes on the rack today.</p>
              </div>
              <div>
                <h3>Hydraulic bandsaw</h3>
                <p>Square-end cut-to-length. 16 mm through Ø 550 mm capacity, mill certs with the lot.</p>
              </div>
              <div>
                <h3>Forging cover</h3>
                <p>When rolled stops at Ø 200, forging rod carries EN grades through 450–550 mm.</p>
              </div>
            </div>
          </div>
          <div className="jk-viz" aria-hidden="true">
            <div className="jk-viz-top">
              <span>CUSTOMER AA · EN-19 Ø 80 × 420</span>
              <span>DROP</span>
            </div>
            <div className="jk-plates">
              <div className="jk-plate">
                <div className="jk-drop" style={{ left: 12, top: 16, width: "58%", height: "42%" }} />
                <div className="jk-drop" style={{ left: 12, top: "62%", width: "34%", height: "28%" }} />
                <div className="jk-drop" style={{ right: 16, top: 16, width: "28%", height: "70%" }} />
              </div>
              <div className="jk-plate">
                <div className="jk-drop" style={{ left: 10, top: 12, width: "78%", height: "30%" }} />
                <div className="jk-drop" style={{ left: 10, top: "48%", width: "48%", height: "40%" }} />
              </div>
            </div>
            <div className="jk-viz-stats">
              <span>91.2% YIELD</span>
              <span>Ø 16–550 MM</span>
              <span>EST. SAME DAY CUT</span>
            </div>
          </div>
        </div>
      </section>

      <section className="jk-section">
        <div className="jk-section-inner jk-manifesto">
          <p>Every machine in Gujarat starts with a bar of steel somebody waited too long for.</p>
          <p className="body">
            The three-man shop in Makarpura. The forging buyer juggling ten suppliers. The production manager who lost
            a contract over a late shaft. We built Jagetiya Metals for them.
          </p>
          <p className="body">
            No mill MOQ theatre. No three-week lead times. No phone-tag for a size that is already on our rack. Just
            metal, cut to spec, dispatched fast.
          </p>
        </div>
      </section>

      <section className="jk-section">
        <div className="jk-section-inner">
          <p className="jk-kicker">Featured Guides</p>
          <div className="jk-guides">
            {GUIDES.map((g) => (
              <Link className="jk-guide" key={g.slug} href={`/metals/guides/${g.slug}`}>
                <h3>{g.title}</h3>
                <p>{g.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="jk-section">
        <div className="jk-section-inner jk-quote-cta">
          <div>
            <p className="jk-kicker">Instant Quote</p>
            <h2 className="jk-h2">Your supplier takes three days. We take a stock check.</h2>
            <p className="jk-lead">
              Tell us grade, shape, size, length, quantity. We match live inventory, cut on the bandsaw, and send a
              landed price. Faster lead times are the floor, not a promise.
            </p>
            <div className="jk-hero-actions">
              <Link className="jk-btn jk-btn-solid" href="/metals/quote">
                Get Metal
              </Link>
              <a className="jk-btn jk-btn-ghost" href={`tel:${COMPANY.phonePrimaryTel}`}>
                {COMPANY.phonePrimary}
              </a>
            </div>
          </div>
          <div className="jk-viz">
            <div className="jk-viz-top">
              <span>QUOTE</span>
              <span>INDICATIVE</span>
            </div>
            <p style={{ color: "#fff", fontSize: 28, letterSpacing: "-0.03em", marginTop: 24 }}>
              Alloy. Size. Cut. Dispatch.
            </p>
            <p style={{ color: "#8a8a8a", marginTop: 12, maxWidth: "36ch" }}>
              Round, square, hex, and flat. Stainless, brass, copper, aluminium on the non-ferrous rack.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
