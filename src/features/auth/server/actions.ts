"use server";

import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendMagicLinkEmail } from "@/lib/email";

export async function setSessionAction(accessToken: string, refreshToken: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return { error };
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.generateLink({
    email,
    type: "magiclink",
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const link = data.properties?.action_link;
  if (!link) {
    redirect(`/login?error=${encodeURIComponent("Failed to generate magic link")}`);
  }

  try {
    await sendMagicLinkEmail(email, link);
  } catch {
    redirect(`/login?error=${encodeURIComponent("Failed to send magic link email")}`);
  }

  redirect("/login?magicLinkSent=true");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
