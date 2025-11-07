import { AuthButton } from "@/components/auth-button";

export function Header() {
  return (
    <header className="max-w-4xl mx-auto mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Spark!Bytes</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
