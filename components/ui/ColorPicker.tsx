'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Persian color names for common colors
const PRESET_COLORS = [
  { hex: '#FF0000', name: 'قرمز' },
  { hex: '#00FF00', name: 'سبز' },
  { hex: '#0000FF', name: 'آبی' },
  { hex: '#FFFF00', name: 'زرد' },
  { hex: '#FF00FF', name: 'بنفش' },
  { hex: '#00FFFF', name: 'فیروزه‌ای' },
  { hex: '#FFA500', name: 'نارنجی' },
  { hex: '#800080', name: 'ارغوانی' },
  { hex: '#FFC0CB', name: 'صورتی' },
  { hex: '#A52A2A', name: 'قهوه‌ای' },
  { hex: '#808080', name: 'خاکستری' },
  { hex: '#000000', name: 'مشکی' },
  { hex: '#FFFFFF', name: 'سفید' },
  { hex: '#8B4513', name: 'قهوه‌ای تیره' },
  { hex: '#4B0082', name: 'نیلی' },
  { hex: '#DC143C', name: 'قرمز کرمزی' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  label,
  description,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update custom color when value changes
  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  const handlePresetColorClick = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  const getColorName = (hex: string): string => {
    const preset = PRESET_COLORS.find(color => 
      color.hex.toLowerCase() === hex.toLowerCase()
    );
    return preset ? preset.name : hex.toUpperCase();
  };

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* Main Color Display & Trigger */}
      <div
        className={`
          relative flex items-center justify-between w-full px-3 py-2 
          border border-gray-300 rounded-md shadow-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${!isValidHex(value) ? 'border-red-300' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {/* Color Preview Square */}
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-md border-2 border-gray-300 shadow-sm flex-shrink-0"
            style={{ backgroundColor: isValidHex(value) ? value : '#CCCCCC' }}
          >
            {!isValidHex(value) && (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                ؟
              </div>
            )}
          </div>
          
          {/* Color Information */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {getColorName(value)}
            </span>
            <span className="text-xs text-gray-500">
              {value.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Description */}
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}

      {/* Validation Error */}
      {!isValidHex(value) && (
        <p className="mt-1 text-xs text-red-600">
          لطفاً کد رنگ معتبر وارد کنید (مثال: #FF0000)
        </p>
      )}

      {/* Dropdown Panel */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          {/* Custom Color Input */}
          <div className="p-3 border-b border-gray-200">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              رنگ سفارشی:
            </label>
            <div className="flex space-x-2">
              <input
                ref={colorInputRef}
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (isValidHex(e.target.value)) {
                    onChange(e.target.value);
                  }
                }}
                placeholder="#FF0000"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                dir="ltr"
              />
            </div>
          </div>

          {/* Preset Colors Grid */}
          <div className="p-3">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              رنگ‌های پیش‌فرض:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => handlePresetColorClick(color.hex)}
                  className={`
                    group relative p-2 rounded-md border-2 transition-all duration-200
                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${value.toLowerCase() === color.hex.toLowerCase() 
                      ? 'border-blue-500 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  title={`${color.name} (${color.hex})`}
                >
                  {/* Color Square */}
                  <div
                    className="w-full h-8 rounded-sm shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  
                  {/* Color Name */}
                  <div className="mt-1 text-xs text-center text-gray-600 group-hover:text-gray-800">
                    {color.name}
                  </div>
                  
                  {/* Selected Indicator */}
                  {value.toLowerCase() === color.hex.toLowerCase() && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Colors (if you want to add this feature) */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              رنگ انتخاب شده: <span className="font-mono">{value.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;