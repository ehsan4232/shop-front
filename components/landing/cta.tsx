import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

const plans = [
  {
    name: 'رایگان',
    price: '۰',
    description: 'برای شروع کسب‌وکار',
    features: [
      'تا ۱۰ محصول',
      '۱ فروشگاه',
      'پشتیبانی ایمیلی',
      'قالب‌های پایه',
      'SSL رایگان',
    ],
    popular: false,
  },
  {
    name: 'حرفه‌ای',
    price: '۴۹,۰۰۰',
    description: 'برای کسب‌وکارهای در حال رشد',
    features: [
      'محصولات نامحدود',
      '۳ فروشگاه',
      'پشتیبانی تلفنی',
      'تمام قالب‌ها',
      'آمار پیشرفته',
      'واردات از شبکه‌های اجتماعی',
      'درگاه‌های پرداخت',
    ],
    popular: true,
  },
  {
    name: 'کسب‌وکار',
    price: '۹۹,۰۰۰',
    description: 'برای شرکت‌ها و کسب‌وکارهای بزرگ',
    features: [
      'همه چیز در پلن حرفه‌ای',
      'فروشگاه‌های نامحدود',
      'پشتیبانی اختصاصی',
      'API اختصاصی',
      'گزارش‌های تخصصی',
      'مدیریت چند فروشنده',
      'پشتیبان‌گیری اولویت‌دار',
    ],
    popular: false,
  },
]

export function CTA() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            پلن مناسب خود را انتخاب کنید
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            با هر کدام از پلن‌های ما، همین امروز فروشگاه آنلاین خود را راه‌اندازی کنید.
            بدون قرارداد طولانی‌مدت، لغو در هر زمان.
          </p>
        </div>
        
        {/* Pricing Plans */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ring-1 ${
                plan.popular
                  ? 'bg-white shadow-2xl ring-gray-900/10 lg:z-10 lg:rounded-b-none'
                  : 'bg-white/5 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0'
              } ${
                planIdx === 0 ? 'lg:rounded-r-none' : ''
              } ${
                planIdx === plans.length - 1 ? 'lg:rounded-l-none' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-red-600 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white">
                  محبوب‌ترین
                </div>
              )}
              
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={`text-lg font-semibold leading-8 ${
                  plan.popular ? 'text-gray-900' : 'text-white'
                }`}>
                  {plan.name}
                </h3>
              </div>
              
              <p className={`mt-4 text-sm leading-6 ${
                plan.popular ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {plan.description}
              </p>
              
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${
                  plan.popular ? 'text-gray-900' : 'text-white'
                }`}>
                  {plan.price}
                </span>
                <span className={`text-sm font-semibold leading-6 ${
                  plan.popular ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {plan.price !== '۰' ? '/ماه' : ''}
                </span>
              </p>
              
              <ul className={`mt-8 space-y-3 text-sm leading-6 ${
                plan.popular ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className={`h-6 w-5 flex-none ${
                      plan.popular ? 'text-green-600' : 'text-green-400'
                    }`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                className={`mt-8 w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                size="lg"
              >
                {plan.price === '۰' ? 'شروع رایگان' : 'انتخاب پلن'}
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-24 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 lg:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              هنوز مطمئن نیستید؟
            </h3>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              با تیم فنی ما تماس بگیرید تا بهترین پلن را برای کسب‌وکار شما پیدا کنیم.
              مشاوره رایگان و بدون تعهد.
            </p>
            
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                مشاوره رایگان
              </Button>
              <div className="text-sm text-gray-400">
                یا با ما تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}