import Link from "next/link";

export function SignInCard() {
  return (
    <div className="login-page">
      <section className="panel login-card">
        <p className="eyebrow">PWH V1</p>
        <h1>Platform sign in</h1>
        <p className="muted">
          Internal workspace for traded flow, intraday review, and reporting. Supabase authentication is the next infrastructure pass.
        </p>
        <form className="login-form">
          <label>
            Email
            <input type="email" placeholder="name@company.com" disabled />
          </label>
          <label>
            Password
            <input type="password" placeholder="Auth rollout in progress" disabled />
          </label>
          <button type="button" disabled>
            Authentication Coming Next
          </button>
        </form>
        <Link href="/" className="text-link">
          Enter platform preview
        </Link>
      </section>
    </div>
  );
}
