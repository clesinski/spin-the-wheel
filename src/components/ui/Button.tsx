'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  accentColor?: string;
  buttonTextColor?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      accentColor,
      buttonTextColor,
      className = '',
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]';

    const variantStyles =
      variant === 'primary'
        ? 'hover:brightness-110 active:brightness-90'
        : 'bg-transparent border-2 hover:bg-black/5';

    const customStyle =
      variant === 'primary'
        ? {
            backgroundColor: accentColor,
            color: buttonTextColor,
            ...style,
          }
        : {
            borderColor: accentColor,
            color: accentColor,
            ...style,
          };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${className}`}
        disabled={disabled}
        style={customStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
