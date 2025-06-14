
-- First, let's make sure the user exists and get their ID
-- Then assign them the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users 
WHERE email = 'revathimp69@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also make sure this user is approved if they have a profile
UPDATE public.profiles 
SET approved = true, approved_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'revathimp69@gmail.com');
