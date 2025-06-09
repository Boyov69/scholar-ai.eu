# 🚀 Scholar AI - Quick Start Deployment

## Step 1: Update Environment Variables
Open `.env` file and add your actual API keys:

```env
# Replace these with your actual keys:
FUTUREHOUSE_API_KEY=your-actual-futurehouse-api-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

## Step 2: Push to GitHub
Run the Git setup script:

```powershell
cd E:\User\Documents\scholar-ai
.\git-setup.ps1
```

When prompted for GitHub credentials:
- Username: Boyov69
- Password: Use a Personal Access Token (not your password)
  - Get one at: https://github.com/settings/tokens

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI
```powershell
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "Import Project"
3. Select "Import Git Repository"
4. Enter: https://github.com/Boyov69/scholar-ai
5. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Step 4: Add Environment Variables in Vercel

In Vercel Dashboard > Your Project > Settings > Environment Variables:

Add these variables:
```
FUTUREHOUSE_API_KEY = [your-key]
VITE_SUPABASE_URL = https://xicjnnzzykdhbmrpafhs.supabase.co
VITE_SUPABASE_ANON_KEY = [your-key]
VITE_FUTUREHOUSE_API_KEY = [your-key]
```

## Step 5: Connect Your Domain

### In Vercel:
1. Go to Project Settings > Domains
2. Add domain: `scholarai.eu` or `app.scholarai.eu`

### In Squarespace:
1. Go to Settings > Domains > DNS Settings
2. Add these records:

```
Type: A
Host: @ (or app)
Points to: 76.76.21.21

Type: CNAME  
Host: www
Points to: cname.vercel-dns.com
```

## 🎯 Verification Checklist

- [ ] `.env` file has all API keys
- [ ] Code pushed to GitHub successfully
- [ ] Vercel deployment successful
- [ ] Environment variables added in Vercel
- [ ] Domain connected and SSL active
- [ ] Test user registration/login
- [ ] Test FutureHouse research query
- [ ] Test payment flow (with test card)

## 🆘 Troubleshooting

### Git Push Issues
```powershell
# If you get authentication errors:
git config --global credential.helper manager
# Then try pushing again
```

### Vercel Build Errors
```powershell
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build
```

### Domain Not Working
- Wait 5-30 minutes for DNS propagation
- Check DNS with: `nslookup scholarai.eu`

## 📞 Need Help?

- **GitHub Issues**: https://github.com/Boyov69/scholar-ai/issues
- **Vercel Support**: https://vercel.com/support
- **Project Documentation**: See DEPLOYMENT_GUIDE.md

---

**Ready to deploy? Start with Step 1! 🚀**