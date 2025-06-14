
import { supabase } from '@/integrations/supabase/client';
import { SignUpData } from '@/types/auth';

export const checkUserApproval = async (userId: string): Promise<boolean> => {
  // Check if user is admin first
  const { data: adminRole, error: adminError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  if (!adminError && adminRole) {
    console.log('User is admin, allowing access');
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
    return false;
  }

  const approved = profile?.approved || false;
  console.log('User approval status:', approved);
  return approved;
};

export const signUpUser = async (email: string, password: string, userData: SignUpData) => {
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

export const signInUser = async (email: string, password: string) => {
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

export const signOutUser = async () => {
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
