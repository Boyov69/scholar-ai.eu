import { supabase } from './supabase.js';
import { config } from './config.js';

/**
 * 🔒 SECURE OpenAI API Client
 * 
 * This client NEVER exposes the OpenAI API key to the frontend.
 * All requests go through our secure Supabase Edge Function.
 * 
 * Security Architecture:
 * Frontend → Supabase Edge Function → OpenAI API
 *     ↑              ↑                    ↑
 * No API key    Has API key         Receives request
 * (secure)      (server-side)       (authenticated)
 */
class SecureOpenAIClient {
  constructor() {
    this.baseUrl = `${config.supabase.url}/functions/v1`;
  }

  /**
   * Get authentication headers for Supabase Edge Function calls
   */
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': config.supabase.anonKey
    };
  }

  /**
   * 🔒 SECURE: Research query using OpenAI
   * 
   * @param {string} query - The research question
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Research response
   */
  async research(query, options = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const requestBody = {
        query,
        tier: options.tier || 'basic',
        model: options.model || 'gpt-4o',
        maxTokens: options.maxTokens || 4096,
        temperature: options.temperature || 0.1
      };

      // 🔒 SECURE: Call our Edge Function (no API key exposed)
      const response = await fetch(`${this.baseUrl}/hyper-function`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'OpenAI request failed');
      }

      return {
        success: true,
        response: data.data.response,
        model: data.data.model,
        tier: data.data.tier,
        usage: data.usage
      };

    } catch (error) {
      console.error('Secure OpenAI Client Error:', error);
      throw error;
    }
  }

  /**
   * 🔒 SECURE: Generate academic summary
   */
  async generateSummary(text, options = {}) {
    const prompt = `Please provide a concise academic summary of the following text:

${text}

Requirements:
- Keep it under 200 words
- Use formal academic language
- Include key findings and conclusions
- Maintain objectivity`;

    return this.research(prompt, {
      ...options,
      model: options.model || 'gpt-4o-mini',
      maxTokens: 300
    });
  }

  /**
   * 🔒 SECURE: Generate research questions
   */
  async generateResearchQuestions(topic, options = {}) {
    const prompt = `Generate 5 high-quality research questions for the topic: "${topic}"

Requirements:
- Questions should be specific and researchable
- Suitable for academic investigation
- Cover different aspects of the topic
- Follow proper academic question formatting`;

    return this.research(prompt, {
      ...options,
      model: options.model || 'gpt-4o-mini',
      maxTokens: 500
    });
  }

  /**
   * 🔒 SECURE: Analyze research gaps
   */
  async analyzeGaps(researchArea, existingLiterature, options = {}) {
    const prompt = `Analyze research gaps in the field of "${researchArea}" based on the following existing literature:

${existingLiterature}

Please identify:
1. Unexplored areas
2. Methodological gaps
3. Theoretical limitations
4. Potential research opportunities

Provide specific, actionable insights for future research.`;

    return this.research(prompt, {
      ...options,
      model: options.model || 'gpt-4o',
      maxTokens: 1000
    });
  }

  /**
   * 🔒 SECURE: Citation formatting
   */
  async formatCitation(citationData, style = 'apa', options = {}) {
    const prompt = `Format the following citation in ${style.toUpperCase()} style:

${JSON.stringify(citationData, null, 2)}

Provide only the properly formatted citation, nothing else.`;

    return this.research(prompt, {
      ...options,
      model: options.model || 'gpt-4o-mini',
      maxTokens: 200,
      temperature: 0
    });
  }

  /**
   * Check if user has access to premium features
   */
  async checkAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { hasAccess: false, tier: 'none' };

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .single();

      return {
        hasAccess: subscription?.status === 'active',
        tier: subscription?.tier || 'basic'
      };
    } catch (error) {
      console.error('Access check error:', error);
      return { hasAccess: false, tier: 'basic' };
    }
  }
}

// Create singleton instance
export const openaiClient = new SecureOpenAIClient();

// Export individual methods for convenience
export const {
  research,
  generateSummary,
  generateResearchQuestions,
  analyzeGaps,
  formatCitation,
  checkAccess
} = openaiClient;

export default openaiClient;

/**
 * 🔒 SECURITY NOTES:
 * 
 * ✅ SECURE PRACTICES:
 * - OpenAI API key stored server-side only
 * - All requests authenticated through Supabase
 * - No sensitive data exposed to frontend
 * - Proper error handling and validation
 * - Tier-based access control
 * 
 * ❌ NEVER DO THIS:
 * - Store API keys in frontend code
 * - Use VITE_OPENAI_API_KEY or similar
 * - Expose keys in environment variables with VITE_ prefix
 * - Make direct OpenAI API calls from frontend
 */
