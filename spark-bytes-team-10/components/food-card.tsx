"use client";

interface FoodCardProps {
  food: {
    name: string;
    allergies?: string;
    quantity_left: number;
    total_quantity: number;
  };
}

export default function FoodCard({ food }: FoodCardProps) {
  const progress = (food.quantity_left / food.total_quantity) * 100;

  return (
    <div className="p-4 border rounded-xl shadow hover:shadow-lg transition bg-white">
      <h2 className="text-lg font-semibold mb-1 text-black">
        {food.name}
      </h2>
      <p className="text-sm mb-2 text-black">
        Allergies: {food.allergies || "None"}
      </p>
      <p className="text-sm text-black mb-2">
        Quantity Left: {food.quantity_left} / {food.total_quantity}
      </p>
      <div className="w-full h-2.5 bg-gray-200 rounded-full">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
