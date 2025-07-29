"use client";

import { useEffect, useState } from "react";
import FlightCard from "./FlightCard";

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

export const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/flights`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }

        const data = await response.json();
        setFlights(data.data.flights);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <div>Loading flights...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (flights.length === 0) {
    return <div>No flights available.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Available Flights ({flights.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((flight) => (
          <FlightCard key={flight._id} flight={flight} />
        ))}
      </div>
    </div>
  );
};
