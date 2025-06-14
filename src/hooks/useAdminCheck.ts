
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for admin check');
        return false;
      }

      console.log('Checking admin status for user:', user.id);
      
      try {
        const { data, error } = await supabase.rpc('is_admin', {
          _user_id: user.id
        });

        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }

        console.log('Admin check result:', data);
        return data || false;
      } catch (error) {
        console.error('Admin check failed:', error);
        return false;
      }
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
