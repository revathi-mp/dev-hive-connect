
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAdminCheck() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for admin check');
        return false;
      }
      
      console.log('Checking admin status for user:', user.id, 'email:', user.email);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.log('Error checking admin status:', error.message);
          return false;
        }

        const isAdmin = !!data;
        console.log('User admin check result:', isAdmin);
        return isAdmin;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
