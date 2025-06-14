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
  Zap
} from 'lucide-react';

const RealtimeReasoningDisplay = ({ 
  isActive = false, 
  progress = 0, 
  currentAgent = null,
  onReasoningUpdate = null 
}) => {
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [discoveredSources, setDiscoveredSources] = useState([]);

  // Simulate real-time reasoning updates
  useEffect(() => {
    let interval = null;

    if (!isActive) {
      // Clear state when not active
      setReasoningSteps([]);
      setCurrentStep(null);
      setDiscoveredSources([]);
      return;
    }

    // Reset state when starting
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
    }, 800); // 🚀 FASTER: Quicker updates to show all steps before API completes

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, onReasoningUpdate]);

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
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900'
    };
    return colors[color] || 'bg-gray-50 border-gray-200 text-gray-900';
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Real-time Reasoning Feed */}
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Real-time Research Reasoning
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
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
                      <div className="flex-shrink-0">
                        <IconComponent className="h-4 w-4 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {agent.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{step.message}</p>
                        {step.details && (
                          <p className="text-xs text-muted-foreground mt-1">
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
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-blue-400" />
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
                  className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {source.title}
                    </p>
                    <p className="text-xs text-blue-700">
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
                <p className="text-xs text-muted-foreground text-center">
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
