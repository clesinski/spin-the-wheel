'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WheelItem, Theme } from '@/types';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ResultOverlayProps {
  winner: WheelItem | null;
  isVisible: boolean;
  onSpinAgain: () => void;
  onNewWheel: () => void;
  theme: Theme;
}

export function ResultOverlay({
  winner,
  isVisible,
  onSpinAgain,
  onNewWheel,
  theme,
}: ResultOverlayProps) {
  const spinAgainRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus "Spin Again" button when overlay appears
  useEffect(() => {
    if (isVisible && spinAgainRef.current) {
      // Small delay to ensure animation has started
      const timer = setTimeout(() => {
        spinAgainRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onSpinAgain();
      }
    },
    [isVisible, onSpinAgain]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const overlayVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

  const contentVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: 'easeOut' as const,
          },
        },
      };

  return (
    <AnimatePresence>
      {isVisible && winner && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
        >
          <motion.div
            className="flex flex-col items-center gap-8 p-8 max-w-md mx-4"
            variants={contentVariants}
          >
            {/* Winner announcement */}
            <div className="text-center">
              <p className="text-white/80 text-xl mb-2">The winner is...</p>
              <h2
                id="result-title"
                className="text-4xl md:text-5xl font-bold"
                style={{ color: theme.accentColor }}
              >
                {winner.label}
              </h2>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                ref={spinAgainRef}
                onClick={onSpinAgain}
                accentColor={theme.accentColor}
                buttonTextColor={theme.buttonTextColor}
                className="min-w-[140px]"
              >
                Spin Again
              </Button>
              <Button
                onClick={onNewWheel}
                variant="secondary"
                accentColor={theme.accentColor}
                className="min-w-[140px]"
              >
                New Wheel
              </Button>
            </div>

            <p className="text-white/50 text-sm">Press Escape to spin again</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
