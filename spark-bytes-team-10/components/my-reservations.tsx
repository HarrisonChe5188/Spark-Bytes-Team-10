"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ReservedFood {
  id: string;
  created_at: string;
  status: string;
  posts: {
    id: number;
    title: string;
    description?: string;
    quantity_left: number;
    total_quantity: number;
    created_at?: string;
    image_path?: string | null;
  };
}

// Helper component to render image with public URL
function ReservationImage({ imagePath, title }: { imagePath: string; title: string }) {
  const supabase = createClient();
  let imageUrl: string | null = null;
  try {
    const { data } = supabase.storage.from('food_pictures').getPublicUrl(imagePath);
    imageUrl = data?.publicUrl || null;
  } catch (err) {
    imageUrl = null;
  }

  if (!imageUrl) return null;

  return (
    <img src={imageUrl} alt={title} className="w-32 h-32 object-cover rounded-md" />
  );
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<ReservedFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations");
      
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      setCancelingId(reservationId);
      const response = await fetch(`/api/reservations?id=${reservationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      // Refresh the list
      await fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel reservation");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading your reservations...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error: {error}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>You haven't reserved any food items yet.</p>
        <p className="text-sm mt-2">Browse available food and click "I'm interested" to reserve!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
      
      {reservations.map((reservation) => (
        <Card key={reservation.id} className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{reservation.posts.title}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Reserved on {new Date(reservation.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              reservation.status === 'reserved' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {reservation.status}
            </span>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4">
              {/* Image */}
              {reservation.posts.image_path && (
                <div className="flex-shrink-0">
                  <ReservationImage imagePath={reservation.posts.image_path} title={reservation.posts.title} />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 space-y-3">
                {reservation.posts.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reservation.posts.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="font-semibold">
                        {reservation.posts.quantity_left}/{reservation.posts.total_quantity}
                      </p>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(reservation.posts.quantity_left / reservation.posts.total_quantity) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={cancelingId === reservation.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                    {cancelingId === reservation.id ? "Canceling..." : "Cancel"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
