"use client";

import { useRouter } from "next/navigation";

export function NewFoodButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/food/new")}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Add New Food
    </button>
  );
}
