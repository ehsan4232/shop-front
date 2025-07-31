import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ColorPicker from './ui/ColorPicker';
import SocialMediaImport from './SocialMediaImport';
import apiClient from '@/lib/api';

interface ProductInstanceFormProps {
  productClass: any;
  onSubmit: (data: any, createAnother: boolean) => void;
}

export const ProductInstanceForm: React.FC<ProductInstanceFormProps> = ({ 
  productClass, 
  onSubmit 
}) => {
  const [createAnother, setCreateAnother] = useState(false);
  const [attributes, setAttributes] = useState<{[key: string]: any}>({});
  const [socialMediaData, setSocialMediaData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Merge form data with attributes and social media data
      const completeData = {
        ...data,
        attributes,
        social_media_data: socialMediaData
      };
      
      await onSubmit(completeData, createAnother);
      
      // If creating another instance, reset form but keep some values
      if (createAnother) {
        const preservedValues = {
          product_class: data.product_class,
          category: data.category,
          brand: data.brand,
          // Keep other common fields
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
        setSocialMediaData(null);
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
    
    // If there are images, we could set them as product images
    // This would require additional handling in the backend
    if (importedData.selectedImages && importedData.selectedImages.length > 0) {
      console.log('Imported images:', importedData.selectedImages);
      // Could trigger image upload process here
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          ایجاد محصول جدید
        </h2>
        <p className="text-gray-600 mt-2">
          کلاس محصول: {productClass.name_fa}
        </p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-left"
              dir="ltr"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات محصول
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
            placeholder="توضیحات کاملی از محصول بنویسید..."
          />
        </div>

        {/* Social Media Import - Per Product Description Requirement */}
        <SocialMediaImport 
          onImport={handleSocialMediaImport}
          className="mb-6"
        />

        {/* Show imported social media data */}
        {socialMediaData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
            {productClass.attributes.map((attr) => (
              <div key={attr.id} className="space-y-2">
                {attr.data_type === 'color' ? (
                  // Use ColorPicker component for color attributes
                  <ColorPicker
                    label={attr.name_fa + (attr.is_required ? ' *' : '')}
                    value={attributes[attr.id] || attr.default_value || '#000000'}
                    onChange={(color) => handleAttributeChange(attr.id, color)}
                    className="w-full"
                  />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-right"
                      required={attr.is_required}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Another Instance Checkbox - Critical Feature Per Product Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="createAnother"
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="createAnother" className="mr-3 text-sm text-gray-700">
              ایجاد محصول دیگری با همین اطلاعات پس از ذخیره
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            برای ایجاد محصولات مشابه، این گزینه را فعال کنید تا فرایند سریع‌تر شود
          </p>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                در حال ذخیره...
              </div>
            ) : (
              createAnother ? 'ذخیره و ایجاد بعدی' : 'ذخیره محصول'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Hook for handling form submission with proper API integration
export const useProductInstanceForm = () => {
  const [loading, setLoading] = useState(false);

  const submitProduct = async (data: any, createAnother: boolean) => {
    setLoading(true);
    try {
      const response = await apiClient.createProduct(data);
      
      if (createAnother) {
        // Show success message but stay on form
        console.log('محصول ایجاد شد. آماده برای محصول بعدی');
      } else {
        // Redirect to product list or detail
        console.log('محصول با موفقیت ایجاد شد');
      }
      
      return response;
    } catch (error) {
      console.error('خطا در ایجاد محصول:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitProduct, loading };
};