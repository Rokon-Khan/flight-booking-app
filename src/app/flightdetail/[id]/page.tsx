/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import LoaddingSkeleton from "@/components/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Cookies from "js-cookie";
import { Clock, DollarSign, MapPin, Pencil, Plane, Trash2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/flights/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch flight");
        const data = await res.json();
        setFlight(data.data.flight);
        setSeats(data.data?.seats);
      } catch (err) {
        setFlight(null);
        toast.error("Could not load flight details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFlight();
  }, [id]);

  // Only check for token (no admin logic)
  const hasToken = () => {
    const token = Cookies.get("token");
    return !!token;
  };

  const handleEdit = () => {
    if (!hasToken()) {
      toast.error("You are not authorized");
      return;
    }
    // Implement edit logic or show edit modal
    toast.success("Edit allowed (token verified)");
  };

  const handleDelete = async () => {
    if (!hasToken()) {
      toast.error("You are not authorized");
      return;
    }
    try {
      const token = Cookies.get("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flights/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Flight deleted successfully!");
      router.push("/admin");
    } catch {
      toast.error("Delete failed. You are not authorized");
    }
  };

  if (loading) {
    return <LoaddingSkeleton />;
  }

  if (!flight) {
    return (
      <div className="flex justify-center items-center h-32">
        Flight not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto ">
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
