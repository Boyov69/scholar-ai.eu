# Scholar AI - Complete Deployment Guide

## 🎯 Project Overview & Functionalities

### Core Features:
1. **AI-Powered Research Platform**
   - Literature search using FutureHouse Crow agent
   - Research synthesis with Falcon agent
   - Citation formatting with Owl agent
   - Research gap analysis with Phoenix agent

2. **User Management**
   - Authentication via Supabase
   - Subscription tiers (Advanced AI, Ultra-Intelligent, PhD-Level)
   - User workspaces and collaboration

3. **Research Tools**
   - Multi-format citation support (APA, MLA, Chicago, Harvard, IEEE, Vancouver, BibTeX)
   - Export formats (PDF, Word, LaTeX, BibTeX, RIS, EndNote)
   - Real-time collaboration
   - Research workspace management

4. **Payment Integration**
   - Stripe payment processing
   - Monthly and yearly subscription plans
   - Tiered pricing structure

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Fill in your `.env` file with your actual credentials:

```env
# FutureHouse API (REQUIRED)
FUTUREHOUSE_API_KEY=your-actual-futurehouse-api-key

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Stripe (REQUIRED for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 2. GitHub Credentials
You'll need:
- GitHub account username
- Personal Access Token (for CLI) or use web authentication

### 3. Vercel Account
- Vercel account email
- Vercel CLI installed: `npm install -g vercel`

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Project

```bash
cd E:\User\Documents\scholar-ai

# Install dependencies
npm install

# Test locally
npm run dev
# Visit http://localhost:5173 to verify everything works
```

### Step 2: Initialize Git & Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Scholar AI platform"

# Create repository on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/scholar-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - What's your project's name? scholar-ai
# - In which directory is your code located? ./
# - Want to override the settings? N
```

### Step 4: Configure Environment Variables in Vercel

```bash
# Add each environment variable
vercel env add FUTUREHOUSE_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production

# For Vite compatibility
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_FUTUREHOUSE_API_KEY production
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production

# Deploy with environment variables
vercel --prod
```

### Step 5: Set Up Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Your project URL is already configured: `https://xicjnnzzykdhbmrpafhs.supabase.co`
3. Get your API keys from Settings > API
4. Set up database tables (if not already done):

```sql
-- Users table is handled by Supabase Auth

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Research queries table
CREATE TABLE research_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query_text TEXT,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 6: Configure Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create products and prices for each tier
3. Update the price IDs in your config
4. Set up webhook endpoint: `https://your-vercel-url.vercel.app/api/stripe-webhook`

### Step 7: Connect to Squarespace Domain

1. In Vercel Dashboard:
   - Go to your project > Settings > Domains
   - Add your domain: `scholarai.eu` or `app.scholarai.eu`

2. In Squarespace:
   - Go to Settings > Domains > Advanced Settings
   - Add these DNS records:
   ```
   Type: A
   Host: @ (or subdomain)
   Points to: 76.76.21.21
   
   Type: CNAME
   Host: www
   Points to: cname.vercel-dns.com
   ```

3. Wait for DNS propagation (5-30 minutes)

## 🔒 Security Checklist

- [ ] All API keys are in `.env` and not in code
- [ ] `.env` is in `.gitignore`
- [ ] Supabase Row Level Security (RLS) is enabled
- [ ] Stripe webhook endpoint is secured
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented

## 📊 Post-Deployment Verification

1. **Test Authentication**
   - Sign up with a new account
   - Verify email (if enabled)
   - Login/logout functionality

2. **Test FutureHouse Integration**
   - Perform a research query
   - Check if all agents respond correctly
   - Verify citation formatting

3. **Test Payment Flow**
   - Use Stripe test cards
   - Verify subscription creation
   - Check webhook handling

4. **Performance Check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify mobile responsiveness

## 🛠️ Maintenance Commands

```bash
# View deployment logs
vercel logs

# Redeploy after changes
git add .
git commit -m "Update: description"
git push
vercel --prod

# Check deployment status
vercel ls

# Rollback if needed
vercel rollback
```

## 📞 Support Contacts

- **Technical Issues**: Create issue on GitHub
- **Billing**: support@scholarai.eu
- **FutureHouse API**: Check their documentation
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support

## 🎉 Launch Checklist

- [ ] All environment variables configured
- [ ] Domain is connected and SSL active
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Analytics tracking enabled
- [ ] Error monitoring (Sentry) configured
- [ ] Backup strategy in place
- [ ] GDPR compliance verified
- [ ] Terms of Service and Privacy Policy linked

---

**Note**: Replace all placeholder values with your actual credentials before deployment.