# 🚀 Scholar-AI Development Setup

## ✅ **CLEAN CODEBASE - NO MORE DUPLICATES!**

This codebase has been cleaned up and all duplicate files have been removed.

## 📁 **Project Structure (Clean)**

```
scholar-ai/
├── src/                    # Main application code
│   ├── components/         # React components
│   ├── lib/               # Core libraries (supabase, api, etc.)
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── supabase/              # Supabase configuration & functions
├── scripts/               # Development & deployment scripts
├── .env.local             # 🎯 SINGLE development environment file
├── .env.example           # Template for environment variables
└── package.json           # Clean dependencies & scripts
```

## 🛠️ **Quick Start (3 Steps)**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Setup**
The `.env.local` file is already configured for development with:
- ✅ Mock payments (no real Stripe charges)
- ✅ Mock AI responses (no API costs)
- ✅ Debug logging enabled
- ✅ Development tools enabled

### 3. **Start Development Server**
```bash
npm run dev
```

🎉 **That's it!** Open http://localhost:5173

## 🔧 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to Vercel |

## 🧹 **What Was Cleaned Up**

### ❌ **Removed Duplicates:**
- `mcp-vercel/` (separate project)
- `scripts/start-localhost.bat`
- `scripts/start-simple.bat`
- `.env.production`
- `test-*.html` files
- Duplicate package.json scripts

### ✅ **Kept Essential:**
- `.env.local` (single development config)
- `.env.example` (template)
- Core scripts in `scripts/`
- Main application in `src/`

## 🎯 **Development Mode Features**

- **Mock Payments**: No real Stripe charges during development
- **Mock AI**: No API costs for OpenAI/FutureHouse
- **Hot Reload**: Instant updates when you save files
- **Debug Logs**: Detailed logging for troubleshooting
- **CORS Proxy**: Automatic handling of cross-origin requests

## 🚀 **Ready for Production**

When ready to deploy:
1. Set `VITE_MOCK_PAYMENTS=false` in environment
2. Set `VITE_MOCK_AI_RESPONSES=false` in environment
3. Run `npm run deploy`

## 📞 **Need Help?**

- Check the browser console for debug logs
- All API calls are mocked by default (safe for development)
- Environment variables are clearly documented in `.env.example`

**Happy coding! 🎉**
