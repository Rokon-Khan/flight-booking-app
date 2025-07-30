/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function BookingEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  type Booking = {
    _id: string;
    numberOfSeats: number;
    totalPrice: number;
    bookingStatus: string;
    paymentStatus: string;
    cancellationDate?: string;
  };

  const [booking, setBooking] = useState<Booking | null>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to edit booking.");
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data.data);
        reset({
          numberOfSeats: data.data.numberOfSeats,
          totalPrice: data.data.totalPrice,
          bookingStatus: data.data.bookingStatus,
          paymentStatus: data.data.paymentStatus,
          cancellationDate: data.data.cancellationDate || "",
        });
      } catch {
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to update booking.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to update booking");
      toast.success("Booking updated!");
      router.back();
    } catch {
      toast.error("Booking update failed");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!booking)
    return (
      <div className="text-3xl min-h-screen flex justify-center items-center">
        Booking not found
      </div>
    );

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Booking #{booking._id.slice(-6)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Number of Seats</label>
            <Input
              type="number"
              {...register("numberOfSeats", { required: true, min: 1 })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Total Price</label>
            <Input
              type="number"
              {...register("totalPrice", { required: true, min: 0 })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Booking Status</label>
            <Input {...register("bookingStatus", { required: true })} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Payment Status</label>
            <Input {...register("paymentStatus", { required: true })} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Cancellation Date</label>
            <Input type="datetime-local" {...register("cancellationDate")} />
          </div>
          <Button type="submit" className="w-full">
            Update Booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
