# 🔑 Getting Your Supabase API Keys

You're at: https://supabase.com/dashboard/project/xicjnnzzykdhbmrpafhs

## Step 1: Get Your API Keys

1. In the Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** under the Configuration section
3. You'll see two important keys:

### Anon Key (public)
- Look for: **`anon` `public`**
- This is safe to use in frontend code
- Copy this entire key

### Service Role Key (secret)
- Look for: **`service_role` `secret`**
- ⚠️ NEVER expose this in frontend code
- Only use in server-side/backend code
- Copy this entire key

## Step 2: Update Your .env File

Replace the placeholders in your `.env` file:

```env
# Replace these lines:
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# With your actual keys:
NEXT_PUBLIC_SUPABASE_ANON_KEY=[paste your anon key here]
SUPABASE_SERVICE_ROLE_KEY=[paste your service role key here]

# Also update the Vite version:
VITE_SUPABASE_ANON_KEY=[paste your anon key here]
```

## Step 3: Verify Your Project URL

Your Supabase URL is already correct in the .env file:
```
https://xicjnnzzykdhbmrpafhs.supabase.co
```

## 🔒 Security Reminder

- **Anon Key**: Can be public (used in frontend)
- **Service Role Key**: Must be kept SECRET (backend only)
- Never commit the .env file to Git (it's already in .gitignore)

---

Once you've added these keys, you're ready to deploy! 🚀