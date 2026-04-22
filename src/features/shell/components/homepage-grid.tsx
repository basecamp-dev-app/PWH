import Link from "next/link";

import { homepageCards } from "@/features/shell/config/homepage-cards";

export function HomepageGrid() {
  return (
    <section className="page-stack">
      <div className="hero-panel panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">PWH Command Center</p>
          <h1>Trading workflows in a cleaner, faster operating surface</h1>
          <p className="muted">
            V1 replaces the legacy desktop shell with a route-based workspace focused on intraday decisions, reporting, and operational clarity.
          </p>
        </div>
        <div className="hero-panel__stats">
          <div className="hero-stat">
            <span className="muted">Workflows</span>
            <strong>5</strong>
          </div>
          <div className="hero-stat">
            <span className="muted">Import Mode</span>
            <strong>Local</strong>
          </div>
          <div className="hero-stat">
            <span className="muted">Design Goal</span>
            <strong>Professional</strong>
          </div>
        </div>
      </div>
      <div className="card-grid">
        {homepageCards.map((card) => (
          <Link key={card.href} href={card.href} className="panel feature-card">
            <div className="feature-card__meta">
              <span className="feature-card__tag">Workflow</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span className="feature-card__cta">Open workspace</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
