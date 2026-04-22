export function AppHeader() {
  return (
    <header className="app-header panel">
      <div className="app-header__main">
        <div>
          <p className="eyebrow">PWH Platform</p>
          <h2>Professional workflows with a cleaner operating surface</h2>
        </div>
        <div className="app-header__badges">
          <span className="header-badge">Manual Import</span>
          <span className="header-badge">Workflow Parity</span>
        </div>
      </div>
      <p className="muted">Modernized for maintainability now, with Supabase and Bloomberg-ready integration paths next.</p>
    </header>
  );
}
