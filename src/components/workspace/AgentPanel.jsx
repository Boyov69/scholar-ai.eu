import React, { useState, useEffect } from 'react';
import { FutureHouseAgents, getAgentById } from '../../lib/futureHouseAgents';
import { Button } from '../ui/button';
import { toast } from 'sonner';

/**
 * Component for displaying and selecting research agents for workspace integration
 * 
 * @param {Object} props - Component props
 * @param {Array} props.selectedAgents - Currently selected agent IDs
 * @param {Function} props.onAgentSelect - Handler for agent selection
 * @param {Function} props.onAgentDeselect - Handler for agent deselection
 * @param {Function} props.onStartAgent - Handler for starting agent process
 * @param {string} props.workspaceId - Current workspace ID
 * @param {string} props.phase - Current research phase
 * @returns {JSX.Element} - Rendered component
 */
const AgentPanel = ({ 
  selectedAgents = [], 
  onAgentSelect, 
  onAgentDeselect, 
  onStartAgent, 
  workspaceId, 
  phase = 'ship' 
}) => {
  const [availableAgents, setAvailableAgents] = useState([]);
  const [agentConfigs, setAgentConfigs] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize available agents based on current phase
  useEffect(() => {
    let phaseAgents = [];
    
    // For Ship phase, we prioritize Owl and Phoenix agents
    if (phase === 'ship') {
      phaseAgents = [
        FutureHouseAgents.owl,
        FutureHouseAgents.phoenix
      ];
    } else if (phase === 'search') {
      // For Search phase, we prioritize Crow and Falcon agents
      phaseAgents = [
        FutureHouseAgents.crow,
        FutureHouseAgents.falcon
      ];
    } else {
      // For other phases, show all agents
      phaseAgents = Object.values(FutureHouseAgents);
    }
    
    setAvailableAgents(phaseAgents);
    
    // Initialize agent configs
    const initialConfigs = {};
    phaseAgents.forEach(agent => {
      initialConfigs[agent.id] = {
        priority: 'normal',
        depth: 'standard',
        maxResults: 20
      };
    });
    
    setAgentConfigs(initialConfigs);
  }, [phase]);
  
  // Handle agent selection
  const handleAgentSelect = (agentId) => {
    if (selectedAgents.includes(agentId)) {
      onAgentDeselect?.(agentId);
    } else {
      onAgentSelect?.(agentId);
    }
  };
  
  // Handle agent configuration change
  const handleConfigChange = (agentId, field, value) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [field]: value
      }
    }));
  };
  
  // Start agent process
  const handleStartProcess = async () => {
    if (selectedAgents.length === 0) {
      toast.error('Please select at least one agent to proceed');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare selected agent configurations
      const agentsWithConfig = selectedAgents.map(agentId => ({
        id: agentId,
        config: agentConfigs[agentId] || {}
      }));
      
      await onStartAgent?.(agentsWithConfig, workspaceId);
      
      toast.success('Agent process initiated successfully');
    } catch (error) {
      console.error('Error starting agent process:', error);
      toast.error('Failed to start agent process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="agent-panel bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium text-white mb-3">
        Research Agents
      </h3>
      
      <p className="text-sm text-gray-400 mb-4">
        Select specialized AI agents to help with your research
      </p>
      
      {/* Agent selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {availableAgents.map(agent => (
          <div 
            key={agent.id}
            className={`
              p-3 rounded-lg transition-all duration-200
              ${selectedAgents.includes(agent.id) 
                ? `bg-gradient-to-r ${agent.color} border border-white` 
                : 'bg-gray-700 hover:bg-gray-600'}
            `}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-2">{agent.icon}</div>
              <div>
                <h4 className="font-medium text-white">{agent.name}</h4>
                <p className="text-xs text-gray-400">{agent.description}</p>
              </div>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={selectedAgents.includes(agent.id)}
                  onChange={() => handleAgentSelect(agent.id)}
                  className="h-5 w-5 accent-blue-500"
                />
              </div>
            </div>
            
            {/* Show configuration when selected */}
            {selectedAgents.includes(agent.id) && (
              <div className="mt-3 text-sm border-t border-gray-600 pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400">Priority</label>
                  <select 
                    value={agentConfigs[agent.id]?.priority || 'normal'}
                    onChange={(e) => handleConfigChange(agent.id, 'priority', e.target.value)}
                    className="bg-gray-800 text-white text-xs rounded px-2 py-1 border border-gray-600"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400">Depth</label>
                  <select 
                    value={agentConfigs[agent.id]?.depth || 'standard'}
                    onChange={(e) => handleConfigChange(agent.id, 'depth', e.target.value)}
                    className="bg-gray-800 text-white text-xs rounded px-2 py-1 border border-gray-600"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <label className="text-gray-400">Max Results</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={agentConfigs[agent.id]?.maxResults || 20}
                    onChange={(e) => handleConfigChange(agent.id, 'maxResults', parseInt(e.target.value))}
                    className="bg-gray-800 text-white text-xs rounded w-16 px-2 py-1 border border-gray-600"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Agent capabilities overview */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <h4 className="font-medium text-white mb-2">Agent Capabilities</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span><strong className="text-blue-300">Owl:</strong> Analyzes research novelty and identifies gaps in existing literature</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">•</span>
            <span><strong className="text-green-300">Phoenix:</strong> Specializes in chemistry research and molecular design</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span><strong className="text-purple-300">Falcon:</strong> Performs deep searches with comprehensive reporting</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            <span><strong className="text-yellow-300">Crow:</strong> Provides concise answers with scientific sources</span>
          </li>
        </ul>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAgentDeselect?.(selectedAgents)}
          disabled={selectedAgents.length === 0}
          className="border-gray-600 text-gray-300"
        >
          Clear Selection
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleStartProcess}
          disabled={isProcessing || selectedAgents.length === 0}
          className="bg-blue-600 hover:bg-blue-500"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Start Agent Process'}
        </Button>
      </div>
    </div>
  );
};

export default AgentPanel;