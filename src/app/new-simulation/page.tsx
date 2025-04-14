import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import NewSimulationClient from "./new-simulation-client";

export default async function NewSimulationPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <NewSimulationClient user={data.user} />;
}
