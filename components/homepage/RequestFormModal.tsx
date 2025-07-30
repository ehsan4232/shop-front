'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Send, Store, Package, Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Validation schema
const requestFormSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره تلفن معتبر وارد کنید'),
  email: z.string().email('ایمیل معتبر وارد کنید').optional().or(z.literal('')),
  business_name: z.string().min(2, 'نام کسب‌وکار الزامی است'),
  business_type: z.string().min(1, 'نوع کسب‌وکار را انتخاب کنید'),
  current_platform: z.string().optional(),
  expected_products: z.string().min(1, 'تعداد محصولات تقریبی را انتخاب کنید'),
  description: z.string().min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد'),
  preferred_theme: z.string().optional(),
  marketing_consent: z.boolean(),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestFormModal: React.FC<RequestFormModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      marketing_consent: true
    }
  });

  const businessType = watch('business_type');

  const businessTypes = [
    { value: 'clothing', label: 'پوشاک', icon: '👕' },
    { value: 'jewelry', label: 'جواهرات', icon: '💎' },
    { value: 'electronics', label: 'الکترونیک', icon: '📱' },
    { value: 'beauty', label: 'آرایشی و بهداشتی', icon: '💄' },
    { value: 'home', label: 'خانه و آشپزخانه', icon: '🏠' },
    { value: 'sports', label: 'ورزشی', icon: '⚽' },
    { value: 'books', label: 'کتاب و نوشت‌افزار', icon: '📚' },
    { value: 'food', label: 'مواد غذایی', icon: '🍎' },
    { value: 'automotive', label: 'خودرو و موتور', icon: '🚗' },
    { value: 'services', label: 'خدمات', icon: '🛠️' },
    { value: 'other', label: 'سایر', icon: '📦' },
  ];

  const productCounts = [
    { value: '1-50', label: '۱ تا ۵۰ محصول' },
    { value: '51-200', label: '۵۱ تا ۲۰۰ محصول' },
    { value: '201-500', label: '۲۰۱ تا ۵۰۰ محصول' },
    { value: '500+', label: 'بیش از ۵۰۰ محصول' },
  ];

  const themes = [
    { value: 'modern', label: 'مدرن', description: 'طراحی امروزی و مینیمال' },
    { value: 'classic', label: 'کلاسیک', description: 'طراحی سنتی و اعتماد‌آور' },
    { value: 'colorful', label: 'رنگارنگ', description: 'طراحی پر رنگ و جذاب' },
    { value: 'minimal', label: 'مینیمال', description: 'طراحی ساده و تمیز' },
  ];

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Submit to backend API
      const response = await fetch('/api/requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('خطا در ارسال درخواست');
      }

      toast.success('درخواست شما با موفقیت ثبت شد! به زودی با شما تماس خواهیم گرفت.');
      reset();
      setStep(1);
      onClose();
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-8 text-right align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    درخواست ساخت فروشگاه
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">مرحله {step} از ۳</span>
                    <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-l from-blue-600 to-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Store className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">اطلاعات شخصی</h3>
                        <p className="text-gray-600">لطفاً اطلاعات تماس خود را وارد کنید</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            نام و نام خانوادگی *
                          </label>
                          <input
                            type="text"
                            {...register('name')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="نام خود را وارد کنید"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            شماره تلفن *
                          </label>
                          <input
                            type="tel"
                            {...register('phone')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="09123456789"
                            dir="ltr"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ایمیل (اختیاری)
                          </label>
                          <input
                            type="email"
                            {...register('email')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="example@email.com"
                            dir="ltr"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business Information */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">اطلاعات کسب‌وکار</h3>
                        <p className="text-gray-600">درباره فروشگاه خود بیشتر بگویید</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نام فروشگاه/کسب‌وکار *
                        </label>
                        <input
                          type="text"
                          {...register('business_name')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="نام فروشگاه خود را وارد کنید"
                        />
                        {errors.business_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          نوع کسب‌وکار *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {businessTypes.map((type) => (
                            <label
                              key={type.value}
                              className={`
                                relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                                ${businessType === type.value 
                                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                value={type.value}
                                {...register('business_type')}
                                className="sr-only"
                              />
                              <span className="text-2xl mb-2">{type.icon}</span>
                              <span className="text-sm font-medium text-center">{type.label}</span>
                              {businessType === type.value && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                  <span className="text-xs">✓</span>
                                </div>
                              )}
                            </label>
                          ))}
                        </div>
                        {errors.business_type && (
                          <p className="text-red-500 text-sm mt-1">{errors.business_type.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تعداد محصولات تقریبی *
                        </label>
                        <select
                          {...register('expected_products')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">انتخاب کنید</option>
                          {productCounts.map((count) => (
                            <option key={count.value} value={count.value}>
                              {count.label}
                            </option>
                          ))}
                        </select>
                        {errors.expected_products && (
                          <p className="text-red-500 text-sm mt-1">{errors.expected_products.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Design Preferences */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Palette className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">تنظیمات طراحی</h3>
                        <p className="text-gray-600">ترجیحات طراحی خود را مشخص کنید</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          قالب مورد نظر (اختیاری)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {themes.map((theme) => (
                            <label
                              key={theme.value}
                              className={`
                                relative p-4 border-2 rounded-xl cursor-pointer transition-all
                                ${watch('preferred_theme') === theme.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                value={theme.value}
                                {...register('preferred_theme')}
                                className="sr-only"
                              />
                              <div className="font-medium mb-1">{theme.label}</div>
                              <div className="text-sm text-gray-600">{theme.description}</div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          توضیحات تکمیلی *
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="درباره فروشگاه خود، محصولاتتان یا نیازهای خاص بیشتر توضیح دهید..."
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('marketing_consent')}
                            className="rounded border-gray-300 text-blue-600 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="mr-3 text-sm text-gray-700">
                            موافقم که اطلاعات تبلیغاتی و آموزشی دریافت کنم
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8 border-t">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        مرحله قبل
                      </button>
                    )}
                    
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-gradient-to-l from-blue-600 to-red-600 text-white rounded-xl hover:opacity-90 transition-opacity mr-auto"
                      >
                        مرحله بعد
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-l from-blue-600 to-red-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mr-auto flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            در حال ارسال...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            ارسال درخواست
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RequestFormModal;