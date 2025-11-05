"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Payload = {
  title: string;
  description?: string;
  quantity: number;
  allergies?: string | null;
  event_id?: number | null;
  userinfo_id?: number | null;
};

export default function CreatePostForm({
  onSubmit,
}: {
  onSubmit?: (payload: Payload) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [allergies, setAllergies] = useState("");
  const [eventId, setEventId] = useState<number | null>(null);
  const [userinfoId, setUserinfoId] = useState<number | null>(null);
  const [events, setEvents] = useState<Array<any>>([]);
  const [users, setUsers] = useState<Array<any>>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      if (!supabase) return;
      setLoadingMeta(true);
      try {
        const { data: ev, error: evErr } = await supabase.from("events").select("*");
        if (evErr) {
          console.warn("Failed to load events:", evErr);
        } else if (mounted) {
          setEvents(ev || []);
        }

        const { data: us, error: usErr } = await supabase.from("userinfo").select("*");
        if (usErr) {
          console.warn("Failed to load userinfo:", usErr);
        } else if (mounted) {
          setUsers(us || []);
        }
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    }
    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Payload = {
      title,
      description,
      quantity,
      allergies: allergies || null,
      event_id: eventId ?? null,
      userinfo_id: userinfoId ?? null,
    };

    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(payload);

      // Reset form on success
      setTitle("");
      setDescription("");
      setQuantity(1);
      setAllergies("");
      setEventId(null);
      setUserinfoId(null);
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Allergies</label>
          <input
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. peanuts, dairy"
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Event</label>
          <select
            value={eventId ?? ""}
            onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : null)}
            disabled={!supabase || loadingMeta}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-900"
          >
            <option value="">(none)</option>
            {events.map((ev: any) => (
              <option key={ev.id} value={ev.id}>
                {ev.name || ev.title || `event:${ev.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Posted by (user)</label>
        <select
          value={userinfoId ?? ""}
          onChange={(e) => setUserinfoId(e.target.value ? Number(e.target.value) : null)}
          disabled={!supabase || loadingMeta}
          className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-900"
        >
          <option value="">(none)</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.username || u.name || `user:${u.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Creating…" : "Create Post"}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {supabase ? "connected" : "offline / no supabase"}
        </span>
      </div>
    </form>
  );
}