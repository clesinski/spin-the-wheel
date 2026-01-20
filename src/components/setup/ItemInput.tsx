'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ItemInputProps {
  label: string;
  color: string;
  onUpdate: (label: string) => void;
  onRemove: () => void;
}

export function ItemInput({ label, color, onUpdate, onRemove }: ItemInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onUpdate(trimmed);
    } else {
      setEditValue(label); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm border border-gray-200">
      {/* Color indicator */}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Label or input */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          aria-label="Edit item label"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 text-left text-gray-800 hover:text-gray-600 truncate"
          aria-label={`Edit ${label}`}
        >
          {label}
        </button>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={`Remove ${label}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
