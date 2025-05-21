
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { InterviewQuestionsTable } from "@/components/admin/InterviewQuestionsTable";
import { Shield } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  // In a real application, you would check if the user has admin rights
  // For demo purposes, we'll just simulate authentication status
  const isAuthenticated = true; // This would normally come from auth context

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Shield className="w-16 h-16 mb-4 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Admin Access Required</h1>
            <p className="mb-6 text-muted-foreground">
              You need to be an administrator to access this page.
            </p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate("/interview-questions")}>
            View Public Page
          </Button>
        </div>

        <div className="space-y-8">
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
