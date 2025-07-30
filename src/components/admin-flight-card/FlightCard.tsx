"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FlightType } from "@/schemas/flight";
import { Clock, DollarSign, MapPin, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

export type FlightCardProps = {
  flight: FlightType;
  onDelete: (flight: FlightType) => Promise<void>;
  onEdit: (flight: FlightType) => void;
};

const FlightCard = ({ flight }: FlightCardProps) => {
  const router = useRouter();

  const handleSeeDetail = () => {
    router.push(`/flightdetail/${flight._id}`);
  };

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

        <div className="flex items-center space-x-2 mt-2">
          <DollarSign className="h-4 w-4 text-accent" />
          <span className="text-lg font-semibold text-accent">
            ${flight.price}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={handleSeeDetail} variant="flight" className="flex-1">
          See Detail
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightCard;
