
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PendingApprovalPage } from '@/components/auth/PendingApprovalPage';

const Index = () => {
  const { user, loading, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in but not approved, show pending approval page
  if (user && !isApproved) {
    return <PendingApprovalPage />;
  }

  // If user is logged in and approved, redirect to home
  if (user && isApproved) {
    return <Navigate to="/home" replace />;
  }

  // If no user, redirect to home (which will show login options)
  return <Navigate to="/home" replace />;
};

export default Index;
