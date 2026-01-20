'use client';

import { useState, useCallback } from 'react';
import { WheelItem, AppState } from '@/types';
import { generateSpinRotation } from '@/lib/wheel-math';

const MAX_ITEMS = 20;

interface UseWheelReturn {
  items: WheelItem[];
  rotation: number;
  appState: AppState;
  winner: WheelItem | null;
  addItem: (label: string) => boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, label: string) => void;
  spin: () => void;
  spinAgain: () => void;
  reset: () => void;
  onSpinComplete: () => void;
  canSpin: boolean;
  isSpinning: boolean;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useWheel(): UseWheelReturn {
  const [items, setItems] = useState<WheelItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [appState, setAppState] = useState<AppState>('setup');
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const canSpin = items.length >= 2;
  const isSpinning = appState === 'spinning';

  const addItem = useCallback((label: string): boolean => {
    const trimmed = label.trim();
    if (!trimmed || items.length >= MAX_ITEMS) {
      return false;
    }

    setItems((prev) => [...prev, { id: generateId(), label: trimmed }]);
    return true;
  }, [items.length]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: trimmed } : item))
    );
  }, []);

  const spin = useCallback(() => {
    if (!canSpin || isSpinning) return;

    // Pre-determine the winner
    const winnerIdx = Math.floor(Math.random() * items.length);
    setTargetIndex(winnerIdx);

    // Calculate rotation
    const newRotation = generateSpinRotation(rotation, winnerIdx, items.length);
    setRotation(newRotation);
    setAppState('spinning');
  }, [canSpin, isSpinning, items.length, rotation]);

  const onSpinComplete = useCallback(() => {
    if (targetIndex !== null && items[targetIndex]) {
      setWinner(items[targetIndex]);
    }
    setAppState('result');
  }, [items, targetIndex]);

  const spinAgain = useCallback(() => {
    setWinner(null);

    // Pre-determine the new winner
    const winnerIdx = Math.floor(Math.random() * items.length);
    setTargetIndex(winnerIdx);

    // Calculate new rotation
    const newRotation = generateSpinRotation(rotation, winnerIdx, items.length);
    setRotation(newRotation);
    setAppState('spinning');
  }, [items.length, rotation]);

  const reset = useCallback(() => {
    setItems([]);
    setRotation(0);
    setAppState('setup');
    setWinner(null);
    setTargetIndex(null);
  }, []);

  return {
    items,
    rotation,
    appState,
    winner,
    addItem,
    removeItem,
    updateItem,
    spin,
    spinAgain,
    reset,
    onSpinComplete,
    canSpin,
    isSpinning,
  };
}
