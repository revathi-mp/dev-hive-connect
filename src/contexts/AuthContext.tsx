
import React, { createContext, useContext } from 'react';
import { AuthContextType, SignUpData } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { signUpUser, signInUser, signOutUser } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading, isApproved } = useAuthState();

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    return await signUpUser(email, password, userData);
  };

  const signIn = async (email: string, password: string) => {
    return await signInUser(email, password);
  };

  const signOut = async () => {
    await signOutUser();
  };

  const value = {
    user,
    session,
    loading,
    isApproved,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
