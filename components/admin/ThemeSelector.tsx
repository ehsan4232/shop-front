'use client';

import { useState, useEffect } from 'react';
import { 
  SwatchIcon, 
  PaintBrushIcon, 
  PhotoIcon,
  CheckIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface Theme {
  id: string;
  name: string;
  name_fa: string;
  theme_type: string;
  business_category: string;
  preview_image: string;
  primary_color: string;
  secondary_color: string;
  description: string;
  is_premium: boolean;
  rating_average: number;
  usage_count: number;
}

interface ThemeSelectorProps {
  currentTheme?: string;
  businessCategory?: string;
  onThemeSelect: (themeId: string) => void;
  className?: string;
}

export default function ThemeSelector({ 
  currentTheme, 
  businessCategory = 'general',
  onThemeSelect,
  className = '' 
}: ThemeSelectorProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [filterType, setFilterType] = useState('all');
  const [showPreview, setShowPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes();
  }, [businessCategory]);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/themes?category=${businessCategory}`);
      const data = await response.json();
      setThemes(data.themes || []);
    } catch (error) {
      console.error('خطا در دریافت قالب‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeSelect(themeId);
  };

  const filteredThemes = themes.filter(theme => {
    if (filterType === 'all') return true;
    if (filterType === 'free') return !theme.is_premium;
    if (filterType === 'premium') return theme.is_premium;
    return theme.theme_type === filterType;
  });

  const themeTypes = [
    { value: 'all', label: 'همه قالب‌ها' },
    { value: 'modern', label: 'مدرن' },
    { value: 'classic', label: 'کلاسیک' },
    { value: 'minimal', label: 'مینیمال' },
    { value: 'elegant', label: 'شیک' },
    { value: 'colorful', label: 'رنگارنگ' },
    { value: 'free', label: 'رایگان' },
    { value: 'premium', label: 'پریمیوم' },
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`} dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PaintBrushIcon className="w-6 h-6 text-blue-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                انتخاب قالب فروشگاه
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                قالب مناسب برای کسب‌وکار خود را انتخاب کنید
              </p>
            </div>
          </div>
          
          {/* Business Category Badge */}
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            دسته: {businessCategory === 'general' ? 'عمومی' : businessCategory}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {themeTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="p-6">
        {filteredThemes.length === 0 ? (
          <div className="text-center py-12">
            <SwatchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              قالبی یافت نشد
            </h3>
            <p className="text-gray-600">
              فیلترها را تغییر دهید تا قالب‌های بیشتری ببینید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map(theme => (
              <div
                key={theme.id}
                className={`relative border-2 rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {/* Preview Image */}
                <div className="relative h-40 bg-gray-100">
                  {theme.preview_image ? (
                    <img
                      src={theme.preview_image}
                      alt={theme.name_fa}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback gradient preview */}
                  <div 
                    className={`absolute inset-0 ${!theme.preview_image ? '' : 'hidden'}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary_color}, ${theme.secondary_color})`
                    }}
                  />
                  
                  {/* Premium Badge */}
                  {theme.is_premium && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <SparklesIcon className="w-3 h-3 ml-1" />
                      پریمیوم
                    </div>
                  )}
                  
                  {/* Selected Indicator */}
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <CheckIcon className="w-4 h-4" />
                    </div>
                  )}

                  {/* Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(theme.id);
                    }}
                    className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-70 flex items-center"
                  >
                    <PhotoIcon className="w-3 h-3 ml-1" />
                    پیش‌نمایش
                  </button>
                </div>

                {/* Theme Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{theme.name_fa}</h4>
                    <div className="flex items-center">
                      {/* Color Swatches */}
                      <div className="flex space-x-1 space-x-reverse">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: theme.primary_color }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: theme.secondary_color }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                      <span>⭐ {theme.rating_average}</span>
                      <span>{theme.usage_count.toLocaleString('fa-IR')} استفاده</span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      theme.is_premium 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {theme.is_premium ? 'پریمیوم' : 'رایگان'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  پیش‌نمایش قالب: {themes.find(t => t.id === showPreview)?.name_fa}
                </h3>
                <button
                  onClick={() => setShowPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {/* Preview iframe or image */}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`/api/themes/${showPreview}/preview`}
                  className="w-full h-96"
                  title="Theme Preview"
                />
              </div>
              
              <div className="mt-4 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowPreview(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    handleThemeSelect(showPreview);
                    setShowPreview(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  انتخاب این قالب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}