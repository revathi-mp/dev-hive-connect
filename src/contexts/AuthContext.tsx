
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isApproved: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; username: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const checkUserApproval = async (userId: string) => {
    // Check if user is admin first
    const { data: adminRole, error: adminError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (!adminError && adminRole) {
      console.log('User is admin, allowing access');
      setIsApproved(true);
      return true;
    }

    // If not admin, check if user is approved
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('approved')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking user approval:', error);
      setIsApproved(false);
      return false;
    }

    const approved = profile?.approved || false;
    setIsApproved(approved);
    console.log('User approval status:', approved);
    return approved;
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await checkUserApproval(session.user.id);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setIsApproved(false);
        }
        setLoading(false);
      }
    );

    // THEN get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          
          if (session?.user) {
            setSession(session);
            setUser(session.user);
            await checkUserApproval(session.user.id);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            setIsApproved(false);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; username: string }) => {
    console.log('Attempting signup for:', email);
    
    // Use the current origin for redirect
    const redirectUrl = `${window.location.origin}/`;
    console.log('Redirect URL:', redirectUrl);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { error };
      }
      
      console.log('Signup successful:', data);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required for user:', data.user.email);
        return { 
          error: { 
            message: 'Please check your email and click the confirmation link. After email confirmation, your account will need admin approval before you can access the forum.',
            name: 'EmailConfirmationRequired'
          } 
        };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signin for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Signin error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return { 
            error: { 
              ...error,
              message: 'Invalid email or password. Please check your credentials and try again. If you just signed up, make sure to confirm your email first.'
            } 
          };
        }
        
        return { error };
      }
      
      console.log('Signin successful for:', data.user?.email);
      return { error: null };
    } catch (err) {
      console.error('Unexpected signin error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
      } else {
        console.log('Signout successful');
      }
    } catch (err) {
      console.error('Unexpected signout error:', err);
    }
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
