"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import ProfileDropdown from "@/components/profile-dropdown";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isPostPage = pathname === "/post";

  return (
    <header className="max-w-4xl mx-auto mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Spark!Bytes</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <button
            onClick={() => router.push(isPostPage ? "/home" : "/post")}
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
          >
            {isPostPage ? "Home" : "Post"}
          </button>
          <button
            onClick={() => router.push("/reservations")}
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
          >
            My Reservations
          </button>
          <ProfileDropdown>
            <LogoutButton />
          </ProfileDropdown>
        </nav>
      </div>
    </header>
  );
}
