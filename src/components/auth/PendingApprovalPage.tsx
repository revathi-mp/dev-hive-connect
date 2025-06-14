
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Clock, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function PendingApprovalPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome!</h1>
            <p className="text-lg text-muted-foreground">
              Hello, {user?.email}!
            </p>
          </div>

          <div className="max-w-md space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-green-900 mb-1">Account Active</p>
                <p className="text-green-700">
                  Your account is ready to use. You can now access all forum features.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
            <Button onClick={handleGoHome}>
              Go to Forum
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
