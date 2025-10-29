import Tabs from "../components/Tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-red-800 to-red-900 dark:from-red-900 dark:to-black p-6 sm:p-12">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-white">Spark Bytes!</h1>
        <p className="text-sm text-red-100">
          Share available food or claim a bite 🍽️
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <Tabs />
      </main>
    </div>
  );
}
