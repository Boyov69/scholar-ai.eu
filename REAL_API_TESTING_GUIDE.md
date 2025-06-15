# 🚀 Real API Testing Guide - Professional Workflow

## 👑 **PROFESSIONAL DEVELOPMENT APPROACH**

**Test locally first → Verify costs → Deploy with confidence**

---

## ⚡ **IMMEDIATE SETUP - LOCAL REAL API TESTING**

### **Step 1: Add Your OpenAI API Key**

In your `.env.local` file, replace:
```env
VITE_OPENAI_API_KEY=your-new-openai-api-key-here
```

With your actual OpenAI API key:
```env
VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### **Step 2: Enable Real API Testing**

Set these flags in `.env.local`:
```env
VITE_USE_LOCAL_OPENAI=true
VITE_USE_REAL_API=false
```

### **Step 3: Restart Development Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 **TESTING WORKFLOW**

### **Phase 1: Single Query Test**
1. **Open**: http://localhost:5173/
2. **Navigate to**: Debug → Real API Test
3. **Test one query**: "What are the latest developments in AI?"
4. **Monitor**: Cost (~$0.01-0.05), Duration (~10-30s), Results quality

### **Phase 2: Multi-Agent Workflow Test**
1. **Test Crow Agent**: Literature search
2. **Test Falcon Agent**: Research synthesis  
3. **Test Owl Agent**: Citation formatting
4. **Test Phoenix Agent**: Gap analysis
5. **Verify**: All agents work together seamlessly

### **Phase 3: Cost & Performance Analysis**
1. **Run 3-5 test queries**
2. **Monitor total costs** (should be <$0.25 for testing)
3. **Check response quality** vs mock data
4. **Verify error handling** with invalid queries

---

## 💰 **COST MONITORING**

### **Expected Costs (GPT-3.5-turbo)**
- **Single query**: ~$0.01-0.05
- **Full research workflow**: ~$0.02-0.08
- **10 test queries**: ~$0.20-0.50
- **100 queries/day**: ~$2-5

### **Cost Control Measures**
```javascript
// Built-in cost monitoring
const estimatedCost = (tokens / 1000) * 0.002; // GPT-3.5-turbo rate
console.log(`Estimated cost: $${estimatedCost.toFixed(4)}`);
```

### **Safety Limits**
- **Max tokens per request**: 1500
- **Temperature**: 0.1-0.2 (consistent results)
- **Model**: GPT-3.5-turbo (cost-effective)

---

## 🔧 **CONFIGURATION OPTIONS**

### **Development Mode (Default)**
```env
VITE_USE_LOCAL_OPENAI=false  # Use mock data
VITE_USE_REAL_API=false      # Use mock responses
```

### **Local Real API Testing**
```env
VITE_USE_LOCAL_OPENAI=true   # Use real OpenAI API
VITE_USE_REAL_API=false      # Still use local testing
```

### **Full Real API Mode**
```env
VITE_USE_LOCAL_OPENAI=true   # Use real OpenAI API
VITE_USE_REAL_API=true       # Use real FutureHouse API
```

---

## 🎯 **TESTING CHECKLIST**

### **✅ Basic Functionality**
- [ ] OpenAI API key configured
- [ ] Development server running
- [ ] Real API test component accessible
- [ ] Single query test successful
- [ ] Cost monitoring working

### **✅ Multi-Agent Workflow**
- [ ] Crow agent (literature search) working
- [ ] Falcon agent (synthesis) working  
- [ ] Owl agent (citations) working
- [ ] Phoenix agent (gap analysis) working
- [ ] All agents integrated properly

### **✅ Performance & Quality**
- [ ] Response time acceptable (<30s)
- [ ] Cost per query reasonable (<$0.05)
- [ ] Response quality good vs mock data
- [ ] Error handling working
- [ ] No API rate limit issues

### **✅ Production Readiness**
- [ ] All tests passing locally
- [ ] Costs understood and acceptable
- [ ] Performance meets requirements
- [ ] Error handling robust
- [ ] Ready for GitHub commit

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **After Successful Local Testing:**

1. **Commit to GitHub**:
```bash
git add .
git commit -m "feat: Add real OpenAI API integration with local testing"
git push origin enhanced-research-feature
```

2. **Update Vercel Environment Variables**:
```env
# In Vercel Dashboard:
OPENAI_API_KEY=sk-your-actual-key  # Server-side only!
VITE_USE_REAL_API=true            # Enable for production
```

3. **Deploy to Vercel**:
```bash
# Automatic deployment via GitHub integration
# Or manual: vercel --prod
```

4. **Production Testing**:
- Test one query in production
- Verify costs and performance
- Monitor for any issues

---

## 🛡️ **SECURITY BEST PRACTICES**

### **✅ Local Testing Security**
- ✅ API key in `.env.local` (not committed)
- ✅ `VITE_` prefix only for local testing
- ✅ Server-side key separate (`OPENAI_API_KEY`)

### **✅ Production Security**
- ✅ API key server-side only in Vercel
- ✅ No `VITE_OPENAI_API_KEY` in production
- ✅ Edge Functions handle API calls securely

### **❌ Never Do This**
- ❌ Commit API keys to Git
- ❌ Use `VITE_OPENAI_API_KEY` in production
- ❌ Expose API keys to browser in production

---

## 📊 **MONITORING & OPTIMIZATION**

### **Performance Metrics**
- **Response Time**: Target <30s per query
- **Token Usage**: Monitor per request
- **Cost Per Query**: Target <$0.05
- **Success Rate**: Target >95%

### **Optimization Tips**
- Use GPT-3.5-turbo for cost efficiency
- Set appropriate max_tokens limits
- Use lower temperature for consistency
- Implement caching for repeated queries

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

**API Key Not Working**:
```bash
# Check environment variables
console.log('API Key:', !!import.meta.env.VITE_OPENAI_API_KEY);
```

**High Costs**:
- Check token usage in responses
- Reduce max_tokens if needed
- Use GPT-3.5-turbo instead of GPT-4

**Slow Responses**:
- Check network connection
- Monitor OpenAI API status
- Consider timeout settings

**Rate Limits**:
- Implement request queuing
- Add delays between requests
- Monitor usage dashboard

---

## 🎉 **SUCCESS CRITERIA**

**Ready for Production When:**
- ✅ All local tests passing
- ✅ Costs under control (<$0.05/query)
- ✅ Performance acceptable (<30s)
- ✅ Error handling robust
- ✅ Security properly implemented
- ✅ Team confident in deployment

**Professional deployment = Zero surprises in production!** 👑

---

## 📞 **SUPPORT**

- **OpenAI API Issues**: https://help.openai.com/
- **Cost Monitoring**: https://platform.openai.com/usage
- **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits

**Ready to test? Add your API key and start with one query!** 🚀
