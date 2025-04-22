
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is a mock API call - in a real app, you would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
      
      // In a real app, a real email would be sent.
      // For demo purposes, we'll create a reset link with a fake token
      // This allows us to demonstrate the reset flow
      setTimeout(() => {
        // Create demo reset link (this would normally come from backend)
        const resetLink = `/reset-password?token=demo-token-12345&email=${encodeURIComponent(email)}`;
        
        toast({
          title: "Demo mode",
          description: (
            <div className="flex flex-col gap-2">
              <span>Since this is a demo, you can use this link to test the reset flow:</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 w-fit"
                onClick={() => navigate(resetLink)}
              >
                Try Reset Flow
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          ),
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not send reset email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to reset your password"
    >
      {!emailSent ? (
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                    autoComplete="email"
                    required
                  />
                  <Mail className="absolute left-3 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-md text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <MailCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-medium text-base mb-2">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => setEmailSent(false)}
            >
              Try another email
            </Button>
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
