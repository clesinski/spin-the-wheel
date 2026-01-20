'use client';

import { motion } from 'framer-motion';
import { WheelItem, Theme } from '@/types';
import { WheelSegment } from './WheelSegment';
import { SpinButton } from './SpinButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface WheelProps {
  items: WheelItem[];
  rotation: number;
  theme: Theme;
  isSpinning: boolean;
  onSpinComplete: () => void;
  onSpin: () => void;
  canSpin: boolean;
}

const WHEEL_SIZE = 400;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 180;

export function Wheel({
  items,
  rotation,
  theme,
  isSpinning,
  onSpinComplete,
  onSpin,
  canSpin,
}: WheelProps) {
  const prefersReducedMotion = useReducedMotion();

  const spinTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : {
        duration: 4,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      };

  const handleAnimationComplete = () => {
    if (isSpinning) {
      // Delay before showing result
      setTimeout(() => {
        onSpinComplete();
      }, 500);
    }
  };

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      {/* Pointer/Arrow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20"
        aria-hidden="true"
      >
        <svg width="30" height="30" viewBox="0 0 30 30">
          <polygon
            points="15,28 5,5 25,5"
            fill={theme.accentColor}
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Wheel SVG */}
      <motion.svg
        viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        className="w-full h-full"
        animate={{ rotate: rotation }}
        transition={spinTransition}
        onAnimationComplete={handleAnimationComplete}
        style={{ transformOrigin: 'center center' }}
        role="img"
        aria-label={`Wheel with ${items.length} segments: ${items.map((i) => i.label).join(', ')}`}
      >
        <title>Spin the Wheel</title>
        <desc>
          A circular wheel divided into {items.length} segments
        </desc>

        {/* Outer ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 5}
          fill="none"
          stroke={theme.accentColor}
          strokeWidth="10"
        />

        {/* Segments */}
        <g>
          {items.map((item, index) => (
            <WheelSegment
              key={item.id}
              label={item.label}
              index={index}
              total={items.length}
              color={theme.colors[index % theme.colors.length]}
              textColor={theme.textColor}
              cx={CENTER}
              cy={CENTER}
              radius={RADIUS}
            />
          ))}
        </g>

        {/* Center circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={35}
          fill={theme.backgroundColor}
          stroke={theme.accentColor}
          strokeWidth="4"
        />
      </motion.svg>

      {/* Spin Button */}
      <SpinButton
        onClick={onSpin}
        disabled={!canSpin || isSpinning}
        isSpinning={isSpinning}
        theme={theme}
      />
    </div>
  );
}
