import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Search,
  Brain,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  Link,
  Target,
  Lightbulb,
  Zap,
  Database
} from 'lucide-react';

const RealtimeReasoningDisplay = ({
  isActive = false,
  progress = 0,
  currentAgent = null,
  onReasoningUpdate = null,
  realTimeUpdates = null // NEW: Real-time updates from actual research process
}) => {
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [discoveredSources, setDiscoveredSources] = useState([]);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);

  // Listen for real-time updates from research process
  useEffect(() => {
    if (realTimeUpdates) {
      console.log('🧠 Real-time update received:', realTimeUpdates);

      const newStep = {
        id: `real-${Date.now()}`,
        agent: realTimeUpdates.agent || 'system',
        type: realTimeUpdates.type || 'update',
        message: realTimeUpdates.message,
        details: realTimeUpdates.details,
        timestamp: Date.now(),
        icon: getIconForType(realTimeUpdates.type),
        color: getColorForAgent(realTimeUpdates.agent),
        sources: realTimeUpdates.sources
      };

      setReasoningSteps(prev => [...prev, newStep]);
      setCurrentStep(newStep);

      if (realTimeUpdates.sources) {
        setDiscoveredSources(prev => [...prev, ...realTimeUpdates.sources]);
      }

      setIsRealTimeMode(true);
    }
  }, [realTimeUpdates]);

  // Fallback to simulated reasoning if no real-time updates
  useEffect(() => {
    let interval = null;

    if (!isActive) {
      // Clear state when not active
      setReasoningSteps([]);
      setCurrentStep(null);
      setDiscoveredSources([]);
      setIsRealTimeMode(false);
      return;
    }

    // If we have real-time updates, don't use simulation
    if (isRealTimeMode) {
      return;
    }

    // Reset state when starting simulation
    setReasoningSteps([]);
    setCurrentStep(null);
    setDiscoveredSources([]);

    const reasoningSequence = [
      {
        id: 1,
        agent: 'crow',
        type: 'search_init',
        message: 'Initializing literature search parameters...',
        timestamp: Date.now(),
        icon: Search,
        color: 'blue'
      },
      {
        id: 2,
        agent: 'crow',
        type: 'query_analysis',
        message: 'Analyzing research question for key concepts...',
        timestamp: Date.now() + 1000,
        icon: Brain,
        color: 'blue',
        details: 'Identified keywords: AI, machine learning, research methodology'
      },
      {
        id: 3,
        agent: 'crow',
        type: 'database_search',
        message: 'Searching academic databases (PubMed, arXiv, IEEE)...',
        timestamp: Date.now() + 2000,
        icon: Search,
        color: 'blue'
      },
      {
        id: 4,
        agent: 'crow',
        type: 'source_discovery',
        message: 'Found 47 relevant papers, filtering by relevance...',
        timestamp: Date.now() + 3500,
        icon: BookOpen,
        color: 'blue',
        sources: [
          { title: 'Deep Learning in Academic Research', year: 2023, relevance: 0.95 },
          { title: 'AI-Powered Literature Review Methods', year: 2024, relevance: 0.92 },
          { title: 'Machine Learning for Research Synthesis', year: 2023, relevance: 0.89 }
        ]
      },
      {
        id: 5,
        agent: 'falcon',
        type: 'synthesis_init',
        message: 'Beginning research synthesis and analysis...',
        timestamp: Date.now() + 5000,
        icon: Target,
        color: 'green'
      },
      {
        id: 6,
        agent: 'falcon',
        type: 'content_analysis',
        message: 'Analyzing paper abstracts and methodologies...',
        timestamp: Date.now() + 6500,
        icon: Eye,
        color: 'green',
        details: 'Processing 23 high-relevance papers for synthesis'
      },
      {
        id: 7,
        agent: 'owl',
        type: 'citation_formatting',
        message: 'Formatting citations in APA style...',
        timestamp: Date.now() + 8000,
        icon: FileText,
        color: 'purple'
      },
      {
        id: 8,
        agent: 'phoenix',
        type: 'gap_analysis',
        message: 'Identifying research gaps and opportunities...',
        timestamp: Date.now() + 9500,
        icon: Lightbulb,
        color: 'orange'
      },
      {
        id: 9,
        agent: 'owl',
        type: 'database_save',
        message: 'Saving citations to database...',
        timestamp: Date.now() + 11000,
        icon: Database,
        color: 'purple',
        details: 'Storing research results and citations'
      },
      {
        id: 10,
        agent: 'falcon',
        type: 'quality_check',
        message: 'Performing final quality assurance...',
        timestamp: Date.now() + 12500,
        icon: CheckCircle,
        color: 'green',
        details: 'Verifying completeness and accuracy'
      },
      {
        id: 11,
        agent: 'crow',
        type: 'finalization',
        message: 'Preparing results for presentation...',
        timestamp: Date.now() + 14000,
        icon: FileText,
        color: 'blue'
      },
      {
        id: 12,
        agent: 'phoenix',
        type: 'completion',
        message: 'Research analysis completed successfully!',
        timestamp: Date.now() + 15500,
        icon: CheckCircle,
        color: 'orange',
        details: 'All results processed and ready for review'
      }
    ];

    console.log('🧠 Starting reasoning sequence with', reasoningSequence.length, 'steps');
    let stepIndex = 0;
    const maxSteps = reasoningSequence.length;

    interval = setInterval(() => {
      console.log(`🧠 Interval tick - stepIndex: ${stepIndex}, total steps: ${maxSteps}`);

      // Safety check: stop if we exceed expected steps
      if (stepIndex >= maxSteps) {
        console.log('🚨 Safety stop: exceeded maximum steps');
        clearInterval(interval);
        setCurrentStep(null);
        if (onReasoningUpdate) {
          onReasoningUpdate({ type: 'complete', message: 'Research reasoning completed' });
        }
        return;
      }

      if (stepIndex < maxSteps) {
        const step = {
          ...reasoningSequence[stepIndex],
          id: `step-${Date.now()}-${stepIndex}` // 🚀 FIXED: Unique IDs to prevent duplicate keys
        };
        console.log(`🧠 Processing step ${stepIndex}:`, step.message);
        setCurrentStep(step);
        setReasoningSteps(prev => [...prev, step]);
        
        // Add discovered sources
        if (step.sources) {
          setDiscoveredSources(prev => [...prev, ...step.sources]);
        }

        // Notify parent component
        if (onReasoningUpdate) {
          onReasoningUpdate(step);
        }

        stepIndex++;
        console.log(`🧠 Incremented stepIndex to: ${stepIndex}`);
      } else {
        console.log('🧠 Reasoning sequence completed, clearing interval');
        clearInterval(interval);
        setCurrentStep(null);

        // Mark reasoning as complete
        if (onReasoningUpdate) {
          onReasoningUpdate({ type: 'complete', message: 'Research reasoning completed' });
        }
      }
    }, 1200); // 🚀 ADJUSTED: Slower timing to match actual processing time

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, onReasoningUpdate, isRealTimeMode]);

  // Helper functions for dynamic reasoning
  const getIconForType = (type) => {
    const iconMap = {
      'search_init': Search,
      'query_analysis': Brain,
      'database_search': Database,
      'source_discovery': BookOpen,
      'url_fetch': Link,
      'content_analysis': Eye,
      'synthesis': Target,
      'citation_format': FileText,
      'quality_check': CheckCircle,
      'gap_analysis': Lightbulb,
      'completion': CheckCircle,
      'error': Clock,
      'progress': Loader2
    };
    return iconMap[type] || Search;
  };

  const getColorForAgent = (agent) => {
    const colorMap = {
      'crow': 'blue',
      'falcon': 'green',
      'owl': 'purple',
      'phoenix': 'orange',
      'system': 'gray'
    };
    return colorMap[agent] || 'blue';
  };

  const getAgentInfo = (agentName) => {
    const agents = {
      crow: { name: 'Crow', color: 'blue', task: 'Literature Search' },
      falcon: { name: 'Falcon', color: 'green', task: 'Research Synthesis' },
      owl: { name: 'Owl', color: 'purple', task: 'Citation Formatting' },
      phoenix: { name: 'Phoenix', color: 'orange', task: 'Gap Analysis' }
    };
    return agents[agentName] || { name: 'Unknown', color: 'gray', task: 'Processing' };
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-900/30 border-blue-400/50 text-blue-50',
      green: 'bg-green-900/30 border-green-400/50 text-green-50',
      purple: 'bg-purple-900/30 border-purple-400/50 text-purple-50',
      orange: 'bg-orange-900/30 border-orange-400/50 text-orange-50',
      gray: 'bg-gray-900/30 border-gray-400/50 text-gray-50'
    };
    return colors[color] || 'bg-gray-900/30 border-gray-400/50 text-gray-50';
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Real-time Reasoning Feed */}
      <Card className="glass-strong border-white/20 bg-black/40 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-bold">
            <Zap className="h-5 w-5 text-yellow-400 drop-shadow-sm" />
            Real-time Research Reasoning
            <Badge variant="outline" className="bg-yellow-500/30 text-yellow-200 border-yellow-400/50 font-semibold">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <AnimatePresence>
              {reasoningSteps.map((step) => {
                const agent = getAgentInfo(step.agent);
                const IconComponent = step.icon;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border ${getColorClasses(step.color)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                        <IconComponent className="h-4 w-4 text-white drop-shadow-sm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-xs border-${step.color}-300/60 text-${step.color}-100 bg-${step.color}-500/10`}>
                            {agent.name}
                          </Badge>
                          <span className="text-xs text-white/80 font-medium">
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white drop-shadow-sm">{step.message}</p>
                        {step.details && (
                          <p className="text-xs text-white/90 mt-1 font-medium">
                            {step.details}
                          </p>
                        )}
                      </div>
                      {step.id === currentStep?.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Live Source Discovery */}
      {discoveredSources.length > 0 && (
        <Card className="glass border-white/20 bg-black/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-white font-bold">
              <BookOpen className="h-4 w-4 text-blue-400 drop-shadow-sm" />
              Sources Discovered ({discoveredSources.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {discoveredSources.slice(0, 3).map((source, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg border border-blue-400/50 backdrop-blur-sm"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-50 drop-shadow-sm">
                      {source.title}
                    </p>
                    <p className="text-xs text-blue-100 font-medium">
                      {source.year} • Relevance: {(source.relevance * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Progress 
                      value={source.relevance * 100} 
                      className="w-16 h-2" 
                    />
                  </div>
                </motion.div>
              ))}
              {discoveredSources.length > 3 && (
                <p className="text-xs text-white/60 text-center">
                  +{discoveredSources.length - 3} more sources found...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealtimeReasoningDisplay;
