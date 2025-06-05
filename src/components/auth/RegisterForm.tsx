"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function RegisterForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call
    console.log("Registration submitted:", values);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Registration Attempt",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    // Here you would typically make an API call to your backend for registration
    // Example:
    // try {
    //   const response = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(values) });
    //   if (response.ok) {
    //     // Handle successful registration (e.g., redirect to login, show success message)
    //     toast({ title: "Registration Successful", description: "Please login to continue."});
    //   } else {
    //     // Handle registration error (e.g., email already exists)
    //     const errorData = await response.json();
    //     toast({ title: "Registration Failed", description: errorData.message || "Could not create account.", variant: "destructive" });
    //   }
    // } catch (error) {
    //   toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    // }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
            <UserPlus className="mr-2 h-7 w-7"/> Create an Account
        </CardTitle>
        <CardDescription>Join BloggerVerse to share your stories.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
             <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                <Link href="/login">Login here</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}
