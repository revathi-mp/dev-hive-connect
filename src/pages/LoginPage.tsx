
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock user database for demo purposes
const MOCK_USERS = [
  { email: "test@example.com", password: "password123" },
  { email: "admin@devhive.com", password: "admin123" },
  { email: "user@devhive.com", password: "user123" },
  // Adding test account from logs
  { email: "revathimp69@gmail.com", password: "#Varuu_rev2004" }
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Login attempt:", data);
      
      // Find user with matching email and password
      const user = MOCK_USERS.find(
        user => user.email === data.email && user.password === data.password
      );
      
      if (user) {
        // Successful login
        setTimeout(() => {
          toast({
            title: "Login successful",
            description: "Welcome back to DevHive Connect!",
          });
          // Store login state in localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", data.email);
          navigate("/home");
          setIsLoading(false);
        }, 1000);
      } else {
        // Failed login
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your email and password to sign in to your account"
    >
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input 
                      id="email" 
                      placeholder="m@example.com" 
                      type="email" 
                      autoComplete="email"
                      disabled={isLoading}
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
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      id="password" 
                      type="password" 
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              toast({
                title: "GitHub sign-in",
                description: "GitHub authentication would be implemented here.",
              });
            }}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
