/**
 * FutureHouse AI Agents Configuration
 * Specialized research agents for different academic tasks
 */

export const FutureHouseAgents = {
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    provider: 'FutureHouse',
    category: 'chemistry',
    description: 'Experimental Chemistry Tasks - ChemCrow iteration using cheminformatics tools for synthesis planning and molecular design',
    detailed_description: 'A new iteration of ChemCrow, Phoenix uses cheminformatics tools to do chemistry. Good for planning synthesis and design of new molecules.',
    use_cases: [
      'Synthesis planning',
      'Molecular design',
      'Chemical reaction prediction',
      'Drug discovery research',
      'Materials science',
      'Cheminformatics analysis'
    ],
    specialty: 'chemistry',
    strengths: [
      'Chemical synthesis planning',
      'Molecular structure analysis',
      'Reaction mechanism prediction',
      'Chemical property prediction'
    ],
    best_for: [
      'Chemistry research',
      'Pharmaceutical development',
      'Materials engineering',
      'Chemical process optimization'
    ],
    icon: '🧪',
    color: 'from-orange-500 to-red-500',
    status: 'experimental'
  },

  crow: {
    id: 'crow',
    name: 'Crow',
    provider: 'FutureHouse',
    category: 'concise-search',
    description: 'Concise Search - Produces succinct answers citing scientific data sources, built with PaperQA2',
    detailed_description: 'Produces a succinct answer citing scientific data sources, good for API calls and specific questions. Built with PaperQA2.',
    use_cases: [
      'Quick fact-checking',
      'Specific scientific questions',
      'API-friendly responses',
      'Citation verification',
      'Rapid literature scanning',
      'Targeted research queries'
    ],
    specialty: 'concise-search',
    strengths: [
      'Fast response times',
      'Accurate citations',
      'Concise summaries',
      'High precision answers'
    ],
    best_for: [
      'Quick research questions',
      'Fact verification',
      'API integrations',
      'Time-sensitive queries'
    ],
    icon: '🔍',
    color: 'from-blue-500 to-cyan-500',
    status: 'stable'
  },

  falcon: {
    id: 'falcon',
    name: 'Falcon',
    provider: 'FutureHouse',
    category: 'deep-search',
    description: 'Deep Search - Produces comprehensive reports with many sources for literature reviews and hypothesis evaluation',
    detailed_description: 'Produces a long report with many sources, good for literature reviews and evaluating hypotheses.',
    use_cases: [
      'Comprehensive literature reviews',
      'Hypothesis evaluation',
      'In-depth research analysis',
      'Academic paper writing',
      'Research proposal development',
      'Systematic reviews'
    ],
    specialty: 'deep-search',
    strengths: [
      'Comprehensive analysis',
      'Multiple source integration',
      'Detailed reporting',
      'Thorough literature coverage'
    ],
    best_for: [
      'Literature reviews',
      'Research proposals',
      'Academic writing',
      'Comprehensive analysis'
    ],
    icon: '📚',
    color: 'from-purple-500 to-pink-500',
    status: 'stable'
  },

  owl: {
    id: 'owl',
    name: 'Owl',
    provider: 'FutureHouse',
    category: 'precedent-search',
    description: 'Precedent Search - Understanding if anyone has done something in science before',
    detailed_description: 'Formerly known as HasAnyone, good for understanding if anyone has ever done something in science.',
    use_cases: [
      'Novelty assessment',
      'Prior art research',
      'Research gap identification',
      'Precedent analysis',
      'Innovation validation',
      'Patent research'
    ],
    specialty: 'precedent-search',
    strengths: [
      'Historical research analysis',
      'Gap identification',
      'Novelty assessment',
      'Precedent tracking'
    ],
    best_for: [
      'Research novelty checks',
      'Patent applications',
      'Innovation assessment',
      'Research gap analysis'
    ],
    icon: '🦉',
    color: 'from-green-500 to-teal-500',
    status: 'stable'
  }
};

/**
 * Additional LLM Provider Agents
 */
export const AdditionalAgents = {
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    category: 'general-research',
    description: 'Advanced reasoning and analysis for general research tasks',
    detailed_description: 'OpenAI\'s most capable model with advanced reasoning, analysis, and research capabilities.',
    use_cases: [
      'General research analysis',
      'Complex reasoning tasks',
      'Multi-step problem solving',
      'Research synthesis',
      'Academic writing assistance',
      'Data interpretation'
    ],
    specialty: 'general-research',
    strengths: [
      'Advanced reasoning',
      'Complex analysis',
      'Multi-domain knowledge',
      'Research synthesis'
    ],
    best_for: [
      'General research',
      'Complex analysis',
      'Academic writing',
      'Problem solving'
    ],
    icon: '🤖',
    color: 'from-gray-500 to-slate-500',
    status: 'stable'
  },

  'claude-3': {
    id: 'claude-3',
    name: 'Claude-3',
    provider: 'Anthropic',
    category: 'synthesis',
    description: 'Excellent for research synthesis and comprehensive analysis',
    detailed_description: 'Anthropic\'s Claude-3 excels at research synthesis, analysis, and maintaining context across long documents.',
    use_cases: [
      'Research synthesis',
      'Long document analysis',
      'Academic writing',
      'Literature integration',
      'Comparative analysis',
      'Research summarization'
    ],
    specialty: 'synthesis',
    strengths: [
      'Research synthesis',
      'Long context handling',
      'Analytical thinking',
      'Academic writing'
    ],
    best_for: [
      'Research synthesis',
      'Academic writing',
      'Document analysis',
      'Literature reviews'
    ],
    icon: '📝',
    color: 'from-indigo-500 to-purple-500',
    status: 'stable'
  }
};

/**
 * Get all available agents
 */
export const getAllAgents = () => {
  return {
    ...FutureHouseAgents,
    ...AdditionalAgents
  };
};

/**
 * Get agents by category
 */
export const getAgentsByCategory = (category) => {
  const allAgents = getAllAgents();
  return Object.values(allAgents).filter(agent => agent.category === category);
};

/**
 * Get agents by provider
 */
export const getAgentsByProvider = (provider) => {
  const allAgents = getAllAgents();
  return Object.values(allAgents).filter(agent => agent.provider === provider);
};

/**
 * Get FutureHouse agents only
 */
export const getFutureHouseAgents = () => {
  return Object.values(FutureHouseAgents);
};

/**
 * Get agent by ID
 */
export const getAgentById = (agentId) => {
  const allAgents = getAllAgents();
  return allAgents[agentId] || null;
};

/**
 * Agent categories for filtering
 */
export const AgentCategories = {
  CHEMISTRY: 'chemistry',
  CONCISE_SEARCH: 'concise-search',
  DEEP_SEARCH: 'deep-search',
  PRECEDENT_SEARCH: 'precedent-search',
  GENERAL_RESEARCH: 'general-research',
  SYNTHESIS: 'synthesis'
};

/**
 * Agent providers
 */
export const AgentProviders = {
  FUTUREHOUSE: 'FutureHouse',
  OPENAI: 'OpenAI',
  ANTHROPIC: 'Anthropic'
};

export default {
  FutureHouseAgents,
  AdditionalAgents,
  getAllAgents,
  getAgentsByCategory,
  getAgentsByProvider,
  getFutureHouseAgents,
  getAgentById,
  AgentCategories,
  AgentProviders
};
