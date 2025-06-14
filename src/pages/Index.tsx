
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from './HomePage';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !adminLoading && user) {
      // Only redirect to admin if user is logged in AND is an admin
      if (isAdmin) {
        console.log('Admin user detected, redirecting to admin panel');
        navigate("/admin");
      } else {
        console.log('Regular user detected, staying on home');
        // Regular users stay on home page - no redirect needed
      }
    }
    // If user is not logged in, they stay on the home page to see login panel
  }, [user, isAdmin, loading, adminLoading, navigate]);

  console.log('Index component state:', {
    user: user?.email,
    loading,
    isAdmin
  });

  // Show loading spinner while checking authentication
  if (loading || adminLoading) {
    console.log('Showing loading state - loading:', loading, 'adminLoading:', adminLoading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always show HomePage - it will handle displaying login/signup for unauthenticated users
  // and the authenticated view for logged-in users
  console.log('Showing HomePage for user:', user?.email || 'unauthenticated');
  return <HomePage />;
};

export default Index;
