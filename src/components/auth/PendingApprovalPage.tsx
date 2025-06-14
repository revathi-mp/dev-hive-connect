
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Clock, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

export function PendingApprovalPage() {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminCheck();
  const { updateApprovalStatus } = useAuthState();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCheckStatus = async () => {
    if (!user) return;
    
    console.log('Checking user approval status...');
    
    // Refresh the approval status
    const isApproved = await updateApprovalStatus(user.id);
    
    console.log('Updated approval status:', isApproved);
    
    if (isApproved) {
      // If user is now approved, redirect to home
      navigate("/home");
    } else if (isAdmin) {
      // If user is admin, redirect to admin panel
      navigate("/admin");
    } else {
      // If still not approved, just refresh the page to show updated status
      window.location.reload();
    }
  };

  // If user is admin, redirect to admin panel
  React.useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Account Pending Approval</h1>
            <p className="text-lg text-muted-foreground">
              Welcome, {user?.email}!
            </p>
          </div>

          <div className="max-w-md space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-blue-900 mb-1">Account Created Successfully</p>
                <p className="text-blue-700">
                  Your account has been created and is now waiting for admin approval.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-orange-900 mb-1">Admin Review Required</p>
                <p className="text-orange-700">
                  An administrator needs to approve your account before you can access the forum features.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-green-900 mb-1">What's Next?</p>
                <p className="text-green-700">
                  You'll receive an email notification once your account is approved. You can then log in and start participating in discussions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
            <Button onClick={handleCheckStatus}>
              Check Status
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
