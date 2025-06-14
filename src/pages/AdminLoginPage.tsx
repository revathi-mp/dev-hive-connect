
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callAdminAuth = async (email: string, password: string, action: 'login' | 'create') => {
    const { data, error } = await supabase.functions.invoke('admin-auth', {
      body: { email, password, action }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const action = isCreateMode ? 'create' : 'login';
      const result = await callAdminAuth(data.email, data.password, action);
      
      if (result.error) {
        toast({
          title: isCreateMode ? "Creation Failed" : "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        if (isCreateMode) {
          toast({
            title: "Admin Created",
            description: "Admin user created successfully! You can now login.",
          });
          setIsCreateMode(false);
          form.reset();
        } else {
          // Store admin session permanently in localStorage
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminEmail', data.email);
          localStorage.setItem('adminSessionTime', Date.now().toString());
          
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin dashboard!",
          });
          
          navigate("/admin-dashboard");
        }
      }
    } catch (error) {
      toast({
        title: isCreateMode ? "Creation Failed" : "Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isCreateMode ? "Create Admin" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            {isCreateMode 
              ? "Create your admin account" 
              : "Enter your admin credentials to access the dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com"
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
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isCreateMode ? "Creating..." : "Logging in...") 
                  : (isCreateMode ? "Create Admin" : "Login as Admin")
                }
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => {
                setIsCreateMode(!isCreateMode);
                form.reset();
              }}
              disabled={isLoading}
            >
              {isCreateMode 
                ? "Already have an admin account? Login" 
                : "Need to create an admin account? Create one"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
