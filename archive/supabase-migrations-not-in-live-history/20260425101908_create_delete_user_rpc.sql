-- Function to delete the currently authenticated user
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- executes with the privileges of the user that created it (superuser)
SET search_path = public, auth
AS $$
DECLARE
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Delete from auth.users. 
    -- Assuming foreign keys to public.profiles have ON DELETE CASCADE.
    DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;
