"use client";

// import { toast } from "@/hooks/use-toast";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { AuthContextType, User } from "./types";
import type { UserRegistration } from "./validations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - in real app, this would come from API
      const userData: User = {
        id: "1",
        email,
        name: "John Doe",
        phone: "1234567890",
        gender: "Male",
        role: email.includes("admin") ? "admin" : "user",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast("Login successful");
    } catch (error) {
      toast("Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegistration) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        role: "user",
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast("Registration successful");
    } catch (error) {
      toast("Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast("Logged out Done");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
