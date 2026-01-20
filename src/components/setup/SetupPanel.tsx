'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { WheelItem, Theme } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ItemInput } from './ItemInput';
import { ThemeSelector } from './ThemeSelector';

const MAX_ITEMS = 20;

interface SetupPanelProps {
  items: WheelItem[];
  onAddItem: (label: string) => boolean;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, label: string) => void;
  onStartSpin: () => void;
  canSpin: boolean;
  theme: Theme;
  themes: Theme[];
  themeIndex: number;
  onThemeChange: (index: number) => void;
}

export function SetupPanel({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onStartSpin,
  canSpin,
  theme,
  themes,
  themeIndex,
  onThemeChange,
}: SetupPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Item name cannot be empty');
      return;
    }
    if (items.length >= MAX_ITEMS) {
      setError(`Maximum ${MAX_ITEMS} items reached`);
      return;
    }

    const success = onAddItem(trimmed);
    if (success) {
      setInputValue('');
      setError(null);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  const itemCount = items.length;
  const needsMoreItems = itemCount < 2;

  return (
    <div className="w-full max-w-md flex flex-col gap-6 p-6 bg-white/80 backdrop-blur rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">Set Up Your Wheel</h2>

      {/* Add item input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter an item..."
            accentColor={theme.accentColor}
            aria-label="New item name"
            aria-describedby={error ? 'input-error' : undefined}
          />
          <Button
            onClick={handleAdd}
            accentColor={theme.accentColor}
            buttonTextColor={theme.buttonTextColor}
            disabled={items.length >= MAX_ITEMS}
            aria-label="Add item"
          >
            Add
          </Button>
        </div>
        {error && (
          <p id="input-error" className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
          {needsMoreItems && (
            <span className="text-sm text-amber-600">
              Add {2 - itemCount} more to spin
            </span>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <ItemInput
                key={item.id}
                label={item.label}
                color={theme.colors[index % theme.colors.length]}
                onUpdate={(label) => onUpdateItem(item.id, label)}
                onRemove={() => onRemoveItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Theme selector */}
      <ThemeSelector
        themes={themes}
        currentIndex={themeIndex}
        onSelect={onThemeChange}
      />

      {/* Start button */}
      <Button
        onClick={onStartSpin}
        disabled={!canSpin}
        accentColor={theme.accentColor}
        buttonTextColor={theme.buttonTextColor}
        className="w-full text-lg py-4"
        title={!canSpin ? 'Add at least 2 items to spin' : undefined}
      >
        Start Spinning
      </Button>
    </div>
  );
}
