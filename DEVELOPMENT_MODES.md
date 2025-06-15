# 🎛️ Scholar-AI Development Modes Guide

## 🚀 **QUICK COMMANDS**

### **Development Mode (Mock Data)**
```bash
npm run dev
```
✅ **Mock APIs, geen kosten, snelle development**

### **Production Mode Lokaal**
```bash
npm run dev:prod
```
✅ **Echte APIs, lokaal testen, debug production issues**

### **Production Build Test**
```bash
npm run test:local
```
✅ **Test geoptimaliseerde build lokaal**

### **Quick Production Test**
```bash
npm run test:prod
```
✅ **Snelle production mode test**

---

## 🎯 **WANNEER WELKE MODE?**

### **🚧 Development Mode** (`npm run dev`)
**Gebruik voor:**
- ✅ UI development
- ✅ Component testing
- ✅ Layout aanpassingen
- ✅ Styling work
- ✅ Snelle iteratie

**Kenmerken:**
- Mock subscription data (Premium tier)
- Mock AI responses
- Mock payment flows
- Geen API kosten
- Instant responses

### **🔄 Production Mode Lokaal** (`npm run dev:prod`)
**Gebruik voor:**
- ✅ API integration testing
- ✅ Database connectivity
- ✅ Payment flow testing
- ✅ Real data validation
- ✅ Production debugging

**Kenmerken:**
- Echte Supabase calls
- Echte Stripe integration
- Real AI API calls
- Mogelijke API kosten
- Real response times

### **📦 Production Build** (`npm run test:local`)
**Gebruik voor:**
- ✅ Performance testing
- ✅ Bundle size verification
- ✅ Production optimizations
- ✅ Final testing voor deploy

**Kenmerken:**
- Geoptimaliseerde code
- Minified assets
- Production performance
- Real production environment

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Development Mode (.env.local)**
```env
VITE_DEV_MODE=true
VITE_MOCK_PAYMENTS=true
VITE_MOCK_AI_RESPONSES=true
VITE_ENABLE_DEBUG_LOGS=true
```

### **Production Mode (.env.local)**
```env
VITE_DEV_MODE=false
VITE_MOCK_PAYMENTS=false
VITE_MOCK_AI_RESPONSES=false
VITE_USE_REAL_API=true
```

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **Stap 1: Development**
```bash
npm run dev
# Ontwikkel features met mock data
```

### **Stap 2: Local Production Test**
```bash
npm run dev:prod
# Test met echte APIs lokaal
```

### **Stap 3: Build Test**
```bash
npm run test:local
# Test production build
```

### **Stap 4: Deploy**
```bash
git add .
git commit -m "Ready for production"
git push origin main
# Automatische deploy naar Vercel
```

---

## 🎛️ **MANUAL MODE SWITCHING**

### **Tijdelijk Production Mode**
```bash
# In terminal:
export VITE_DEV_MODE=false
npm run dev

# Of Windows:
set VITE_DEV_MODE=false && npm run dev
```

### **Terug naar Development Mode**
```bash
# In terminal:
export VITE_DEV_MODE=true
npm run dev

# Of Windows:
set VITE_DEV_MODE=true && npm run dev
```

---

## 🔍 **DEBUG TIPS**

### **Check Current Mode**
Open browser console en kijk naar:
```
🚧 Development mode: Using mock data
# OF
🚀 Production mode: Using real APIs
```

### **Force Mode in Browser**
```javascript
// In browser console:
localStorage.setItem('forceDevMode', 'true');
// Of:
localStorage.setItem('forceDevMode', 'false');
// Dan refresh page
```

---

## ⚠️ **BELANGRIJKE NOTES**

### **API Kosten**
- **Development Mode**: Geen kosten
- **Production Mode**: Echte API calls = kosten

### **Data Persistence**
- **Development Mode**: Mock data, niet persistent
- **Production Mode**: Echte database, persistent

### **Performance**
- **Development Mode**: Sneller (mock responses)
- **Production Mode**: Realistisch (echte API latency)

---

## 🎉 **AANBEVELING**

**Voor dagelijkse development:**
```bash
npm run dev
```

**Voor production testing:**
```bash
npm run dev:prod
```

**Voor final verification:**
```bash
npm run test:local
```

**Voor deployment:**
```bash
git push origin main
```

**Happy coding! 🚀**
