/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Moon, Plane, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const isActive = (path: string) => pathname === path;

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Flights
      </Link>
      <Link
        href="/bookings"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/bookings") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        My Bookings
      </Link>
      <Link
        href="/admin"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/admin") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Admin
      </Link>
    </>
  );

  const AuthButtons = () => (
    <>
      <Link href="/login">
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="flight" size="sm">
          Register
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-sky bg-clip-text text-transparent">
              FlightBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>

          {/* Desktop Auth & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <AuthButtons />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Plane className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold bg-gradient-sky bg-clip-text text-transparent">
                      FlightBook
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    <NavLinks />
                  </nav>

                  <div className="border-t border-border pt-4 mt-6">
                    <div className="flex flex-col space-y-2">
                      <AuthButtons />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
