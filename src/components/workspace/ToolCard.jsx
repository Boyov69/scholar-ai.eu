import React from 'react';

/**
 * Component for displaying an academic tool with action buttons
 * 
 * @param {Object} props - Component props
 * @param {Object} props.tool - Tool object with id, name, icon, description
 * @param {boolean} props.isActive - Whether the tool is currently active
 * @param {boolean} props.isRecommended - Whether the tool is recommended for current stage
 * @param {Function} props.onActivate - Handler for tool activation
 * @param {Function} props.onDeactivate - Handler for tool deactivation
 * @param {Function} props.onConfigure - Handler for tool configuration
 * @returns {JSX.Element} - Rendered component
 */
const ToolCard = ({ 
  tool, 
  isActive = false, 
  isRecommended = false,
  onActivate,
  onDeactivate,
  onConfigure
}) => {
  const { id, name, icon, description } = tool;
  
  return (
    <div 
      className={`
        tool-card rounded-lg p-3 transition-all duration-300
        ${isActive ? 'bg-blue-900 shadow-lg' : 'bg-gray-800 hover:bg-gray-700'}
        ${isRecommended ? 'ring-2 ring-yellow-500' : ''}
      `}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-black font-bold px-2 py-1 rounded-full">
          Recommended
        </div>
      )}
      
      {/* Tool header */}
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2" role="img" aria-label={name}>
          {icon}
        </span>
        <h3 className={`font-medium ${isActive ? 'text-blue-200' : 'text-white'}`}>
          {name}
        </h3>
      </div>
      
      {/* Tool description */}
      <p className="text-xs text-gray-400 mb-3">
        {description}
      </p>
      
      {/* Action buttons */}
      <div className="flex justify-between mt-2">
        {isActive ? (
          <>
            <button 
              onClick={() => onConfigure?.(id)}
              className="text-xs px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Configure
            </button>
            <button 
              onClick={() => onDeactivate?.(id)}
              className="text-xs px-2 py-1 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disable
            </button>
          </>
        ) : (
          <button 
            onClick={() => onActivate?.(id)}
            className={`
              text-xs px-2 py-1 rounded w-full
              ${isRecommended 
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'}
              transition-colors
            `}
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolCard;