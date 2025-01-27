"use client";
import Events from "@/components/events";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const user =  await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
  <Events/>
  );
}
