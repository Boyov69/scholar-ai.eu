# 🔒 OpenAI API Security Guide

## 🚨 CRITICAL SECURITY ALERT

**Your OpenAI API key was exposed in our conversation and MUST be revoked immediately!**

### ⚡ IMMEDIATE ACTION REQUIRED:

1. **Go to OpenAI Platform**: https://platform.openai.com/api-keys
2. **Find and DELETE** the exposed key: `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`
3. **Create a new API key**
4. **Store it securely** (see instructions below)

---

## ✅ SECURE IMPLEMENTATION

### **Architecture Overview**
```
Browser/Frontend → Supabase Edge Function → OpenAI API
      ↑                    ↑                    ↑
  No API key         Has API key         Receives request
  (secure)          (server-side)       (authenticated)
```

### **🔒 What We've Implemented**

#### 1. **Secure Supabase Edge Function**
- **Location**: `supabase/functions/openai-research/index.ts`
- **Purpose**: Server-side OpenAI API calls
- **Security**: API key never exposed to frontend

#### 2. **Secure Frontend Client**
- **Location**: `src/lib/openai.js`
- **Purpose**: Safe interface for OpenAI features
- **Security**: No direct API calls, uses Edge Function

#### 3. **Environment Configuration**
- **Server-side only**: `OPENAI_API_KEY=sk-your-new-key`
- **Never use**: `VITE_OPENAI_API_KEY` (exposes to browser!)

---

## 🛠️ SETUP INSTRUCTIONS

### **Step 1: Create New OpenAI API Key**
1. Visit: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. **NEVER share this key anywhere!**

### **Step 2: Configure Environment Variables**

#### **For Local Development (.env.local)**
```env
# 🔒 SECURE: Server-side only (no VITE_ prefix!)
OPENAI_API_KEY=sk-your-new-openai-key-here

# ✅ Safe public variables (keep existing):
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

#### **For Vercel Deployment**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add **ONLY**:
   ```
   OPENAI_API_KEY = sk-your-new-openai-key-here
   ```
3. **DO NOT ADD**: `VITE_OPENAI_API_KEY` or any public variant

### **Step 3: Deploy Edge Function**
```bash
# Deploy the secure Edge Function
supabase functions deploy openai-research
```

---

## 🔥 SECURITY BEST PRACTICES

### **✅ DO THIS:**
- Store API keys server-side only
- Use environment variables without `VITE_` prefix
- Make API calls through Edge Functions
- Implement user authentication
- Add rate limiting and usage tracking
- Monitor API usage and costs

### **❌ NEVER DO THIS:**
- Use `VITE_OPENAI_API_KEY` or similar
- Store API keys in frontend code
- Make direct OpenAI calls from browser
- Share API keys in chat/email/code
- Commit API keys to version control
- Expose keys in client-side JavaScript

---

## 🚀 USAGE EXAMPLES

### **Basic Research Query**
```javascript
import { openaiResearch } from '@/lib/api';

const response = await openaiResearch(
  "What are the latest developments in quantum computing?",
  { tier: 'ultra', model: 'gpt-4o' }
);
```

### **Generate Summary**
```javascript
import { generateSummary } from '@/lib/api';

const summary = await generateSummary(
  "Your research paper text here...",
  { maxTokens: 300 }
);
```

### **Format Citation**
```javascript
import { formatCitation } from '@/lib/api';

const citation = await formatCitation({
  title: "Research Paper Title",
  authors: ["Author 1", "Author 2"],
  year: 2024,
  journal: "Journal Name"
}, 'apa');
```

---

## 🛡️ TIER-BASED ACCESS CONTROL

### **Basic Tier**
- Model: `gpt-4o-mini`
- Max Tokens: 2,048
- Rate Limit: 10 requests/hour

### **Ultra Tier**
- Model: `gpt-4o` (full access)
- Max Tokens: 4,096
- Rate Limit: 100 requests/hour

---

## 📊 MONITORING & COSTS

### **Usage Tracking**
- All requests logged in `research_queries` table
- Token usage tracked per user
- Tier-based restrictions enforced

### **Cost Management**
- Set OpenAI usage limits in dashboard
- Monitor spending alerts
- Implement rate limiting

---

## 🔍 TESTING SECURITY

### **Verify API Key is Secure**
```javascript
// In browser console - should be undefined:
console.log(process.env.VITE_OPENAI_API_KEY); // ✅ undefined

// This should work (calls Edge Function):
import { openaiResearch } from '@/lib/api';
openaiResearch("test query"); // ✅ works securely
```

### **Check Network Requests**
- Open DevTools → Network tab
- Make OpenAI request
- Verify: No direct calls to `api.openai.com`
- Should only see calls to your Supabase Edge Function

---

## 🆘 EMERGENCY PROCEDURES

### **If API Key is Compromised:**
1. **Immediately revoke** the key at OpenAI
2. **Create new key** and update environment variables
3. **Redeploy** Edge Functions with new key
4. **Monitor usage** for unauthorized activity
5. **Review logs** for security breaches

### **Support Contacts:**
- OpenAI Support: https://help.openai.com/
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support

---

## ✅ SECURITY CHECKLIST

- [ ] Old API key revoked
- [ ] New API key created
- [ ] Environment variables configured (no VITE_ prefix)
- [ ] Edge Function deployed
- [ ] Frontend updated to use secure client
- [ ] Testing completed
- [ ] Monitoring enabled
- [ ] Team educated on security practices

**Remember: Security is not optional - it's essential!** 🔒
