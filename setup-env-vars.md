# 🚀 Complete Environment Variables Setup for Scholar AI

## 📋 **ENVIRONMENT VARIABLES TO SET:**

### **Required for Production:**
```
VITE_SUPABASE_URL=https://xicjnnzzykdhbmrpafhs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg0MjksImV4cCI6MjA2NDk1NDQyOX0.4N0ZKvuaCpDqWmmtgK_j-Ra4BkUQrVQXot2B8Gzs9kI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODQyOSwiZXhwIjoyMDY0OTU0NDI5fQ.DL_NaeuewHd_CwZOiY7JIzB2K-sPyRw2xpHhBMerUd0
VITE_STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
VITE_APP_ENV=production
VITE_APP_URL=https://www.scholarai.eu
NODE_ENV=production
```

## 🎯 **CURSOR MCP COMMANDS TO RUN:**

Once you have your Stripe key, use these commands in Cursor:

### **1. List Your Projects:**
```
"Using the Vercel MCP tools, list all my projects"
```

### **2. Find Your Scholar AI Project:**
```
"Using the Vercel MCP tools, find my scholar-ai project and show me its current environment variables"
```

### **3. Set All Environment Variables:**
```
"Using the Vercel MCP tools, create these environment variables for my scholar-ai project in the production environment:

VITE_SUPABASE_URL=https://xicjnnzzykdhbmrpafhs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzg0MjksImV4cCI6MjA2NDk1NDQyOX0.4N0ZKvuaCpDqWmmtgK_j-Ra4BkUQrVQXot2B8Gzs9kI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2pubnp6eWtkaGJtcnBhZmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODQyOSwiZXhwIjoyMDY0OTU0NDI5fQ.DL_NaeuewHd_CwZOiY7JIzB2K-sPyRw2xpHhBMerUd0
VITE_STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_KEY]
VITE_APP_ENV=production
VITE_APP_URL=https://www.scholarai.eu
NODE_ENV=production

Please set these for production, preview, and development environments."
```

### **4. Trigger a New Deployment:**
```
"Using the Vercel MCP tools, create a new deployment for my scholar-ai project to apply the new environment variables"
```

## 🔧 **SUPABASE AUTH SETTINGS TO UPDATE:**

Also update these in your Supabase dashboard:

### **Site URL:**
```
https://www.scholarai.eu
```

### **Redirect URLs:**
```
https://www.scholarai.eu/auth/callback
https://scholarai.eu/auth/callback
https://www.scholarai.eu/auth/reset-password
https://scholarai.eu/auth/reset-password
```

### **CORS Origins:**
```
https://www.scholarai.eu
https://scholarai.eu
```

## ✅ **VERIFICATION CHECKLIST:**

After setting up:
- [ ] Environment variables set in Vercel
- [ ] Supabase auth settings updated
- [ ] New deployment triggered
- [ ] Test authentication on production
- [ ] Test Enhanced Research feature
- [ ] Verify no 401 errors

## 🎉 **EXPECTED RESULTS:**

✅ No more 401 Supabase errors  
✅ Authentication working properly  
✅ Enhanced Research feature accessible  
✅ Cross-origin errors suppressed  
✅ Production deployment stable
