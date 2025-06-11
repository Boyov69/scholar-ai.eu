// Mock data and services for local development
// This file provides mock implementations for testing without external APIs

// Mock FutureHouse API responses
export const mockFutureHouseResponses = {
  crow: {
    query: "What are the latest developments in AI?",
    response: {
      summary: "Recent developments in AI include large language models like GPT-4, Claude, and Gemini, along with advances in multimodal AI, reinforcement learning, and AI safety research.",
      sources: [
        {
          title: "Attention Is All You Need",
          authors: ["Vaswani et al."],
          year: 2017,
          relevance: 0.95
        },
        {
          title: "GPT-4 Technical Report",
          authors: ["OpenAI"],
          year: 2023,
          relevance: 0.92
        }
      ],
      confidence: 0.89,
      processingTime: 2.3
    }
  },
  falcon: {
    query: "Synthesize research on machine learning ethics",
    response: {
      synthesis: "Machine learning ethics encompasses bias mitigation, fairness, transparency, accountability, and privacy protection. Key challenges include algorithmic bias, data privacy, and the need for explainable AI systems.",
      keyThemes: [
        "Algorithmic Bias and Fairness",
        "Privacy and Data Protection",
        "Transparency and Explainability",
        "Accountability and Governance"
      ],
      recommendations: [
        "Implement bias testing throughout the ML pipeline",
        "Adopt privacy-preserving techniques like differential privacy",
        "Develop explainable AI methods for critical applications",
        "Establish clear governance frameworks for AI deployment"
      ],
      confidence: 0.87
    }
  },
  owl: {
    query: "Format citations for AI papers",
    response: {
      citations: {
        apa: [
          "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need. Advances in neural information processing systems, 30.",
          "Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. Advances in neural information processing systems, 33, 1877-1901."
        ],
        mla: [
          "Vaswani, Ashish, et al. \"Attention is all you need.\" Advances in neural information processing systems 30 (2017).",
          "Brown, Tom, et al. \"Language models are few-shot learners.\" Advances in neural information processing systems 33 (2020): 1877-1901."
        ],
        chicago: [
          "Vaswani, Ashish, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia Polosukhin. \"Attention is all you need.\" Advances in neural information processing systems 30 (2017).",
          "Brown, Tom, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared D. Kaplan, Prafulla Dhariwal, Arvind Neelakantan et al. \"Language models are few-shot learners.\" Advances in neural information processing systems 33 (2020): 1877-1901."
        ]
      }
    }
  },
  phoenix: {
    query: "Identify research gaps in AI safety",
    response: {
      gaps: [
        {
          area: "Alignment Problem",
          description: "Limited understanding of how to align AI systems with human values at scale",
          priority: "High",
          researchNeeded: "Scalable oversight methods, value learning techniques"
        },
        {
          area: "Robustness Testing",
          description: "Insufficient methods for testing AI system robustness in edge cases",
          priority: "High",
          researchNeeded: "Adversarial testing frameworks, stress testing methodologies"
        },
        {
          area: "Interpretability",
          description: "Lack of comprehensive interpretability methods for large neural networks",
          priority: "Medium",
          researchNeeded: "Mechanistic interpretability, causal analysis tools"
        }
      ],
      opportunities: [
        "Development of formal verification methods for AI systems",
        "Creation of standardized safety benchmarks",
        "Research into AI system monitoring and shutdown procedures"
      ],
      confidence: 0.84
    }
  }
};

// Mock Stripe responses for testing
export const mockStripeResponses = {
  createCheckoutSession: {
    id: "cs_test_mock123",
    url: "https://checkout.stripe.com/pay/cs_test_mock123",
    success_url: "http://localhost:5173/dashboard?subscription=success",
    cancel_url: "http://localhost:5173/pricing?subscription=cancelled"
  },
  createPortalSession: {
    id: "bps_test_mock123",
    url: "https://billing.stripe.com/session/bps_test_mock123"
  },
  subscriptionStatus: {
    status: "active",
    tier: "ultra_intelligent", // Ultra-Intelligent tier - full access to Enhanced Research
    customerId: "cus_test_mock123",
    subscriptionId: "sub_test_mock123",
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false
  }
};

// Mock usage data
export const mockUsageData = {
  current: {
    queries_used: 15,
    collaborators_count: 2,
    storage_used_mb: 250,
    workspaces_count: 3,
    citations_count: 45,
    period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
  },
  limits: {
    advanced_ai: {
      queries: 50,
      collaborators: 2,
      storage_mb: 1000,
      workspaces: 2,
      citations: 100
    },
    ultra_intelligent: {
      queries: -1, // unlimited
      collaborators: 10,
      storage_mb: 10000,
      workspaces: 10,
      citations: -1
    },
    phd_level: {
      queries: -1,
      collaborators: -1,
      storage_mb: 100000,
      workspaces: -1,
      citations: -1
    }
  }
};

// Mock research queries
export const mockResearchQueries = [
  {
    id: "query_1",
    query: "What are the latest developments in transformer architectures?",
    agent_type: "crow",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    results: mockFutureHouseResponses.crow.response
  },
  {
    id: "query_2",
    query: "Synthesize research on machine learning ethics",
    agent_type: "falcon",
    status: "completed",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    results: mockFutureHouseResponses.falcon.response
  },
  {
    id: "query_3",
    query: "Current research on quantum computing applications",
    agent_type: "crow",
    status: "processing",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    results: null
  }
];

// Mock citations
export const mockCitations = [
  {
    id: "citation_1",
    title: "Attention Is All You Need",
    authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
    publication_date: "2017-06-12",
    journal: "Advances in Neural Information Processing Systems",
    doi: "10.48550/arXiv.1706.03762",
    url: "https://arxiv.org/abs/1706.03762",
    tags: ["transformers", "attention", "nlp"],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "citation_2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin, J.", "Chang, M.W.", "Lee, K."],
    publication_date: "2018-10-11",
    journal: "arXiv preprint",
    doi: "10.48550/arXiv.1810.04805",
    url: "https://arxiv.org/abs/1810.04805",
    tags: ["bert", "transformers", "nlp"],
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

// Mock workspaces
export const mockWorkspaces = [
  {
    id: "workspace_1",
    name: "AI Research Project",
    description: "Research on artificial intelligence and machine learning",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    member_count: 3,
    query_count: 15,
    citation_count: 25
  },
  {
    id: "workspace_2",
    name: "Ethics in Technology",
    description: "Exploring ethical implications of emerging technologies",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    member_count: 2,
    query_count: 8,
    citation_count: 12
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: "notif_1",
    type: "query_completed",
    title: "Research Query Completed",
    message: "Your query about transformer architectures has been completed.",
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "notif_2",
    type: "subscription",
    title: "Subscription Renewed",
    message: "Your Advanced AI subscription has been renewed for another month.",
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock API delay simulation
export const simulateApiDelay = (min = 500, max = 2000) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock error simulation
export const simulateRandomError = (errorRate = 0.1) => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated API error for testing');
  }
};

// Development mode checker
export const isDevelopmentMode = () => {
  return import.meta.env.VITE_APP_ENV === 'development' || 
         import.meta.env.VITE_MOCK_PAYMENTS === 'true';
};

// Mock API wrapper
export const withMockData = async (apiCall, mockData, options = {}) => {
  if (isDevelopmentMode() && options.useMock !== false) {
    await simulateApiDelay(options.minDelay, options.maxDelay);
    
    if (options.simulateErrors) {
      simulateRandomError(options.errorRate);
    }
    
    return mockData;
  }
  
  return await apiCall();
};

export default {
  mockFutureHouseResponses,
  mockStripeResponses,
  mockUsageData,
  mockResearchQueries,
  mockCitations,
  mockWorkspaces,
  mockNotifications,
  simulateApiDelay,
  simulateRandomError,
  isDevelopmentMode,
  withMockData
};
