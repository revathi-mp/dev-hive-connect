
-- Create a table for admin credentials
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Add Row Level Security (RLS) - admins only
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy that denies all access by default (admin table should only be accessed server-side)
CREATE POLICY "Admin users table is protected" 
  ON public.admin_users 
  FOR ALL 
  USING (false);
