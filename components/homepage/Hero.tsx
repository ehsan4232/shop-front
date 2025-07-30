'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Rocket, Users } from 'lucide-react';
import RequestFormModal from './RequestFormModal';

const Hero = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const stats = [
    { label: 'فروشگاه فعال', value: '1000+', icon: Users },
    { label: 'محصول فروخته شده', value: '10K+', icon: Rocket },
    { label: 'کاربر آنلاین', value: '1000+', icon: Sparkles },
  ];

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-red-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              {/* Logo Placeholder */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl mb-4">
                  <span className="text-white text-3xl font-bold">مال</span>
                </div>
                <p className="text-sm text-gray-600">فروشگاه‌ساز آنلاین</p>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-l from-blue-600 to-red-600 bg-clip-text text-transparent">
                  فروشگاه آنلاین
                </span>
                <br />
                <span className="text-gray-800">
                  خود را بسازید
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                پلتفرمی برای ساخت وبسایت فروشگاهی. صاحبان فروشگاه می‌توانند وارد وبسایت پلتفرم شوند 
                تا فروشگاه‌های خود را مدیریت کنند و محصولاتشان را در وبسایت‌هایشان قابل فروش کنند.
              </p>

              {/* First CTA Button (Required by product description) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRequestForm(true)}
                className="bg-gradient-to-l from-blue-600 to-red-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 inline-flex items-center gap-3 mb-8"
              >
                <span>شروع رایگان</span>
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg mb-3">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Dashboard Mockup */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  {/* Mockup Content */}
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    
                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
                        <div className="h-3 bg-blue-300 rounded w-2/3 mb-2"></div>
                        <div className="h-6 bg-blue-400 rounded w-1/3"></div>
                      </div>
                      <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4">
                        <div className="h-3 bg-red-300 rounded w-2/3 mb-2"></div>
                        <div className="h-6 bg-red-400 rounded w-1/3"></div>
                      </div>
                    </div>
                    
                    <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium">فروش موفق</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">+۱۲ مشتری جدید</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Request Form Modal */}
      <RequestFormModal 
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
      />
    </>
  );
};

export default Hero;