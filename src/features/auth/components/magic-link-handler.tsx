"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionFromUrl } from "@/lib/supabase/browser";
import { setSessionAction } from "@/features/auth/server/actions";

export function MagicLinkHandler() {
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    async function handleMagicLink() {
      try {
        const tokens = getSessionFromUrl();
        if (!tokens) {
          setStatus("no tokens");
          return;
        }

        const result = await setSessionAction(tokens.accessToken, tokens.refreshToken);
        if (result.error) {
          console.error("Magic link session error:", result.error);
          setStatus("error");
          return;
        }

        window.location.hash = "";
        router.push("/");
      } catch (err) {
        console.error("Magic link error:", err);
        setStatus("error");
      }
    }

    handleMagicLink();
  }, [router]);

  if (status === "checking") {
    return (
      <div className="login-page">
        <div className="panel login-card">
          <p className="eyebrow">PWH V1</p>
          <h1>Signing you in...</h1>
          <p className="muted">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="login-page">
        <div className="panel login-card">
          <p className="eyebrow">PWH V1</p>
          <h1>Sign in failed</h1>
          <p className="muted">The sign-in link may be expired or invalid. Please request a new magic link.</p>
          <a href="/login" className="text-link">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return null;
}