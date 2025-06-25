import React, { forwardRef } from 'react';

export const Label = forwardRef(({ className, htmlFor, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`text-sm font-medium text-white ${className || ''}`}
      {...props}
    />
  );
});

export default Label;
