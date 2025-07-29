/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SeatBooking } from "@/components/SeatBooking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { Clock, DollarSign, MapPin, Plane } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function FlightDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

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
        setSeats(data.data.seats);
      } catch (err) {
        setFlight(null);
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFlight();
  }, [id]);

  const handleBookFlight = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setShowBooking(true);
  };

  if (loading) {
    return <div>Loading flight details...</div>;
  }

  if (!flight) {
    return <div>Flight not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
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

          <div className="mt-6">
            <Button
              onClick={handleBookFlight}
              variant="flight"
              size="lg"
              disabled={!flight.availability || seats.every((s) => s.isBooked)}
              className="w-full"
            >
              Book Flight
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
              onBookingComplete={() => setShowBooking(false)}
              onClose={() => setShowBooking(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
