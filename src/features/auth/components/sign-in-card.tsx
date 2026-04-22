import { signInAction } from "@/features/auth/server/actions";

export function SignInCard({
  errorMessage,
  magicLinkSent,
}: {
  errorMessage?: string;
  magicLinkSent?: boolean;
}) {
  return (
    <div className="login-page">
      <section className="panel login-card">
        <p className="eyebrow">PWH V1</p>
        <h1>Sign in</h1>
        {magicLinkSent ? (
          <p className="muted">
            Check your email for the sign-in link. Click the link to sign in
            to your workspace.
          </p>
        ) : (
          <>
            <p className="muted">
              Internal workspace for traded flow, intraday review, and
              reporting. Sign in with your email to receive a magic link.
            </p>
            <form className="login-form" action={signInAction}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                />
              </label>
              {errorMessage ? (
                <p className="login-error">{errorMessage}</p>
              ) : null}
              <button type="submit">Send magic link</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
