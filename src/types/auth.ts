
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isApproved: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; username: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  username: string;
}
