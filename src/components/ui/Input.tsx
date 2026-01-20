'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  accentColor?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', accentColor, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-current min-h-[44px] ${className}`}
        style={{
          '--tw-ring-color': accentColor,
          ...style,
        } as React.CSSProperties}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
