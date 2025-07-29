'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

const plans = [
  {
    name: 'رایگان',
    price: '۰',
    description: 'برای شروع و آزمایش',
    features: [
      'تا ۵۰ محصول',
      '۱۰۰ مگابایت فضای ذخیره‌سازی',
      'دامنه رایگان .mall.ir',
      'پشتیبانی ایمیل',
      'تمهای پایه',
    ],
    limitations: [
      'بدون دامنه اختصاصی',
      'محدودیت در سفارشی‌سازی',
    ],
    highlighted: false,
    buttonText: 'شروع رایگان',
    buttonColor: 'bg-gray-600 hover:bg-gray-700'
  },
  {
    name: 'حرفه‌ای',
    price: '۲۹۹,۰۰۰',
    originalPrice: '۴۹۹,۰۰۰',
    description: 'برای کسب‌وکارهای جدی',
    features: [
      'تا ۲۰۰۰ محصول',
      '۵ گیگابایت فضای ذخیره‌سازی',
      'دامنه اختصاصی رایگان',
      'اتصال به شبکه‌های اجتماعی',
      'آنالیتیکس پیشرفته',
      'پشتیبانی تلفنی',
      'تمام تمه‌ها و قالب‌ها',
      'سئو پیشرفته',
    ],
    limitations: [],
    highlighted: true,
    buttonText: 'انتخاب پلان حرفه‌ای',
    buttonColor: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  },
  {
    name: 'سازمانی',
    price: 'تماس بگیرید',
    description: 'برای فروشگاه‌های بزرگ',
    features: [
      'محصولات نامحدود',
      'فضای ذخیره‌سازی نامحدود',
      'چندین دامنه',
      'API اختصاصی',
      'مدیریت چند فروشگاه',
      'پشتیبانی اختصاصی',
      'گزارشات تخصصی',
      'امکانات سفارشی',
    ],
    limitations: [],
    highlighted: false,
    buttonText: 'تماس با فروش',
    buttonColor: 'bg-gray-600 hover:bg-gray-700'
  }
]

const testimonials = [
  {
    name: 'علی احمدی',
    business: 'فروشگاه مد و پوشاک آریا',
    image: '/placeholder-avatar-1.jpg',
    quote: 'با پلتفرم مال، فروش آنلاین‌ام ۳ برابر شد. رابط کاربری فوق‌العاده و پشتیبانی عالی!'
  },
  {
    name: 'مریم صادقی',
    business: 'جواهرات نگین',
    image: '/placeholder-avatar-2.jpg',
    quote: 'امکان وارد کردن محصولات از اینستاگرام کاری رو خیلی راحت کرده. حرف نداره!'
  },
  {
    name: 'محمد رضایی',
    business: 'الکترونیک پردیس',
    image: '/placeholder-avatar-3.jpg',
    quote: 'سیستم مدیریت سفارشات و گزارش‌گیری‌هاش دقیقاً همون چیزی بود که می‌خواستم.'
  }
]

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pricing Section */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            انتخاب
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}پلان مناسب
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            پلان مناسب با نیازهای کسب‌وکار خود را انتخاب کنید
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted 
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 scale-105' 
                  : 'bg-white border border-gray-200'
              } shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    پیشنهاد ویژه
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price === 'تماس بگیرید' ? (
                    <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {plan.originalPrice} تومان
                        </span>
                      )}
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.price !== '۰' && (
                        <span className="text-gray-600">تومان/ماه</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <li key={`limit-${limitIndex}`} className="flex items-start gap-3 opacity-60">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    </div>
                    <span className="text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 ${plan.buttonColor}`}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-16"
          >
            نظرات مشتریان ما
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="mr-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
            
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                همین الان شروع کنید
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                ۱۴ روز رایگان امتحان کنید. بدون نیاز به کارت اعتباری. 
                هر وقت خواستید لغو کنید.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  شروع رایگان
                  <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  تماس با فروش
                </Link>
              </div>

              <div className="mt-8 text-sm text-gray-400">
                بیش از ۱۰۰۰ فروشگاه به ما اعتماد کرده‌اند
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
