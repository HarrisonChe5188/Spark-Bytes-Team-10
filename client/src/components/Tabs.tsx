"use client";

import React, { useState } from "react";
import CreatePostForm from "./CreatePostForm";
import { supabase } from "../lib/supabaseClient";

export default function Tabs() {
  const [active, setActive] = useState<"feed" | "create">("feed");

    async function onSubmit(payload: {
      title: string;
      description?: string;
      quantity: number;
      allergies?: string | null;
      event_id?: number | null;
      userinfo_id?: number | null;
    }) {
    // Try to insert into Supabase 'posts' table.
    try {
      if (!supabase) {
        // Supabase not configured — inform the developer/user and abort.
        // eslint-disable-next-line no-alert
        alert(
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to run this feature."
        );
        // Also log to console with guidance.
        // eslint-disable-next-line no-console
        console.warn(
          "Attempted to create post but Supabase client is not available. Add env vars in client/.env.local or configure the client."
        );
        return;
      }

      const insertPayload = {
        name: payload.title,
        created_at: new Date().toISOString(),
          allergies: payload.allergies ?? null,
        total_quantity: payload.quantity,
          event_id: payload.event_id ?? null,
        quantity_left: payload.quantity,
          userinfo_id: payload.userinfo_id ?? null,
      };

      const { data, error } = await supabase
        .from("food")
        .insert([insertPayload])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        // eslint-disable-next-line no-alert
        alert("Failed to create post: " + error.message);
        return;
      }

      console.log("Inserted post:", data);
      // eslint-disable-next-line no-alert
      alert("Post created — you should see it in the feed (if implemented).");
      setActive("feed");
    } catch (err) {
      console.error("Unexpected error while creating post:", err);
      // eslint-disable-next-line no-alert
      alert("Unexpected error while creating post (see console).");
    }
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

// -- Enable RLS
// ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;

// -- Allow authenticated users to insert only when new row userinfo_id equals auth.uid()
// CREATE POLICY "Auth users can insert their food" ON public.food
//   FOR INSERT
//   TO authenticated
//   WITH CHECK (userinfo_id = auth.uid());