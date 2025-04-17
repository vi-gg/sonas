"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);

    // Return authentication errors to display on the login page
    if (error.status === 400 || error.status === 401) {
      return {
        error: "Invalid email or password. Please try again.",
        email: data.email,
      };
    }

    // Only redirect to error page for unexpected server errors
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/new-simulation");
}
