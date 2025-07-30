'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value, 
  onChange, 
  label, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Common colors for quick selection
  const commonColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#000000', '#FFFFFF', '#808080', '#800000', '#008000', '#000080',
    '#FFA500', '#800080', '#008080', '#C0C0C0', '#808000', '#FF1493'
  ];
  
  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };
  
  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Color Preview and Input */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="relative w-12 h-12 border-2 border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="انتخاب رنگ"
        >
          {/* Checkerboard pattern for transparency */}
          <div className="absolute inset-0 bg-checkerboard rounded-lg"></div>
          <div 
            className="absolute inset-0 rounded-lg"
            style={{ backgroundColor: value }}
          ></div>
        </button>
        
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue === '' || isValidHex(newValue)) {
              handleColorChange(newValue);
            }
          }}
          placeholder="#000000"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          dir="ltr"
        />
      </div>
      
      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="space-y-4">
            {/* Advanced Color Picker */}
            <HexColorPicker 
              color={value} 
              onChange={handleColorChange}
            />
            
            {/* Quick Color Selection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">رنگ‌های پیش‌فرض</p>
              <div className="grid grid-cols-6 gap-2">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 border border-gray-300 rounded hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`انتخاب رنگ ${color}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              بستن
            </button>
          </div>
        </div>
      )}
      
      {/* Common Colors Grid */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">رنگ‌های متداول</p>
        <div className="grid grid-cols-9 gap-2">
          {commonColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 border-2 rounded-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                value === color ? 'border-blue-500' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              aria-label={`انتخاب رنگ ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

// CSS for checkerboard pattern (add to globals.css)
/*
.bg-checkerboard {
  background-image: 
    linear-gradient(45deg, #ccc 25%, transparent 25%), 
    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #ccc 75%), 
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
*/