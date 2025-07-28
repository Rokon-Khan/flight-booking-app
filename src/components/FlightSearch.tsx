/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface FlightSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  date?: string;
  airline?: string;
  maxPrice?: number;
}

export const FlightSearch = ({ onSearch }: FlightSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    origin: "",
    destination: "",
    date: "",
    airline: "",
    maxPrice: undefined,
  });

  const handleSearch = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );
    onSearch(cleanFilters);
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
    onSearch({});
  };

  return (
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
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
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
          <Button onClick={handleSearch} variant="flight" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
