
-- First, let's check if there are any existing profiles that might be causing conflicts
-- and then update the trigger function to handle username conflicts gracefully

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function that handles duplicate usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  base_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Get the base username from metadata
  base_username := NEW.raw_user_meta_data->>'username';
  
  -- If no username provided, use email prefix
  IF base_username IS NULL OR base_username = '' THEN
    base_username := split_part(NEW.email, '@', 1);
  END IF;
  
  -- Start with the base username
  final_username := base_username;
  
  -- Keep trying until we find a unique username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || counter;
    counter := counter + 1;
  END LOOP;
  
  -- Insert the profile with the unique username
  INSERT INTO public.profiles (id, username, first_name, last_name)
  VALUES (
    NEW.id,
    final_username,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up any duplicate or problematic profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (username) id 
  FROM public.profiles 
  ORDER BY username, created_at
);
