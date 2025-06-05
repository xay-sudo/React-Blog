
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
import { LogIn } from "lucide-react";
import { users, MOCK_ADMIN_USER_ID } from "@/data/users"; // Import user data

const formSchema = z.object({
  identifier: z.string().min(3, {
    message: "Email or Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login submitted:", values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    const adminUser = users.find(user => user.id === MOCK_ADMIN_USER_ID);
    let loginSuccess = false;

    if (adminUser) {
      if (values.identifier.toLowerCase() === adminUser.email.toLowerCase() || values.identifier.toLowerCase() === adminUser.name.toLowerCase()) {
        // In a real app, you would also validate the password here against a hash.
        // For this mock, we'll assume password "Dell123" is correct if identifier matches.
        // if (values.password === "Dell123") { // Optional: mock password check
        loginSuccess = true;
        // }
      }
    }

    if (loginSuccess) {
      toast({
        title: "Login Successful (Mock)",
        description: `Welcome, ${adminUser?.name || 'Admin'}!`,
      });
      // Here you might redirect the user, e.g., router.push('/admin');
    } else {
      toast({
        title: "Login Failed (Mock)",
        description: "User not recognized or invalid credentials for mock admin.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
            <LogIn className="mr-2 h-7 w-7"/> Login to BloggerVerse
        </CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="yourname or you@example.com" {...field} />
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
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                <Link href="/register">Register here</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}
