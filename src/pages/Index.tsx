
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { PendingApprovalPage } from '@/components/auth/PendingApprovalPage';
import HomePage from './HomePage';

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

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('Showing loading state - loading:', loading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, show the HomePage which contains login/signup options
  if (!user) {
    console.log('No user, showing HomePage with login/signup options');
    return <HomePage />;
  }

  // If user exists but admin check is still loading, show loading
  if (user && adminLoading) {
    console.log('Admin check loading for user:', user.email);
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

  // If user is logged in and approved, show HomePage (which will show authenticated view)
  if (user && isApproved) {
    console.log('Showing HomePage for approved user');
    return <HomePage />;
  }

  // Fallback to HomePage
  console.log('Fallback showing HomePage');
  return <HomePage />;
};

export default Index;
