import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { Textarea } from "@/components/ui/textarea";
import { flightSchema, type Flight } from "@/schemas/flight";
// import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FlightFormProps {
  initialData?: Partial<Flight>;
  onSubmit?: (data: Flight) => void;
  isEdit?: boolean;
}

export const FlightForm = ({
  initialData,
  onSubmit,
  isEdit = false,
}: FlightFormProps) => {
  //   const { toast } = useToast();
  const [seatInput, setSeatInput] = useState("");

  const form = useForm<Flight>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      airline: initialData?.airline || "",
      flight_number: initialData?.flight_number || "",
      origin: initialData?.origin || "",
      destination: initialData?.destination || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      price: initialData?.price || 0,
      seats: initialData?.seats || [],
    },
  });

  const handleSubmit = (data: Flight) => {
    console.log("Flight data:", data);
    toast.success(
      `Flight ${data.flight_number} has been ${
        isEdit ? "updated" : "added"
      } successfully.`
    );
    onSubmit?.(data);
    if (!isEdit) form.reset();
  };

  const addSeat = () => {
    if (seatInput.trim()) {
      const currentSeats = form.getValues("seats");
      if (!currentSeats.includes(seatInput.trim())) {
        form.setValue("seats", [...currentSeats, seatInput.trim()]);
        setSeatInput("");
      }
    }
  };

  const removeSeat = (seatToRemove: string) => {
    const currentSeats = form.getValues("seats");
    form.setValue(
      "seats",
      currentSeats.filter((seat) => seat !== seatToRemove)
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-sky bg-clip-text text-transparent">
          {isEdit ? "Edit Flight" : "Add New Flight"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update flight information"
            : "Enter flight details to add to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <Input placeholder="Airways" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flight_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Number</FormLabel>
                    <FormControl>
                      <Input placeholder="AW123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="10:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Seats</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 1A, 2B, 3C"
                        value={seatInput}
                        onChange={(e) => setSeatInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSeat())
                        }
                      />
                      <Button type="button" onClick={addSeat} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((seat) => (
                        <Badge
                          key={seat}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {seat}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeSeat(seat)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="flight" className="w-full" size="lg">
              {isEdit ? "Update Flight" : "Add Flight"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
