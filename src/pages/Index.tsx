
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from './HomePage';

const Index = () => {
  const { loading } = useAuth();

  console.log('Index component state');

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('Showing loading state - loading:', loading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always show HomePage
  console.log('Showing HomePage');
  return <HomePage />;
};

export default Index;
