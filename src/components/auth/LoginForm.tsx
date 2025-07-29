/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { userLoginSchema, type UserLogin } from "@/schemas/auth";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// // import { useToast } from "@/hooks/use-toast";

// export const LoginForm = () => {
//   // const { toast } = useToast();
//   const router = useRouter();

//   const form = useForm<UserLogin>({
//     resolver: zodResolver(userLoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = (data: UserLogin) => {
//     console.log("Login data:", data);
//     toast("Login Successful!");
//     form.reset();
//     router.push("/");
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-card">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold bg-gradient-sky bg-clip-text text-transparent">
//           Welcome Back
//         </CardTitle>
//         <CardDescription>Sign in to your FlightBooking account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="john@example.com"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Enter your password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit" variant="flight" className="w-full" size="lg">
//               Sign In
//             </Button>
//           </form>
//         </Form>
//         <div className="text-center mt-3">
//           <p className="text-sm  text-gray-600">
//             Don&apos;t have an account?
//             <Link
//               href="/register"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

"use client";
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
import { userLoginSchema, type UserLogin } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserLogin) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(
          errorData?.message ||
            "Login failed. Please check your credentials and try again."
        );
        setLoading(false);
        return;
      }

      toast.success("Login Successful!");
      form.reset();
      router.push("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-sky bg-clip-text text-transparent">
          Welcome Back To FlightBook
        </CardTitle>
        <CardDescription>Sign in to your FlightBook account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="flight"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-3">
          <p className="text-sm  text-gray-600">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
