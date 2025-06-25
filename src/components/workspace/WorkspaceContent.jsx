import React, { useState, useEffect } from 'react';
import AgentPanel from './AgentPanel';
import { agentWorkspaceIntegration } from '../../services/agentWorkspaceIntegration';
import { toast } from 'sonner';

/**
 * Component that displays stage-specific content for the current pipeline stage
 * 
 * @param {Object} props - Component props
 * @param {string} props.stage - Current pipeline stage
 * @param {Object} props.workspaceData - Data for the current workspace
 * @param {Object} props.researchResults - Results from Scholar AI research
 * @param {Function} props.onSaveResults - Callback to save results to workspace
 * @returns {JSX.Element} - Rendered component
 */
const WorkspaceContent = ({
  stage,
  workspaceData = {},
  researchResults = null,
  onSaveResults = null
}) => {
  const [stageData, setStageData] = useState({});
  
  // Update stage data when workspaceData or stage changes
  useEffect(() => {
    if (workspaceData && workspaceData[stage]) {
      setStageData(workspaceData[stage]);
    } else if (researchResults && stage === 'think') {
      // For thinking stage, use synthesis from research results
      const thinkData = {
        synthesis: researchResults.results?.synthesis || {},
        keyFindings: researchResults.results?.synthesis?.key_findings || []
      };
      setStageData(thinkData);
      
      // Save research results to workspace
      if (onSaveResults) {
        onSaveResults(researchResults);
      }
    } else if (researchResults && stage === 'citation') {
      // For citation stage, use citation data from research results
      const citationData = {
        formatted: researchResults.results?.citations || [],
        sources: researchResults.results?.literature?.sources || [],
        style: researchResults.metadata?.citation_style || 'APA'
      };
      setStageData(citationData);
      
      // Save research results to workspace
      if (onSaveResults) {
        onSaveResults(researchResults);
      }
    } else if (researchResults && stage === 'query') {
      // For query stage, use query data from research results
      const queryData = {
        text: researchResults.query || '',
        researchArea: researchResults.metadata?.researchArea || 'General Research'
      };
      setStageData(queryData);
      
      // Save research results to workspace
      if (onSaveResults) {
        onSaveResults(researchResults);
      }
    } else if (researchResults && stage === 'search') {
      // For search stage, use literature sources from research results
      const searchData = {
        results: researchResults.results?.literature?.sources || [],
        totalSources: researchResults.metadata?.total_sources || 0
      };
      setStageData(searchData);
      
      // Save research results to workspace
      if (onSaveResults) {
        onSaveResults(researchResults);
      }
    }
  }, [stage, workspaceData, researchResults, onSaveResults]);
  // Render appropriate content based on current stage
  const renderStageContent = () => {
    switch (stage) {
      case 'think':
        return <ThinkStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'query':
        return <QueryStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'search':
        return <SearchStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'citation':
        return <CiteStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'collaboration':
        return <CollaborationStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'test':
        return <TestStageContent workspaceData={workspaceData} stageData={stageData} />;
      case 'ship':
        return <ShipStageContent workspaceData={workspaceData} stageData={stageData} />;
      default:
        return <DefaultStageContent />;
    }
  };
  
  return (
    <div className="workspace-content bg-gray-800 rounded-lg p-4 shadow-lg">
      {renderStageContent()}
    </div>
  );
};

// Stage-specific content components

const QueryStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Define Your Research Question</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Research Question
        </label>
        <textarea
          className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your research question or hypothesis..."
          rows={3}
          defaultValue={workspaceData?.researchQuestion || ''}
        />
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Research Area
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Machine Learning, Climate Science, Psychology..."
            defaultValue={workspaceData?.researchArea || ''}
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Keywords
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter keywords separated by commas"
            defaultValue={workspaceData?.keywords || ''}
          />
        </div>
        
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
          Save Research Question
        </button>
      </div>
      
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">Research Question Guidelines</h3>
        <ul className="list-disc pl-5 text-gray-300 space-y-2 text-sm">
          <li>Be specific and clear about what you want to investigate</li>
          <li>Ensure your question is answerable through research</li>
          <li>Consider scope - not too broad, not too narrow</li>
          <li>Include relevant variables or concepts</li>
          <li>Align with ethical research standards</li>
        </ul>
      </div>
    </div>
  );
};

const SearchStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Literature Search</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for papers, articles, journals..."
            defaultValue={workspaceData?.searchQuery || ''}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
            Search
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full">
            Peer Reviewed
          </span>
          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full">
            Last 5 Years
          </span>
          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full">
            Full Text
          </span>
          <button className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full hover:bg-gray-500 transition-colors">
            + Add Filter
          </button>
        </div>
      </div>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Search Results</h3>
        {stageData?.results && stageData.results.length > 0 ? (
          <div className="space-y-3">
            {stageData.results.map((source, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded border border-gray-700">
                <p className="text-white font-medium">{source.title}</p>
                <p className="text-sm text-gray-400">
                  {source.authors?.join(', ') || 'Unknown authors'} • {source.year || 'N/A'} • {source.journal || 'N/A'}
                </p>
                {source.abstract && (
                  <p className="text-sm text-gray-300 mt-2">{source.abstract}</p>
                )}
                {source.doi && (
                  <p className="text-xs text-blue-400 mt-1">DOI: {source.doi}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No search results yet. Use the search bar above to find relevant literature.</p>
        )}
      </div>
      
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">Saved Papers</h3>
        <p className="text-gray-400 text-sm italic">No papers saved yet. Save papers from search results to build your literature collection.</p>
      </div>
    </div>
  );
};

const CiteStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Citation Management</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Your Citations</h3>
          
          <div className="flex gap-2">
            <select className="text-sm bg-gray-800 text-white border border-gray-600 rounded px-2 py-1">
              <option>APA</option>
              <option>MLA</option>
              <option>Chicago</option>
              <option>Harvard</option>
            </select>
            
            <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
              Export
            </button>
          </div>
        </div>
        
        {stageData?.sources && stageData.sources.length > 0 ? (
          <div className="space-y-3">
            {stageData.sources.map((source, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded border border-gray-700">
                <p className="text-white font-medium">{source.title}</p>
                <p className="text-sm text-gray-400">
                  {source.authors?.join(', ') || 'Unknown authors'} • {source.year || 'N/A'} • {source.journal || 'N/A'}
                </p>
                {source.doi && (
                  <p className="text-xs text-blue-400 mt-1">DOI: {source.doi}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No citations yet. Add papers from the Search stage or import from citation tools.</p>
        )}
      </div>
      
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">Import Citations</h3>
        <div className="flex gap-3">
          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
            Import from Zotero
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
            Import BibTeX
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
            Import EndNote
          </button>
        </div>
      </div>
    </div>
  );
};

const ThinkStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Analysis & Synthesis</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Research Notes</h3>
        <textarea
          className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your research notes, ideas, and synthesis..."
          rows={8}
          defaultValue={stageData?.synthesis?.summary || workspaceData?.researchNotes || ''}
        />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
          Save Notes
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Key Findings</h3>
          {stageData?.keyFindings && stageData.keyFindings.length > 0 ? (
            <ul className="space-y-2 text-gray-300">
              {stageData.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">No key findings identified yet. Add findings from your research.</p>
          )}
          <button className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
            Add Finding
          </button>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Research Gaps</h3>
          <p className="text-gray-400 text-sm italic">No research gaps identified yet. Analyze your literature to identify opportunities.</p>
          <button className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
            Add Research Gap
          </button>
        </div>
      </div>
    </div>
  );
};

const CollaborationStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Collaboration</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Team Members</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">JD</div>
              <div>
                <p className="text-white">Jane Doe</p>
                <p className="text-xs text-gray-400">Lead Researcher</p>
              </div>
            </div>
            <div className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded-full">Online</div>
          </div>
          
          <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white mr-3">MS</div>
              <div>
                <p className="text-white">Michael Smith</p>
                <p className="text-xs text-gray-400">Data Analyst</p>
              </div>
            </div>
            <div className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded-full">Offline</div>
          </div>
        </div>
        
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
          Invite Collaborator
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Discussion Board</h3>
          <p className="text-gray-400 text-sm">Share ideas and feedback with your research team.</p>
          <div className="mt-3 bg-gray-800 p-3 rounded text-sm text-gray-300">
            <p className="mb-2">No discussions yet. Start a conversation with your team.</p>
            <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
              New Topic
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Shared Documents</h3>
          <p className="text-gray-400 text-sm">Access documents shared by your research team.</p>
          <div className="mt-3 bg-gray-800 p-3 rounded text-sm text-gray-300">
            <p className="mb-2">No shared documents yet. Upload or create a document to collaborate.</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
                Upload
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors">
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestStageContent = ({ workspaceData, stageData = {} }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Validate Findings</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Validation Checklist</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" id="check1" className="mr-2" />
            <label htmlFor="check1" className="text-gray-300">Check sources for credibility and relevance</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="check2" className="mr-2" />
            <label htmlFor="check2" className="text-gray-300">Verify facts and statistics from multiple sources</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="check3" className="mr-2" />
            <label htmlFor="check3" className="text-gray-300">Review methodology for biases or limitations</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="check4" className="mr-2" />
            <label htmlFor="check4" className="text-gray-300">Ensure conclusions are supported by evidence</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="check5" className="mr-2" />
            <label htmlFor="check5" className="text-gray-300">Check for logical fallacies in arguments</label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Peer Review</h3>
          <p className="text-gray-400 text-sm">Request feedback from colleagues or experts in your field.</p>
          <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
            Request Review
          </button>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Findings Validation</h3>
          <textarea
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Document how you've validated your findings..."
            rows={4}
            defaultValue={workspaceData?.validationNotes || ''}
          />
          <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

const ShipStageContent = ({ workspaceData, stageData = {} }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [agentResults, setAgentResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize agent results from workspace data if available
  useEffect(() => {
    if (stageData?.agentResults) {
      setAgentResults(stageData.agentResults);
    }
  }, [stageData]);
  
  // Handle agent selection
  const handleAgentSelect = (agentId) => {
    setSelectedAgents(prev => [...prev, agentId]);
  };
  
  // Handle agent deselection
  const handleAgentDeselect = (agentId) => {
    if (Array.isArray(agentId)) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(prev => prev.filter(id => id !== agentId));
    }
  };
  
  // Start agent process
  const handleStartAgentProcess = async (agentsWithConfig, workspaceId) => {
    if (!workspaceId) {
      toast.error('Workspace ID is required to start agent process');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await agentWorkspaceIntegration.initializeAgentProcess(
        agentsWithConfig,
        workspaceId,
        { phase: 'ship' }
      );
      
      if (result.status === 'success') {
        setAgentResults(result.results);
        toast.success('Agent process completed successfully!');
      } else {
        toast.error(`Agent process failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in agent process:', error);
      toast.error('An error occurred during the agent process');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculate completion percentage based on checkboxes and agent results
  const getCompletionPercentage = () => {
    let completed = 3; // Default completed items
    let total = 6; // Total items
    
    // Add 1 if agent results are available
    if (agentResults) {
      completed += 1;
      total += 1;
    }
    
    return Math.round((completed / total) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Publish & Share</h2>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Publication Readiness</h3>
        
        <div className="w-full bg-gray-800 rounded-full h-4 mb-3">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          {completionPercentage}% complete - {7 - Math.round((completionPercentage / 100) * 7)} items remaining
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="checkbox" id="pub1" className="mr-2" checked readOnly />
            <label htmlFor="pub1" className="text-gray-300">Complete draft</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub2" className="mr-2" checked readOnly />
            <label htmlFor="pub2" className="text-gray-300">Format citations and references</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub3" className="mr-2" checked readOnly />
            <label htmlFor="pub3" className="text-gray-300">Proofread for grammar and style</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub4" className="mr-2" checked={agentResults !== null} readOnly />
            <label htmlFor="pub4" className="text-gray-300">AI Agent Analysis</label>
            {agentResults && (
              <span className="ml-2 text-xs bg-green-800 text-green-100 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub5" className="mr-2" />
            <label htmlFor="pub5" className="text-gray-300">Create abstract</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub6" className="mr-2" />
            <label htmlFor="pub6" className="text-gray-300">Format for target journal</label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="pub7" className="mr-2" />
            <label htmlFor="pub7" className="text-gray-300">Final review with co-authors</label>
          </div>
        </div>
      </div>
      
      {/* Agent results section - only visible when results are available */}
      {agentResults && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-white mb-3">AI Agent Analysis</h3>
          
          <div className="space-y-4">
            {/* Publication recommendations */}
            {agentResults.publication && (
              <div className="bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">Publication Recommendations</h4>
                
                {agentResults.publication.suggestions && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">Improvement Suggestions:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                      {agentResults.publication.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {agentResults.publication.recommendedJournals && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Recommended Journals:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agentResults.publication.recommendedJournals.map((journal, index) => (
                        <div key={index} className="flex items-center bg-gray-700 p-2 rounded">
                          <div className="mr-2 text-sm">
                            <p className="font-medium text-white">{journal.name}</p>
                            <p className="text-xs text-gray-400">Impact: {journal.impact} • Match: {journal.match}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Agent-specific results */}
            {agentResults.agentSpecific && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Owl agent results */}
                {agentResults.agentSpecific.owl && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">🦉</span>
                      <h4 className="font-medium text-green-300">Owl Analysis</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Novelty Score: </span>
                        <span className="font-medium">{agentResults.agentSpecific.owl.noveltyScore}%</span>
                      </p>
                      
                      {agentResults.agentSpecific.owl.researchGaps && (
                        <div>
                          <p className="text-gray-400">Research Gaps:</p>
                          <ul className="list-disc pl-5 text-gray-300">
                            {agentResults.agentSpecific.owl.researchGaps.map((gap, index) => (
                              <li key={index}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {agentResults.agentSpecific.owl.competitiveAdvantage && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Competitive Advantage: </span>
                          {agentResults.agentSpecific.owl.competitiveAdvantage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Phoenix agent results */}
                {agentResults.agentSpecific.phoenix && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">🧪</span>
                      <h4 className="font-medium text-orange-300">Phoenix Analysis</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {agentResults.agentSpecific.phoenix.molecularAnalysis && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Molecular Analysis: </span>
                          {agentResults.agentSpecific.phoenix.molecularAnalysis}
                        </p>
                      )}
                      
                      {agentResults.agentSpecific.phoenix.synthesisPathways && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Synthesis Pathways: </span>
                          {agentResults.agentSpecific.phoenix.synthesisPathways}
                        </p>
                      )}
                      
                      {agentResults.agentSpecific.phoenix.propertyPredictions && (
                        <div>
                          <p className="text-gray-400">Property Predictions:</p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {Object.entries(agentResults.agentSpecific.phoenix.propertyPredictions).map(([key, value]) => (
                              <div key={key} className="bg-gray-700 px-2 py-1 rounded text-center">
                                <span className="capitalize text-gray-300">{key}: </span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Agent Panel integration */}
      {!agentResults && (
        <AgentPanel
          selectedAgents={selectedAgents}
          onAgentSelect={handleAgentSelect}
          onAgentDeselect={handleAgentDeselect}
          onStartAgent={handleStartAgentProcess}
          workspaceId={workspaceData.id}
          phase="ship"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Export Options</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
              PDF
            </button>
            <button className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
              Word Document
            </button>
            <button className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
              LaTeX
            </button>
            <button className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors">
              HTML
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-3">Share Research</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
              Email
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
              Team Share
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
              Submit to Journal
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors">
              Research Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultStageContent = () => {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold text-white mb-4">Select a Research Stage</h2>
      <p className="text-gray-400">
        Use the pipeline tracker above to select a research stage and begin working on your project.
      </p>
    </div>
  );
};

export default WorkspaceContent;