/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import HeroSection from "@/components/HeroSection";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { SeatBooking } from "@/components/SeatBooking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { Clock, DollarSign, MapPin, Plane } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Flight {
  _id: string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Seat {
  _id: string;
  flightId: string;
  seatNumber: string;
  isBooked: boolean;
  bookedBy: string | null;
  reservedAt: string | null;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface BookedSeat {
  seatId: string;
  seatNumber: string;
}

export default function FlightDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  // Booking/confirmation state
  const [bookedSeatIds, setBookedSeatIds] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch flight and seats
  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/flights/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch flight");
        const data = await response.json();
        setFlight(data.data.flight);
        setSeats(data.data?.seats);

        // Try to get userId if already booked
        const bookedBySeat = data.data?.seats?.find(
          (seat: Seat) => seat?.isBooked && seat?.bookedBy
        );
        if (bookedBySeat?.bookedBy) {
          setUserId(bookedBySeat.bookedBy);
        }
      } catch (err) {
        setFlight(null);
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFlight();
  }, [id]);

  // Handle booking seats
  const handleBookFlight = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setShowBooking(true);
  };

  // Called from SeatBooking when booking complete
  const handleBookingComplete = (booking: { seatIds: string[] }) => {
    setShowBooking(false);
    setBookedSeatIds(booking.seatIds);
    // After booking, get userId from freshly booked seats
    if (booking.seatIds && booking.seatIds.length > 0) {
      const bookedBy = seats.find(
        (s) => s._id === booking.seatIds[0]
      )?.bookedBy;
      if (bookedBy) setUserId(bookedBy);
    }
  };

  // Confirm booking dialog and logic
  const handleConfirmClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    setConfirming(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flightId: id,
            seatIds: bookedSeatIds,
          }),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result?.message || "Failed to confirm booking.");
        setConfirmDialogOpen(false);
        setConfirming(false);
        return;
      }
      toast.success("Booking confirmed!");
      setConfirmSuccess(true);
      setConfirmDialogOpen(false);
    } catch (error) {
      toast.error("Failed to confirm booking.");
    } finally {
      setConfirming(false);
    }
  };

  // My Booking navigation
  const handleMyBooking = () => {
    if (!userId) {
      toast.error("User ID not found. Please try again.");
      return;
    }
    router.push(`/my-booking/${userId}`);
  };

  const checkConfirmedBooking = async () => {
    // Get token and decode userId
    const token = Cookies.get("token");
    if (!token) return;
    // For now, use the userId from state if available
    if (!userId) return;

    // Fetch user bookings
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) return;
    const data = await res.json();
    // Find a booking for this flight and status Confirmed
    const booking = (data.data || []).find(
      (b: any) => b.flightId._id === id && b.bookingStatus === "Confirmed"
    );
    if (booking) {
      setConfirmSuccess(true);
      setBookedSeatIds(booking.seatsBooked.map((s: any) => s._id));
      setUserId(booking.userId);
    }
  };

  // Then call this in useEffect after seats/flight have loaded:
  useEffect(() => {
    if (flight && seats.length > 0) {
      checkConfirmedBooking();
    }
  }, [flight, seats]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!flight) {
    return <div>Flight not found.</div>;
  }

  // Booked seat info
  const bookedSeats = seats.filter((s) => bookedSeatIds.includes(s._id));

  return (
    <>
      <HeroSection />
      <div className="max-w-2xl mx-auto -mt-32  relative">
        <Card className="w-full shadow-card mt-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{flight.airline}</h3>
              </div>
              <Badge variant="outline" className="font-mono">
                {flight.flight_number}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{flight.origin}</span> →{" "}
                  <span className="font-medium">{flight.destination}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {flight.date} at {flight.time}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-lg font-semibold text-accent">
                ${flight.price}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-4">
              {seats.map((seat) => (
                <Badge
                  key={seat._id}
                  variant={seat.isBooked ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {seat.seatNumber} {seat.isBooked ? "(Booked)" : ""}
                </Badge>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row items-center">
              <Button
                onClick={handleBookFlight}
                variant="flight"
                size="lg"
                disabled={
                  !flight.availability || seats.every((s) => s.isBooked)
                }
                className="w-full sm:w-auto"
              >
                Book Flight
              </Button>
              <Button
                onClick={handleConfirmClick}
                variant="premium"
                size="lg"
                className="w-full sm:w-auto"
                disabled={bookedSeatIds.length === 0 || confirmSuccess}
              >
                Confirm Booking
              </Button>
              <Button
                onClick={handleMyBooking}
                variant="flight"
                size="lg"
                className="w-full sm:w-auto"
                disabled={!confirmSuccess}
              >
                My Booking
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Dialog */}
        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {flight && seats && (
              <SeatBooking
                flight={{
                  ...flight,
                  seats: seats
                    .filter((s) => !s.isBooked)
                    .map((s) => s.seatNumber),
                  seatIds: seats.filter((s) => !s.isBooked).map((s) => s._id),
                }}
                onBookingComplete={handleBookingComplete}
                onClose={() => setShowBooking(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Booking Alert */}
        <AlertDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm your booking for seat
                {bookedSeatIds.length > 1 ? "s" : ""}{" "}
                {bookedSeats.map((s) => s.seatNumber).join(", ")}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={confirming}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBooking}
                disabled={confirming}
              >
                {confirming ? "Confirming..." : "Yes, Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
