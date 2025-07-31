import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProductInstanceFormProps {
  productClass: any;
  onSubmit: (data: any, createAnother: boolean) => void;
}

export const ProductInstanceForm: React.FC<ProductInstanceFormProps> = ({ 
  productClass, 
  onSubmit 
}) => {
  const [createAnother, setCreateAnother] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = (data: any) => {
    onSubmit(data, createAnother);
    
    // If creating another instance, reset form but keep some values
    if (createAnother) {
      const preservedValues = {
        product_class: data.product_class,
        category: data.category,
        brand: data.brand,
        // Keep other common fields
      };
      reset(preservedValues);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="توضیحات کاملی از محصول بنویسید..."
          />
        </div>

        {/* Social Media Import Button - Per Product Description */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              واردکردن از شبکه‌های اجتماعی
            </h3>
            <p className="text-gray-600 mb-4">
              5 پست آخر از تلگرام یا اینستاگرام را دریافت کنید
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                📱 دریافت از تلگرام
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
              >
                📷 دریافت از اینستاگرام
              </button>
            </div>
          </div>
        </div>

        {/* Color Attributes - Per Product Description */}
        {productClass.attributes?.filter(attr => attr.data_type === 'color').map((colorAttr) => (
          <div key={colorAttr.id} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {colorAttr.name_fa}
            </label>
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="color"
                {...register(`attributes.${colorAttr.id}.color_hex`)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                {...register(`attributes.${colorAttr.id}.value_text`)}
                placeholder="نام رنگ"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        {/* Create Another Instance Checkbox - Critical Feature */}
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
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {createAnother ? 'ذخیره و ایجاد بعدی' : 'ذخیره محصول'}
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
      // API call to create product instance
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (createAnother) {
          // Show success message but stay on form
          console.log('محصول ایجاد شد. آماده برای محصول بعدی');
        } else {
          // Redirect to product list or detail
          console.log('محصول با موفقیت ایجاد شد');
        }
      }
    } catch (error) {
      console.error('خطا در ایجاد محصول:', error);
    } finally {
      setLoading(false);
    }
  };

  return { submitProduct, loading };
};