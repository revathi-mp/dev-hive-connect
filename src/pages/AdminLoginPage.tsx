
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && !adminLoading && user && isAdmin) {
      console.log('Admin already logged in, redirecting to admin panel');
      navigate("/admin");
    } else if (!loading && !adminLoading && user && !isAdmin) {
      console.log('Regular user trying to access admin login, redirecting to home');
      navigate("/home");
    }
  }, [user, isAdmin, loading, adminLoading, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Admin login form submitted for:', data.email);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error("Admin login error:", error);
        
        let errorMessage = "Admin login failed. Please check your credentials.";
        
        if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Admin Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Admin login successful');
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin panel!",
        });
        
        // Small delay to ensure auth state and admin check are updated
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      }
    } catch (error) {
      console.error("Unexpected admin login error:", error);
      toast({
        title: "Admin Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (loading || adminLoading) {
    return (
      <AuthLayout
        title="Loading..."
        description="Checking admin authentication status"
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Admin Portal Access"
      description="Enter your administrator credentials to access the admin panel"
    >
      <div className="grid gap-6">
        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Administrator Login Required
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: "Admin email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin-email">Admin Email</FormLabel>
                  <FormControl>
                    <Input 
                      id="admin-email" 
                      placeholder="admin@company.com" 
                      type="email" 
                      autoComplete="email"
                      disabled={isLoading}
                      className="border-blue-200 focus:border-blue-500"
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
                required: "Admin password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin-password">Admin Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        id="admin-password" 
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="border-blue-200 focus:border-blue-500 pr-10"
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Only authorized administrators can access the admin panel.
          </p>
        </div>

        <div className="text-center text-sm border-t pt-4">
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            ← Back to User Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
