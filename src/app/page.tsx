import { FlightList } from "@/components/FlightCardList";
import { FlightSearch } from "@/components/FlightSearch";
import HeroSection from "@/components/HeroSection";

export default function FlightsPage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Section */}
        <FlightSearch />
        {/* Flight List */}
        <FlightList />
      </div>
    </div>
  );
}
