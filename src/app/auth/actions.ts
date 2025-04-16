"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Error updating password:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    // Still redirect to home even if there's an error
  }

  revalidatePath("/", "layout");
  redirect("/");
}
