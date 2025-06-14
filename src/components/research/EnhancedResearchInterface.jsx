import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Brain, 
  BookOpen, 
  FileText, 
  Download, 
  Share, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Zap,
  Eye,
  Filter,
  Calendar,
  Crown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  getFutureHouseAgents
} from '../../lib/futureHouseAgents';
import { useSubscription } from '../../hooks/useSubscription';

const EnhancedResearchInterface = ({ onQuerySubmit }) => {
  const { getAvailableAgents, canUseAgent, getAgentLimits, tier } = useSubscription();
  const [selectedAgents, setSelectedAgents] = useState([]); // Start with no agents selected
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [researchType, setResearchType] = useState('quick'); // quick, comprehensive, specialized

  // 🔥 CRITICAL FIX: Communicate agent selection to parent component
  useEffect(() => {
    if (onQuerySubmit) {
      console.log('🔄 Agent selection changed:', selectedAgents);
      onQuerySubmit(selectedAgents);
    }
  }, [selectedAgents, onQuerySubmit]);

  // Get agents by provider (memoized for performance)
  const futureHouseAgents = useMemo(() => getFutureHouseAgents(), []);

  // Get available agents and limits
  const availableAgents = useMemo(() => getAvailableAgents(), [getAvailableAgents]);
  const agentLimits = useMemo(() => getAgentLimits(), [getAgentLimits]);

  // Research type configurations
  const researchTypes = [
    {
      id: 'quick',
      name: 'Quick Search',
      description: 'Fast answers with key citations',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      recommended_agents: ['crow'],
      estimatedTime: '1-2 min'
    },
    {
      id: 'comprehensive',
      name: 'Standard Analysis',
      description: 'Balanced depth and speed',
      icon: Search,
      color: 'from-purple-500 to-pink-500',
      recommended_agents: ['crow', 'falcon'],
      estimatedTime: '3-5 min'
    },
    {
      id: 'specialized',
      name: 'Deep Analysis',
      description: 'Thorough literature review',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      recommended_agents: ['crow', 'falcon', 'owl', 'phoenix'],
      estimatedTime: '5-10 min'
    }
  ];

  // Agent selection handler
  const toggleAgent = useCallback((agentId) => {
    // Check if user can use this agent
    if (!canUseAgent(agentId)) {
      return; // Don't allow selection of restricted agents
    }

    setSelectedAgents(prev => {
      const isCurrentlySelected = prev.includes(agentId);

      if (isCurrentlySelected) {
        // Always allow deselection
        return prev.filter(id => id !== agentId);
      } else {
        // Check if adding this agent would exceed limits
        if (prev.length >= agentLimits.maxAgentsPerQuery && agentLimits.maxAgentsPerQuery !== -1) {
          return prev; // Don't add if at limit
        }
        return [...prev, agentId];
      }
    });
  }, [canUseAgent, agentLimits.maxAgentsPerQuery]);

  const selectResearchType = useCallback((type) => {
    setResearchType(type.id);
    setSelectedAgents(type.recommended_agents);
  }, []);

  const AgentCard = ({ agent, isSelected, onToggle }) => {
    const canUse = canUseAgent(agent.id);
    const isRestricted = !canUse;

    return (
      <motion.div
        whileHover={{ scale: isRestricted ? 1 : 1.02 }}
        whileTap={{ scale: isRestricted ? 1 : 0.98 }}
        onClick={() => !isRestricted && onToggle(agent.id)}
        className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected
            ? `bg-gradient-to-r ${agent.color} bg-opacity-20 border-white/30`
            : isRestricted
            ? 'bg-gray-500/10 border-gray-500/30 cursor-not-allowed opacity-60'
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
      >
        {/* Agent Info */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{agent.icon}</span>
          <div className="flex-1">
            <h4 className="font-medium text-white text-sm">{agent.name}</h4>
            <p className="text-xs text-white/60">{agent.provider}</p>
          </div>
          {isSelected && <CheckCircle className="h-4 w-4 text-green-400" />}
          {isRestricted && <Crown className="h-4 w-4 text-yellow-400" />}
        </div>

        <p className="text-xs text-white/70 mb-2">{agent.description}</p>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1 mb-2">
          {agent.capabilities?.slice(0, 2).map((cap, idx) => (
            <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/60">
              {cap}
            </Badge>
          ))}
        </div>

        {/* Restriction Notice */}
        {isRestricted && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <p className="text-xs text-yellow-300 mb-1">
              <strong>Ultra Required</strong>
            </p>
            <p className="text-xs text-white/60 mb-2">
              This agent requires an Ultra subscription (€99/month)
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-blue-400/30 text-blue-300 hover:bg-blue-400/10"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/pricing';
              }}
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade to Ultra
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

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

          {/* Tier-specific access info */}
          {(tier === 'free' || tier === 'premium') && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  {tier === 'free' ? 'Free Trial Access' : 'Premium Plan (€29/month)'}
                </span>
              </div>

              {/* Crow Agent Info */}
              <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">✅</span>
                  <strong className="text-green-300">Crow Agent Available</strong>
                </div>
                <p className="text-xs text-white/70 ml-6">
                  <strong>FutureHouse Concise Search</strong> - Produces succinct answers citing scientific data sources, built with PaperQA2. Perfect for quick research questions and fact verification.
                </p>
              </div>

              {/* Restricted Agents */}
              <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-400">🔒</span>
                  <strong className="text-red-300">Ultra Required</strong>
                </div>
                <p className="text-xs text-white/70 ml-6">
                  <strong>Falcon, Owl & Phoenix</strong> agents require Ultra subscription (€99/month) for deep analysis, precedent search, and chemistry research.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="text-xs border-blue-400/30 text-blue-300 hover:bg-blue-400/10"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade to Ultra for All 4 Agents
              </Button>
            </div>
          )}
          
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
      </CardContent>
    </Card>
  );
};

export default EnhancedResearchInterface;
