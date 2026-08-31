import Link from "next/link";

export const metadata = { title: "Cutting" };

export default function CuttingPage() {
  return (
    <div className="jk-page">
      <p className="jk-kicker">JK CUT</p>
      <h1>Cut to size on hydraulic bandsaw.</h1>
      <p className="jk-lead">
        16 mm through 550 mm capacity. Square ends, ready for the lathe or the mill. We cut the bar you bought — not a
        mill remainder you did not.
      </p>
      <div className="jk-pills">
        <span className="jk-pill">16–550 mm</span>
        <span className="jk-pill">−0 / +2 mm typical</span>
        <span className="jk-pill">Mill certs with the heat</span>
      </div>
      <div className="jk-prose" style={{ marginTop: 32 }}>
        <h2>What we cut</h2>
        <p>
          Round, square, hex, and flat in carbon, alloy, and tool steels. Forging lots for heavy section. Stainless and
          non-ferrous by request on the same saw schedule.
        </p>
        <h2>How to order a cut</h2>
        <p>
          Send grade, size, cut length, and quantity. If the exact diameter is not on the rack we quote the nearest
          above and below so you can decide whether to turn or wait.
        </p>
        <p>
          <Link href="/metals/quote">Open the quote tool</Link>
        </p>
      </div>
    </div>
  );
}
