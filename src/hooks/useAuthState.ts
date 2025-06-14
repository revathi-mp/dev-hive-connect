
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
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          // Only update approval status for authenticated users
          try {
            await updateApprovalStatus(session.user.id);
          } catch (error) {
            console.error('Error in approval check:', error);
            setIsApproved(false);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsApproved(false);
        }
        
        // Always set loading to false after processing auth state
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
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          try {
            await updateApprovalStatus(session.user.id);
          } catch (error) {
            console.error('Error in initial approval check:', error);
            setIsApproved(false);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsApproved(false);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        setSession(null);
        setUser(null);
        setIsApproved(false);
      } finally {
        if (mounted) {
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
