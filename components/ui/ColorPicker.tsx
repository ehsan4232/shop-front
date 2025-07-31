import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
  required?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  className = '',
  required = false
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [colorName, setColorName] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Common colors palette for quick selection
  const commonColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
    '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
    '#FFFFFF', '#E0E0E0', '#C0C0C0', '#A0A0A0', '#808080', '#606060',
    '#404040', '#202020', '#000000', '#8B4513', '#D2691E', '#CD853F'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hexToColorName = (hex: string): string => {
    const colorNames: { [key: string]: string } = {
      '#FF0000': 'قرمز',
      '#00FF00': 'سبز',
      '#0000FF': 'آبی',
      '#FFFF00': 'زرد',
      '#FF8000': 'نارنجی',
      '#8000FF': 'بنفش',
      '#FF00FF': 'صورتی',
      '#00FFFF': 'فیروزه‌ای',
      '#FFFFFF': 'سفید',
      '#000000': 'سیاه',
      '#808080': 'خاکستری',
      '#8B4513': 'قهوه‌ای'
    };
    return colorNames[hex.toUpperCase()] || 'رنگ سفارشی';
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    setColorName(hexToColorName(color));
    setShowPicker(false);
  };

  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    onChange(color);
    setColorName(hexToColorName(color));
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef} dir="rtl">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      {/* Color Display Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <div className="flex items-center">
          <div
            className="w-6 h-6 rounded border border-gray-300 ml-3"
            style={{ backgroundColor: value }}
          />
          <span className="text-right">
            {colorName || hexToColorName(value)}
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          {value}
        </div>
      </button>

      {/* Color Picker Dropdown */}
      {showPicker && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          {/* Color Palette Grid */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رنگ‌های محبوب
            </label>
            <div className="grid grid-cols-6 gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                    value === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={hexToColorName(color)}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انتخاب رنگ دلخواه
            </label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="color"
                value={value}
                onChange={handleCustomColorChange}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
                  if (hexPattern.test(e.target.value)) {
                    onChange(e.target.value);
                    setColorName(hexToColorName(e.target.value));
                  }
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Color Name Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام رنگ (اختیاری)
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="مثال: قرمز آتشین"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 space-x-reverse mt-4">
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              تأیید
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;