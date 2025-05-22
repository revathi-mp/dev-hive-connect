
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
import { authService } from "@/services/supabaseService";
import { profilesService } from "@/services/supabaseService";

// Define validation schema
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      console.log("Signup attempt:", data);
      
      // Use auth service for signup
      const { data: authData, error } = await authService.signup(data.email, data.password);
      
      if (error) {
        console.error("Supabase auth error:", error);
        toast({
          title: "Signup failed",
          description: error.message || "Please check your information and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (authData.user) {
        // Create a profile for the new user
        const profileData = {
          id: authData.user.id,
          username: data.username,
          full_name: `${data.firstName} ${data.lastName}`,
          created_at: new Date().toISOString(),
        };
        
        await profilesService.updateProfile(authData.user.id, profileData);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to DevHive Connect! Please check your email to verify your account.",
        });
        
        // Store user info in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email);
        
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await authService.signInWithGithub();
      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "GitHub sign-in",
        description: "Failed to initiate GitHub authentication.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to create a new account"
    >
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="first-name">First name</FormLabel>
                    <FormControl>
                      <Input 
                        id="first-name" 
                        placeholder="John" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="last-name">Last name</FormLabel>
                    <FormControl>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input 
                      id="username" 
                      placeholder="johndoe" 
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
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input 
                      id="password" 
                      type="password" 
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
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
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
