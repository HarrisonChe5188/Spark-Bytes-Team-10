import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MyReservations from "@/components/my-reservations";

export const metadata = {
  title: "My Reservations - Spark Bytes",
  description: "View your food reservations",
};

export default async function ReservationsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-black dark:to-red-950 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Reservations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all the food items you're interested in
          </p>
        </div>

        <MyReservations />
      </div>
    </div>
  );
}
