import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { fixInputInteraction } from '../../utils/inputFix';
import {
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  Search
} from 'lucide-react';
import { getAgentById } from '../../lib/futureHouseAgents';

const ResearchQueryForm = ({ 
  selectedAgents = [], 
  onSubmit, 
  subscription,
  isLoading = false 
}) => {
  const [title, setTitle] = useState('');
  const [queryText, setQueryText] = useState('');
  const [researchDepth, setResearchDepth] = useState('standard');
  const [citationStyle, setCitationStyle] = useState('apa');

  // Fix input interaction issues
  useEffect(() => {
    const timer = setTimeout(() => {
      fixInputInteraction();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const depthOptions = [
    {
      id: 'quick',
      name: 'Quick Search',
      description: 'Fast answers with key citations',
      estimatedTime: '1-2 min',
      icon: '⚡'
    },
    {
      id: 'standard',
      name: 'Standard Analysis',
      description: 'Balanced depth and speed',
      estimatedTime: '3-5 min',
      icon: '📊'
    },
    {
      id: 'comprehensive',
      name: 'Deep Analysis',
      description: 'Thorough literature review',
      estimatedTime: '5-10 min',
      icon: '🔬'
    }
  ];

  const citationStyles = [
    { id: 'apa', name: 'APA', description: 'American Psychological Association' },
    { id: 'mla', name: 'MLA', description: 'Modern Language Association' },
    { id: 'chicago', name: 'Chicago', description: 'Chicago Manual of Style' },
    { id: 'bibtex', name: 'BibTeX', description: 'LaTeX Bibliography' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !queryText.trim() || selectedAgents.length === 0) {
      return;
    }

    const queryData = {
      title: title.trim(),
      query_text: queryText.trim(),
      selected_agents: selectedAgents,
      research_depth: researchDepth,
      citation_style: citationStyle,
      timestamp: new Date().toISOString()
    };

    await onSubmit(queryData);
    
    // Reset form after successful submission
    setTitle('');
    setQueryText('');
  };

  const getEstimatedTime = () => {
    const depth = depthOptions.find(d => d.id === researchDepth);
    const agentCount = selectedAgents.length;
    
    if (agentCount > 1) {
      return `${depth?.estimatedTime} (Multi-agent)`;
    }
    return depth?.estimatedTime || '3-5 min';
  };

  const canSubmit = title.trim() && queryText.trim() && selectedAgents.length > 0 && !isLoading;

  return (
    <Card className="glass-strong border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-green-400" />
          Research Query
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/90">
              Research Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your research..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              style={{
                pointerEvents: 'auto',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                position: 'relative',
                zIndex: 10
              }}
              required
            />
          </div>

          {/* Research Query */}
          <div className="space-y-2">
            <Label htmlFor="query" className="text-white/90">
              Research Question
            </Label>
            <Textarea
              id="query"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Describe your research question in detail. Be specific about what you want to discover, analyze, or understand..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px] resize-none"
              style={{
                pointerEvents: 'auto',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                position: 'relative',
                zIndex: 10
              }}
              required
            />
            <p className="text-xs text-white/60">
              Tip: The more specific your question, the better the AI agents can assist you.
            </p>
          </div>

          {/* Research Depth */}
          <div className="space-y-3">
            <Label className="text-white/90">Research Depth</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {depthOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setResearchDepth(option.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    researchDepth === option.id
                      ? 'bg-blue-500/20 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{option.icon}</span>
                    <span className="font-medium text-sm">{option.name}</span>
                  </div>
                  <p className="text-xs text-white/70 mb-1">{option.description}</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-white/60" />
                    <span className="text-xs text-white/60">{option.estimatedTime}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Citation Style */}
          <div className="space-y-3">
            <Label className="text-white/90">Citation Style</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {citationStyles.map((style) => (
                <motion.div
                  key={style.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCitationStyle(style.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all text-center ${
                    citationStyle === style.id
                      ? 'bg-purple-500/20 border-purple-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-sm">{style.name}</div>
                  <div className="text-xs text-white/60">{style.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Agents Preview */}
          {selectedAgents.length > 0 && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  Selected AI Agents ({selectedAgents.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedAgents.map((agentId) => {
                  const agent = getAgentById(agentId);
                  return agent ? (
                    <div key={agentId} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                      <span>{agent.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{agent.name}</div>
                        <div className="text-xs text-white/60">{agent.specialty}</div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Estimated processing time:</span>
                  <span className="font-medium">{getEstimatedTime()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Validation Messages */}
          {selectedAgents.length === 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Select an AI agent to start your research</p>
                <p className="text-xs text-blue-300/80">
                  💡 Tip: <strong>Crow agent</strong> (FutureHouse Concise Search) is available with your {subscription?.tier === 'premium' ? '€29 Premium plan' : 'free trial'}!
                </p>
              </div>
            </div>
          )}

          {/* Usage Limits */}
          {subscription && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white/90">
                  {subscription.monthly_query_limit - (subscription.monthly_queries_used || 0)} queries remaining this month
                </span>
              </div>
              <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                {subscription.tier}
              </Badge>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Research Query...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Submit Research Query
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResearchQueryForm;
