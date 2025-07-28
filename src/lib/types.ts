export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  role: "user" | "admin";
}

export interface Flight {
  _id: string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  seats?: string[];
  available_seats?: string[];
  booked_seats?: string[];
}

export interface Booking {
  id: string;
  flightId: string;
  userId: string;
  seatNumber: string;
  passengerName: string;
  passengerEmail: string;
  status: "confirmed" | "reserved" | "cancelled";
  reservedUntil?: Date;
  createdAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
