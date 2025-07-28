import { z } from "zod";

export const flightSchema = z.object({
  airline: z.string().min(2, "Airline name must be at least 2 characters"),
  flight_number: z
    .string()
    .min(3, "Flight number must be at least 3 characters"),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  seats: z.array(z.string()).min(1, "At least one seat must be available"),
});

export const bookingSchema = z.object({
  flightId: z.string().min(1, "Flight ID is required"),
  seatNumber: z.string().min(1, "Seat number is required"),
  passengerName: z
    .string()
    .min(2, "Passenger name must be at least 2 characters"),
  passengerEmail: z.string().email("Please enter a valid email address"),
});

export type Flight = z.infer<typeof flightSchema>;
export type Booking = z.infer<typeof bookingSchema>;
