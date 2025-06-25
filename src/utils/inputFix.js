// Input field interaction fixes
export const fixInputInteraction = () => {
  console.log('🔧 Fixing input interactions');
  // Target all inputs and textareas, not just those with data-slot="input"
  const inputs = document.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Log the input being fixed
    console.log('🔧 Fixing input:', input.id || 'unnamed input');
    
    // Force enable pointer events
    input.style.pointerEvents = 'auto !important';
    input.style.userSelect = 'text !important';
    input.style.webkitUserSelect = 'text !important';
    input.style.position = 'relative !important';
    input.style.zIndex = '999 !important'; // Higher z-index to ensure visibility
    
    // Remove any conflicting event listeners and add new ones
    const stopAndFocus = (e) => {
      console.log('🔧 Input event triggered:', e.type, 'on', input.id);
      e.stopPropagation();
      e.preventDefault();
      setTimeout(() => input.focus(), 0);
    };
    
    // Use more events to ensure interactivity
    ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(eventType => {
      input.addEventListener(eventType, stopAndFocus, { capture: true });
    });
    
    // Ensure focus works
    input.addEventListener('focus', (e) => {
      console.log('🔧 Focus event on:', input.id);
      e.stopPropagation();
    }, { capture: true });
    
    // Add a direct change handler to log value changes
    input.addEventListener('input', (e) => {
      console.log('🔧 Input value changed:', input.id, 'Value:', input.value);
    }, { capture: true });
  });
  
  console.log('🔧 Total inputs fixed:', document.querySelectorAll('input, textarea').length);
};

// Auto-fix on DOM changes
export const setupInputFixObserver = () => {
  console.log('🔄 Setting up input fix observer');
  
  const observer = new MutationObserver((mutations) => {
    let inputsFixed = 0;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Target all inputs and textareas
            const inputs = node.querySelectorAll ? node.querySelectorAll('input, textarea') : [];
            
            inputs.forEach(input => {
              input.style.pointerEvents = 'auto !important';
              input.style.userSelect = 'text !important';
              input.style.webkitUserSelect = 'text !important';
              input.style.position = 'relative !important';
              input.style.zIndex = '999 !important';
              
              // Add the same event handlers as in fixInputInteraction
              const stopAndFocus = (e) => {
                e.stopPropagation();
                setTimeout(() => input.focus(), 0);
              };
              
              ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(eventType => {
                input.addEventListener(eventType, stopAndFocus, { capture: true });
              });
              
              inputsFixed++;
            });
          }
        });
      }
    });
    
    if (inputsFixed > 0) {
      console.log(`🔄 Fixed ${inputsFixed} inputs from DOM mutation`);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  console.log('🔄 Input fix observer active');
  return observer;
};

// Auto-initialize the observer when the module is imported
let observerInstance = null;
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    observerInstance = setupInputFixObserver();
    // Run initial fix
    setTimeout(fixInputInteraction, 500);
  });
}
