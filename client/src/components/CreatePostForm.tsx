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
      className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-900"
          placeholder="e.g. Leftover sandwiches"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-gray-900"
          rows={3}
          placeholder="Details (location, pickup instructions, best before, etc.)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-28 rounded border px-3 py-2 bg-gray-50 dark:bg-gray-900"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Post
        </button>
        <span className="text-sm text-gray-500">
          (no external connection yet — placeholder)
        </span>
      </div>
    </form>
  );
}
