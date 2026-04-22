import Link from "next/link";

export function SignInCard() {
  return (
    <div className="login-page">
      <section className="panel login-card">
        <p className="eyebrow">JDB V1</p>
        <h1>Sign in</h1>
        <p className="muted">
          V1 keeps auth lightweight while the legacy Python app remains the reference implementation.
        </p>
        <form className="login-form">
          <label>
            Email
            <input type="email" placeholder="name@company.com" disabled />
          </label>
          <label>
            Password
            <input type="password" placeholder="Supabase Auth wiring next" disabled />
          </label>
          <button type="button" disabled>
            Supabase Auth Coming Next
          </button>
        </form>
        <Link href="/" className="text-link">
          Enter V1 preview
        </Link>
      </section>
    </div>
  );
}
