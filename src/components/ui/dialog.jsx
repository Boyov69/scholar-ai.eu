import React, { createContext, forwardRef, useContext, useState } from 'react';

const DialogContext = createContext({
  open: false,
  setOpen: () => {},
});

export const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  
  // Update internal state when external state changes
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Notify parent when internal state changes
  React.useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={(e) => {
              // Prevent accidental clicks on backdrop from closing the dialog
              // This will ensure the modal stays open when clicking "New Workspace"
              e.stopPropagation();
              // Only close if deliberately clicked on backdrop
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          />
          {children}
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const DialogContent = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`
        relative z-50 max-w-lg w-full p-6 mx-4 
        rounded-lg shadow-lg transform transition-all 
        bg-gray-800 text-white border border-gray-700
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

export const DialogHeader = ({ children, className, ...props }) => {
  return (
    <div className={`mb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className, ...props }) => {
  return (
    <h2 className={`text-xl font-semibold ${className || ''}`} {...props}>
      {children}
    </h2>
  );
};

export const DialogDescription = ({ children, className, ...props }) => {
  return (
    <p className={`text-sm text-gray-400 mt-2 ${className || ''}`} {...props}>
      {children}
    </p>
  );
};

export const DialogFooter = ({ children, className, ...props }) => {
  return (
    <div className={`mt-6 flex justify-end gap-3 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
