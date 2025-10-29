"use client";

import React, { useState } from "react";
import CreatePostForm from "./CreatePostForm";

export default function Tabs() {
  const [active, setActive] = useState<"feed" | "create">("feed");

  function onSubmit(payload: {
    title: string;
    description: string;
    quantity: number;
  }) {
    // This is where you'd send the payload to Supabase once configured.
    // For now we log and show a small browser alert for feedback.
    console.log("Submitted (stub):", payload);
    try {
      // small UX feedback
      // eslint-disable-next-line no-alert
      alert("Post created (stub) — check console for payload.");
    } catch {}
    setActive("feed");
  }

  return (
      <div className="bg-transparent">
        <nav className="flex gap-3 mb-6 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-md w-fit">
          <button
              onClick={() => setActive("feed")}
              className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 ${
                  active === "feed"
                      ? "bg-red-600 text-white shadow-md scale-105"
                      : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
             Feed
          </button>
          <button
              onClick={() => setActive("create")}
              className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 ${
                  active === "create"
                      ? "bg-red-600 text-white shadow-md scale-105"
                      : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            ️ Create Post
          </button>
        </nav>

        <section className="transition-all duration-300">
          {active === "feed" ? (
              <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Available Posts
                  </h2>
                  <div className="text-6xl">🍕</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No posts yet — switch to "Create Post" to share some food!
                  </p>
                </div>
              </div>
          ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                   Share Your Food
                </h2>
                <CreatePostForm onSubmit={onSubmit} />
              </div>
          )}
        </section>
      </div>
  );
}