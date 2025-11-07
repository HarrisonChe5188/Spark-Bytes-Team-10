import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewFoodButton } from "@/components/new-food-button";
import AllFoodList from "@/components/all-food-list";

export default async function FeedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="w-full space-y-6">
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <NewFoodButton />
        </div>
        <AllFoodList />
      </section>
    </main>
  );
}
