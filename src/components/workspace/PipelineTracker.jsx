import React from 'react';
import { PIPELINE_STAGES } from '../../config/academicTools';

/**
 * Pipeline tracker component that displays research workflow stages
 * 
 * @param {Object} props - Component props
 * @param {Array} props.stages - Pipeline stages array (optional, uses default if not provided)
 * @param {string} props.current - Current active stage ID
 * @param {Function} props.onStageClick - Handler for stage button clicks
 * @returns {JSX.Element} - Rendered component
 */
const PipelineTracker = ({ 
  stages = PIPELINE_STAGES, 
  current, 
  onStageClick 
}) => {
  // Get the index of the current stage for progress calculation
  const getStageIndex = (stageId) => stages.findIndex(s => s.id === stageId);
  const currentIndex = getStageIndex(current);
  
  return (
    <div className="pipeline-tracker bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Research Pipeline</h2>
      
      {/* Pipeline stages with progress indicators */}
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-600 z-0"></div>
        
        {/* Active progress bar */}
        <div 
          className="absolute top-8 left-8 h-1 bg-blue-500 z-10 transition-all duration-500"
          style={{ 
            width: `${currentIndex / (stages.length - 1) * 100}%`,
            maxWidth: 'calc(100% - 64px)'
          }}
        ></div>
        
        {/* Stage buttons */}
        <div className="flex items-center justify-between relative z-20">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center">
              <button
                onClick={() => onStageClick(stage.id)}
                className={`
                  stage-button rounded-full w-16 h-16 flex items-center justify-center
                  transition-all duration-300 transform hover:scale-110
                  ${index <= currentIndex 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-600 text-gray-300'}
                  ${current === stage.id ? 'ring-2 ring-white' : ''}
                `}
                aria-label={`Move to ${stage.name} stage`}
                title={stage.description}
              >
                <span className="text-2xl" role="img" aria-label={stage.name}>{stage.icon}</span>
              </button>
              
              <p className={`
                text-center mt-2 text-sm font-medium
                ${current === stage.id ? 'text-blue-300' : 'text-gray-400'}
              `}>
                {stage.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current stage details */}
      <div className="mt-6 bg-gray-700 rounded-lg p-3">
        <div className="flex items-center">
          <div className="text-3xl mr-3">
            {stages[currentIndex]?.icon}
          </div>
          <div>
            <p className="text-sm text-gray-300">Current Stage:</p>
            <p className="text-lg font-bold text-white">{stages[currentIndex]?.name}</p>
            <p className="text-xs text-gray-400 mt-1">{stages[currentIndex]?.description}</p>
          </div>
        </div>
        
        {/* Stage navigation buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              const prevIndex = currentIndex - 1;
              if (prevIndex >= 0) {
                onStageClick(stages[prevIndex].id);
              }
            }}
            disabled={currentIndex === 0}
            className={`
              px-3 py-1 rounded text-sm
              ${currentIndex === 0 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-500'}
            `}
          >
            ← Previous
          </button>
          
          <button
            onClick={() => {
              const nextIndex = currentIndex + 1;
              if (nextIndex < stages.length) {
                onStageClick(stages[nextIndex].id);
              }
            }}
            disabled={currentIndex === stages.length - 1}
            className={`
              px-3 py-1 rounded text-sm
              ${currentIndex === stages.length - 1 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500'}
            `}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipelineTracker;