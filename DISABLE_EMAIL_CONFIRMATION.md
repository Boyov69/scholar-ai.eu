# 📧 Disable Email Confirmation in Supabase

The 400 error during sign-up is likely because Supabase requires email confirmation by default. Here's how to disable it for testing:

## Steps to Disable Email Confirmation:

1. **Go to your Supabase Dashboard**
   - Open: https://supabase.com/dashboard/project/xicjnnzzykdhbmrpafhs

2. **Navigate to Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Providers**
   - Click on **Email**

3. **Disable Email Confirmation**
   - Find the toggle for **"Confirm email"**
   - Turn it **OFF** (for development/testing only!)
   - Click **Save**

4. **Important Security Note**
   ⚠️ Remember to turn email confirmation back ON before deploying to production!

## After Disabling Email Confirmation:

1. Go back to your application: http://localhost:5173
2. Try signing up again with the same credentials:
   - Name: John Doe
   - Email: john.doe@example.com
   - Password: TestPassword123!
   - Role: Student

The sign-up should now work successfully!

## Alternative: Check for Existing User

If you still get an error, the email might already be registered. Try:
- Using a different email address
- Or signing in instead of signing up

## Still Having Issues?

Check the Supabase logs:
1. Go to your Supabase dashboard
2. Click on **Logs** → **API logs**
3. Look for any error messages related to authentication