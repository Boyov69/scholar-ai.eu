import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';
import { 
  getFutureHouseAgents, 
  getAgentsByProvider, 
  AgentProviders 
} from '../../lib/futureHouseAgents';

const EnhancedResearchInterface = ({ onQuerySubmit, subscription }) => {
  const [selectedAgents, setSelectedAgents] = useState(['crow']); // Default to Crow for quick searches
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [researchType, setResearchType] = useState('quick'); // quick, comprehensive, specialized
  
  // Get agents by provider
  const futureHouseAgents = getFutureHouseAgents();
  const openAIAgents = getAgentsByProvider(AgentProviders.OPENAI);
  const anthropicAgents = getAgentsByProvider(AgentProviders.ANTHROPIC);

  const researchTypes = [
    {
      id: 'quick',
      name: 'Quick Search',
      description: 'Fast, targeted answers with citations',
      recommended_agents: ['crow'],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'comprehensive',
      name: 'Deep Analysis',
      description: 'Comprehensive literature review',
      recommended_agents: ['falcon', 'claude-3'],
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'specialized',
      name: 'Specialized Research',
      description: 'Domain-specific analysis',
      recommended_agents: ['phoenix', 'owl'],
      icon: Target,
      color: 'from-green-500 to-teal-500'
    }
  ];

  const toggleAgent = (agentId) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const selectResearchType = (type) => {
    setResearchType(type.id);
    setSelectedAgents(type.recommended_agents);
  };

  const AgentCard = ({ agent, isSelected, onToggle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(agent.id)}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? `bg-gradient-to-r ${agent.color} bg-opacity-20 border-white/30 shadow-lg`
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{agent.icon}</span>
          <div>
            <h4 className="font-semibold text-white">{agent.name}</h4>
            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
              {agent.provider}
            </Badge>
          </div>
        </div>
        {isSelected && (
          <Sparkles className="h-4 w-4 text-yellow-400" />
        )}
      </div>
      
      <p className="text-sm text-white/80 mb-3 line-clamp-2">
        {agent.description}
      </p>
      
      <div className="flex flex-wrap gap-1">
        {agent.best_for?.slice(0, 2).map((use, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="text-xs bg-white/10 text-white/70 border-0"
          >
            {use}
          </Badge>
        ))}
      </div>
    </motion.div>
  );

  return (
    <Card className="glass-strong border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5 text-blue-400" />
          Enhanced AI Research Assistant
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            Multi-Agent
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Research Type Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/90">Research Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {researchTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectResearchType(type)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    researchType === type.id
                      ? `bg-gradient-to-r ${type.color} bg-opacity-20 border-white/30`
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-white" />
                    <span className="font-medium text-white text-sm">{type.name}</span>
                  </div>
                  <p className="text-xs text-white/70">{type.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FutureHouse Agents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/90 flex items-center gap-2">
              <span className="text-orange-400">🔬</span>
              FutureHouse Agents
              <Badge variant="outline" className="text-xs border-orange-400/30 text-orange-300">
                Specialized
              </Badge>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {futureHouseAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgents.includes(agent.id)}
                onToggle={toggleAgent}
              />
            ))}
          </div>
        </div>

        {/* Other Providers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/90">General AI Agents</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllAgents(!showAllAgents)}
              className="text-white/70 hover:text-white"
            >
              {showAllAgents ? (
                <>Hide <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>Show All <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </div>
          
          {showAllAgents && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {[...openAIAgents, ...anthropicAgents].map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onToggle={toggleAgent}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Selected Agents Summary */}
        {selectedAgents.length > 0 && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">
                Selected Agents ({selectedAgents.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAgents.map((agentId) => {
                const allAgents = [...futureHouseAgents, ...openAIAgents, ...anthropicAgents];
                const agent = allAgents.find(a => a.id === agentId);
                return agent ? (
                  <Badge 
                    key={agentId}
                    className={`bg-gradient-to-r ${agent.color} text-white border-0`}
                  >
                    {agent.icon} {agent.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Usage Limits */}
        {subscription && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/90">
                {subscription.monthly_query_limit - (subscription.monthly_queries_used || 0)} queries remaining
              </span>
            </div>
            <Badge variant="outline" className="border-blue-400/30 text-blue-300">
              {subscription.tier}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedResearchInterface;
