import { signOutAction } from "@/features/auth/server/actions";

export function AppHeader({ userEmail }: { userEmail: string }) {
  return (
    <header className="app-header panel">
      <div className="app-header__main">
        <div>
          <p className="eyebrow">PWH Platform</p>
          <h2>Professional workflows with a cleaner operating surface</h2>
        </div>
        <div className="app-header__badges">
          <span className="header-badge">Supabase Runtime</span>
          <span className="header-badge">{userEmail}</span>
          <form action={signOutAction}>
            <button type="submit" className="header-action">Sign out</button>
          </form>
        </div>
      </div>
      <p className="muted">Runtime data, tracked orders, and access control now run through Supabase-backed infrastructure.</p>
    </header>
  );
}
