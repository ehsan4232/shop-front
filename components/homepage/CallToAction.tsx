'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import RequestFormModal from './RequestFormModal'

/**
 * Call to Action component for middle/bottom of homepage
 * Product requirement: "2 bold call to actions at the top and middle/bottom which pop request form"
 */
const CallToAction = () => {
  const [showRequestForm, setShowRequestForm] = useState(false)

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              آماده شروع هستید؟
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              همین امروز فروشگاه آنلاین خود را راه‌اندازی کنید و از امکانات بی‌نظیر پلتفرم مال بهره‌مند شوید. 
              هزاران فروشنده دیگر قبل از شما این کار را کرده‌اند!
            </p>

            {/* Second CTA Button (Product Requirement) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequestForm(true)}
              className="bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 inline-flex items-center gap-4 mb-8"
            >
              <span>درخواست رایگان فروشگاه</span>
              <ArrowLeft className="w-6 h-6" />
            </motion.button>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">۰ تومان</div>
                <div className="text-white/80">هزینه راه‌اندازی</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">۲۴/۷</div>
                <div className="text-white/80">پشتیبانی فنی</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">۵ دقیقه</div>
                <div className="text-white/80">راه‌اندازی سریع</div>
              </motion.div>
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

export default CallToAction
