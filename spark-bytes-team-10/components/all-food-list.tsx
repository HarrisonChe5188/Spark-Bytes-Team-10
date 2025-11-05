"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import FoodCard from "./food-card";

export default function FoodList() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      const { data, error } = await supabase.from("food").select("*");
      if (error) console.error("Error fetching foods:", error);
      else setFoods(data || []);
      setLoading(false);
    };

    fetchFoods();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (foods.length === 0)
    return <p className="text-center mt-10 text-gray-500">No foods available.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}
