'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Shield, BarChart3, Settings } from 'lucide-react'

/**
 * Store Owner Login Section component
 * Product requirement: "login section for store owners to reach to their admin panel"
 */
const StoreOwnerLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to OTP verification or admin panel
    window.location.href = `/auth/login?phone=${encodeURIComponent(phoneNumber)}`
    setIsLoading(false)
  }

  const features = [
    {
      icon: BarChart3,
      title: 'پنل آمار و گزارشات',
      description: 'مشاهده آمار فروش، بازدید و تعامل مشتریان'
    },
    {
      icon: Settings,
      title: 'مدیریت محصولات',
      description: 'افزودن، ویرایش و مدیریت محصولات فروشگاه'
    },
    {
      icon: Shield,
      title: 'امنیت بالا',
      description: 'ورود با رمز یکبار مصرف و حفاظت از اطلاعات'
    }
  ]

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              صاحبان فروشگاه
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              به پنل مدیریت فروشگاه خود دسترسی پیدا کنید و کسب‌وکار آنلاین خود را مدیریت کنید.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ورود به پنل مدیریت
              </h3>
              <p className="text-gray-600">
                با شماره تلفن خود وارد شوید
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن همراه
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  dir="ltr"
                  pattern="09[0-9]{9}"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  کد تأیید به شماره شما ارسال خواهد شد
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full bg-gradient-to-l from-blue-600 to-red-600 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>در حال ارسال کد...</span>
                  </div>
                ) : (
                  'ورود به پنل مدیریت'
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                هنوز فروشگاه ندارید؟{' '}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-blue-600 font-medium hover:underline"
                >
                  همین حالا ایجاد کنید
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default StoreOwnerLogin
