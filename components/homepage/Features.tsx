'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Palette, 
  Smartphone, 
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'فروشگاه حرفه‌ای',
    description: 'ایجاد فروشگاه آنلاین زیبا و کارآمد با امکانات پیشرفته مدیریت محصولات و سفارشات',
    color: 'bg-blue-500'
  },
  {
    icon: Palette,
    title: 'قالب‌های متنوع',
    description: 'انتخاب از میان قالب‌های مدرن و جذاب برای نمایش بهتر محصولاتتان',
    color: 'bg-purple-500'
  },
  {
    icon: Smartphone,
    title: 'موبایل فرندلی',
    description: 'فروشگاه شما در تمام دستگاه‌ها به صورت کامل قابل استفاده است',
    color: 'bg-green-500'
  },
  {
    icon: TrendingUp,
    title: 'آنالیز فروش',
    description: 'داشبورد تحلیلی برای بررسی عملکرد فروش و رفتار مشتریان',
    color: 'bg-orange-500'
  },
  {
    icon: Globe,
    title: 'دامنه اختصاصی',
    description: 'استفاده از دامنه اختصاصی برای فروشگاه شما یا ساب‌دامین رایگان',
    color: 'bg-red-500'
  },
  {
    icon: Shield,
    title: 'امنیت بالا',
    description: 'ورود امن با رمز یکبار مصرف و حفاظت کامل از اطلاعات مشتریان',
    color: 'bg-indigo-500'
  },
  {
    icon: Zap,
    title: 'سرعت بالا',
    description: 'بارگذاری سریع صفحات و تجربه کاربری روان برای مشتریانتان',
    color: 'bg-yellow-500'
  },
  {
    icon: Users,
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی همیشه آماده کمک به شما در تمام مراحل کار',
    color: 'bg-teal-500'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ویژگی‌های <span className="text-blue-600">مال</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            پلتفرم مال با ارائه بهترین ابزارها و امکانات، کسب‌وکار آنلاین شما را به سطح جدیدی می‌رساند
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">فروشگاه فعال</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">50000+</div>
                <div className="text-blue-100">محصول فروخته شده</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100">زمان آپتایم</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">پشتیبانی</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            ببینید چطور فروشگاه شما زنده می‌شود
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder for video - replace with actual video */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-l-4 border-white ml-1"></div>
                  </div>
                  <p className="text-lg">ویدیو معرفی پلتفرم مال</p>
                  <p className="text-sm text-gray-300 mt-2">کلیک کنید تا پخش شود</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}