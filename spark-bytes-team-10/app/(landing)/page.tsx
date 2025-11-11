import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (!error && data?.claims) {
    redirect("/home");
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 sm:px-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-5xl sm:text-6xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Share food.
          <br />
          Reduce waste.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Connect with the BU community to share and discover available food.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/auth/sign-up"
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
          >
            Get started
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or{" "}
            <Link
              href="/auth/login"
              className="text-red-600 dark:text-red-400 font-semibold hover:underline"
            >
              sign in
            </Link>
            {" "}if you already have an account
          </p>
        </div>
      </div>
    </main>
  );
}
