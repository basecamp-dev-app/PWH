import Link from "next/link";

import { navItems } from "@/features/shell/config/nav-items";

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <div>
        <p className="eyebrow">Workflow Dashboard</p>
        <h1 className="app-sidebar__title">JDB V1</h1>
      </div>
      <nav className="app-sidebar__nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="app-sidebar__link">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
