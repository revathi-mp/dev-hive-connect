
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const resendConfirmationEmail = async (email: string) => {
    setIsResendingConfirmation(true);
    console.log('Resending confirmation email for:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        toast({
          title: "Failed to Resend",
          description: error.message || "Could not resend confirmation email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your email for the confirmation link.",
        });
        setShowResendOption(false);
      }
    } catch (error) {
      console.error('Unexpected resend error:', error);
      toast({
        title: "Failed to Resend",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowResendOption(false);
    console.log('Signup form submitted for:', data.email);
    
    try {
      const result = await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      if (result.error) {
        console.error("Signup error:", result.error);
        
        let errorMessage = "Please check your information and try again.";
        
        if (result.error.message) {
          if (result.error.message.includes('User already registered')) {
            setExistingEmail(data.email);
            setShowResendOption(true);
            toast({
              title: "Account Already Exists",
              description: "An account with this email already exists. You can resend the confirmation email if needed.",
              variant: "destructive",
            });
            return;
          } else {
            errorMessage = result.error.message;
          }
        }
        
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (result.needsConfirmation) {
          toast({
            title: "Account Created Successfully",
            description: "Please check your email and click the confirmation link to complete your registration.",
          });
        } else {
          toast({
            title: "Account Created Successfully",
            description: "Your account has been created and you are now logged in!",
          });
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to create a new account"
    >
      <div className="grid gap-6">
        {showResendOption && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Account Already Exists</h3>
            <p className="text-sm text-blue-700 mb-3">
              An account with email <strong>{existingEmail}</strong> already exists. 
              If you haven't received your confirmation email, you can resend it.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => resendConfirmationEmail(existingEmail)}
                disabled={isResendingConfirmation}
              >
                {isResendingConfirmation ? "Sending..." : "Resend Confirmation Email"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
              >
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: "First name is required" }}
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
                rules={{ required: "Last name is required" }}
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
              rules={{ 
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              }}
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
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              }}
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
              rules={{ 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
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
          onClick={() => {
            toast({
              title: "GitHub sign-up",
              description: "GitHub registration would be implemented here.",
            });
          }}
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
