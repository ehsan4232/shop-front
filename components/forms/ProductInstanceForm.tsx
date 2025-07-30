'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import ColorPicker from '../ui/ColorPicker';

// Validation schema
const productInstanceSchema = z.object({
  sku: z.string().min(1, 'کد محصول الزامی است'),
  price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  stock_quantity: z.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  weight: z.number().optional(),
  attributes: z.record(z.any()).optional(),
});

type ProductInstanceFormData = z.infer<typeof productInstanceSchema>;

interface ProductInstanceFormProps {
  productId: string;
  productClass: {
    id: string;
    name: string;
    attributes: Array<{
      id: string;
      name: string;
      type: 'text' | 'color' | 'size' | 'number' | 'choice';
      required: boolean;
      choices?: string[];
    }>;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ProductInstanceForm: React.FC<ProductInstanceFormProps> = ({
  productId,
  productClass,
  onSuccess,
  onCancel
}) => {
  const [createAnother, setCreateAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attributeValues, setAttributeValues] = useState<Record<string, any>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm<ProductInstanceFormData>({
    resolver: zodResolver(productInstanceSchema),
    defaultValues: {
      sku: '',
      price: 0,
      stock_quantity: 1,
      attributes: {}
    }
  });

  const handleAttributeChange = (attributeId: string, value: any) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }));
    setValue(`attributes.${attributeId}`, value);
  };

  const renderAttributeField = (attribute: any) => {
    const value = attributeValues[attribute.id] || '';
    
    switch (attribute.type) {
      case 'color':
        return (
          <ColorPicker
            key={attribute.id}
            label={attribute.name}
            value={value}
            onChange={(color) => handleAttributeChange(attribute.id, color)}
          />
        );
      
      case 'choice':
        return (
          <div key={attribute.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {attribute.name}
              {attribute.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={attribute.required}
            >
              <option value="">انتخاب کنید</option>
              {attribute.choices?.map((choice: string) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'number':
        return (
          <div key={attribute.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {attribute.name}
              {attribute.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleAttributeChange(attribute.id, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={attribute.required}
              step="0.01"
            />
          </div>
        );
      
      default: // text
        return (
          <div key={attribute.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {attribute.name}
              {attribute.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={attribute.required}
            />
          </div>
        );
    }
  };

  const onSubmit = async (data: ProductInstanceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Combine form data with attributes
      const instanceData = {
        ...data,
        product: productId,
        attributes: attributeValues
      };

      // API call to create product instance
      const response = await fetch(`/api/products/${productId}/instances/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instanceData)
      });

      if (!response.ok) {
        throw new Error('خطا در ایجاد نمونه محصول');
      }

      const result = await response.json();
      
      toast.success('نمونه محصول با موفقیت ایجاد شد');

      if (createAnother) {
        // Reset only instance-specific fields, keep attribute values
        reset({
          sku: '',
          price: data.price, // Keep price
          stock_quantity: 1, // Reset stock to 1
          weight: data.weight, // Keep weight
          attributes: attributeValues // Keep attributes
        });
        
        // Keep attribute values but reset stock-related fields
        toast.success('آماده برای ایجاد نمونه بعدی');
      } else {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating product instance:', error);
      toast.error('خطا در ایجاد نمونه محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        ایجاد نمونه محصول - {productClass.name}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کد محصول (SKU) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('sku')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: SHIRT-RED-XL-001"
            />
            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت (تومان) <span className="text-red-500">*</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موجودی انبار <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('stock_quantity', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وزن (گرم)
            </label>
            <input
              type="number"
              {...register('weight', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Product Attributes */}
        {productClass.attributes && productClass.attributes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">ویژگی‌های محصول</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productClass.attributes.map(renderAttributeField)}
            </div>
          </div>
        )}

        {/* Create Another Checkbox - REQUIRED BY PRODUCT DESCRIPTION */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse">
            <input
              type="checkbox"
              id="createAnother"
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="createAnother" className="text-sm text-gray-700 cursor-pointer">
              ایجاد نمونه دیگر با همین اطلاعات
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            با فعال کردن این گزینه، فرم پس از ذخیره پاک نخواهد شد و می‌توانید نمونه دیگری با اطلاعات مشابه ایجاد کنید
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 space-x-reverse pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              انصراف
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال ذخیره...
              </span>
            ) : (
              createAnother ? 'ذخیره و ایجاد دیگری' : 'ذخیره نمونه محصول'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInstanceForm;