import { Resend } from "resend";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendMagicLinkEmail(email: string, link: string) {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: "PWH <onboarding@resend.dev>",
    to: email,
    subject: "Sign in to your workspace",
    html: `
      <p>Click the link below to sign in to your workspace:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  if (error) {
    console.error("Failed to send magic link email:", error);
    throw new Error("Failed to send email");
  }
}