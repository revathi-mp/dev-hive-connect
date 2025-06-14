
import { supabase } from '@/integrations/supabase/client';

export const signUpUser = async (email: string, password: string, userData: any) => {
  console.log('Attempting signup for:', email);
  
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
        data,
        error: null,
        needsConfirmation: true
      };
    }
    
    return { data, error: null, needsConfirmation: false };
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
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: { 
            ...error,
            message: 'Invalid email or password. Please check your credentials and try again.'
          } 
        };
      } else if (error.message.includes('Email not confirmed')) {
        return {
          error: {
            ...error,
            message: 'Please check your email and click the confirmation link before signing in.'
          }
        };
      } else if (error.message.includes('Signup requires a valid password')) {
        return {
          error: {
            ...error,
            message: 'Password is required to sign in.'
          }
        };
      }
      
      return { error };
    }
    
    console.log('Signin successful for:', data.user?.email);
    return { data, error: null };
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
