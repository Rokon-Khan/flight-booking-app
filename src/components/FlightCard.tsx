"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Flight } from "@/schemas/flight";
import { Clock, DollarSign, MapPin, Plane, Users } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
  onBook?: (flight: Flight) => void;
  onEdit?: (flight: Flight) => void;
  onDelete?: (flight: Flight) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export const FlightCard = ({
  flight,
  onBook,
  onEdit,
  onDelete,
  showActions = true,
  isAdmin = false,
}: FlightCardProps) => {
  return (
    <Card className="w-full shadow-card hover:shadow-flight transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{flight.airline}</h3>
          </div>
          <Badge variant="outline" className="font-mono">
            {flight.flight_number}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">{flight.origin}</span> →{" "}
              <span className="font-medium">{flight.destination}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {flight.date} at {flight.time}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <span className="text-lg font-semibold text-accent">
              ${flight.price}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {flight.seats.length} seats available
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {flight.seats.slice(0, 8).map((seat) => (
            <Badge key={seat} variant="secondary" className="text-xs">
              {seat}
            </Badge>
          ))}
          {flight.seats.length > 8 && (
            <Badge variant="secondary" className="text-xs">
              +{flight.seats.length - 8} more
            </Badge>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {!isAdmin && onBook && (
              <Button
                onClick={() => onBook(flight)}
                variant="flight"
                className="flex-1"
                disabled={flight.seats.length === 0}
              >
                Book Flight
              </Button>
            )}

            {isAdmin && (
              <>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(flight)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(flight)}
                    variant="destructive"
                    className="flex-1"
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
