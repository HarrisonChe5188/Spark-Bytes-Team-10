"use client";

import { supabase } from "@/lib/supabase/client"; // use the exported client
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // use the imported supabase
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
      Logout
    </Button>
  );
}
