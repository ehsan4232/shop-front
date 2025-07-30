/**
 * Product Instance Creation Form
 * Addresses product description requirement: "checkbox for creating another instance with same info"
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ColorPicker from '../ui/ColorPicker';

// Form validation schema
const productInstanceSchema = z.object({
  sku: z.string().min(1, 'کد محصول الزامی است'),
  price: z.number().min(0, 'قیمت باید مثبت باشد'),
  comparePrice: z.number().optional(),
  stockQuantity: z.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  attributes: z.record(z.string()),
  createAnother: z.boolean().default(false) // The critical checkbox from product description
});

type ProductInstanceFormData = z.infer<typeof productInstanceSchema>;

interface ProductInstanceFormProps {
  productId: string;
  availableAttributes: Array<{
    id: string;
    name: string;
    name_fa: string;
    type: 'text' | 'color' | 'size' | 'number' | 'choice';
    required: boolean;
    choices?: string[];
  }>;
  onSubmit: (data: ProductInstanceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ProductInstanceFormData>;
}

export function ProductInstanceForm({
  productId,
  availableAttributes,
  onSubmit,
  onCancel,
  initialData
}: ProductInstanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldCreateAnother, setShouldCreateAnother] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProductInstanceFormData>({
    resolver: zodResolver(productInstanceSchema),
    defaultValues: {
      sku: initialData?.sku || '',
      price: initialData?.price || 0,
      comparePrice: initialData?.comparePrice || undefined,
      stockQuantity: initialData?.stockQuantity || 0,
      attributes: initialData?.attributes || {},
      createAnother: false
    }
  });

  const formData = watch();

  const handleFormSubmit = async (data: ProductInstanceFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      
      // If "Create Another" is checked, reset form with same data but new SKU
      if (data.createAnother) {
        const resetData = {
          ...data,
          sku: generateNewSku(data.sku),
          createAnother: false
        };
        reset(resetData);
        setShouldCreateAnother(false);
      }
    } catch (error) {
      console.error('Failed to create product instance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNewSku = (currentSku: string): string => {
    const timestamp = Date.now().toString().slice(-4);
    const baseSku = currentSku.replace(/-\d+$/, ''); // Remove existing suffix
    return `${baseSku}-${timestamp}`;
  };

  const renderAttributeField = (attribute: any) => {
    const fieldName = `attributes.${attribute.id}`;
    const currentValue = formData.attributes[attribute.id] || '';

    switch (attribute.type) {
      case 'color':
        return (
          <ColorPicker
            value={currentValue}
            onChange={(color) => setValue(fieldName, color)}
            label={attribute.name_fa}
            required={attribute.required}
          />
        );

      case 'choice':
        return (
          <select
            {...register(fieldName)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={attribute.required}
          >
            <option value="">انتخاب کنید...</option>
            {attribute.choices?.map((choice: string) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            {...register(fieldName, { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={attribute.required}
          />
        );

      default:
        return (
          <input
            type="text"
            {...register(fieldName)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={attribute.required}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ایجاد نمونه محصول جدید
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد محصول (SKU) *
            </label>
            <input
              type="text"
              {...register('sku')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: PROD-001"
            />
            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              موجودی انبار *
            </label>
            <input
              type="number"
              {...register('stockQuantity', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              قیمت (تومان) *
            </label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              قیمت قبل از تخفیف (تومان)
            </label>
            <input
              type="number"
              {...register('comparePrice', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Product Attributes */}
        {availableAttributes.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ویژگی‌های محصول</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableAttributes.map((attribute) => (
                <div key={attribute.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {attribute.name_fa}
                    {attribute.required && <span className="text-red-500 mr-1">*</span>}
                  </label>
                  {renderAttributeField(attribute)}
                  {errors.attributes?.[attribute.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.attributes[attribute.id]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Warning Display */}
        {formData.stockQuantity < 3 && formData.stockQuantity > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  هشدار موجودی کم
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    موجودی این محصول کمتر از ۳ عدد است. این هشدار به مشتریان نمایش داده خواهد شد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* The Critical Checkbox from Product Description */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('createAnother')}
              id="createAnother"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={(e) => setShouldCreateAnother(e.target.checked)}
            />
            <label htmlFor="createAnother" className="mr-2 block text-sm text-gray-900">
              ایجاد نمونه دیگری با همین اطلاعات پس از ذخیره
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            با فعال کردن این گزینه، پس از ذخیره این نمونه، فرم با همین اطلاعات برای ایجاد نمونه بعدی آماده می‌شود
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ذخیره...
              </>
            ) : (
              shouldCreateAnother ? 'ذخیره و ایجاد بعدی' : 'ذخیره'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductInstanceForm;