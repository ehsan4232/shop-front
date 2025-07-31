'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Check, Zap } from 'lucide-react'
import { useState } from 'react'
import RequestFormModal from './RequestFormModal'

/**
 * Pricing component for subscription plans
 * Product requirement: Various pricing plans for different store sizes
 */
const Pricing = () => {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'رایگان',
      nameEn: 'starter',
      price: { monthly: 0, annual: 0 },
      popular: false,
      description: 'برای شروع کسب‌وکار',
      features: [
        'تا ۱۰ محصول',
        '۱۰۰ مگابایت فضای ذخیره‌سازی',
        'تا ۱۰۰ سفارش در ماه',
        'زیردامنه رایگان (.mall.ir)',
        'پشتیبانی ایمیلی',
        'قالب‌های پایه'
      ],
      limitations: [
        'بدون دامنه اختصاصی',
        'بدون SMS تبلیغاتی',
        'آمار محدود'
      ]
    },
    {
      name: 'پایه',
      nameEn: 'basic',
      price: { monthly: 99000, annual: 990000 },
      popular: false,
      description: 'برای کسب‌وکارهای کوچک',
      features: [
        'تا ۱۰۰ محصول',
        '۱ گیگابایت فضای ذخیره‌سازی',
        'تا ۵۰۰ سفارش در ماه',
        'دامنه اختصاصی',
        'پشتیبانی تلفنی',
        'همه قالب‌ها',
        'گزارش‌های پایه',
        'وارد کردن از شبکه‌های اجتماعی'
      ],
      limitations: [
        'بدون SMS تبلیغاتی',
        'آمار محدود'
      ]
    },
    {
      name: 'حرفه‌ای',
      nameEn: 'pro',
      price: { monthly: 199000, annual: 1990000 },
      popular: true,
      description: 'برای کسب‌وکارهای در حال رشد',
      features: [
        'تا ۱۰۰۰ محصول',
        '۵ گیگابایت فضای ذخیره‌سازی',
        'سفارش نامحدود',
        'دامنه اختصاصی',
        'پشتیبانی اولویت‌دار',
        'همه قالب‌ها + قالب‌های premium',
        'گزارش‌های تفصیلی',
        'SMS تبلیغاتی (۱۰۰۰ پیام/ماه)',
        'وارد کردن از شبکه‌های اجتماعی',
        'تخفیف و کوپن پیشرفته',
        'API دسترسی'
      ],
      limitations: []
    },
    {
      name: 'سازمانی',
      nameEn: 'enterprise',
      price: { monthly: 399000, annual: 3990000 },
      popular: false,
      description: 'برای کسب‌وکارهای بزرگ',
      features: [
        'محصول نامحدود',
        '۲۰ گیگابایت فضای ذخیره‌سازی',
        'سفارش نامحدود',
        'چندین دامنه اختصاصی',
        'پشتیبانی اختصاصی ۲۴/۷',
        'قالب‌های سفارشی',
        'گزارش‌های تحلیلی پیشرفته',
        'SMS نامحدود',
        'وارد کردن پیشرفته از شبکه‌های اجتماعی',
        'تخفیف و کوپن پیشرفته',
        'API کامل',
        'مدیریت چند فروشگاه',
        'مشاوره کسب‌وکار'
      ],
      limitations: []
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  return (
    <>
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              پلن مناسب خود را انتخاب کنید
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              با پلن‌های مختلف ما، از استارتاپ تا شرکت‌های بزرگ، همه می‌توانند فروشگاه آنلاین داشته باشند
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="inline-flex items-center bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  !isAnnual
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ماهانه
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  isAnnual
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                سالانه
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  ۲۰٪ تخفیف
                </span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.nameEn}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-3xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'border-blue-500 shadow-blue-500/10 scale-105' : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      محبوب‌ترین
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price[isAnnual ? 'annual' : 'monthly'] === 0 ? (
                        'رایگان'
                      ) : (
                        <>
                          <span>{formatPrice(plan.price[isAnnual ? 'annual' : 'monthly'])}</span>
                          <span className="text-lg font-medium text-gray-600">
                            {isAnnual ? ' تومان/سال' : ' تومان/ماه'}
                          </span>
                        </>
                      )}
                    </div>
                    {isAnnual && plan.price.annual > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        معادل {formatPrice(Math.floor(plan.price.annual / 12))} تومان/ماه
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, i) => (
                    <div key={i} className="flex items-start gap-3 opacity-60">
                      <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-500 line-through">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRequestForm(true)}
                  className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:shadow-lg'
                      : plan.price[isAnnual ? 'annual' : 'monthly'] === 0
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span>
                    {plan.price[isAnnual ? 'annual' : 'monthly'] === 0 ? 'شروع رایگان' : 'انتخاب پلن'}
                  </span>
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                نیاز به راه‌حل سفارشی دارید؟
              </h3>
              <p className="text-gray-600 mb-6">
                برای کسب‌وکارهای بزرگ و نیازهای خاص، تیم ما آماده ارائه راه‌حل سفارشی است
              </p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                تماس با فروش
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Request Form Modal */}
      <RequestFormModal 
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
      />
    </>
  )
}

export default Pricing
