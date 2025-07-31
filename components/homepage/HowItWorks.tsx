'use client';

import { useState } from 'react';
import { 
  UserPlusIcon, 
  CogIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  PlayIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 1,
    title: 'ثبت نام و ایجاد حساب',
    description: 'به سادگی در پلتفرم مال ثبت نام کنید و حساب کاربری خود را ایجاد کنید',
    icon: UserPlusIcon,
    video: '/videos/signup-demo.mp4',
    features: [
      'ثبت نام سریع با OTP',
      'راه‌اندازی فروشگاه در کمتر از 5 دقیقه',
      'پشتیبانی 24/7'
    ]
  },
  {
    id: 2,
    title: 'شخصی‌سازی فروشگاه',
    description: 'قالب مناسب کسب‌وکار خود را انتخاب کنید و فروشگاه خود را شخصی‌سازی کنید',
    icon: CogIcon,
    video: '/videos/customization-demo.mp4',
    features: [
      'قالب‌های متنوع و مدرن',
      'شخصی‌سازی کامل رنگ‌ها و فونت‌ها',
      'لوگو و برندینگ اختصاصی'
    ]
  },
  {
    id: 3,
    title: 'افزودن محصولات',
    description: 'محصولات خود را اضافه کنید، از شبکه‌های اجتماعی وارد کنید یا به صورت انبوه آپلود کنید',
    icon: ShoppingBagIcon,
    video: '/videos/products-demo.mp4',
    features: [
      'افزودن آسان محصولات',
      'وارد کردن از تلگرام و اینستاگرام',
      'مدیریت دسته‌بندی و ویژگی‌ها'
    ]
  },
  {
    id: 4,
    title: 'تحلیل و فروش',
    description: 'فروش خود را شروع کنید و با ابزارهای تحلیلی پیشرفت کسب‌وکار خود را رصد کنید',
    icon: ChartBarIcon,
    video: '/videos/analytics-demo.mp4',
    features: [
      'داشبورد تحلیلی پیشرفته',
      'گزارش‌های فروش و بازدید',
      'کمپین‌های تبلیغاتی SMS'
    ]
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const handleVideoPlay = (stepId: number) => {
    setPlayingVideo(stepId);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            چطور کار می‌کند؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            در چند مرحله ساده فروشگاه آنلاین خود را راه‌اندازی کنید و شروع به فروش کنید
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeStep === step.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <step.icon className="w-5 h-5 ml-2" />
              مرحله {step.id}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`transition-all duration-500 ${
                  activeStep === step.id
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-4 hidden'
                }`}
              >
                {activeStep === step.id && (
                  <>
                    {/* Step Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl ml-4">
                        <step.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-600">
                          مرحله {step.id}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    {/* Step Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Step Features */}
                    <div className="space-y-3">
                      {step.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <CheckIcon className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6">
                      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        شروع کنید
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Video/Demo Side */}
          <div className="relative">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`transition-all duration-500 ${
                  activeStep === step.id
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 hidden'
                }`}
              >
                {activeStep === step.id && (
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Video Thumbnail/Player */}
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 relative">
                      {playingVideo === step.id ? (
                        <video
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          onEnded={() => setPlayingVideo(null)}
                        >
                          <source src={step.video} type="video/mp4" />
                          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                        </video>
                      ) : (
                        <>
                          {/* Demo Content Placeholder */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 mb-4 mx-auto w-fit">
                                <step.icon className="w-12 h-12 text-blue-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                دمو {step.title}
                              </h4>
                              <p className="text-sm text-gray-600 max-w-xs">
                                برای مشاهده نحوه عملکرد روی دکمه پخش کلیک کنید
                              </p>
                            </div>
                          </div>

                          {/* Play Button */}
                          <button
                            onClick={() => handleVideoPlay(step.id)}
                            className="absolute inset-0 flex items-center justify-center group"
                          >
                            <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all group-hover:scale-110">
                              <PlayIcon className="w-8 h-8 mr-1" />
                            </div>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        نمایش مرحله {step.id}: {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ببینید که چطور به سادگی می‌توانید این مرحله را انجام دهید
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Process Overview */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              فرآیند کامل در یک نگاه
            </h3>
            <p className="text-gray-600">
              از ثبت نام تا شروع فروش در کمتر از 30 دقیقه
            </p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center max-w-xs">
                {/* Step Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  index < activeStep - 1 
                    ? 'bg-green-100 text-green-600' 
                    : index === activeStep - 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < activeStep - 1 ? (
                    <CheckIcon className="w-8 h-8" />
                  ) : (
                    <step.icon className="w-8 h-8" />
                  )}
                </div>

                {/* Step Info */}
                <h4 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-16 w-24 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
