import heroImage from "@/assets/Flight-aviation-Image.png";
import Image from "next/image";
import SearchCard from "./SearchCard";

export default function HeroSection() {
  return (
    <div className="relative h-96 flex flex-col items-center justify-center">
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
      <div className=" mt-4 max-w-4xl px-4">
        <SearchCard />
      </div>
    </div>
  );
}
