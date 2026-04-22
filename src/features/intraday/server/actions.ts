"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { normalizeTrackedKey } from "@/lib/formatters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createTrackedOrderAction(formData: FormData) {
  const user = await requireUser();
  const line = String(formData.get("line") ?? "").trim();

  if (!line) {
    throw new Error("Tracked order text is required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tracked_orders").insert({
    line,
    normalized_key: normalizeTrackedKey(line),
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/intraday");
}

export async function updateTrackedOrderAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const line = String(formData.get("line") ?? "").trim();

  if (!id || !line) {
    throw new Error("Tracked order update requires both id and line.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tracked_orders").update({
    line,
    normalized_key: normalizeTrackedKey(line),
    updated_by: user.id,
  }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/intraday");
}

export async function deleteTrackedOrderAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Tracked order delete requires an id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tracked_orders").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/intraday");
}
