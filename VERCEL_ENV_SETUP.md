# 🚀 Vercel Environment Variables Setup

## 🔧 **REQUIRED ENVIRONMENT VARIABLES FOR PRODUCTION**

### **1. Supabase Configuration**
```
VITE_SUPABASE_URL=https://xicjnnzzykdhbmrpafhs.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

### **2. Stripe Configuration**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-publishable-key
STRIPE_SECRET_KEY=sk_live_your-live-secret-key
```

### **3. Application Configuration**
```
VITE_APP_ENV=production
VITE_APP_URL=https://www.scholarai.eu
NODE_ENV=production
```

### **4. FutureHouse AI (Optional)**
```
VITE_FUTUREHOUSE_API_KEY=your-futurehouse-api-key
```

---

## 📝 **HOW TO SET UP IN VERCEL:**

### **Method 1: Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Add each variable one by one:
   - **Name**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Your actual value
   - **Environment**: Select **Production**, **Preview**, and **Development**

### **Method 2: Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
vercel env add VITE_APP_ENV production
vercel env add VITE_APP_URL production
vercel env add NODE_ENV production
```

---

## 🔒 **SUPABASE SETUP FOR PRODUCTION:**

### **1. Update Supabase Auth Settings**
In your Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. Add these URLs to **Site URL**:
   - `https://www.scholarai.eu`
   - `https://scholarai.eu`
3. Add these URLs to **Redirect URLs**:
   - `https://www.scholarai.eu/auth/callback`
   - `https://scholarai.eu/auth/callback`
   - `https://www.scholarai.eu/auth/reset-password`
   - `https://scholarai.eu/auth/reset-password`

### **2. Update CORS Settings**
In Supabase dashboard:
1. Go to **Settings** → **API**
2. Update **CORS origins** to include:
   - `https://www.scholarai.eu`
   - `https://scholarai.eu`

---

## 💳 **STRIPE SETUP FOR PRODUCTION:**

### **1. Switch to Live Mode**
1. In Stripe dashboard, toggle to **Live mode**
2. Get your live publishable key (`pk_live_...`)
3. Get your live secret key (`sk_live_...`)

### **2. Update Webhook Endpoints**
1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://www.scholarai.eu/api/stripe/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

---

## 🌐 **DOMAIN SETUP:**

### **1. Custom Domain in Vercel**
1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add domain: `www.scholarai.eu`
4. Add domain: `scholarai.eu`
5. Configure DNS records as instructed by Vercel

### **2. SSL Certificate**
Vercel automatically provides SSL certificates for custom domains.

---

## ✅ **VERIFICATION CHECKLIST:**

### **Environment Variables Set:**
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_APP_URL=https://www.scholarai.eu`
- [ ] `NODE_ENV=production`

### **Supabase Configuration:**
- [ ] Site URLs updated
- [ ] Redirect URLs updated
- [ ] CORS origins updated
- [ ] RLS policies enabled

### **Stripe Configuration:**
- [ ] Live mode enabled
- [ ] Live keys configured
- [ ] Webhook endpoints updated
- [ ] Products and prices created

### **Domain Configuration:**
- [ ] Custom domains added in Vercel
- [ ] DNS records configured
- [ ] SSL certificates active

---

## 🚨 **TROUBLESHOOTING:**

### **Cross-Origin Errors:**
- Ensure all domains are added to Supabase CORS settings
- Check that redirect URLs match exactly
- Verify environment variables are set correctly

### **Authentication Issues:**
- Check Supabase auth settings
- Verify redirect URLs are correct
- Ensure email confirmation is disabled for testing

### **Payment Issues:**
- Verify Stripe is in live mode
- Check webhook endpoints are correct
- Ensure live keys are being used

---

## 📞 **SUPPORT:**

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test with Vercel preview deployments first

**Ready for production deployment!** 🚀
