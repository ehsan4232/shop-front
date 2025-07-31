'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ColorPicker from './ui/ColorPicker';
import SocialMediaImport from './SocialMediaImport';
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface ProductInstanceFormProps {
  productClass: any;
  onSubmit: (data: any, createAnother: boolean) => void;
  initialData?: any;
}

export const ProductInstanceForm: React.FC<ProductInstanceFormProps> = ({ 
  productClass, 
  onSubmit,
  initialData 
}) => {
  const [createAnother, setCreateAnother] = useState(false);
  const [attributes, setAttributes] = useState<{[key: string]: any}>(initialData?.attributes || {});
  const [socialMediaData, setSocialMediaData] = useState<any>(initialData?.social_media_data || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedProduct, setLastCreatedProduct] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: initialData
  });

  // Watch stock quantity for low stock warning
  const stockQuantity = watch('stock_quantity');
  const showStockWarning = stockQuantity && parseInt(stockQuantity) <= 3;

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Merge form data with attributes and social media data
      const completeData = {
        ...data,
        attributes,
        social_media_data: socialMediaData,
        product_class: productClass.id
      };
      
      await onSubmit(completeData, createAnother);
      setLastCreatedProduct(completeData);
      
      // If creating another instance, reset form but keep some values
      if (createAnother) {
        // Preserve common data for next instance
        const preservedValues = {
          product_class: data.product_class,
          category: data.category,
          brand: data.brand,
          description: data.description, // Keep description by default
          base_price: data.base_price,   // Keep pricing info
          compare_price: data.compare_price,
          // Reset instance-specific fields
          name_fa: '',
          name: '',
          stock_quantity: '',
          sku: ''
        };
        
        reset(preservedValues);
        
        // Keep non-instance-specific attributes
        const preservedAttributes = {};
        Object.keys(attributes).forEach(key => {
          const attr = productClass.attributes?.find(a => a.id.toString() === key);
          if (attr && !attr.is_instance_specific) {
            preservedAttributes[key] = attributes[key];
          }
        });
        setAttributes(preservedAttributes);
        
        // Keep social media data for reuse
        // setSocialMediaData(null); // Comment this to keep social data
        
        // Focus on first field for quick entry
        setTimeout(() => {
          const firstInput = document.querySelector('input[name="name_fa"]') as HTMLInputElement;
          if (firstInput) firstInput.focus();
        }, 100);
      }
    } catch (error) {
      console.error('خطا در ایجاد محصول:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttributeChange = (attributeId: string, value: any) => {
    setAttributes(prev => ({
      ...prev,
      [attributeId]: value
    }));
  };

  const handleSocialMediaImport = (importedData: any) => {
    setSocialMediaData(importedData);
    
    // Auto-fill form fields with imported content
    if (importedData.selectedTexts && importedData.selectedTexts.length > 0) {
      // Use first text as description
      const description = importedData.selectedTexts[0];
      setValue('description', description);
    }
    
    // Extract hashtags for name suggestions
    if (importedData.selectedTexts && importedData.selectedTexts.length > 0) {
      const text = importedData.selectedTexts[0];
      const hashtags = text.match(/#[\u0600-\u06FF\w]+/g);
      if (hashtags && hashtags.length > 0) {
        const suggestedName = hashtags[0].replace('#', '');
        setValue('name_fa', suggestedName);
      }
    }
    
    // Show success message
    const totalImported = (importedData.selectedTexts?.length || 0) + 
                         (importedData.selectedImages?.length || 0) + 
                         (importedData.selectedVideos?.length || 0);
    
    if (totalImported > 0) {
      // You could show a toast notification here
      console.log(`${totalImported} مورد از شبکه اجتماعی وارد شد`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <DocumentDuplicateIcon className="w-6 h-6 ml-2" />
          ایجاد محصول جدید
        </h2>
        <p className="text-gray-600 mt-2">
          کلاس محصول: {productClass.name_fa}
        </p>
        {lastCreatedProduct && createAnother && (
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircleIcon className="w-4 h-4 ml-1" />
            محصول قبلی با موفقیت ایجاد شد
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام محصول (فارسی) *
            </label>
            <input
              type="text"
              {...register('name_fa', { required: 'نام فارسی الزامی است' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: تی‌شرت آدیداس زرد"
            />
            {errors.name_fa && (
              <p className="text-red-500 text-sm mt-1">{errors.name_fa.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام محصول (انگلیسی)
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Example: Adidas Yellow T-shirt"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت پایه (تومان)
            </label>
            <input
              type="number"
              {...register('base_price')}
              placeholder={`قیمت وراثتی: ${productClass.effective_price || 0}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              در صورت خالی ماندن، قیمت از کلاس والد به ارث می‌رسد
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت قبل از تخفیف (تومان)
            </label>
            <input
              type="number"
              {...register('compare_price')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موجودی انبار *
            </label>
            <input
              type="number"
              {...register('stock_quantity', { 
                required: 'موجودی انبار الزامی است',
                min: { value: 0, message: 'موجودی نمی‌تواند منفی باشد' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                showStockWarning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
              }`}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
            )}
            {/* Stock Warning Display - Per Product Description */}
            {showStockWarning && (
              <div className="mt-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                ⚠️ هشدار: موجودی کم! این مقدار به مشتریان نمایش داده می‌شود
              </div>
            )}
          </div>
        </div>

        {/* Description with Social Media Import */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              توضیحات محصول
            </label>
            {/* Social Media Import Button - Per Product Description Requirement */}
            <SocialMediaImport 
              onImport={handleSocialMediaImport}
              trigger={
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  📱 وارد کردن از شبکه اجتماعی
                </button>
              }
            />
          </div>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="توضیحات کاملی از محصول بنویسید یا از شبکه اجتماعی وارد کنید..."
          />
        </div>

        {/* Show imported social media data */}
        {socialMediaData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">محتوای وارد شده از شبکه اجتماعی:</h4>
            <div className="text-sm text-green-700 space-y-1">
              {socialMediaData.selectedTexts?.length > 0 && (
                <div>• {socialMediaData.selectedTexts.length} متن</div>
              )}
              {socialMediaData.selectedImages?.length > 0 && (
                <div>• {socialMediaData.selectedImages.length} تصویر</div>
              )}
              {socialMediaData.selectedVideos?.length > 0 && (
                <div>• {socialMediaData.selectedVideos.length} ویدیو</div>
              )}
            </div>
          </div>
        )}

        {/* Product Attributes */}
        {productClass.attributes && productClass.attributes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">ویژگی‌های محصول</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productClass.attributes.map((attr) => (
                <div key={attr.id} className="space-y-2">
                  {attr.data_type === 'color' ? (
                    // ENHANCED: Use ColorPicker component for color attributes
                    <ColorPicker
                      label={attr.name_fa + (attr.is_required ? ' *' : '')}
                      value={attributes[attr.id] || attr.default_value || '#000000'}
                      onChange={(color) => handleAttributeChange(attr.id, color)}
                      description={`رنگ ${productClass.name_fa}`}
                      required={attr.is_required}
                    />
                  ) : attr.data_type === 'size' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {attr.name_fa} {attr.is_required && '*'}
                      </label>
                      <select
                        value={attributes[attr.id] || ''}
                        onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required={attr.is_required}
                      >
                        <option value="">انتخاب سایز</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>
                  ) : attr.data_type === 'number' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {attr.name_fa} {attr.is_required && '*'}
                      </label>
                      <input
                        type="number"
                        value={attributes[attr.id] || ''}
                        onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                        placeholder={attr.default_value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required={attr.is_required}
                      />
                    </div>
                  ) : attr.data_type === 'boolean' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`attr_${attr.id}`}
                        checked={attributes[attr.id] || false}
                        onChange={(e) => handleAttributeChange(attr.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`attr_${attr.id}`} className="mr-3 text-sm text-gray-700">
                        {attr.name_fa} {attr.is_required && '*'}
                      </label>
                    </div>
                  ) : (
                    // Default text input for other types
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {attr.name_fa} {attr.is_required && '*'}
                      </label>
                      <input
                        type="text"
                        value={attributes[attr.id] || ''}
                        onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                        placeholder={attr.default_value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required={attr.is_required}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Another Instance Checkbox - CRITICAL FEATURE PER PRODUCT DESCRIPTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="createAnother"
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <div className="mr-3">
              <label htmlFor="createAnother" className="text-sm font-medium text-blue-800">
                ✨ ایجاد محصول دیگری با همین اطلاعات پس از ذخیره
              </label>
              <p className="text-xs text-blue-600 mt-1">
                این گزینه برای ایجاد محصولات مشابه (مثل تی‌شرت‌های مختلف با رنگ‌های متفاوت) مفید است. 
                پس از ذخیره، فرم تمیز می‌شود اما اطلاعات مشترک حفظ می‌شوند.
              </p>
              {createAnother && (
                <div className="mt-2 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  💡 نکته: پس از ذخیره، فقط نام محصول، موجودی و سایر اطلاعات منحصربه‌فرد پاک می‌شوند
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال ذخیره...
              </span>
            ) : createAnother ? (
              '💾 ذخیره و ایجاد بعدی'
            ) : (
              '💾 ذخیره محصول'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Hook for handling form submission
export const useProductInstanceForm = () => {
  const [loading, setLoading] = useState(false);

  const submitProduct = async (data: any, createAnother: boolean) => {
    setLoading(true);
    try {
      // Enhanced API call with proper error handling
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (createAnother) {
          // Show success message but stay on form
          console.log('محصول ایجاد شد. آماده برای محصول بعدی');
          // You could trigger a toast notification here
        } else {
          // Redirect to product list or detail
          console.log('محصول با موفقیت ایجاد شد');
          // window.location.href = `/admin/products/${result.id}`;
        }
        
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'خطا در ایجاد محصول');
      }
    } catch (error) {
      console.error('خطا در ایجاد محصول:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitProduct, loading };
};

export default ProductInstanceForm;