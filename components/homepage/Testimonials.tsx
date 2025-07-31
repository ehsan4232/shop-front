'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

/**
 * Testimonials component with slider
 * Product requirement: "sliders" for testimonials section
 */
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'احمد محمدی',
      business: 'فروشگاه پوشاک آنلاین',
      avatar: '/avatars/ahmad.jpg',
      rating: 5,
      text: 'با استفاده از پلتفرم مال، توانستم فروشگاه آنلاین خودم را در کمتر از ۵ دقیقه راه‌اندازی کنم. فروش‌هایم ۳ برابر شده!',
      revenue: '۵۰ میلیون تومان فروش ماهانه'
    },
    {
      id: 2,
      name: 'فاطمه کریمی',
      business: 'فروشگاه زیورآلات',
      avatar: '/avatars/fatemeh.jpg',
      rating: 5,
      text: 'امکانات فوق‌العاده‌ای داره. مخصوصاً قابلیت وارد کردن محصولات از اینستاگرام که خیلی وقتم رو صرفه‌جویی کرده.',
      revenue: '۲۰ میلیون تومان فروش ماهانه'
    },
    {
      id: 3,
      name: 'علی احمدی',
      business: 'فروشگاه لوازم الکترونیک',
      avatar: '/avatars/ali.jpg',
      rating: 5,
      text: 'پشتیبانی عالی، طراحی زیبا و امکانات کامل. حالا مشتری‌هایم راحت می‌تونن آنلاین سفارش بدن.',
      revenue: '۱۰۰ میلیون تومان فروش ماهانه'
    },
    {
      id: 4,
      name: 'مریم رضایی',
      business: 'فروشگاه محصولات زیبایی',
      avatar: '/avatars/maryam.jpg',
      rating: 5,
      text: 'قابلیت ارسال پیامک تبلیغاتی و تخفیف‌ها خیلی کارآمده. مشتری‌هایم همیشه از آخرین تخفیف‌ها باخبرن.',
      revenue: '۳۰ میلیون تومان فروش ماهانه'
    },
    {
      id: 5,
      name: 'حسین موسوی',
      business: 'فروشگاه کتاب',
      avatar: '/avatars/hossein.jpg',
      rating: 5,
      text: 'امکان داشتن دامنه اختصاصی و طراحی‌های متنوع باعث شده فروشگاه من خیلی حرفه‌ای به نظر برسه.',
      revenue: '۱۵ میلیون تومان فروش ماهانه'
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-100/50 rounded-full blur-3xl"></div>
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
            داستان موفقیت مشتریان ما
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            هزاران فروشنده با پلتفرم مال کسب‌وکار آنلاین خود را رشد داده‌اند
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-full hover:shadow-2xl transition-shadow duration-300">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="w-10 h-10 text-blue-600/20" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Revenue Badge */}
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {testimonial.revenue}
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.business}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">۱۰۰۰+</div>
            <div className="text-gray-600">فروشگاه فعال</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">۹۸٪</div>
            <div className="text-gray-600">رضایت مشتریان</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">۲۴/۷</div>
            <div className="text-gray-600">پشتیبانی</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">۵ دقیقه</div>
            <div className="text-gray-600">راه‌اندازی</div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination {
          bottom: -50px !important;
          text-align: center;
        }
        
        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #e5e7eb;
          opacity: 1;
          margin: 0 6px;
        }
        
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #2563eb, #dc2626);
        }
      `}</style>
    </section>
  )
}

export default Testimonials
