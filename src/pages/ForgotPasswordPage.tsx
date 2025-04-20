
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to reset your password"
    >
      <div className="grid gap-6">
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                placeholder="m@example.com"
                type="email"
              />
            </div>
            <Button className="w-full" type="submit">
              Send Reset Link
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
    </AuthLayout>
  );
}
