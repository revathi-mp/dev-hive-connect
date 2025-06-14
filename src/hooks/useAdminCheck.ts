
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
          .single();

        if (error) {
          console.log('User is not admin or error occurred:', error.message);
          
          // Check if user exists in profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, approved')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Profile not found for user:', user.id, profileError);
          } else {
            console.log('User profile found:', profile);
          }
          
          return false;
        }

        console.log('User admin check result:', !!data, 'role data:', data);
        return !!data;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
