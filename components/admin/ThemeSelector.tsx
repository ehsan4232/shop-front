import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import apiClient from '@/lib/api';

interface Theme {
  id: string;
  name_fa: string;
  description: string;
  theme_type: string;
  layout_type: string;
  color_scheme: string;
  preview_image: string;
  thumbnail: string;
  demo_url: string;
  is_premium: boolean;
  price: number;
  usage_count: number;
  rating_average: number;
  rating_count: number;
  suggested_for_types: string[];
}

interface ThemePreviewProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (theme: Theme) => void;
  onPreview: (theme: Theme) => void;
  onApply: (theme: Theme) => void;
  isApplying?: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  theme,
  isSelected,
  onSelect,
  onPreview,
  onApply,
  isApplying = false
}) => {
  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Premium Badge */}
      {theme.is_premium && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            پریمیام
          </span>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10">
          <CheckCircleIcon className="w-6 h-6 text-blue-600 bg-white rounded-full" />
        </div>
      )}

      {/* Theme Preview Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onSelect(theme)}>
        {theme.preview_image ? (
          <img
            src={theme.preview_image}
            alt={theme.name_fa}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-500 text-sm">پیش‌نمایش در دسترس نیست</span>
          </div>
        )}
      </div>

      {/* Theme Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex-1">{theme.name_fa}</h3>
          {theme.price > 0 && (
            <span className="text-sm font-medium text-green-600 mr-2">
              {theme.price.toLocaleString()} تومان
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {theme.description}
        </p>

        {/* Theme Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 ml-1" />
            <span>{theme.rating_average.toFixed(1)}</span>
            <span className="mr-1">({theme.rating_count})</span>
          </div>
          <span>{theme.usage_count} استفاده</span>
        </div>

        {/* Theme Type Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {theme.theme_type}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {theme.layout_type}
          </span>
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {theme.color_scheme}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {theme.demo_url && (
            <button
              onClick={() => onPreview(theme)}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              پیش‌نمایش
            </button>
          )}
          <button
            onClick={() => onApply(theme)}
            disabled={isApplying}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplying ? 'در حال اعمال...' : 'اعمال قالب'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ThemeSelectorProps {
  storeId: string;
  currentThemeId?: string;
  businessType?: string;
  onThemeApplied: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  storeId,
  currentThemeId,
  businessType,
  onThemeApplied
}) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [applyingTheme, setApplyingTheme] = useState<string | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLayout, setFilterLayout] = useState<string>('all');
  const [filterPremium, setFilterPremium] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [themes, filterType, filterLayout, filterPremium, sortBy, businessType]);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/themes/');
      setThemes(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت قالب‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...themes];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(theme => theme.theme_type === filterType);
    }

    // Filter by layout
    if (filterLayout !== 'all') {
      filtered = filtered.filter(theme => theme.layout_type === filterLayout);
    }

    // Filter by premium status
    if (filterPremium === 'free') {
      filtered = filtered.filter(theme => !theme.is_premium);
    } else if (filterPremium === 'premium') {
      filtered = filtered.filter(theme => theme.is_premium);
    }

    // Business type suggestions
    if (businessType) {
      const suggested = filtered.filter(theme => 
        theme.suggested_for_types.includes(businessType)
      );
      const others = filtered.filter(theme => 
        !theme.suggested_for_types.includes(businessType)
      );
      filtered = [...suggested, ...others];
    }

    // Sort themes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usage_count - a.usage_count;
        case 'rating':
          return b.rating_average - a.rating_average;
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredThemes(filtered);
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleThemePreview = (theme: Theme) => {
    if (theme.demo_url) {
      window.open(theme.demo_url, '_blank');
    }
  };

  const handleThemeApply = async (theme: Theme) => {
    try {
      setApplyingTheme(theme.id);
      
      const response = await apiClient.post(`/stores/${storeId}/apply-theme/`, {
        theme_id: theme.id,
        custom_options: {} // Could include customization options
      });

      onThemeApplied(theme);
      
      // Show success message
      alert(`قالب "${theme.name_fa}" با موفقیت اعمال شد!`);
      
    } catch (error: any) {
      console.error('خطا در اعمال قالب:', error);
      const errorMessage = error.response?.data?.error || 'خطا در اعمال قالب';
      alert(errorMessage);
    } finally {
      setApplyingTheme(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3">در حال بارگذاری قالب‌ها...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">انتخاب قالب</h2>
        <div className="text-sm text-gray-600">
          {filteredThemes.length} قالب موجود
        </div>
      </div>

      {/* Business Type Suggestion */}
      {businessType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">پیشنهاد ویژه برای {businessType}</h3>
          <p className="text-sm text-blue-700">
            قالب‌های زیر به طور خاص برای نوع کسب‌وکار شما طراحی شده‌اند.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع قالب</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">همه</option>
              <option value="minimal">مینیمال</option>
              <option value="modern">مدرن</option>
              <option value="classic">کلاسیک</option>
              <option value="elegant">شیک</option>
              <option value="bold">پررنگ</option>
              <option value="business">تجاری</option>
              <option value="creative">خلاقانه</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">چیدمان</label>
            <select
              value={filterLayout}
              onChange={(e) => setFilterLayout(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">همه</option>
              <option value="grid">شبکه‌ای</option>
              <option value="list">لیستی</option>
              <option value="masonry">آجری</option>
              <option value="carousel">کاروسل</option>
              <option value="magazine">مجله‌ای</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع قالب</label>
            <select
              value={filterPremium}
              onChange={(e) => setFilterPremium(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="all">همه</option>
              <option value="free">رایگان</option>
              <option value="premium">پریمیام</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مرتب‌سازی</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="popular">محبوب‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
              <option value="newest">جدیدترین</option>
              <option value="price_low">قیمت: کم به زیاد</option>
              <option value="price_high">قیمت: زیاد به کم</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType('all');
                setFilterLayout('all');
                setFilterPremium('all');
                setSortBy('popular');
              }}
              className="w-full bg-gray-200 text-gray-700 p-2 rounded text-sm hover:bg-gray-300"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme?.id === theme.id}
            onSelect={handleThemeSelect}
            onPreview={handleThemePreview}
            onApply={handleThemeApply}
            isApplying={applyingTheme === theme.id}
          />
        ))}
      </div>

      {/* No themes message */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">قالبی با این فیلترها یافت نشد</div>
          <p className="text-gray-400">لطفاً فیلترهای خود را تغییر دهید.</p>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;