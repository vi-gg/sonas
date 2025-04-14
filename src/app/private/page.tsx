import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";
import { signOut } from "../auth/actions";
import { Button } from "@/components/ui/button";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <p>Hello {data.user.email}</p>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  );
}
