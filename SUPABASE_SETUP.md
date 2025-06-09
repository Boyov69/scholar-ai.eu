# 🗄️ Supabase Database Setup Guide

## Prerequisites
- You have already created a Supabase project
- You have added your API keys to the `.env` file

## Step 1: Access the SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xicjnnzzykdhbmrpafhs
2. Click on **SQL Editor** in the left sidebar (it looks like a terminal icon)

## Step 2: Run the Database Schema

1. Click on **New query** button
2. Open the file `supabase/schema.sql`
3. Copy ALL the SQL code (starting from `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)

## Step 3: Verify the Setup

After running the schema, you should see:
- ✅ Success messages for each table created
- ✅ No error messages in red

To verify everything is set up correctly:
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `user_profiles`
   - `workspaces`
   - `workspace_members`
   - `research_queries`
   - `citations`
   - `workspace_activities`
   - `notifications`

## Step 4: Configure Authentication (Optional)

By default, Supabase requires email confirmation. For testing, you might want to disable this:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle OFF "Confirm email" (for development only!)
3. Remember to turn it back ON for production

## Step 5: Test the Application

1. Go back to your application: http://localhost:5173
2. Try creating a new account
3. You should now be able to sign up successfully!

## Troubleshooting

### If you get "relation does not exist" errors:
- Make sure you ran the entire schema.sql file
- Check that you're in the correct Supabase project

### If authentication still fails:
- Check that your API keys in `.env` are correct
- Make sure the Supabase URL matches your project
- Verify that email confirmations are disabled for testing

## Next Steps

Once your database is set up and authentication is working:
1. Deploy to GitHub using `git-setup.ps1`
2. Deploy to Vercel using `deploy.ps1`
3. Configure your custom domain

---

Need help? Check the error logs in:
- Browser console (F12)
- Supabase dashboard → **Logs** → **API logs**