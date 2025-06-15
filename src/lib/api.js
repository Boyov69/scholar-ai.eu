import { supabase } from './supabase.js';
import { config } from './config.js';
import { openaiClient } from './openai.js';

// API client for Scholar AI backend services
class APIClient {
  constructor() {
    this.baseUrl = config.supabase.url;
  }

  // Get auth headers for API requests
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
      'apikey': config.supabase.anonKey
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/functions/v1/${endpoint}`;
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Stripe payment methods
  async createCheckoutSession(priceId, successUrl, cancelUrl) {
    // 🚧 DEVELOPMENT MODE: Mock checkout session
    const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

    if (isDevelopment) {
      console.log('🚧 Development mode: Mock checkout session created');
      // Simulate redirect to success page after short delay
      setTimeout(() => {
        window.location.href = successUrl;
      }, 1000);
      return { sessionUrl: successUrl };
    }

    // Production mode: real API call
    return this.request('stripe-checkout', {
      method: 'POST',
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl
      })
    });
  }

  async createPortalSession(returnUrl) {
    // 🚧 DEVELOPMENT MODE: Mock portal session
    const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

    if (isDevelopment) {
      console.log('🚧 Development mode: Mock portal session created');
      // Simulate redirect to return URL after short delay
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 1000);
      return { portalUrl: returnUrl };
    }

    // Production mode: real API call
    return this.request('stripe-portal', {
      method: 'POST',
      body: JSON.stringify({
        returnUrl
      })
    });
  }

  async getSubscriptionStatus() {
    // 🚧 DEVELOPMENT MODE: Return mock subscription data
    const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

    if (isDevelopment) {
      console.log('🚧 Development mode: Using mock subscription status');
      return {
        status: 'active',
        tier: 'premium',
        customerId: 'cus_mock_development',
        subscriptionId: 'sub_mock_development',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        cancelAtPeriodEnd: false
      };
    }

    // Production mode: try real API call
    try {
      return await this.request('subscription-status', {
        method: 'GET'
      });
    } catch (error) {
      console.warn('⚠️ Subscription status API failed, using fallback:', error.message);
      // Fallback to free tier if API fails
      return {
        status: 'inactive',
        tier: 'free',
        customerId: null,
        subscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      };
    }
  }

  // Usage tracking methods
  async getUserUsage(period = 'current') {
    return this.request(`usage-tracking?period=${period}`, {
      method: 'GET'
    });
  }

  async updateUsage(usageData) {
    return this.request('usage-tracking', {
      method: 'POST',
      body: JSON.stringify(usageData)
    });
  }

  // Research query methods
  async createResearchQuery(queryData) {
    return this.request('research-query', {
      method: 'POST',
      body: JSON.stringify(queryData)
    });
  }

  async getResearchQueries(workspaceId = null) {
    const endpoint = workspaceId 
      ? `research-queries?workspace_id=${workspaceId}`
      : 'research-queries';
    
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  // Workspace methods
  async createWorkspace(workspaceData) {
    return this.request('workspace', {
      method: 'POST',
      body: JSON.stringify(workspaceData)
    });
  }

  async getWorkspaces() {
    return this.request('workspaces', {
      method: 'GET'
    });
  }

  async updateWorkspace(workspaceId, workspaceData) {
    return this.request(`workspace/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(workspaceData)
    });
  }

  // Citation methods
  async createCitation(citationData) {
    return this.request('citation', {
      method: 'POST',
      body: JSON.stringify(citationData)
    });
  }

  async getCitations(workspaceId = null) {
    const endpoint = workspaceId 
      ? `citations?workspace_id=${workspaceId}`
      : 'citations';
    
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  async updateCitation(citationId, citationData) {
    return this.request(`citation/${citationId}`, {
      method: 'PUT',
      body: JSON.stringify(citationData)
    });
  }

  async deleteCitation(citationId) {
    return this.request(`citation/${citationId}`, {
      method: 'DELETE'
    });
  }

  // User profile methods
  async updateProfile(profileData) {
    return this.request('profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getProfile() {
    return this.request('profile', {
      method: 'GET'
    });
  }

  // Notification methods
  async getNotifications() {
    return this.request('notifications', {
      method: 'GET'
    });
  }

  async markNotificationRead(notificationId) {
    return this.request(`notification/${notificationId}/read`, {
      method: 'POST'
    });
  }

  // Analytics methods
  async getAnalytics(period = '30d') {
    return this.request(`analytics?period=${period}`, {
      method: 'GET'
    });
  }

  // Export methods
  async exportData(format, workspaceId = null) {
    const endpoint = workspaceId
      ? `export/${format}?workspace_id=${workspaceId}`
      : `export/${format}`;

    return this.request(endpoint, {
      method: 'GET'
    });
  }

  // 🔒 SECURE OpenAI Integration Methods
  async openaiResearch(query, options = {}) {
    return openaiClient.research(query, options);
  }

  async generateSummary(text, options = {}) {
    return openaiClient.generateSummary(text, options);
  }

  async generateResearchQuestions(topic, options = {}) {
    return openaiClient.generateResearchQuestions(topic, options);
  }

  async analyzeResearchGaps(researchArea, existingLiterature, options = {}) {
    return openaiClient.analyzeGaps(researchArea, existingLiterature, options);
  }

  async formatCitation(citationData, style = 'apa', options = {}) {
    return openaiClient.formatCitation(citationData, style, options);
  }

  async checkOpenAIAccess() {
    return openaiClient.checkAccess();
  }
}

// Create singleton instance
export const api = new APIClient();

// Export individual methods for convenience
export const {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  getUserUsage,
  updateUsage,
  createResearchQuery,
  getResearchQueries,
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
  createCitation,
  getCitations,
  updateCitation,
  deleteCitation,
  updateProfile,
  getProfile,
  getNotifications,
  markNotificationRead,
  getAnalytics,
  exportData,
  // 🔒 Secure OpenAI methods
  openaiResearch,
  generateSummary,
  generateResearchQuestions,
  analyzeResearchGaps,
  formatCitation,
  checkOpenAIAccess
} = api;

export default api;
