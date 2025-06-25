import { config } from './config.js';

/**
 * FutureHouse Backend Client
 * Connects frontend to Python backend service for real FutureHouse API integration
 */

class FutureHouseBackendClient {
  constructor() {
    this.backendUrl = config.futurehouse.backendUrl;
    this.timeout = 30000; // 30 second timeout
  }

  /**
   * Make HTTP request to backend with proper error handling
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.backendUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(`🔌 Making backend request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Backend request successful');
      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Backend request timeout');
      }

      console.error('❌ Backend request failed:', error);
      throw error;
    }
  }

  /**
   * Process research query through Python backend
   */
  async processResearchQuery(query, options = {}) {
    try {
      console.log('🚀 Processing research query through Python backend...');

      // Map frontend query format to backend format
      const backendQuery = {
        query: query.question || query.query || '',
        agent: 'CROW', // Default to CROW for literature search
        options: {
          max_results: query.maxResults || 50,
          citation_style: query.citationStyle || 'apa',
          research_area: query.researchArea || '',
          synthesis_type: query.synthesisType || 'comprehensive',
          ...options
        }
      };

      const result = await this.makeRequest('/api/research', {
        method: 'POST',
        body: JSON.stringify(backendQuery)
      });

      // Transform backend response to match frontend expectations
      return this.transformBackendResponse(result, query);

    } catch (error) {
      console.error('❌ Backend processing failed:', error);
      throw error;
    }
  }

  /**
   * Transform backend response to match frontend format
   */
  transformBackendResponse(backendResult, originalQuery) {
    return {
      queryId: originalQuery.queryId || Date.now().toString(),
      status: 'completed',
      results: {
        literature: backendResult.data || {},
        synthesis: backendResult.data || {},
        citations: backendResult.data || {},
        gaps: backendResult.data || {}
      },
      metadata: {
        processed_at: backendResult.timestamp || new Date().toISOString(),
        agents_used: [backendResult.agent?.toLowerCase() || 'crow'],
        total_sources: backendResult.data?.sources?.length || 0,
        backend_processed: true,
        processing_time_ms: 0,
        cached: false
      }
    };
  }

  /**
   * Check if backend is available and healthy
   */
  async checkHealth() {
    try {
      const response = await this.makeRequest('/health', {
        method: 'GET'
      });

      return {
        available: true,
        status: response.status || 'healthy',
        version: response.version || 'unknown',
        futurehouse_available: response.futurehouse_available || false
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        reason: 'Backend service unavailable'
      };
    }
  }
}

// Create singleton instance
const backendClient = new FutureHouseBackendClient();

// Export the main interface
export const futureHouseBackend = {
  processResearchQuery: (query, options) => backendClient.processResearchQuery(query, options)
};

export const checkBackendAvailability = () => backendClient.checkHealth();