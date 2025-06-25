# Scholar AI FutureHouse Backend Service

Python-based backend service for integrating FutureHouse AI agents with Scholar AI.

## 🚀 Overview

This backend service provides a FastAPI-based REST API that interfaces with the FutureHouse Python client library. It enables Scholar AI to use real FutureHouse AI agents (Crow, Falcon, Owl, Phoenix) for advanced research capabilities.

## 📋 Prerequisites

- Python 3.11+
- FutureHouse API key
- Supabase project (for authentication)
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Development

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

The API will be available at `http://localhost:8000`

## 📚 API Endpoints

### Health Check
- `GET /health` - Check service health and FutureHouse availability

### Research Endpoints
- `POST /api/research` - Execute a research query with specified agent
- `POST /api/research/multi-agent` - Execute comprehensive multi-agent research

### Agent-Specific Endpoints
- `POST /api/agents/crow/search` - Literature search (Crow)
- `POST /api/agents/falcon/synthesize` - Research synthesis (Falcon)
- `POST /api/agents/owl/format` - Citation formatting (Owl)
- `POST /api/agents/phoenix/analyze` - Gap analysis (Phoenix)

## 🔧 Configuration

### Environment Variables

```env
# Required
FUTUREHOUSE_API_KEY=your-futurehouse-api-key

# Optional (for authentication)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://scholar-ai.eu

# Server
HOST=0.0.0.0
PORT=8000
```

## 🧪 Testing

Run tests with pytest:
```bash
pytest tests/ -v
```

## 📦 Deployment

### Railway.app Deployment

1. **Create new project on Railway**
2. **Add environment variables**
3. **Deploy from GitHub:**
   ```bash
   railway login
   railway link
   railway up
   ```

### Render.com Deployment

1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Set build command:** `pip install -r requirements.txt`
4. **Set start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### AWS Lambda Deployment

Use Mangum adapter for serverless deployment:
```python
# app/lambda_handler.py
from mangum import Mangum
from app.main import app

handler = Mangum(app)
```

## 🔌 Frontend Integration

Update the frontend `futurehouse.js` to use this backend:

```javascript
// src/lib/futurehouse.js
const BACKEND_URL = process.env.VITE_FUTUREHOUSE_BACKEND_URL || 'http://localhost:8000';

async function callFutureHouseBackend(endpoint, data) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Backend error: ${response.statusText}`);
  }
  
  return response.json();
}
```

## 🐛 Troubleshooting

### FutureHouse Client Not Found
If you see "FutureHouse client not available", ensure:
1. `futurehouse-client` is installed: `pip install futurehouse-client`
2. Your Python version is compatible (3.8+)

### Authentication Errors
- Verify Supabase credentials are correct
- Ensure Authorization header is sent from frontend

### CORS Issues
- Add your frontend URL to `ALLOWED_ORIGINS`
- Ensure proper headers in frontend requests

## 📝 API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is part of Scholar AI and follows the same MIT license.