/* eslint-disable react-hooks/exhaustive-deps */
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
import { bookingSchema, type Booking, type Flight } from "@/schemas/flight";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

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
  //   const { toast } = useToast();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [reservationTime, setReservationTime] = useState<number | null>(null);
  const [isReserved, setIsReserved] = useState(false);

  const form = useForm<Booking>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      flightId: flight.flight_number,
      seatNumber: "",
      passengerName: "",
      passengerEmail: "",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (reservationTime && reservationTime > 0) {
      interval = setInterval(() => {
        setReservationTime((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            setSelectedSeat(null);
            setIsReserved(false);
            form.setValue("seatNumber", "");
            toast(
              "Your seat reservation has expired. Please select a seat again."
            );
            return null;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reservationTime, form, toast]);

  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
    setReservationTime(120); // 2 minutes in seconds
    setIsReserved(true);
    form.setValue("seatNumber", seat);
    toast(
      `Seat ${seat} is reserved for 2 minutes. Please complete your booking.`
    );
  };

  const handleSubmit = (data: Booking) => {
    console.log("Booking data:", data);
    toast(
      `Your seat ${data.seatNumber} on flight ${flight.flight_number} has been booked successfully.`
    );
    onBookingComplete?.(data);
    onClose?.();
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
          <h3 className="text-lg font-semibold mb-4">Select Your Seat</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {flight.seats.map((seat) => (
              <Button
                key={seat}
                variant={selectedSeat === seat ? "default" : "outline"}
                size="sm"
                onClick={() => handleSeatSelect(seat)}
                disabled={isReserved && selectedSeat !== seat}
                className="h-10 w-full"
              >
                {seat}
                {selectedSeat === seat && (
                  <CheckCircle className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Passenger Information Form */}
        {selectedSeat && (
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
                        Seat {selectedSeat} • ${flight.price}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-lg font-semibold"
                    >
                      ${flight.price}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="premium"
                    className="flex-1"
                    disabled={!selectedSeat || !reservationTime}
                  >
                    Confirm Booking (${flight.price})
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
