import { z } from "zod";

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["Male", "Female", "Other"], {
    error: "Please select a gender",
  }),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const flightSchema = z.object({
  airline: z.string().min(1, "Airline is required"),
  flight_number: z.string().min(1, "Flight number is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.number().min(0, "Price must be positive"),
  seats: z.array(z.string()).min(1, "At least one seat is required"),
});

export const seatBookingSchema = z.object({
  flightId: z.string().min(1, "Flight ID is required"),
  seatNumber: z.string().min(1, "Seat number is required"),
  passengerName: z.string().min(2, "Passenger name is required"),
  passengerEmail: z.string().email("Invalid email address"),
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type Flight = z.infer<typeof flightSchema>;
export type SeatBooking = z.infer<typeof seatBookingSchema>;
