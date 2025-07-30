"use client";
import { BookingCard } from "@/components/BookingCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingsListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to view bookings.");
      setLoading(false);
      return;
    }
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.data || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b._id !== id));
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings found.</div>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
