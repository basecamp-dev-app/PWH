import Link from "next/link";

import { navItems } from "@/features/shell/config/nav-items";

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <div className="brand-mark">PWH</div>
        <div>
          <p className="eyebrow app-sidebar__eyebrow">Platform</p>
          <h1 className="app-sidebar__title">PWH V1</h1>
          <p className="app-sidebar__subtitle">Trading workflows, intraday flow, and desk reporting.</p>
        </div>
      </div>
      <nav className="app-sidebar__nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="app-sidebar__link">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="app-sidebar__footer">
        <span>Manual local import</span>
        <strong>V1</strong>
      </div>
    </aside>
  );
}
