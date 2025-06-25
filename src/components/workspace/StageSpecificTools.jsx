import React, { useState } from 'react';
import { ACADEMIC_TOOLS, STAGE_TOOL_MAPPING } from '../../config/academicTools';
import ToolCard from './ToolCard';

/**
 * Component that displays tools recommended for the current pipeline stage
 * 
 * @param {Object} props - Component props
 * @param {string} props.stage - Current pipeline stage
 * @param {Array} props.enabledTools - Array of enabled tool IDs
 * @param {Function} props.onToolSelect - Handler for tool selection
 * @param {Function} props.onToolActivate - Handler for tool activation
 * @param {Function} props.onToolDeactivate - Handler for tool deactivation
 * @param {Function} props.onToolConfigure - Handler for tool configuration
 * @returns {JSX.Element} - Rendered component
 */
const StageSpecificTools = ({ 
  stage,
  enabledTools = [],
  onToolSelect,
  onToolActivate,
  onToolDeactivate,
  onToolConfigure
}) => {
  const [showAllTools, setShowAllTools] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Get recommended tools for current stage
  const recommendedToolIds = STAGE_TOOL_MAPPING[stage] || [];
  
  // Flatten all tools into a single array
  const allTools = Object.values(ACADEMIC_TOOLS).flat();
  
  // Get all category names
  const categories = Object.keys(ACADEMIC_TOOLS);
  
  // Filter tools based on current selection
  const getFilteredTools = () => {
    if (filterCategory === 'all') {
      return allTools;
    }
    return ACADEMIC_TOOLS[filterCategory] || [];
  };
  
  // Get recommended tools as objects
  const recommendedTools = recommendedToolIds
    .map(id => allTools.find(tool => tool.id === id))
    .filter(Boolean);
  
  return (
    <div className="stage-tools mt-4 bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white">
          Tools for {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
        </h3>
        
        <button
          onClick={() => setShowAllTools(!showAllTools)}
          className="text-sm px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
        >
          {showAllTools ? 'Hide All Tools' : 'Show All Tools'}
        </button>
      </div>
      
      {/* Recommended tools section */}
      {recommendedTools.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-yellow-500 mb-2">
            Recommended for this stage
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recommendedTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isActive={enabledTools.includes(tool.id)}
                isRecommended={true}
                onActivate={onToolActivate}
                onDeactivate={onToolDeactivate}
                onConfigure={onToolConfigure}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* All tools section (collapsible) */}
      {showAllTools && (
        <div className="mt-4">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              All Available Tools
            </h4>
            
            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterCategory('all')}
                className={`text-xs px-3 py-1 rounded-full transition-colors
                  ${filterCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                All
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`text-xs px-3 py-1 rounded-full capitalize transition-colors
                    ${filterCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getFilteredTools().map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isActive={enabledTools.includes(tool.id)}
                isRecommended={recommendedToolIds.includes(tool.id)}
                onActivate={onToolActivate}
                onDeactivate={onToolDeactivate}
                onConfigure={onToolConfigure}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {recommendedTools.length === 0 && !showAllTools && (
        <div className="text-center py-6 text-gray-400">
          <p>No specific tools recommended for this stage.</p>
          <button
            onClick={() => setShowAllTools(true)}
            className="mt-2 text-blue-400 hover:text-blue-300 underline"
          >
            Browse all available tools
          </button>
        </div>
      )}
    </div>
  );
};

export default StageSpecificTools;