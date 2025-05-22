
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/services/supabaseService';

interface AuthUser {
  id: string;
  email: string | null;
  user_metadata?: any;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the current session when the app loads
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session) {
          setUser(session.user as AuthUser);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = authService.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user as AuthUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    return await authService.login(email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signUp = async (email: string, password: string) => {
    return await authService.signup(email, password);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthProvider');
  }
  return context;
};
