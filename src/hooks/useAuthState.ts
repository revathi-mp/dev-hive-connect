
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkUserApproval } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const updateApprovalStatus = async (userId: string) => {
    const approved = await checkUserApproval(userId);
    setIsApproved(approved);
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
          await updateApprovalStatus(session.user.id);
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
            await updateApprovalStatus(session.user.id);
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

  return {
    user,
    session,
    loading,
    isApproved,
    updateApprovalStatus
  };
};
