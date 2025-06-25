import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PIPELINE_STAGES, ACADEMIC_TOOLS, STAGE_TOOL_MAPPING } from '../../config/academicTools';
import useWorkspaceTools from '../../hooks/useWorkspaceTools';
import PipelineTracker from './PipelineTracker';
import StageSpecificTools from './StageSpecificTools';
import WorkspaceContent from './WorkspaceContent';
import { researchWorkspaceIntegration } from '../../services/researchWorkspaceIntegration';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

/**
 * Enhanced Workspace component that combines pipeline stages and tools
 * with Scholar AI integration for research queries and results
 *
 * @returns {JSX.Element} - Rendered component
 */
const EnhancedWorkspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [workspaceData, setWorkspaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [researchResults, setResearchResults] = useState(null);
  const [currentToolConfig, setCurrentToolConfig] = useState(null);
  const [configSettings, setConfigSettings] = useState({});
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  // Use custom hook for workspace tools management
  const {
    enabledTools,
    toolSettings,
    currentStage,
    activateTool,
    deactivateTool,
    updateToolSettings,
    moveToStage,
    loading: toolsLoading,
    error: toolsError
  } = useWorkspaceTools(workspaceId);
  
  // Load workspace data
  useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!workspaceId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Check if we have research results in location state (from navigation)
        if (location.state?.researchResults) {
          console.log('📊 Found research results in navigation state:', location.state.researchResults);
          setResearchResults(location.state.researchResults);
        }
        
        // Try to load from the research workspace integration service
        const integrationData = await researchWorkspaceIntegration.saveResultsToWorkspace(
          researchResults || {},
          workspaceId,
          currentStage
        );
        
        if (integrationData.status === 'success') {
          console.log('✅ Loaded workspace data from integration service:', integrationData.data);
          setWorkspaceData({
            ...workspaceData,
            ...integrationData.data
          });
          setLoading(false);
          return;
        }
        
        // In development/testing, use mock data
        if (import.meta.env.DEV) {
          const mockData = {
            id: workspaceId || 'mock-workspace',
            name: 'Academic Research Project',
            description: 'Exploring the effects of climate change on marine ecosystems',
            researchQuestion: 'How do rising ocean temperatures affect coral reef biodiversity?',
            researchArea: 'Marine Biology, Climate Science',
            keywords: 'coral reefs, biodiversity, ocean warming, climate change',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Simulate API delay (reduced to improve user experience)
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setWorkspaceData(mockData);
          setLoading(false);
          return;
        }
        
        // In production, would fetch from API
        // const response = await fetch(`/api/workspaces/${workspaceId}`);
        // if (!response.ok) throw new Error('Failed to load workspace');
        // const data = await response.json();
        // setWorkspaceData(data);
      } catch (error) {
        console.error('Error loading workspace:', error);
        toast.error('Error loading workspace data');
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkspaceData();
  }, [workspaceId, currentStage, researchResults, location.state]);
  
  // Handle tool selection/activation
  const handleToolSelect = (toolId) => {
    // Find the tool in academic tools
    const allTools = Object.values(ACADEMIC_TOOLS).flat();
    const selectedTool = allTools.find(tool => tool.id === toolId);
    
    if (selectedTool) {
      toast.info(`Selected tool: ${selectedTool.name}`);
      
      // Show more information about the tool
      toast(
        <div>
          <h3 className="font-medium">{selectedTool.name}</h3>
          <p className="text-sm text-gray-400">{selectedTool.description}</p>
        </div>
      );
    }
  };
  
  // Handle tool activation with proper feedback
  const handleToolActivate = (toolId) => {
    const allTools = Object.values(ACADEMIC_TOOLS).flat();
    const selectedTool = allTools.find(tool => tool.id === toolId);
    
    toast.loading(`Activating ${selectedTool?.name || toolId}...`);
    
    // Add a slight delay to simulate processing
    setTimeout(() => {
      activateTool(toolId, {});
      toast.dismiss();
      toast.success(`${selectedTool?.name || toolId} activated`);
    }, 600);
  };
  
  // Handle tool deactivation with proper feedback
  const handleToolDeactivate = (toolId) => {
    const allTools = Object.values(ACADEMIC_TOOLS).flat();
    const selectedTool = allTools.find(tool => tool.id === toolId);
    
    toast.loading(`Deactivating ${selectedTool?.name || toolId}...`);
    
    // Add a slight delay to simulate processing
    setTimeout(() => {
      deactivateTool(toolId);
      toast.dismiss();
      toast.success(`${selectedTool?.name || toolId} deactivated`);
    }, 600);
  };
  
  // Open configuration modal for a tool
  const handleToolConfigure = (toolId) => {
    const allTools = Object.values(ACADEMIC_TOOLS).flat();
    const selectedTool = allTools.find(tool => tool.id === toolId);
    
    if (selectedTool) {
      // Get current settings or use defaults
      const currentSettings = toolSettings[toolId] || {};
      
      setCurrentToolConfig(selectedTool);
      setConfigSettings(currentSettings);
      setConfigModalOpen(true);
    }
  };
  
  // Save tool configuration
  const handleSaveConfig = () => {
    if (!currentToolConfig) return;
    
    toast.loading(`Saving ${currentToolConfig.name} configuration...`);
    
    // Add a slight delay to simulate processing
    setTimeout(() => {
      updateToolSettings(currentToolConfig.id, configSettings);
      setConfigModalOpen(false);
      toast.dismiss();
      toast.success(`${currentToolConfig.name} configuration updated`);
    }, 800);
  };
  
  // Handle stage change with visual feedback
  const handleStageChange = async (stageId) => {
    const toastId = toast.loading(`Moving to ${stageId} stage...`);
    
    try {
      // Move to the new stage
      moveToStage(stageId);
      
      // If we have research results, save them for the new stage
      if (researchResults && workspaceId) {
        await researchWorkspaceIntegration.saveResultsToWorkspace(
          researchResults,
          workspaceId,
          stageId
        );
        
        console.log(`🔄 Research results saved for stage: ${stageId}`);
      }
      
      toast.dismiss(toastId);
      toast.success(`Moved to ${stageId.charAt(0).toUpperCase() + stageId.slice(1)} stage`);
      
      // Auto-enable recommended tools for this stage
      const recommendedTools = STAGE_TOOL_MAPPING[stageId] || [];
      const allTools = Object.values(ACADEMIC_TOOLS).flat();
      
      for (const toolId of recommendedTools) {
        if (!enabledTools.includes(toolId)) {
          const tool = allTools.find(t => t.id === toolId);
          if (tool) {
            setTimeout(() => {
              activateTool(toolId, {});
              toast.info(`${tool.name} automatically enabled for this stage`);
            }, 1000);
            break; // Only enable one tool automatically as an example
          }
        }
      }
    } catch (error) {
      console.error('Error saving research results for stage:', error);
      toast.dismiss(toastId);
      toast.error('Failed to update stage data');
    }
  };
  
  // Save research query results to the workspace
  const saveResearchResults = async (results) => {
    if (!workspaceId || !results) return;
    
    try {
      setResearchResults(results);
      
      const savedData = await researchWorkspaceIntegration.saveResultsToWorkspace(
        results,
        workspaceId,
        currentStage
      );
      
      if (savedData.status === 'success') {
        setWorkspaceData({
          ...workspaceData,
          ...savedData.data
        });
        
        toast.success('Research results saved to workspace');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving research results:', error);
      toast.error('Failed to save research results. Please try again.');
      return false;
    }
  };
  
  if (loading || toolsLoading) {
    return (
      <div className="enhanced-workspace p-4 min-h-screen bg-gray-900 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading workspace...</p>
            <button
              className="mt-4 text-blue-400 hover:text-blue-300"
              onClick={() => navigate('/research/enhanced')}
            >
              Return to Research
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (toolsError) {
    return (
      <div className="enhanced-workspace p-4 min-h-screen bg-gray-900 text-white">
        <div className="bg-red-900 text-white p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Error Loading Workspace</h2>
          <p>{toolsError}</p>
          <button
            className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate('/research/enhanced')}
          >
            Return to Research
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="enhanced-workspace p-4 min-h-screen bg-gray-900 text-white">
      {/* Tool Configuration Modal */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{currentToolConfig?.name} Configuration</DialogTitle>
          </DialogHeader>
          
          {currentToolConfig && (
            <div className="py-4">
              {/* Configuration form - dynamically built based on tool */}
              {Object.entries(currentToolConfig.config || {}).map(([key, defaultValue]) => {
                // Determine field type based on value
                const isBoolean = typeof defaultValue === 'boolean';
                const isNumber = typeof defaultValue === 'number';
                const isArray = Array.isArray(defaultValue);
                
                return (
                  <div key={key} className="mb-4">
                    <Label htmlFor={key} className="text-gray-300 mb-1 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                    </Label>
                    
                    {isBoolean ? (
                      <div className="flex items-center">
                        <Switch
                          id={key}
                          checked={configSettings[key] ?? defaultValue}
                          onCheckedChange={(checked) => {
                            setConfigSettings(prev => ({
                              ...prev,
                              [key]: checked
                            }));
                          }}
                        />
                        <Label htmlFor={key} className="ml-2 text-gray-400 text-sm">
                          {configSettings[key] ?? defaultValue ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    ) : isNumber ? (
                      <Input
                        id={key}
                        type="number"
                        value={configSettings[key] ?? defaultValue}
                        onChange={(e) => {
                          setConfigSettings(prev => ({
                            ...prev,
                            [key]: parseFloat(e.target.value)
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : isArray ? (
                      <Textarea
                        id={key}
                        value={(configSettings[key] ?? defaultValue).join(', ')}
                        onChange={(e) => {
                          setConfigSettings(prev => ({
                            ...prev,
                            [key]: e.target.value.split(',').map(item => item.trim())
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : (
                      <Input
                        id={key}
                        value={configSettings[key] ?? defaultValue}
                        onChange={(e) => {
                          setConfigSettings(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfigModalOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfig}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Workspace header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {workspaceData.name || 'Academic Research Workspace'}
          </h1>
          <p className="text-gray-400">
            {workspaceData.description || 'No description provided'}
          </p>
          {researchResults && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                Connected to Scholar AI Enhanced Model
              </span>
            </div>
          )}
        </div>
        <button
          className="flex items-center px-3 py-2 bg-blue-600/20 text-blue-300 rounded-md hover:bg-blue-600/30 hover:text-blue-200 transition-colors border border-blue-500/50"
          onClick={() => {
            localStorage.setItem('lastWorkspaceId', workspaceId);
            navigate('/research/enhanced');
            toast.success('Returned to Enhanced Research');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Research
        </button>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with tools */}
        <div className="lg:col-span-1">
          <StageSpecificTools 
            stage={currentStage}
            enabledTools={enabledTools}
            onToolSelect={handleToolSelect}
            onToolActivate={handleToolActivate}
            onToolDeactivate={handleToolDeactivate}
            onToolConfigure={handleToolConfigure}
          />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3">
          <PipelineTracker 
            stages={PIPELINE_STAGES}
            current={currentStage}
            onStageClick={handleStageChange}
          />
          
          <WorkspaceContent
            stage={currentStage}
            workspaceData={workspaceData}
            researchResults={researchResults}
            onSaveResults={saveResearchResults}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedWorkspace;