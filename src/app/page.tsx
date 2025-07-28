/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import heroImage from "@/assets/Flight-aviation-Image.png";
import { FlightCard } from "@/components/FlightCard";
import { FlightSearch, type SearchFilters } from "@/components/FlightSearch";
import { Navbar } from "@/components/navbar";
import { SeatBooking } from "@/components/SeatBooking";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type Booking, type Flight } from "@/schemas/flight";
import Image from "next/image";
import { useState } from "react";

// Mock flight data
const mockFlights: Flight[] = [
  {
    airline: "SkyWings Airlines",
    flight_number: "SW123",
    origin: "New York",
    destination: "London",
    date: "2024-12-01",
    time: "10:00 AM",
    price: 650,
    seats: ["1A", "1B", "1C", "2A", "2B", "3A", "3B", "4A"],
  },
  {
    airline: "CloudJet",
    flight_number: "CJ456",
    origin: "Los Angeles",
    destination: "Tokyo",
    date: "2024-12-02",
    time: "2:30 PM",
    price: 850,
    seats: ["1A", "1B", "2A", "2B", "3A", "3B"],
  },
  {
    airline: "Airways Express",
    flight_number: "AE789",
    origin: "Chicago",
    destination: "Paris",
    date: "2024-12-03",
    time: "6:15 PM",
    price: 720,
    seats: ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4A"],
  },
];

const FlightsPage = () => {
  const [flights, setFlights] = useState<Flight[]>(mockFlights);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(mockFlights);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = flights;

    if (filters.origin) {
      filtered = filtered.filter((flight) =>
        flight.origin.toLowerCase().includes(filters.origin!.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter((flight) =>
        flight.destination
          .toLowerCase()
          .includes(filters.destination!.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter((flight) => flight.date === filters.date);
    }

    if (filters.airline) {
      filtered = filtered.filter((flight) =>
        flight.airline.toLowerCase().includes(filters.airline!.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((flight) => flight.price <= filters.maxPrice!);
    }

    setFilteredFlights(filtered);
  };

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowBooking(true);
  };

  const handleBookingComplete = (booking: Booking) => {
    console.log("Booking completed:", booking);
    setShowBooking(false);
    setSelectedFlight(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {/* <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      > */}
      <div className="relative h-96 flex items-center justify-center">
        <Image
          src={heroImage}
          alt="Hero image"
          fill
          className="object-cover object-center"
          priority={true}
          placeholder="blur"
        />

        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg md:text-xl">
            Book with confidence, fly with comfort
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Section */}
        <FlightSearch onSearch={handleSearch} />

        {/* Results Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Available Flights ({filteredFlights.length})
          </h2>

          {filteredFlights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No flights found. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFlights.map((flight) => (
                <FlightCard
                  key={flight.flight_number}
                  flight={flight}
                  onBook={handleBookFlight}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedFlight && (
            <SeatBooking
              flight={selectedFlight}
              onBookingComplete={handleBookingComplete}
              onClose={() => setShowBooking(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlightsPage;
