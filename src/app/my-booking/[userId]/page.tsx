/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Users,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Booking {
  userId: string;
  flightId: {
    airline: string;
    flight_number: string;
    destination: string;
    date: string;
    time: string;
    price: number;
  };
  numberOfSeats: number;
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
  seatsBooked: {
    seatNumber: string;
  }[];
  cancellationDate: string | null;
  bookingDate: string;
}

export default function MyBookingPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data.data || []);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span>Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-red-500">
        {error}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span>No bookings found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="space-y-8">
        {bookings.map((booking, idx) => (
          <Card key={idx} className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {booking.flightId.airline}
                <Badge variant="outline" className="font-mono">
                  {booking.flightId.flight_number}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.flightId.date} at {booking.flightId.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.numberOfSeats} seat
                    {booking.numberOfSeats > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">
                    ${booking.totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">To:</span>
                <span>{booking.flightId.destination}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {booking.seatsBooked.map((seat, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {seat.seatNumber}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-2">
                <Badge
                  variant={
                    booking.bookingStatus === "Confirmed"
                      ? "default"
                      : booking.bookingStatus === "Pending"
                      ? "outline"
                      : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  {booking.bookingStatus === "Confirmed" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {booking.bookingStatus !== "Confirmed" && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {booking.bookingStatus}
                </Badge>
                <Badge
                  variant={
                    booking.paymentStatus === "Paid" ? "default" : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  {booking.paymentStatus}
                </Badge>
              </div>

              <div className="mt-2">
                <span className="block text-xs text-muted-foreground">
                  Booking Date: {new Date(booking.bookingDate).toLocaleString()}
                </span>
                {booking.cancellationDate && (
                  <span className="block text-xs text-red-500">
                    Cancelled at:{" "}
                    {new Date(booking.cancellationDate).toLocaleString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
