"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function NewFood() {
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("food")
        .insert({
          name,
          allergies,
          total_quantity: Number(quantity),
          quantity_left: Number(quantity),
        })
        .select();

      if (error) throw new Error(error.message);

      setMessage(`Food "${data[0].name}" created successfully!`);
      setName("");
      setAllergies("");
      setQuantity("");
    } catch (err: any) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl border border-gray-200 bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-center">Add New Food</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Total Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? "Creating..." : "Create Food"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
