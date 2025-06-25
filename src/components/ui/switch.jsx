import React, { forwardRef } from 'react';

export const Switch = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked || false}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${checked ? 'bg-green-500' : 'bg-gray-600'}
        ${className || ''}
      `}
      {...props}
    >
      <span 
        className={`
          pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg 
          ring-0 transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
});

export default Switch;
