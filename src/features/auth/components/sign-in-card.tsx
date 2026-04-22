import { signInAction } from "@/features/auth/server/actions";

export function SignInCard({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="login-page">
      <section className="panel login-card">
        <p className="eyebrow">PWH V1</p>
        <h1>Platform sign in</h1>
        <p className="muted">
          Internal workspace for traded flow, intraday review, and reporting. Sign in with your Supabase-backed workspace credentials.
        </p>
        <form className="login-form" action={signInAction}>
          <label>
            Email
            <input type="email" name="email" placeholder="name@company.com" required />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Password" required />
          </label>
          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}
          <button type="submit">Sign in</button>
        </form>
      </section>
    </div>
  );
}
