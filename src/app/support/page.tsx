import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import SupportClient from "./support-client";

export default async function SupportPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <SupportClient user={data.user} />;
}
