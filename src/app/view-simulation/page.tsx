import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import ViewSimulationClient from "./view-simulation-client";

export default async function ViewSimulationPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <ViewSimulationClient user={data.user} />;
}
