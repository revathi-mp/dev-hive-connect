
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Designated admin email - only this email can access admin panel
const ADMIN_EMAIL = "revathimp69@gmail.com";
const ADMIN_PASSWORD = "password123";

export function HomeAdminLoginPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    // Check if the email and password match the designated admin credentials
    if (data.email !== ADMIN_EMAIL || data.password !== ADMIN_PASSWORD) {
      toast({
        title: "Invalid Admin Credentials",
        description: "Invalid email or password for admin access.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Admin login attempt from home page for:', data.email);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error("Admin login error:", error);
        toast({
          title: "Invalid Credentials",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        console.log('Admin login successful from home page');
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin panel!",
        });
        
        // Navigate directly to admin panel
        navigate("/admin");
      }
    } catch (error) {
      console.error("Unexpected admin login error:", error);
      toast({
        title: "Invalid Credentials",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-blue-600" />
          Admin Access
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter administrator credentials to access the admin panel
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Enter admin email" 
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
                        placeholder="Enter admin password"
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
        
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Are you a forum user?
          </p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
            Go to User Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
