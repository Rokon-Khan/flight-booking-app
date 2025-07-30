/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BookingCard({
  booking,
  onDelete,
}: {
  booking: any;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const token = Cookies.get("token");

  const handleEdit = () => {
    router.push(`/booking/${booking._id}`);
  };

  const handleDelete = async () => {
    if (!token) {
      toast.error("You must be logged in to delete booking.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Booking deleted successfully");
      onDelete(booking._id);
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Booking #{booking._id.slice(-6)}</CardTitle>
      </CardHeader>
      <CardContent>
        {booking.flightId ? (
          <div className="mb-2">
            <div>
              <b>Flight:</b> {booking.flightId.airline} (
              {booking.flightId.flight_number})
            </div>
            <div>
              <b>Route:</b> {booking.flightId.origin} &rarr;{" "}
              {booking.flightId.destination}
            </div>
            <div>
              <b>Date/Time:</b> {booking.flightId.date} {booking.flightId.time}
            </div>
          </div>
        ) : (
          <div className="mb-2 text-sm text-muted-foreground">
            No flight info
          </div>
        )}
        <div>
          <b>Seats Booked:</b>{" "}
          {booking.seatsBooked?.map((s: any) => s.seatNumber).join(", ") ||
            "N/A"}
        </div>
        <div>
          <b>Booking Status:</b> {booking.bookingStatus}
        </div>
        <div>
          <b>Payment Status:</b> {booking.paymentStatus}
        </div>
        <div>
          <b>Total Price:</b> ${booking.totalPrice}
        </div>
        <div>
          <b>Booked At:</b> {new Date(booking.bookingDate).toLocaleString()}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
