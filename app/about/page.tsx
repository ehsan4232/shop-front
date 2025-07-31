'use client'

import { motion } from 'framer-motion'
import { Target, Users, Zap, Award, Heart, Lightbulb } from 'lucide-react'

/**
 * About Us page component  
 * Product requirement: "contact us and about us"
 */
const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: 'هدف ما',
      description: 'کمک به کسب‌وکارهای ایرانی برای حضور قدرتمند در فضای آنلاین و رشد فروش'
    },
    {
      icon: Heart,
      title: 'مأموریت ما',
      description: 'ساده‌سازی فرآیند راه‌اندازی فروشگاه آنلاین و دموکراسی دسترسی به تجارت الکترونیک'
    },
    {
      icon: Lightbulb,
      title: 'چشم‌انداز ما',
      description: 'تبدیل شدن به پلتفرم شماره یک فروشگاه‌سازی در ایران و منطقه خاورمیانه'
    },
    {
      icon: Zap,
      title: 'نوآوری',
      description: 'استفاده از جدیدترین تکنولوژی‌ها برای ارائه بهترین تجربه کاربری'
    }
  ]

  const team = [
    {
      name: 'علی احمدی',
      role: 'مدیرعامل',
      description: '۱۰ سال تجربه در حوزه تجارت الکترونیک',
      image: '/team/ali.jpg'
    },
    {
      name: 'سارا محمدی',
      role: 'مدیر فناوری',
      description: 'متخصص توسعه نرم‌افزار و معماری سیستم',
      image: '/team/sara.jpg'
    },
    {
      name: 'حسین رضایی',
      role: 'مدیر محصول',
      description: 'طراح تجربه کاربری و استراتژی محصول',
      image: '/team/hossein.jpg'
    },
    {
      name: 'مریم کریمی',
      role: 'مدیر بازاریابی',
      description: 'متخصص بازاریابی دیجیتال و رشد کسب‌وکار',
      image: '/team/maryam.jpg'
    }
  ]

  const stats = [
    { number: '1000+', label: 'فروشگاه فعال' },
    { number: '10K+', label: 'محصول فروخته شده' },
    { number: '500+', label: 'مشتری راضی' },
    { number: '24/7', label: 'پشتیبانی' }
  ]

  const timeline = [
    {
      year: '1402',
      title: 'شروع مال',
      description: 'ایده اولیه پلتفرم فروشگاه‌سازی متولد شد'
    },
    {
      year: '1402',
      title: 'نسخه اولیه',
      description: 'راه‌اندازی اولین نسخه با امکانات پایه'
    },
    {
      year: '1403',
      title: 'رشد سریع',
      description: 'پیوستن صدها فروشنده و افزودن امکانات جدید'
    },
    {
      year: 'آینده',
      title: 'توسعه منطقه‌ای',
      description: 'گسترش به سایر کشورهای منطقه'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            درباره مال
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            پلتفرمی که کسب‌وکارهای ایرانی را به دنیای آنلاین وصل می‌کند
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                داستان ما
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong>مال</strong> با هدف دموکراسی دسترسی به تجارت الکترونیک در ایران راه‌اندازی شد. 
                  ما متوجه شدیم که بسیاری از کسب‌وکارهای کوچک و متوسط به دلیل پیچیدگی‌ها و هزینه‌های بالا 
                  نمی‌توانند فروشگاه آنلاین داشته باشند.
                </p>
                <p>
                  هدف ما این بود که فرآیند راه‌اندازی فروشگاه آنلاین را تا حد امکان ساده کنیم و 
                  ابزارهای حرفه‌ای را در اختیار همه قرار دهیم. امروز با افتخار می‌توانیم بگوییم که 
                  هزاران فروشنده با کمک پلتفرم ما موفق به رشد کسب‌وکار خود شده‌اند.
                </p>
                <p>
                  <strong>فروشگاه‌ساز مال</strong> نه تنها یک ابزار است، بلکه شریک رشد کسب‌وکار شماست.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-red-200/30 rounded-full"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {stat.number}
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ارزش‌های ما
            </h2>
            <p className="text-xl text-gray-600">
              اصولی که ما را در مسیر موفقیت هدایت می‌کند
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              مسیر ما
            </h2>
            <p className="text-xl text-gray-600">
              نگاهی به سفر ما از ایده تا امروز
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              تیم ما
            </h2>
            <p className="text-xl text-gray-600">
              افرادی که پشت صحنه برای موفقیت شما تلاش می‌کنند
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-blue-600 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              آماده پیوستن به خانواده مال هستید؟
            </h2>
            <p className="text-xl opacity-90 mb-8">
              همین امروز فروشگاه آنلاین خود را راه‌اندازی کنید
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-lg transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              شروع رایگان
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
