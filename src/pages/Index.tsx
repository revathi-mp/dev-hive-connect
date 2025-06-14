
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { PendingApprovalPage } from '@/components/auth/PendingApprovalPage';

const Index = () => {
  const { user, loading, isApproved } = useAuth();
  const { data: isAdmin, isLoading: adminLoading, error: adminError } = useAdminCheck();

  console.log('Index component state:', {
    user: user?.email,
    loading,
    isApproved,
    isAdmin,
    adminLoading,
    adminError
  });

  if (loading || adminLoading) {
    console.log('Showing loading state - loading:', loading, 'adminLoading:', adminLoading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in and is admin, redirect to admin panel
  if (user && isAdmin) {
    console.log('Redirecting admin to admin panel');
    return <Navigate to="/admin" replace />;
  }

  // If user is logged in but not approved and not admin, show pending approval page
  if (user && !isApproved && !isAdmin) {
    console.log('Showing pending approval page');
    return <PendingApprovalPage />;
  }

  // If user is logged in and approved, redirect to home
  if (user && isApproved) {
    console.log('Redirecting approved user to home');
    return <Navigate to="/home" replace />;
  }

  // If no user, redirect to home (which will show login options)
  console.log('No user, redirecting to home');
  return <Navigate to="/home" replace />;
};

export default Index;
