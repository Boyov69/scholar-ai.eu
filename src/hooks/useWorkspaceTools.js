import { useState, useEffect } from 'react';
import { STAGE_TOOL_MAPPING } from '../config/academicTools';
import { config } from '../lib/config';

/**
 * Custom hook for managing academic workspace tools
 * @param {string} workspaceId - The ID of the current workspace
 * @returns {Object} - Workspace tools state and methods
 */
export const useWorkspaceTools = (workspaceId) => {
  const [enabledTools, setEnabledTools] = useState([]);
  const [toolSettings, setToolSettings] = useState({});
  const [currentStage, setCurrentStage] = useState('think');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved configuration
  useEffect(() => {
    const loadWorkspaceConfig = async () => {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // In development mode, use mock data
        if (import.meta.env.DEV) {
          // Mock data for development
          const mockEnabledTools = ['zotero', 'writefull', 'xmind'];
          const mockToolSettings = {
            zotero: { apiKey: 'mock-key', syncEnabled: true },
            writefull: { checkGrammar: true, language: 'en-US' },
            xmind: { autoSave: true }
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setEnabledTools(mockEnabledTools);
          setToolSettings(mockToolSettings);
          setCurrentStage('think');
          setLoading(false);
          return;
        }

        // In production, fetch from API
        // const response = await fetch(`${config.apiUrl}/workspaces/${workspaceId}/tools`);
        // if (!response.ok) throw new Error('Failed to load workspace configuration');
        // const data = await response.json();
        
        // setEnabledTools(data.enabledTools || []);
        // setToolSettings(data.toolSettings || {});
        // setCurrentStage(data.currentStage || 'query');

        // For now, use mock data in all environments until API is implemented
        const mockEnabledTools = ['zotero', 'writefull', 'xmind'];
        const mockToolSettings = {
          zotero: { apiKey: 'mock-key', syncEnabled: true },
          writefull: { checkGrammar: true, language: 'en-US' },
          xmind: { autoSave: true }
        };
        
        setEnabledTools(mockEnabledTools);
        setToolSettings(mockToolSettings);
        setCurrentStage('think');
      } catch (err) {
        console.error('Error loading workspace configuration:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaceConfig();
  }, [workspaceId]);

  /**
   * Activate a tool for the current workspace
   * @param {string} toolId - The ID of the tool to activate
   * @param {Object} settings - Initial settings for the tool
   */
  const activateTool = async (toolId, settings = {}) => {
    if (enabledTools.includes(toolId)) return;
    
    try {
      // In production, would save to API
      // await fetch(`${config.apiUrl}/workspaces/${workspaceId}/tools`, {
      //   method: 'POST',
      //   body: JSON.stringify({ toolId, settings }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Update local state
      setEnabledTools(prev => [...prev, toolId]);
      setToolSettings(prev => ({ ...prev, [toolId]: settings }));
    } catch (err) {
      console.error('Error activating tool:', err);
      setError(`Failed to activate ${toolId}: ${err.message}`);
    }
  };

  /**
   * Deactivate a tool for the current workspace
   * @param {string} toolId - The ID of the tool to deactivate
   */
  const deactivateTool = async (toolId) => {
    if (!enabledTools.includes(toolId)) return;
    
    try {
      // In production, would save to API
      // await fetch(`${config.apiUrl}/workspaces/${workspaceId}/tools/${toolId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      setEnabledTools(prev => prev.filter(id => id !== toolId));
      setToolSettings(prev => {
        const newSettings = { ...prev };
        delete newSettings[toolId];
        return newSettings;
      });
    } catch (err) {
      console.error('Error deactivating tool:', err);
      setError(`Failed to deactivate ${toolId}: ${err.message}`);
    }
  };

  /**
   * Update settings for a specific tool
   * @param {string} toolId - The ID of the tool to update
   * @param {Object} newSettings - The new settings to apply
   */
  const updateToolSettings = async (toolId, newSettings) => {
    if (!enabledTools.includes(toolId)) return;
    
    try {
      // In production, would save to API
      // await fetch(`${config.apiUrl}/workspaces/${workspaceId}/tools/${toolId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ settings: newSettings }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Update local state
      setToolSettings(prev => ({
        ...prev,
        [toolId]: { ...prev[toolId], ...newSettings }
      }));
    } catch (err) {
      console.error('Error updating tool settings:', err);
      setError(`Failed to update ${toolId} settings: ${err.message}`);
    }
  };

  /**
   * Move to the next pipeline stage
   */
  const moveToNextStage = async () => {
    const stages = ['think', 'query', 'search', 'citation', 'collaboration', 'test', 'ship'];
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      
      try {
        // In production, would save to API
        // await fetch(`${config.apiUrl}/workspaces/${workspaceId}/pipeline`, {
        //   method: 'PATCH',
        //   body: JSON.stringify({ currentStage: nextStage }),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        
        // Update local state
        setCurrentStage(nextStage);
      } catch (err) {
        console.error('Error updating pipeline stage:', err);
        setError(`Failed to move to ${nextStage} stage: ${err.message}`);
      }
    }
  };

  /**
   * Move to a specific pipeline stage
   * @param {string} stageId - The ID of the stage to move to
   */
  const moveToStage = async (stageId) => {
    const stages = ['think', 'query', 'search', 'citation', 'collaboration', 'test', 'ship'];
    if (!stages.includes(stageId)) return;
    
    try {
      // In production, would save to API
      // await fetch(`${config.apiUrl}/workspaces/${workspaceId}/pipeline`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ currentStage: stageId }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Update local state
      setCurrentStage(stageId);
    } catch (err) {
      console.error('Error updating pipeline stage:', err);
      setError(`Failed to move to ${stageId} stage: ${err.message}`);
    }
  };

  /**
   * Get recommended tools for current stage
   * @returns {Array} - Array of tool IDs recommended for current stage
   */
  const getRecommendedTools = () => {
    return STAGE_TOOL_MAPPING[currentStage] || [];
  };

  return {
    enabledTools,
    toolSettings,
    currentStage,
    loading,
    error,
    activateTool,
    deactivateTool,
    updateToolSettings,
    moveToNextStage,
    moveToStage,
    getRecommendedTools
  };
};

export default useWorkspaceTools;