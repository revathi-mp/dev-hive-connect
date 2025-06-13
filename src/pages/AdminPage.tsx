
import React from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { InterviewQuestionsTable } from "@/components/admin/InterviewQuestionsTable";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { AdminStats } from "@/components/admin/AdminStats";
import { Shield, ArrowLeft } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAuth } from "@/contexts/AuthContext";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();

  // Show loading while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Verifying admin access...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Shield className="w-16 h-16 mb-4 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Admin Access Required</h1>
            <p className="mb-6 text-muted-foreground">
              You need to be an administrator to access this page.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              {!user && (
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-8">
          {/* Stats Overview */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
            <AdminStats />
          </section>

          {/* User Management */}
          <section>
            <UserManagementTable />
          </section>

          {/* Interview Questions Management */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Interview Questions Database</h2>
            <InterviewQuestionsTable />
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
