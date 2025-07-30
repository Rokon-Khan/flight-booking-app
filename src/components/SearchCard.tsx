/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FlightCard from "./FlightCard";

// The result card below is just a placeholder. Replace with your actual FlightCard or similar for showing results.
// import FlightCard from "@/components/FlightCard";

export interface Flight {
  _id: string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  seats: string[];
}

const SearchCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Advanced params (add UI for these if needed)
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [airline, setAirline] = useState<string | undefined>();
  const [page] = useState<number>(1);
  const [limit] = useState<number>(10);

  useEffect(() => {
    if (flights.length > 0) setModalOpen(true);
  }, [flights]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFlights([]);

    // Determine which fields to send for the API
    // For demonstration: if searchTerm matches a flight number, airline, or destination
    // You can enhance this logic for more advanced field mapping
    const params: Record<string, string | number | undefined> = {
      page,
      limit,
    };

    // Simple parsing logic
    if (searchTerm) {
      // If searchTerm is a flight number (all numbers or letters+numbers)
      if (/^[a-zA-Z]{1,3}\d{2,4}$/.test(searchTerm.trim())) {
        params.flight_number = searchTerm.trim();
      } else if (/^[a-zA-Z\s]+$/.test(searchTerm.trim())) {
        params.airline = searchTerm.trim();
      } else {
        params.destination = searchTerm.trim();
      }
    }
    if (date) params.date = date;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (airline) params.airline = airline;

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
      )
      .join("&");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flights/search?${queryString}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to search flights");
      const data = await res.json();
      setFlights(data.data.flights || []);
      if ((data.data.flights || []).length === 0) {
        toast.info("No flights found for your search.");
      }
    } catch {
      toast.error("Error searching flights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Card */}
      <Card className="max-w-4xl mx-auto bg-zinc-400/50 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search by destination, airline, or flight number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <Input
                  type="date"
                  className="pl-10 h-12 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                disabled={loading}
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? "Searching..." : "Search Flights"}
              </Button>
            </div>
            {/* Example for advanced search: Uncomment these for more filters */}
            {/* 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Min Price"
                type="number"
                value={minPrice ?? ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                placeholder="Max Price"
                type="number"
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                placeholder="Airline"
                value={airline ?? ""}
                onChange={(e) => setAirline(e.target.value || undefined)}
              />
            </div>
            */}
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl bg-background">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flights.length > 0 ? (
              flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} />
              ))
            ) : (
              <div>No flights found.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchCard;
