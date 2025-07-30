/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
// import FlightCard from "@/components/FlightCard";
import FlightCard from "@/components/admin-flight-card/FlightCard";
import { FlightForm } from "@/components/FlightForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlightType } from "@/schemas/flight";
import Cookies from "js-cookie";
import { Plus, Settings } from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [editingFlight, setEditingFlight] = useState<FlightType | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all flights if token exists
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to manage flights.");
      setLoading(false);
      return;
    }
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch flights");
        const data = await res.json();
        setFlights(data.data.flights || []);
      } catch (err) {
        toast.error("Failed to load flights.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleAddFlight = async (newFlight: Omit<FlightType, "_id">) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to add a flight.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFlight),
      });
      if (!res.ok) throw new Error("Failed to add flight");
      const data = await res.json();
      setFlights((prev) => [...prev, data.data.flight]);
      toast.success(
        `Flight ${data.data.flight.flight_number} has been added successfully.`
      );
      setShowAddDialog(false);
    } catch {
      toast.error("Failed to add flight.");
    }
  };

  const handleEditFlight = (flight: FlightType) => {
    setEditingFlight(flight);
    setShowEditDialog(true);
  };

  const handleUpdateFlight = async (updatedFlight: FlightType) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to update & add a flight.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flights/${updatedFlight._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFlight),
        }
      );
      if (!res.ok) throw new Error("Failed to update flight");
      const data = await res.json();
      setFlights((prev) =>
        prev.map((f) => (f._id === updatedFlight._id ? data.data.flight : f))
      );
      toast.success(
        `Flight ${data.data.flight.flight_number} has been updated successfully.`
      );
      setShowEditDialog(false);
      setEditingFlight(null);
    } catch {
      toast.error("Failed to update flight.");
    }
  };

  const handleDeleteFlight = async (flight: FlightType) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You must be logged in to delete a flight.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flights/${flight._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete flight");
      setFlights((prev) => prev.filter((f) => f._id !== flight._id));
      toast.success(
        `Flight ${flight.flight_number} has been deleted successfully.`
      );
    } catch {
      toast.error("Failed to delete flight.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-sky bg-clip-text text-transparent">
              Flight Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Add, edit, and manage flight schedules
            </p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="flight" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Flight
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Flight</DialogTitle>
              </DialogHeader>
              <FlightForm onSubmit={handleAddFlight} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Flights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {flights.map((flight) => (
            <FlightCard
              key={flight._id}
              flight={flight}
              onEdit={handleEditFlight}
              onDelete={handleDeleteFlight}
            />
          ))}
        </div>

        {!loading && flights.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No flights configured
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first flight to get started with the booking system.
            </p>
            <Button onClick={() => setShowAddDialog(true)} variant="flight">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Flight
            </Button>
          </div>
        )}

        {/* Edit Flight Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Flight</DialogTitle>
            </DialogHeader>
            {editingFlight && (
              <FlightForm
                initialData={editingFlight}
                onSubmit={(data) => {
                  if (!data._id) {
                    toast.error("Flight ID is missing.");
                    return;
                  }
                  // Cast to FlightType since _id is now guaranteed
                  return handleUpdateFlight(data as FlightType);
                }}
                isEdit={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
