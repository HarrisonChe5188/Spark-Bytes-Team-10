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
      <nav className="flex gap-2 mb-4">
        <button
          onClick={() => setActive("feed")}
          className={`px-3 py-1 rounded ${
            active === "feed"
              ? "bg-blue-600 text-white"
              : "bg-white/60 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setActive("create")}
          className={`px-3 py-1 rounded ${
            active === "create"
              ? "bg-blue-600 text-white"
              : "bg-white/60 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          }`}
        >
          Create Post
        </button>
      </nav>

      <section>
        {active === "feed" ? (
          <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Available posts</h2>
            <p className="text-sm text-gray-500">
              No posts yet — switch to "Create Post" to add an entry.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-3">Create a post</h2>
            <CreatePostForm onSubmit={onSubmit} />
          </div>
        )}
      </section>
    </div>
  );
}
