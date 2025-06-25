"""
FutureHouse API Backend Service for Scholar AI
Provides a Python-based integration with FutureHouse AI agents
"""

import os
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import httpx

# Import FutureHouse client
try:
    from futurehouse_client import FutureHouseClient, JobNames
    FUTUREHOUSE_AVAILABLE = True
except ImportError:
    FUTUREHOUSE_AVAILABLE = False
    logging.warning("FutureHouse client not available. Running in mock mode.")

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
FUTUREHOUSE_API_KEY = os.getenv("FUTUREHOUSE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# Initialize FutureHouse client if available
futurehouse_client = None
if FUTUREHOUSE_AVAILABLE and FUTUREHOUSE_API_KEY:
    try:
        futurehouse_client = FutureHouseClient(api_key=FUTUREHOUSE_API_KEY)
        logger.info("✅ FutureHouse client initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize FutureHouse client: {e}")

# Pydantic models
class ResearchRequest(BaseModel):
    """Request model for research queries"""
    query: str = Field(..., description="The research question or query")
    agent: str = Field("CROW", description="The FutureHouse agent to use")
    max_results: Optional[int] = Field(50, description="Maximum number of results")
    options: Optional[Dict[str, Any]] = Field(default_factory=dict)

class LiteratureSearchRequest(BaseModel):
    """Request model for literature search"""
    query: str
    max_results: Optional[int] = 50
    include_abstracts: Optional[bool] = True
    date_range: Optional[Dict[str, str]] = None
    fields: Optional[List[str]] = None

class SynthesisRequest(BaseModel):
    """Request model for research synthesis"""
    sources: List[Dict[str, Any]]
    research_question: str
    synthesis_type: Optional[str] = "comprehensive"
    citation_style: Optional[str] = "apa"
    include_gaps: Optional[bool] = True

class CitationRequest(BaseModel):
    """Request model for citation formatting"""
    sources: List[Dict[str, Any]]
    citation_style: Optional[str] = "apa"
    include_bibliography: Optional[bool] = True
    sort_alphabetically: Optional[bool] = True

class GapAnalysisRequest(BaseModel):
    """Request model for gap analysis"""
    research_area: str
    existing_literature: List[Dict[str, Any]]
    analysis_depth: Optional[str] = "detailed"
    suggest_methodologies: Optional[bool] = True
    identify_collaborations: Optional[bool] = True

class MultiAgentRequest(BaseModel):
    """Request model for multi-agent research"""
    question: str
    research_area: Optional[str] = None
    max_results: Optional[int] = 100
    citation_style: Optional[str] = "apa"
    synthesis_type: Optional[str] = "comprehensive"
    date_range: Optional[Dict[str, str]] = None

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    logger.info("🚀 Starting FutureHouse Backend Service")
    logger.info(f"📍 FutureHouse Available: {FUTUREHOUSE_AVAILABLE}")
    logger.info(f"🔑 API Key Configured: {bool(FUTUREHOUSE_API_KEY)}")
    yield
    logger.info("👋 Shutting down FutureHouse Backend Service")

# Create FastAPI app
app = FastAPI(
    title="Scholar AI FutureHouse Backend",
    description="Python backend service for FutureHouse AI integration",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for user authentication
async def verify_auth_token(authorization: Optional[str] = Header(None)):
    """Verify the authorization token with Supabase"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # In production, verify with Supabase
    # For now, we'll do basic validation
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    return authorization.replace("Bearer ", "")

# Mock response functions
async def get_mock_research_response(request: ResearchRequest):
    """Generate mock research response"""
    return {
        "success": True,
        "agent": request.agent,
        "query": request.query,
        "data": {
            "response": f"Mock response for {request.agent} agent: {request.query}",
            "sources": ["Mock Source 1", "Mock Source 2"],
            "confidence": 0.85
        },
        "timestamp": datetime.utcnow().isoformat(),
        "mock": True
    }

async def get_mock_literature_results(query: str):
    """Generate mock literature search results"""
    return {
        "status": "success",
        "query": query,
        "total_results": 3,
        "sources": [
            {
                "title": f"Mock Study on {query}",
                "authors": ["Smith, J.", "Doe, A."],
                "year": 2024,
                "abstract": f"This is a mock abstract about {query}...",
                "doi": "10.1234/mock.2024.001"
            },
            {
                "title": f"Recent Advances in {query}",
                "authors": ["Johnson, M.", "Williams, K."],
                "year": 2023,
                "abstract": f"Another mock abstract discussing {query}...",
                "doi": "10.1234/mock.2023.002"
            }
        ],
        "search_metadata": {
            "search_time": "1.5s",
            "databases_searched": ["Mock Database"],
            "filters_applied": ["peer_reviewed"]
        },
        "mock": True
    }

async def get_mock_synthesis(research_question: str):
    """Generate mock synthesis results"""
    return {
        "status": "success",
        "research_question": research_question,
        "synthesis": {
            "executive_summary": f"Mock synthesis for: {research_question}",
            "key_findings": [
                "Mock finding 1",
                "Mock finding 2",
                "Mock finding 3"
            ],
            "themes": [
                {"theme": "Theme 1", "description": "Mock theme description"},
                {"theme": "Theme 2", "description": "Another mock theme"}
            ],
            "recommendations": [
                "Mock recommendation 1",
                "Mock recommendation 2"
            ]
        },
        "confidence_score": 0.85,
        "processing_time": "2.3s",
        "mock": True
    }

async def get_mock_citations(sources: List[Dict[str, Any]]):
    """Generate mock citation results"""
    return {
        "status": "success",
        "citation_style": "apa",
        "bibliography": [
            "Smith, J., & Doe, A. (2024). Mock Study. Journal of Examples, 1(1), 1-10.",
            "Johnson, M., & Williams, K. (2023). Recent Advances. Research Today, 2(3), 45-60."
        ],
        "in_text_citations": [
            "(Smith & Doe, 2024)",
            "(Johnson & Williams, 2023)"
        ],
        "total_sources": len(sources),
        "mock": True
    }

async def get_mock_gap_analysis(research_area: str):
    """Generate mock gap analysis results"""
    return {
        "status": "success",
        "research_area": research_area,
        "analysis": {
            "identified_gaps": [
                {
                    "gap": "Limited longitudinal studies",
                    "importance": "high",
                    "description": "Mock gap description"
                },
                {
                    "gap": "Lack of cross-cultural validation",
                    "importance": "medium",
                    "description": "Another mock gap"
                }
            ],
            "suggested_methodologies": [
                "Mixed-methods approach",
                "Large-scale survey design"
            ],
            "collaboration_opportunities": [
                "International research consortium",
                "Industry-academia partnership"
            ]
        },
        "confidence_score": 0.82,
        "analysis_depth": "detailed",
        "mock": True
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "futurehouse_available": FUTUREHOUSE_AVAILABLE,
        "futurehouse_configured": bool(futurehouse_client),
        "timestamp": datetime.utcnow().isoformat()
    }

# Main research endpoint
@app.post("/api/research")
async def research(
    request: ResearchRequest,
    token: str = Depends(verify_auth_token)
):
    """Execute a research query using FutureHouse agents"""
    try:
        if not futurehouse_client:
            # Return mock data if FutureHouse is not available
            return await get_mock_research_response(request)
        
        # Map agent names to JobNames
        agent_mapping = {
            "CROW": JobNames.CROW,
            "FALCON": JobNames.FALCON,
            "OWL": JobNames.OWL,
            "PHOENIX": JobNames.PHOENIX
        }
        
        job_name = agent_mapping.get(request.agent.upper())
        if not job_name:
            raise HTTPException(status_code=400, detail=f"Invalid agent: {request.agent}")
        
        # Create task data
        task_data = {
            "name": job_name,
            "query": request.query,
            **request.options
        }
        
        # Run the task
        logger.info(f"🔍 Running {request.agent} agent for query: {request.query[:50]}...")
        result = futurehouse_client.run_tasks_until_done(task_data)
        
        return {
            "success": True,
            "agent": request.agent,
            "query": request.query,
            "data": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Research error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Literature search endpoint (Crow)
@app.post("/api/agents/crow/search")
async def literature_search(
    request: LiteratureSearchRequest,
    token: str = Depends(verify_auth_token)
):
    """Search literature using Crow agent"""
    try:
        if not futurehouse_client:
            return await get_mock_literature_results(request.query)
        
        task_data = {
            "name": JobNames.CROW,
            "query": request.query,
            "max_results": request.max_results,
            "include_abstracts": request.include_abstracts
        }
        
        if request.date_range:
            task_data["date_range"] = request.date_range
        if request.fields:
            task_data["fields"] = request.fields
        
        result = futurehouse_client.run_tasks_until_done(task_data)
        
        return {
            "status": "success",
            "query": request.query,
            "total_results": len(result.get("sources", [])),
            "sources": result.get("sources", []),
            "search_metadata": {
                "search_time": f"{result.get('processing_time', 0)}s",
                "databases_searched": result.get("databases", []),
                "filters_applied": result.get("filters", [])
            }
        }
        
    except Exception as e:
        logger.error(f"Literature search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Research synthesis endpoint (Falcon)
@app.post("/api/agents/falcon/synthesize")
async def synthesize_research(
    request: SynthesisRequest,
    token: str = Depends(verify_auth_token)
):
    """Synthesize research using Falcon agent"""
    try:
        if not futurehouse_client:
            return await get_mock_synthesis(request.research_question)
        
        task_data = {
            "name": JobNames.FALCON,
            "sources": request.sources,
            "research_question": request.research_question,
            "synthesis_type": request.synthesis_type,
            "citation_style": request.citation_style,
            "include_gaps": request.include_gaps
        }
        
        result = futurehouse_client.run_tasks_until_done(task_data)
        
        return {
            "status": "success",
            "research_question": request.research_question,
            "synthesis": result.get("synthesis", {}),
            "confidence_score": result.get("confidence_score", 0.85),
            "processing_time": f"{result.get('processing_time', 0)}s"
        }
        
    except Exception as e:
        logger.error(f"Synthesis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Citation formatting endpoint (Owl)
@app.post("/api/agents/owl/format")
async def format_citations(
    request: CitationRequest,
    token: str = Depends(verify_auth_token)
):
    """Format citations using Owl agent"""
    try:
        if not futurehouse_client:
            return await get_mock_citations(request.sources)
        
        task_data = {
            "name": JobNames.OWL,
            "sources": request.sources,
            "citation_style": request.citation_style,
            "include_bibliography": request.include_bibliography,
            "sort_alphabetically": request.sort_alphabetically
        }
        
        result = futurehouse_client.run_tasks_until_done(task_data)
        
        return {
            "status": "success",
            "citation_style": request.citation_style,
            "bibliography": result.get("bibliography", []),
            "in_text_citations": result.get("in_text_citations", []),
            "total_sources": len(request.sources)
        }
        
    except Exception as e:
        logger.error(f"Citation formatting error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Gap analysis endpoint (Phoenix)
@app.post("/api/agents/phoenix/analyze")
async def analyze_gaps(
    request: GapAnalysisRequest,
    token: str = Depends(verify_auth_token)
):
    """Analyze research gaps using Phoenix agent"""
    try:
        if not futurehouse_client:
            return await get_mock_gap_analysis(request.research_area)
        
        task_data = {
            "name": JobNames.PHOENIX,
            "research_area": request.research_area,
            "existing_literature": request.existing_literature,
            "analysis_depth": request.analysis_depth,
            "suggest_methodologies": request.suggest_methodologies,
            "identify_collaborations": request.identify_collaborations
        }
        
        result = futurehouse_client.run_tasks_until_done(task_data)
        
        return {
            "status": "success",
            "research_area": request.research_area,
            "analysis": result.get("analysis", {}),
            "confidence_score": result.get("confidence_score", 0.82),
            "analysis_depth": request.analysis_depth
        }
        
    except Exception as e:
        logger.error(f"Gap analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Multi-agent research endpoint
@app.post("/api/research/multi-agent")
async def multi_agent_research(
    request: MultiAgentRequest,
    token: str = Depends(verify_auth_token)
):
    """Execute a comprehensive multi-agent research query"""
    try:
        query_id = f"query_{int(datetime.utcnow().timestamp())}"
        
        # Step 1: Literature search with Crow
        literature_request = LiteratureSearchRequest(
            query=request.question,
            max_results=request.max_results,
            date_range=request.date_range
        )
        literature_results = await literature_search(literature_request, token)
        
        # Step 2: Synthesis with Falcon
        synthesis_request = SynthesisRequest(
            sources=literature_results.get("sources", []),
            research_question=request.question,
            synthesis_type=request.synthesis_type,
            citation_style=request.citation_style
        )
        synthesis_results = await synthesize_research(synthesis_request, token)
        
        # Step 3: Citation formatting with Owl
        citation_request = CitationRequest(
            sources=literature_results.get("sources", []),
            citation_style=request.citation_style
        )
        citation_results = await format_citations(citation_request, token)
        
        # Step 4: Gap analysis with Phoenix
        gap_request = GapAnalysisRequest(
            research_area=request.research_area or request.question,
            existing_literature=literature_results.get("sources", [])
        )
        gap_results = await analyze_gaps(gap_request, token)
        
        return {
            "queryId": query_id,
            "status": "completed",
            "results": {
                "literature": literature_results,
                "synthesis": synthesis_results,
                "citations": citation_results,
                "gaps": gap_results
            },
            "metadata": {
                "processed_at": datetime.utcnow().isoformat(),
                "agents_used": ["crow", "falcon", "owl", "phoenix"],
                "total_sources": len(literature_results.get("sources", []))
            }
        }
        
    except Exception as e:
        logger.error(f"Multi-agent research error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)