
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  useEffect(() => {
    // Verify token when component mounts
    const verifyToken = async () => {
      if (!token || !email) {
        setTokenValid(false);
        return;
      }

      // In a real app, this would be an API call to verify the token
      // For demo purposes, we'll simulate a valid token check
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate token validation (any token with email for demo)
        setTokenValid(!!token && !!email);
      } catch (error) {
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token, email]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const score = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChar, isLongEnough]
      .filter(Boolean).length;
    
    if (score <= 2) setPasswordStrength("weak");
    else if (score <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [password]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength === "weak") {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is a mock API call - in a real app, you would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in.",
      });
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not reset your password. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while verifying token
  if (tokenValid === null) {
    return (
      <AuthLayout
        title="Reset password"
        description="Verifying your reset link..."
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <AuthLayout
        title="Invalid reset link"
        description="This password reset link is invalid or has expired"
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <p className="text-center text-muted-foreground">
            The password reset link you clicked is invalid or has expired. Please request a new password reset link.
          </p>
          <div className="flex flex-col space-y-3 w-full">
            <Button 
              className="w-full" 
              asChild
            >
              <Link to="/forgot-password">
                Request new reset link
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link to="/login">
                Back to login
              </Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show password reset form if token is valid
  return (
    <AuthLayout
      title="Reset password"
      description={`Create a new password for ${email}`}
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
              </div>
              
              {passwordStrength && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()}`}
                      style={{
                        width: passwordStrength === "weak" 
                          ? "33%" 
                          : passwordStrength === "medium" 
                          ? "66%" 
                          : "100%"
                      }}
                    />
                  </div>
                  <Badge
                    variant={
                      passwordStrength === "weak"
                        ? "destructive"
                        : passwordStrength === "medium"
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs capitalize"
                  >
                    {passwordStrength}
                  </Badge>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Password should contain uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
            
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  required
                />
                <Shield className="absolute left-3 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
              </div>
              
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  Passwords don't match
                </p>
              )}
              
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full mt-2" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
