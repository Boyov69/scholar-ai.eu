# 🏠 Scholar AI Localhost Development Guide

This guide will help you set up and run Scholar AI locally for development and testing.

## 🚀 Quick Start

### One-Command Setup
```bash
npm run localhost
```

This single command will:
- ✅ Set up local environment
- ✅ Start Supabase services
- ✅ Deploy Edge Functions
- ✅ Create test data
- ✅ Start development server
- ✅ Open browser tabs

### Fresh Start (Clean Setup)
```bash
npm run localhost:fresh
```

## 📋 Prerequisites

### Required Software
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** (v8+) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Optional (Auto-installed)
- **Supabase CLI** - Auto-installed via npm
- **Vercel CLI** - For deployment only

## 🛠️ Manual Setup (If Needed)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Local Environment
```bash
npm run localhost:setup
```

### 3. Create Test Data
```bash
npm run test:data
```

### 4. Start Development Server
```bash
npm run dev
```

## 🌐 Local URLs

Once running, you'll have access to:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main Scholar AI application |
| **Supabase Studio** | http://localhost:54323 | Database management |
| **Supabase API** | http://localhost:54321 | Backend API |
| **Edge Functions** | http://localhost:54321/functions/v1 | Serverless functions |

## 👥 Test Users

Pre-created test users for different subscription tiers:

| Email | Password | Tier | Features |
|-------|----------|------|----------|
| `student@localhost.dev` | `TestPassword123!` | **Free** | Basic features |
| `researcher@localhost.dev` | `TestPassword123!` | **Advanced AI** | 50 queries/month |
| `professor@localhost.dev` | `TestPassword123!` | **Ultra Intelligent** | Unlimited queries |
| `admin@localhost.dev` | `TestPassword123!` | **PhD Level** | All features |

## 💳 Test Payment Cards

Use these Stripe test cards for payment testing:

| Card Number | Description | Expected Result |
|-------------|-------------|-----------------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0000 0000 0002` | Visa | ❌ Declined |
| `4000 0025 0000 3155` | Visa | 🔐 Requires 3D Secure |
| `4000 0000 0000 9995` | Visa | ⚠️ Insufficient funds |

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

## 🧪 Testing Features

### Research Queries
- **Mock AI Responses**: Enabled in development mode
- **Real-time Processing**: Simulated with delays
- **Error Simulation**: Random errors for testing

### Payment Flows
- **Stripe Checkout**: Mock responses in dev mode
- **Subscription Management**: Full lifecycle testing
- **Webhook Simulation**: Local webhook handling

### Collaboration
- **Multi-user Workspaces**: Test with different users
- **Real-time Updates**: Simulated collaboration
- **Permission Testing**: Role-based access

## 📊 Development Tools

### Database Management
```bash
# Reset database
supabase db reset

# View database logs
supabase logs

# Open Supabase Studio
supabase studio
```

### Testing Scripts
```bash
# Test payment flow
npm run test:payments

# Create Stripe products
npm run setup:stripe

# Recreate test data
npm run test:data
```

### Environment Management
```bash
# Setup fresh environment
npm run localhost:setup

# Start with fresh data
npm run localhost:fresh
```

## 🔧 Configuration

### Environment Variables
Local development uses `.env.local` with these key settings:

```env
# Development Mode
NODE_ENV=development
VITE_APP_ENV=development
VITE_MOCK_PAYMENTS=true
VITE_MOCK_AI_RESPONSES=true

# Local Supabase
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Test Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Feature Flags
Control what's enabled in development:

```env
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_SHOW_DEV_TOOLS=true
VITE_ENABLE_DEBUG_LOGS=true
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### Supabase Won't Start
```bash
# Stop all Supabase services
supabase stop

# Start fresh
supabase start
```

#### Database Issues
```bash
# Reset database completely
supabase db reset

# Recreate test data
npm run test:data
```

#### Edge Functions Not Working
```bash
# Redeploy functions
supabase functions deploy

# Check function logs
supabase functions logs
```

### Getting Help

1. **Check Logs**: Look at browser console and terminal output
2. **Restart Services**: Try `npm run localhost:fresh`
3. **Reset Database**: Use `supabase db reset`
4. **Check Ports**: Ensure ports 5173, 54321, 54323 are free

## 📁 Project Structure

```
scholar-ai/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and services
│   └── pages/             # Page components
├── supabase/              # Backend configuration
│   ├── functions/         # Edge Functions
│   ├── migrations/        # Database migrations
│   └── schema.sql         # Database schema
├── scripts/               # Development scripts
│   ├── setup-localhost.ps1
│   ├── start-localhost.ps1
│   ├── create-test-data.js
│   └── test-payment-flow.js
└── docs/                  # Documentation
```

## 🚀 Ready for Development!

Once everything is running:

1. **Frontend**: http://localhost:5173
2. **Login**: Use any test user credentials
3. **Test Features**: Try research queries, payments, collaboration
4. **Monitor**: Check Supabase Studio for database changes
5. **Debug**: Use browser dev tools and console logs

## 🔄 Development Workflow

1. **Make Changes**: Edit code in `src/`
2. **Hot Reload**: Changes appear instantly
3. **Test Features**: Use test users and mock data
4. **Check Database**: Monitor in Supabase Studio
5. **Test Payments**: Use test cards for Stripe flows
6. **Debug Issues**: Check console and logs

## 📝 Next Steps

- **Customize Features**: Modify components and logic
- **Test Thoroughly**: Use all test users and scenarios
- **Add New Features**: Follow existing patterns
- **Prepare for Production**: Use production checklist

Happy coding! 🎉
