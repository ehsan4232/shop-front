/**
 * Color Picker Component for Product Attributes
 * Addresses product description requirement: "Color fields must be presented with colorpads"
 */

'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  presetColors?: string[];
}

const DEFAULT_PRESET_COLORS = [
  '#FF0000', // قرمز
  '#00FF00', // سبز
  '#0000FF', // آبی
  '#FFFF00', // زرد
  '#FF00FF', // بنفش
  '#00FFFF', // آبی روشن
  '#FFA500', // نارنجی
  '#800080', // بنفش تیره
  '#FFC0CB', // صورتی
  '#A52A2A', // قهوه‌ای
  '#808080', // خاکستری
  '#000000', // مشکی
  '#FFFFFF', // سفید
];

export function ColorPicker({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  presetColors = DEFAULT_PRESET_COLORS
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#000000');

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {/* Preset Color Options */}
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            disabled={disabled}
            onClick={() => handleColorSelect(color)}
            className={`
              w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110
              ${value === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ backgroundColor: color }}
            title={`انتخاب رنگ ${color}`}
          />
        ))}
        
        {/* Custom Color Picker Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-8 h-8 rounded border-2 border-dashed border-gray-400 flex items-center justify-center
            transition-all duration-200 hover:border-gray-600
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title="انتخاب رنگ سفارشی"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Selected Color Display */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm text-gray-700 font-mono">{value}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-red-500 hover:text-red-700 text-sm"
              title="حذف رنگ"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Custom Color Picker Modal */}
      {isOpen && !disabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">انتخاب رنگ سفارشی</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <HexColorPicker 
                color={customColor} 
                onChange={handleCustomColorChange}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                  placeholder="#000000"
                />
                <div
                  className="w-10 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: customColor }}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleColorSelect(customColor)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  انتخاب
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;