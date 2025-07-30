/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import FlightCard from "@/components/FlightCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

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
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  date?: string;
  airline?: string;
  maxPrice?: number;
}

export const FlightSearch = ({
  onSearch,
}: {
  onSearch?: (filters: SearchFilters) => void;
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    origin: "",
    destination: "",
    date: "",
    airline: "",
    maxPrice: undefined,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    // Call API directly (ignoring the onSearch prop, since we're handling UI here)
    setLoading(true);
    setFlights([]);

    const params = new URLSearchParams();
    if (cleanFilters.origin)
      params.append("origin", cleanFilters.origin as string);
    if (cleanFilters.destination)
      params.append("destination", cleanFilters.destination as string);
    if (cleanFilters.date) params.append("date", cleanFilters.date as string);
    if (cleanFilters.airline)
      params.append("airline", cleanFilters.airline as string);
    if (cleanFilters.maxPrice)
      params.append("maxPrice", String(cleanFilters.maxPrice));

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/flights/search?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("Failed to search flights");
      const data = await res.json();
      setFlights(data.data.flights || []);
      setModalOpen(true);
    } catch {
      setFlights([]);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const emptyFilters = {
      origin: "",
      destination: "",
      date: "",
      airline: "",
      maxPrice: undefined,
    };
    setFilters(emptyFilters);
    setFlights([]);
    setModalOpen(false);
    onSearch?.({});
  };

  return (
    <>
      <Card className="w-full shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Search Flights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From</label>
              <Input
                placeholder="Origin city"
                value={filters.origin}
                onChange={(e) =>
                  setFilters({ ...filters, origin: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input
                placeholder="Destination city"
                value={filters.destination}
                onChange={(e) =>
                  setFilters({ ...filters, destination: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Airline</label>
              <Input
                placeholder="Airline name"
                value={filters.airline}
                onChange={(e) =>
                  setFilters({ ...filters, airline: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Price ($)
              </label>
              <Input
                type="number"
                placeholder="Maximum price"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              variant="flight"
              className="flex-1"
              disabled={loading}
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search Flights"}
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show results in shadcn modal */}
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
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No flights found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
