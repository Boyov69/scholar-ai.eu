import { config } from './config.js';

// FutureHouse API client for AI research capabilities
class FutureHouseClient {
  constructor() {
    this.apiKey = config.futurehouse.apiKey;
    this.baseUrl = config.futurehouse.baseUrl;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('FutureHouse API Error:', error);
      throw error;
    }
  }

  // Crow agent - Literature search and analysis
  async searchLiterature(query, options = {}) {
    return this.request('/agents/crow/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        max_results: options.maxResults || 50,
        include_abstracts: options.includeAbstracts !== false,
        date_range: options.dateRange,
        fields: options.fields || ['title', 'authors', 'abstract', 'doi', 'year']
      })
    });
  }

  // Falcon agent - Research synthesis and analysis
  async synthesizeResearch(sources, research_question, options = {}) {
    return this.request('/agents/falcon/synthesize', {
      method: 'POST',
      body: JSON.stringify({
        sources,
        research_question,
        synthesis_type: options.synthesisType || 'comprehensive',
        citation_style: options.citationStyle || 'apa',
        include_gaps: options.includeGaps !== false
      })
    });
  }

  // Owl agent - Citation and reference management
  async formatCitations(sources, style = 'apa') {
    return this.request('/agents/owl/format', {
      method: 'POST',
      body: JSON.stringify({
        sources,
        citation_style: style,
        include_bibliography: true,
        sort_alphabetically: true
      })
    });
  }

  // Phoenix agent - Research gap analysis and recommendations
  async analyzeGaps(research_area, existing_literature, options = {}) {
    return this.request('/agents/phoenix/analyze', {
      method: 'POST',
      body: JSON.stringify({
        research_area,
        existing_literature,
        analysis_depth: options.analysisDepth || 'detailed',
        suggest_methodologies: options.suggestMethodologies !== false,
        identify_collaborations: options.identifyCollaborations !== false
      })
    });
  }

  // Multi-agent research query processing
  async processResearchQuery(query, options = {}) {
    const queryId = options.queryId || `query_${Date.now()}`;
    
    try {
      // Step 1: Literature search with Crow
      const literatureResults = await this.searchLiterature(query.question, {
        maxResults: query.maxResults || 100,
        dateRange: query.dateRange,
        fields: query.fields
      });

      // Step 2: Synthesis with Falcon
      const synthesis = await this.synthesizeResearch(
        literatureResults.sources,
        query.question,
        {
          synthesisType: query.synthesisType,
          citationStyle: query.citationStyle,
          includeGaps: true
        }
      );

      // Step 3: Citation formatting with Owl
      const formattedCitations = await this.formatCitations(
        literatureResults.sources,
        query.citationStyle || 'apa'
      );

      // Step 4: Gap analysis with Phoenix
      const gapAnalysis = await this.analyzeGaps(
        query.researchArea || query.question,
        literatureResults.sources,
        {
          analysisDepth: 'detailed',
          suggestMethodologies: true
        }
      );

      return {
        queryId,
        status: 'completed',
        results: {
          literature: literatureResults,
          synthesis: synthesis,
          citations: formattedCitations,
          gaps: gapAnalysis
        },
        metadata: {
          processed_at: new Date().toISOString(),
          agents_used: ['crow', 'falcon', 'owl', 'phoenix'],
          total_sources: literatureResults.sources?.length || 0
        }
      };
    } catch (error) {
      return {
        queryId,
        status: 'error',
        error: error.message,
        metadata: {
          processed_at: new Date().toISOString(),
          failed_at: 'multi_agent_processing'
        }
      };
    }
  }

  // Get query status (for long-running queries)
  async getQueryStatus(queryId) {
    return this.request(`/queries/${queryId}/status`);
  }

  // Cancel a running query
  async cancelQuery(queryId) {
    return this.request(`/queries/${queryId}/cancel`, {
      method: 'POST'
    });
  }
}

// Export singleton instance
export const futureHouseClient = new FutureHouseClient();

// Research query utilities
export const researchUtils = {
  // Create a research query object
  createQuery(question, options = {}) {
    return {
      question,
      researchArea: options.researchArea,
      maxResults: options.maxResults || 50,
      dateRange: options.dateRange,
      citationStyle: options.citationStyle || 'apa',
      synthesisType: options.synthesisType || 'comprehensive',
      fields: options.fields || ['title', 'authors', 'abstract', 'doi', 'year'],
      metadata: {
        created_at: new Date().toISOString(),
        user_id: options.userId
      }
    };
  },

  // Parse and validate research results
  validateResults(results) {
    const required = ['literature', 'synthesis', 'citations'];
    const missing = required.filter(field => !results[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required result fields: ${missing.join(', ')}`);
    }

    return {
      isValid: true,
      sourceCount: results.literature?.sources?.length || 0,
      hasGapAnalysis: !!results.gaps,
      citationCount: results.citations?.bibliography?.length || 0
    };
  },

  // Extract key insights from research results
  extractInsights(results) {
    const insights = {
      keyFindings: [],
      researchGaps: [],
      methodologies: [],
      recommendations: []
    };

    if (results.synthesis?.key_findings) {
      insights.keyFindings = results.synthesis.key_findings;
    }

    if (results.gaps?.identified_gaps) {
      insights.researchGaps = results.gaps.identified_gaps;
    }

    if (results.gaps?.suggested_methodologies) {
      insights.methodologies = results.gaps.suggested_methodologies;
    }

    if (results.gaps?.recommendations) {
      insights.recommendations = results.gaps.recommendations;
    }

    return insights;
  }
};

