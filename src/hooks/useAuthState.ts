
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
    try {
      const approved = await checkUserApproval(userId);
      setIsApproved(approved);
      return approved;
    } catch (error) {
      console.error('Error updating approval status:', error);
      setIsApproved(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Only update approval status for authenticated users
          try {
            await updateApprovalStatus(session.user.id);
          } catch (error) {
            console.error('Error in approval check:', error);
            setIsApproved(false);
          }
        } else {
          setIsApproved(false);
        }
        
        // ALWAYS set loading to false after processing auth state
        setLoading(false);
      }
    );

    // THEN get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsApproved(false);
          setLoading(false);
          return;
        }
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        // Set the session and user immediately
        setSession(session);
        setUser(session?.user || null);
        
        // If we have a session, update approval status
        if (session?.user) {
          try {
            await updateApprovalStatus(session.user.id);
          } catch (error) {
            console.error('Error in initial approval check:', error);
            setIsApproved(false);
          }
        } else {
          setIsApproved(false);
        }
        
        // Set loading to false after processing
        setLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsApproved(false);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      mounted = false;
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
