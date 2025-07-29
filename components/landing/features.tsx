'use client'

import { motion } from 'framer-motion'
import { 
  ShoppingBagIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'مدیریت محصولات',
    description: 'افزودن و مدیریت محصولات با ویژگی‌های پیشرفته، دسته‌بندی هوشمند و وارد کردن از شبکه‌های اجتماعی',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: ChartBarIcon,
    title: 'آنالیتیکس پیشرفته',
    description: 'گزارشات فروش، تحلیل رفتار مشتریان، و داشبورد مدیریتی برای بهبود عملکرد فروشگاه',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'طراحی ریسپانسیو',
    description: 'فروشگاه شما در تمام دستگاه‌ها عالی نمایش داده می‌شود و تجربه کاربری فوق‌العاده‌ای ارائه می‌دهد',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'درگاه‌های پرداخت',
    description: 'اتصال به تمام درگاه‌های پرداخت ایرانی، پردازش ایمن تراکنش‌ها و مدیریت مالی پیشرفته',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: UserGroupIcon,
    title: 'مدیریت مشتریان',
    description: 'پنل مشتریان، سیستم وفاداری، برنامه‌های تخفیف و ارتباط مستقیم با مشتریان',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: GlobeAltIcon,
    title: 'SEO و بازاریابی',
    description: 'بهینه‌سازی موتورهای جستجو، کمپین‌های بازاریابی و ابزارهای افزایش فروش',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: SparklesIcon,
    title: 'اتصال شبکه‌های اجتماعی',
    description: 'وارد کردن خودکار محتوا از تلگرام و اینستاگرام، مدیریت کانال‌های فروش',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'امنیت و پشتیبانی',
    description: 'امنیت بالا، پشتیبان‌گیری خودکار، و پشتیبانی ۲۴/۷ برای حل مشکلات',
    color: 'from-gray-600 to-gray-700'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            ویژگی‌های
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}قدرتمند
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            تمام ابزارهایی که برای راه‌اندازی و مدیریت یک فروشگاه آنلاین موفق نیاز دارید
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                آماده شروع هستید؟
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                با پلتفرم مال، فروشگاه آنلاین خود را همین امروز راه‌اندازی کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-300 shadow-lg"
                >
                  شروع رایگان
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  مشاهده نمونه کارها
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
