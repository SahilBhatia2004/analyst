import React from 'react';
import { X } from 'lucide-react';

const ColorGrid = ({ currentTheme, onThemeChange, onClose }) => {
  const colorThemes = [
    {
      name: 'Dark Green (Default)',
      background: '#0a0a0a',
      cardBackground: '#1a1a1a',
      border: '#2a2a2a',
      accent: '#22c55e',
      chartColor: '#4ade80',
    },
    {
      name: 'Dark Blue',
      background: '#0a0f1a',
      cardBackground: '#1a1f2e',
      border: '#2a3f5f',
      accent: '#3b82f6',
      chartColor: '#60a5fa',
    },
    {
      name: 'Dark Purple',
      background: '#0f0a1a',
      cardBackground: '#1f1a2e',
      border: '#3f2a5f',
      accent: '#a855f7',
      chartColor: '#c084fc',
    },
    {
      name: 'Dark Red',
      background: '#1a0a0a',
      cardBackground: '#2e1a1a',
      border: '#5f2a2a',
      accent: '#ef4444',
      chartColor: '#f87171',
    },
    {
      name: 'Dark Cyan',
      background: '#0a1a1a',
      cardBackground: '#1a2e2e',
      border: '#2a5f5f',
      accent: '#06b6d4',
      chartColor: '#22d3ee',
    },
    {
      name: 'Dark Orange',
      background: '#1a0f0a',
      cardBackground: '#2e1f1a',
      border: '#5f3f2a',
      accent: '#f97316',
      chartColor: '#fb923c',
    },
    {
      name: 'Dark Pink',
      background: '#1a0a1a',
      cardBackground: '#2e1a2e',
      border: '#5f2a5f',
      accent: '#ec4899',
      chartColor: '#f472b6',
    },
    {
      name: 'Dark Teal',
      background: '#0a1a14',
      cardBackground: '#1a2e24',
      border: '#2a5f44',
      accent: '#14b8a6',
      chartColor: '#2dd4bf',
    },
    {
      name: 'Midnight',
      background: '#050505',
      cardBackground: '#0f0f0f',
      border: '#1f1f1f',
      accent: '#22c55e',
      chartColor: '#4ade80',
    },
    {
      name: 'Charcoal',
      background: '#1a1a1a',
      cardBackground: '#2a2a2a',
      border: '#3a3a3a',
      accent: '#22c55e',
      chartColor: '#4ade80',
    },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Color Themes</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {colorThemes.map((theme, index) => (
          <button
            key={index}
            onClick={() => onThemeChange(theme)}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
              currentTheme.name === theme.name
                ? 'border-green-500'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: theme.cardBackground }}
          >
            <div className="flex gap-1 mb-2">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: theme.background }}
                title="Background"
              />
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: theme.cardBackground }}
                title="Card Background"
              />
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: theme.accent }}
                title="Accent"
              />
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: theme.chartColor }}
                title="Chart Color"
              />
            </div>
            <p className="text-xs text-white font-medium">{theme.name}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong className="text-white">Note:</strong> Each theme includes a custom chart color optimized for visibility.
          Chart backgrounds remain dark for optimal readability.
        </p>
      </div>
    </div>
  );
};

export default ColorGrid;
