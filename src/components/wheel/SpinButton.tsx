'use client';

import { motion } from 'framer-motion';
import { Theme } from '@/types';

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
  theme: Theme;
}

export function SpinButton({ onClick, disabled, isSpinning, theme }: SpinButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-bold text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
      style={{
        backgroundColor: theme.accentColor,
        color: theme.buttonTextColor,
      }}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      aria-label={isSpinning ? 'Spinning...' : 'Spin the wheel'}
    >
      {isSpinning ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          ↻
        </motion.span>
      ) : (
        'SPIN'
      )}
    </motion.button>
  );
}
