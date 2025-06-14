// Input field interaction fixes
export const fixInputInteraction = () => {
  // Ensure all input fields are interactive
  const inputs = document.querySelectorAll('input[data-slot="input"], textarea');
  
  inputs.forEach(input => {
    // Force enable pointer events
    input.style.pointerEvents = 'auto';
    input.style.userSelect = 'text';
    input.style.webkitUserSelect = 'text';
    input.style.position = 'relative';
    input.style.zIndex = '10';
    
    // Remove any conflicting event listeners
    input.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    }, { capture: true });
    
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      input.focus();
    }, { capture: true });
    
    input.addEventListener('focus', (e) => {
      e.stopPropagation();
    }, { capture: true });
  });
};

// Auto-fix on DOM changes
export const setupInputFixObserver = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const inputs = node.querySelectorAll ? node.querySelectorAll('input[data-slot="input"], textarea') : [];
            inputs.forEach(input => {
              input.style.pointerEvents = 'auto';
              input.style.userSelect = 'text';
              input.style.webkitUserSelect = 'text';
              input.style.position = 'relative';
              input.style.zIndex = '10';
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
};
