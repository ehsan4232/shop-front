'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  label,
  placeholder = '#000000',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Apply the temporary value when closing
        if (tempValue !== value) {
          onChange(tempValue);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, tempValue, value, onChange]);

  // Update temp value when prop value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setTempValue(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure valid hex format when input loses focus
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tempValue)) {
      setTempValue(value);
    } else {
      onChange(tempValue);
    }
  };

  const handleColorSquareClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleApplyColor = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  const handleCancelColor = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  const isValidColor = (color: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        {/* Color Preview Square */}
        <button
          type="button"
          onClick={handleColorSquareClick}
          disabled={disabled}
          className={`
            w-10 h-10 rounded-md border-2 border-gray-300 shadow-sm transition-all duration-200
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400 hover:shadow-md'}
            ${isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
          `}
          style={{ 
            backgroundColor: isValidColor(tempValue) ? tempValue : '#ffffff',
            backgroundImage: !isValidColor(tempValue) ? 
              'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 8px 8px' : 'none'
          }}
          title={isValidColor(tempValue) ? tempValue : 'رنگ نامعتبر'}
        >
          {!isValidColor(tempValue) && (
            <Palette className="w-5 h-5 text-gray-500 mx-auto" />
          )}
        </button>

        {/* Hex Input */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${!isValidColor(tempValue) && tempValue ? 'border-red-300 text-red-600' : ''}
            `}
            dir="ltr"
          />
          {!isValidColor(tempValue) && tempValue && (
            <p className="text-xs text-red-600 mt-1">فرمت رنگ نامعتبر است</p>
          )}
        </div>
      </div>

      {/* Color Picker Popover */}
      {isOpen && !disabled && (
        <div 
          ref={popoverRef}
          className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
          style={{ minWidth: '280px' }}
        >
          {/* Color Picker */}
          <div className="mb-4">
            <HexColorPicker 
              color={tempValue} 
              onChange={handleColorChange}
              style={{ width: '100%', height: '200px' }}
            />
          </div>

          {/* Preset Colors */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">رنگ‌های پیش‌فرض</p>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                '#800000', '#808080', '#800080', '#008000', '#000080', '#808000', '#ff8000', '#ff0080'
              ].map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => handleColorChange(presetColor)}
                  className={`
                    w-8 h-8 rounded border-2 hover:scale-110 transition-transform duration-200
                    ${tempValue.toLowerCase() === presetColor.toLowerCase() ? 'border-blue-500' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>

          {/* Current Selection Display */}
          <div className="mb-4 p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: tempValue }}
              />
              <span className="text-sm font-mono text-gray-700">{tempValue}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelColor}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              لغو
            </button>
            <button
              type="button"
              onClick={handleApplyColor}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              اعمال
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;