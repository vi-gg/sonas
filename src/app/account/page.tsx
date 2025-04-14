import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import AccountClient from "./account-client";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Pass the user data to the client component
  return <AccountClient user={data.user} />;
}
