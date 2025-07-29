// "use client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Flight } from "@/schemas/flight";
// import { Clock, DollarSign, MapPin, Plane, Users } from "lucide-react";

// interface FlightCardProps {
//   flight: Flight;
//   onBook?: (flight: Flight) => void;
//   onEdit?: (flight: Flight) => void;
//   onDelete?: (flight: Flight) => void;
//   showActions?: boolean;
//   isAdmin?: boolean;
// }

// export const FlightCard = ({
//   flight,
//   onBook,
//   onEdit,
//   onDelete,
//   showActions = true,
//   isAdmin = false,
// }: FlightCardProps) => {
//   return (
//     <Card className="w-full shadow-card hover:shadow-flight transition-shadow duration-300">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Plane className="h-5 w-5 text-primary" />
//             <h3 className="font-semibold text-lg">{flight.airline}</h3>
//           </div>
//           <Badge variant="outline" className="font-mono">
//             {flight.flight_number}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2">
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               <span className="font-medium">{flight.origin}</span> →{" "}
//               <span className="font-medium">{flight.destination}</span>
//             </span>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Clock className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               {flight.date} at {flight.time}
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2">
//             <DollarSign className="h-4 w-4 text-accent" />
//             <span className="text-lg font-semibold text-accent">
//               ${flight.price}
//             </span>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Users className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               {flight.seats.length} seats available
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-1">
//           {flight.seats.slice(0, 8).map((seat) => (
//             <Badge key={seat} variant="secondary" className="text-xs">
//               {seat}
//             </Badge>
//           ))}
//           {flight.seats.length > 8 && (
//             <Badge variant="secondary" className="text-xs">
//               +{flight.seats.length - 8} more
//             </Badge>
//           )}
//         </div>
//       </CardContent>

//       {showActions && (
//         <CardFooter className="pt-2">
//           <div className="flex flex-col sm:flex-row gap-2 w-full">
//             {!isAdmin && onBook && (
//               <Button
//                 onClick={() => onBook(flight)}
//                 variant="flight"
//                 className="flex-1"
//                 disabled={flight.seats.length === 0}
//               >
//                 Book Flight
//               </Button>
//             )}

//             {isAdmin && (
//               <>
//                 {onEdit && (
//                   <Button
//                     onClick={() => onEdit(flight)}
//                     variant="outline"
//                     className="flex-1"
//                   >
//                     Edit
//                   </Button>
//                 )}
//                 {onDelete && (
//                   <Button
//                     onClick={() => onDelete(flight)}
//                     variant="destructive"
//                     className="flex-1"
//                   >
//                     Delete
//                   </Button>
//                 )}
//               </>
//             )}
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Clock, DollarSign, MapPin, Plane, Users } from "lucide-react";
// import { useEffect, useState } from "react";

// interface Flight {
//   _id: string;
//   airline: string;
//   flight_number: string;
//   origin: string;
//   destination: string;
//   date: string;
//   time: string;
//   price: number;
//   seats?: string[];
//   available_seats?: string[];
//   booked_seats?: string[];
// }

// interface FlightCardProps {
//   flight: Flight;
//   onBook?: (flight: Flight) => void;
//   onEdit?: (flight: Flight) => void;
//   onDelete?: (flight: Flight) => void;
//   showActions?: boolean;
//   isAdmin?: boolean;
// }

// const FlightCard = ({
//   flight,
//   onBook,
//   onEdit,
//   onDelete,
//   showActions = true,
//   isAdmin = false,
// }: FlightCardProps) => {
//   // Handle case where seats is undefined or empty
//   const displaySeats =
//     flight.seats && flight.seats.length > 0
//       ? flight.seats
//       : ["Seats are available"];

//   return (
//     <Card className="w-full shadow-card hover:shadow-flight transition-shadow duration-300">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Plane className="h-5 w-5 text-primary" />
//             <h3 className="font-semibold text-lg">{flight.airline}</h3>
//           </div>
//           <Badge variant="outline" className="font-mono">
//             {flight.flight_number}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2">
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               <span className="font-medium">{flight.origin}</span> →{" "}
//               <span className="font-medium">{flight.destination}</span>
//             </span>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Clock className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               {flight.date} at {flight.time}
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2">
//             <DollarSign className="h-4 w-4 text-accent" />
//             <span className="text-lg font-semibold text-accent">
//               ${flight.price}
//             </span>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Users className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm">
//               {displaySeats.length}{" "}
//               {displaySeats[0] === "Seats are available"
//                 ? "seats available"
//                 : "seats available"}
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-1">
//           {displaySeats.slice(0, 8).map((seat) => (
//             <Badge key={seat} variant="secondary" className="text-xs">
//               {seat}
//             </Badge>
//           ))}
//           {displaySeats.length > 8 && (
//             <Badge variant="secondary" className="text-xs">
//               +{displaySeats.length - 8} more
//             </Badge>
//           )}
//         </div>
//       </CardContent>

//       {showActions && (
//         <CardFooter className="pt-2">
//           <div className="flex flex-col sm:flex-row gap-2 w-full">
//             {!isAdmin && onBook && (
//               <Button
//                 onClick={() => onBook(flight)}
//                 variant="flight"
//                 className="flex-1"
//               >
//                 Book Flight
//               </Button>
//             )}

//             {isAdmin && (
//               <>
//                 {onEdit && (
//                   <Button
//                     onClick={() => onEdit(flight)}
//                     variant="outline"
//                     className="flex-1"
//                   >
//                     Edit
//                   </Button>
//                 )}
//                 {onDelete && (
//                   <Button
//                     onClick={() => onDelete(flight)}
//                     variant="destructive"
//                     className="flex-1"
//                   >
//                     Delete
//                   </Button>
//                 )}
//               </>
//             )}
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export const FlightList = () => {
//   const [flights, setFlights] = useState<Flight[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchFlights = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/flights`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch flights");
//         }

//         const data = await response.json();

//         setFlights(data.data.flights);
//         setLoading(false);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//         setLoading(false);
//       }
//     };

//     fetchFlights();
//   }, []);

//   if (loading) {
//     return <div>Loading flights...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (flights.length === 0) {
//     return <div>No flights available.</div>;
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">
//         Available Flights ({flights.length})
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {flights.map((flight) => (
//           <FlightCard
//             key={flight._id}
//             flight={flight}
//             showActions={true}
//             isAdmin={false} // Adjust based on your auth logic
//             onBook={(flight) => console.log("Book flight:", flight)}
//             // Add onEdit and onDelete handlers if needed
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { Clock, DollarSign, MapPin, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const router = useRouter();

  const handleBookFlight = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/flight/${flight._id}`);
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
        <Button onClick={handleBookFlight} variant="flight" className="flex-1">
          Book Flight
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightCard;
