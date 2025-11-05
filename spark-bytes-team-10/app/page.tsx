import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NewFoodButton } from "@/components/new-food-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-black dark:to-red-950 p-6 sm:p-12">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <div className="inline-block bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-full shadow-lg">
          <h1 className="text-4xl font-bold">Spark Bytes!</h1>
        </div>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Share available food across BU.
        </p>

        {/* Simple nav */}
        <nav className="mt-4 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/about"
            className="text-red-600 dark:text-red-400 font-semibold hover:underline"
          >
            About
          </Link>
          <ThemeSwitcher />
          <AuthButton />
        </nav>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <NewFoodButton />
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Spark Bytes — Team 10
      </footer>
    </div>
  );
}
