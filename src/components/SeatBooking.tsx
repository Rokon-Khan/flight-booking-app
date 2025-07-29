/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { bookingSchema } from "@/schemas/flight";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  seats: string[];
  seatIds: string[];
}

interface Booking {
  flightId: string;
  seatIds: string[];
  passengerName: string;
  passengerEmail: string;
}

interface SeatBookingProps {
  flight: Flight;
  onBookingComplete?: (booking: Booking) => void;
  onClose?: () => void;
}

export const SeatBooking = ({
  flight,
  onBookingComplete,
  onClose,
}: SeatBookingProps) => {
  // Indexes of selected seats
  const [selectedSeatIndexes, setSelectedSeatIndexes] = useState<number[]>([]);
  const [reservationTime, setReservationTime] = useState<number | null>(null);
  const [isReserved, setIsReserved] = useState(false);

  const form = useForm<Booking>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      flightId: flight._id,
      seatIds: [],
      passengerName: "",
      passengerEmail: "",
    },
  });

  // Reservation timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (reservationTime && reservationTime > 0) {
      interval = setInterval(() => {
        setReservationTime((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            setSelectedSeatIndexes([]);
            setIsReserved(false);
            form.setValue("seatIds", []);
            toast(
              "Your seat reservation has expired. Please select seats again."
            );
            return null;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reservationTime, form]);

  // Handle seat selection/deselection for multi-select
  const handleSeatToggle = (idx: number) => {
    setIsReserved(true);
    setReservationTime(120); // 2 minutes in seconds

    setSelectedSeatIndexes((prev) => {
      if (prev.includes(idx)) {
        // Deselect
        const updated = prev.filter((i) => i !== idx);
        form.setValue(
          "seatIds",
          updated.map((i) => flight.seatIds[i])
        );
        return updated;
      } else {
        // Select additional
        const updated = [...prev, idx];
        form.setValue(
          "seatIds",
          updated.map((i) => flight.seatIds[i])
        );
        return updated;
      }
    });
  };

  const handleSubmit = async (data: Booking) => {
    const token = Cookies.get("token");
    if (!token) {
      toast("You must be logged in to book a seat.");
      onClose?.();
      return;
    }

    if (
      !data.seatIds ||
      !Array.isArray(data.seatIds) ||
      data.seatIds.length === 0
    ) {
      toast.error("Please select at least one seat.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flightId: data.flightId,
          seatIds: data.seatIds,
          passengerName: data.passengerName,
          passengerEmail: data.passengerEmail,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData?.message || "Booking failed. Please try again.");
        return;
      }

      toast.success(
        `Your seat${data.seatIds.length > 1 ? "s" : ""} ${selectedSeatIndexes
          .map((i) => flight.seats[i])
          .join(", ")} on flight ${
          flight.flight_number
        } has been booked successfully.`
      );
      onBookingComplete?.(data);
      onClose?.();
    } catch (e) {
      toast.error("Booking failed. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-sky bg-clip-text text-transparent">
          Book Your Seat
        </CardTitle>
        <CardDescription>
          Flight {flight.flight_number}: {flight.origin} → {flight.destination}
        </CardDescription>
        {reservationTime && (
          <div className="flex items-center justify-center space-x-2 text-accent">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-semibold">
              Time remaining: {formatTime(reservationTime)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seat Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Your Seat(s)</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {flight.seats.map((seat, idx) => (
              <Button
                key={seat}
                variant={
                  selectedSeatIndexes.includes(idx) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleSeatToggle(idx)}
                className="h-10 w-full"
              >
                {seat}
                {selectedSeatIndexes.includes(idx) && (
                  <CheckCircle className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Passenger Information Form */}
        {selectedSeatIndexes.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Passenger Information
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="passengerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passenger Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passengerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Booking Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Seats{" "}
                        {selectedSeatIndexes
                          .map((i) => flight.seats[i])
                          .join(", ")}{" "}
                        • ${flight.price} x {selectedSeatIndexes.length}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-lg font-semibold"
                    >
                      ${flight.price * selectedSeatIndexes.length}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="premium"
                    className="flex-1"
                    disabled={
                      selectedSeatIndexes.length === 0 ||
                      !reservationTime ||
                      form.formState.isSubmitting
                    }
                  >
                    Confirm Booking ($
                    {flight.price * selectedSeatIndexes.length})
                  </Button>
                  {onClose && (
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
