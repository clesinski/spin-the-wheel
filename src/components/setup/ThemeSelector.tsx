'use client';

import { Theme } from '@/types';

interface ThemeSelectorProps {
  themes: Theme[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function ThemeSelector({ themes, currentIndex, onSelect }: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Theme</label>
      <div className="flex gap-2">
        {themes.map((theme, index) => (
          <button
            key={theme.name}
            onClick={() => onSelect(index)}
            className={`group relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400'
                : 'border-gray-300 hover:border-gray-500'
            }`}
            aria-label={`Select ${theme.name} theme`}
            aria-pressed={index === currentIndex}
            title={theme.name}
          >
            {/* Multi-color swatch */}
            <div className="w-full h-full flex">
              {theme.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {theme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
