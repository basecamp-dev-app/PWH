import Link from "next/link";

import { homepageCards } from "@/features/shell/config/homepage-cards";

export function HomepageGrid() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Homepage</p>
        <h1>V1 Workflows</h1>
        <p className="muted">
          This replaces the legacy desktop homepage with a clean route-based workflow grid.
        </p>
      </div>
      <div className="card-grid">
        {homepageCards.map((card) => (
          <Link key={card.href} href={card.href} className="panel feature-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
