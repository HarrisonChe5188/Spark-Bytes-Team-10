"use client";

import React, { useState } from "react";

export default function CreatePostForm({
                                         onSubmit,
                                       }: {
  onSubmit?: (payload: {
    title: string;
    description: string;
    quantity: number;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, description, quantity };
    // For now we only log: connection to Supabase will be added later.
    // Replace console.log with a call to the Supabase client when ready.
    console.log("Create post payload:", payload);
    if (onSubmit) onSubmit(payload);
    // Reset form
    setTitle("");
    setDescription("");
    setQuantity(1);
  }

  return (
      <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700"
      >
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all"
              placeholder="e.g. Leftover sandwiches"
              required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all resize-none"
              rows={4}
              placeholder="Details (location, pickup instructions, best before, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Quantity
          </label>
          <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-32 rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200"
          >
             Create Post
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          placeholder mode
        </span>
        </div>
      </form>
  );
}