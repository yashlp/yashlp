import { ABOUT_BODY, ABOUT_INTRO, ABOUT_STATS, CUTTING_SERVICES } from "@/lib/metals/about-content";

export function NoxAbout() {
  return (
    <section id="about" className="nox-section nox-about">
      <div className="nox-container">
        <p className="nox-eyebrow">About us</p>
        <h2 className="nox-h2">About Jagetiya Metals</h2>
        <p className="nox-about-intro">{ABOUT_INTRO}</p>

        <div className="nox-about-grid">
          <div className="nox-about-main">
            <div className="nox-about-badge">
              <span className="nox-about-badge-title">Jagetiya Metals</span>
              <span className="nox-about-badge-meta">Since 1990 · Vadodara, Gujarat</span>
            </div>
            {ABOUT_BODY.map((para) => (
              <p key={para.slice(0, 40)} className="nox-body">
                {para}
              </p>
            ))}
          </div>

          <div className="nox-about-stats">
            {ABOUT_STATS.map((stat) => (
              <article key={stat.title} className="nox-about-stat">
                <h3>{stat.title}</h3>
                <p className="nox-about-stat-sub">{stat.subtitle}</p>
                <p className="nox-about-stat-desc">{stat.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="nox-cutting-banner">
          <div>
            <p className="nox-eyebrow">Precision cutting services</p>
            <h3 className="nox-h3">{CUTTING_SERVICES.title}</h3>
            <p className="nox-body">{CUTTING_SERVICES.description}</p>
          </div>
          <ul className="nox-cutting-list">
            {CUTTING_SERVICES.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
