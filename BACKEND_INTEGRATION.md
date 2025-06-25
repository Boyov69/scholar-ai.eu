# FutureHouse Backend Integration Guide

## 🚀 Overview

This document explains how to use the new Python backend integration for FutureHouse API calls in Scholar AI.

## 📋 Phase 1 Implementation Status

✅ **Completed:**
- Frontend-to-backend HTTP client implementation
- Environment variable configuration
- Graceful fallback system
- Backend health checking
- Test component for connection verification

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Backend service URL
VITE_FUTUREHOUSE_BACKEND_URL=http://localhost:8000

# Enable backend processing (set to 'true' to use Python backend)
VITE_USE_FUTUREHOUSE_BACKEND=false

# Enable real API calls (set to 'true' for production)
VITE_USE_REAL_API=false

# Enable local OpenAI testing (development only)
VITE_USE_LOCAL_OPENAI=false
```

### Backend Service

The Python backend service should be running on the configured URL (default: `http://localhost:8000`).

See `backend/README.md` for backend setup instructions.

## 🎯 How It Works

### 1. **Fallback Strategy**

The system uses a multi-tier fallback approach:

1. **Python Backend** (if `VITE_USE_FUTUREHOUSE_BACKEND=true`)
   - Connects to Python FastAPI service
   - Uses official FutureHouse Python client
   - Real FutureHouse API calls

2. **Frontend OpenAI** (if `VITE_USE_LOCAL_OPENAI=true`)
   - Direct OpenAI API calls from frontend
   - For development testing only

3. **Mock Responses** (default)
   - Simulated responses for development
   - No external API calls

### 2. **Backend Integration**

The frontend connects to the backend via:

```javascript
import { futureHouseBackend, checkBackendAvailability } from '@/lib/futurehouse-backend';

// Check if backend is available
const status = await checkBackendAvailability();

// Process research query through backend
const result = await futureHouseBackend.processResearchQuery(query, options);
```

### 3. **Error Handling**

- Backend unavailable → Falls back to frontend processing
- Backend timeout → Falls back to frontend processing  
- Invalid response → Falls back to frontend processing
- All errors are logged for debugging

## 🧪 Testing

### Backend Connection Test

Use the `BackendConnectionTest` component to verify the connection:

```jsx
import { BackendConnectionTest } from '@/components/debug';

// In your component
<BackendConnectionTest />
```

This component will:
- Check backend availability
- Test FutureHouse client status
- Run sample queries
- Display connection diagnostics

### Manual Testing

1. **Start Backend Service:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Enable Backend in Frontend:**
   ```bash
   # In .env
   VITE_USE_FUTUREHOUSE_BACKEND=true
   ```

3. **Test Connection:**
   - Use the BackendConnectionTest component
   - Check browser console for connection logs
   - Verify API calls in backend logs

## 🔍 Debugging

### Frontend Logs

Look for these console messages:

```
🔧 Scholar AI API Configuration: { useBackend: true, ... }
🔌 FutureHouse Backend Status: { available: true, ... }
🔌 Using FutureHouse Python Backend...
✅ Backend processing completed successfully
```

### Backend Logs

The Python backend will log:

```
INFO: ✅ FutureHouse client initialized successfully
INFO: 🔍 Running CROW agent for query: ...
```

### Common Issues

1. **Backend Not Available:**
   - Check if backend service is running
   - Verify `VITE_FUTUREHOUSE_BACKEND_URL` is correct
   - Check CORS configuration

2. **FutureHouse Client Not Available:**
   - Verify `FUTUREHOUSE_API_KEY` in backend environment
   - Check if `futurehouse-client` package is installed
   - Review backend logs for initialization errors

3. **Timeout Errors:**
   - Backend requests timeout after 30 seconds
   - Check backend performance and FutureHouse API response times

## 🚀 Next Steps (Phase 2)

1. **Deploy Backend Service:**
   - Deploy Python backend to cloud service
   - Configure production environment variables
   - Set up monitoring and logging

2. **Production Configuration:**
   - Set `VITE_USE_FUTUREHOUSE_BACKEND=true`
   - Set `VITE_USE_REAL_API=true`
   - Configure production backend URL

3. **Testing & Validation:**
   - Test all FutureHouse agents (CROW, FALCON, OWL, PHOENIX)
   - Verify response format compatibility
   - Performance testing and optimization

## 📚 API Reference

### Backend Client Methods

```javascript
// Check backend health
const status = await checkBackendAvailability();
// Returns: { available: boolean, status: string, futurehouse_available: boolean }

// Process research query
const result = await futureHouseBackend.processResearchQuery(query, options);
// Returns: { queryId, status, results, metadata }
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_FUTUREHOUSE_BACKEND_URL` | Backend service URL | `http://localhost:8000` |
| `VITE_USE_FUTUREHOUSE_BACKEND` | Enable backend processing | `false` |
| `VITE_USE_REAL_API` | Enable real API calls | `false` |
| `VITE_USE_LOCAL_OPENAI` | Enable OpenAI fallback | `false` |

## 🔒 Security Notes

- Never expose FutureHouse API keys in frontend environment variables
- Backend handles all sensitive API keys
- Frontend only communicates with your backend service
- CORS is configured to allow only your frontend domain
