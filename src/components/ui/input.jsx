import React, { forwardRef } from 'react';

export const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm
        placeholder:text-muted-foreground focus-visible:outline-none
        focus-visible:ring-1 focus-visible:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        border-gray-600 bg-gray-700 text-white
        ${className || ''}
      `}
      ref={ref}
      {...props}
    />
  );
});

export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`
        flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm
        placeholder:text-muted-foreground focus-visible:outline-none
        focus-visible:ring-1 focus-visible:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-50
        border-gray-600 bg-gray-700 text-white resize-y
        ${className || ''}
      `}
      ref={ref}
      {...props}
    />
  );
});
