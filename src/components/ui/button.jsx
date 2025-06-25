import React, { forwardRef } from 'react';

export const Button = forwardRef(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    // The asChild prop is destructured separately to prevent it from being passed to the DOM element
    const getVariantClasses = () => {
      switch (variant) {
        case 'default':
          return 'bg-blue-600 text-white hover:bg-blue-700';
        case 'outline':
          return 'border border-gray-600 bg-transparent text-white hover:bg-gray-700';
        case 'ghost':
          return 'bg-transparent text-white hover:bg-gray-700';
        case 'destructive':
          return 'bg-red-600 text-white hover:bg-red-700';
        case 'success':
          return 'bg-green-600 text-white hover:bg-green-700';
        default:
          return 'bg-blue-600 text-white hover:bg-blue-700';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'h-8 px-3 text-xs';
        case 'default':
          return 'h-10 px-4 py-2 text-sm';
        case 'lg':
          return 'h-12 px-6 text-base';
        default:
          return 'h-10 px-4 py-2 text-sm';
      }
    };

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-md font-medium 
          transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
