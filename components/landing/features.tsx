import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  ShoppingCartIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'ایجاد فروشگاه در ۵ دقیقه',
    description: 'با چند کلیک ساده، فروشگاه آنلاین خود را راه‌اندازی کنید. بدون نیاز به دانش فنی یا برنامه‌نویسی.',
    icon: ShoppingCartIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'پشتیبانی کامل فارسی',
    description: 'رابط کاربری، تقویم، اعداد و تمام قابلیت‌های پلتفرم به صورت کامل فارسی‌سازی شده است.',
    icon: GlobeAltIcon,
    color: 'bg-green-500',
  },
  {
    name: 'واردات از شبکه‌های اجتماعی',
    description: 'محصولات خود را مستقیماً از اینستاگرام و تلگرام وارد کنید. تصاویر و توضیحات به صورت خودکار دریافت می‌شود.',
    icon: DevicePhoneMobileIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'درگاه‌های پرداخت ایرانی',
    description: 'اتصال مستقیم به زرین‌پال، پارسیان، ملت و سایر درگاه‌های پرداخت معتبر کشور.',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'مدیریت موجودی هوشمند',
    description: 'کنترل موجودی، هشدار کمبود کالا، مدیریت انواع محصول و ویژگی‌های نامحدود.',
    icon: ServerIcon,
    color: 'bg-red-500',
  },
  {
    name: 'آمار و گزارش‌گیری',
    description: 'داشبورد تحلیلی پیشرفته با نمودارهای فروش، بازدید مشتریان و عملکرد محصولات.',
    icon: ChartBarIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'امنیت بالا',
    description: 'احراز هویت دو مرحله‌ای، رمزگذاری اطلاعات و پشتیبان‌گیری خودکار از داده‌های شما.',
    icon: LockClosedIcon,
    color: 'bg-gray-700',
  },
  {
    name: 'پشتیبانی ابری',
    description: 'میزبانی ابری قدرتمند با آپتایم ۹۹.۹٪ و پشتیبانی فنی ۲۴ ساعته.',
    icon: CloudArrowUpIcon,
    color: 'bg-cyan-500',
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">امکانات پیشرفته</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            همه چیز برای موفقیت کسب‌وکار آنلاین شما
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            پلتفرم مال تمام ابزارهای مورد نیاز برای راه‌اندازی، مدیریت و توسعه فروشگاه آنلاین موفق را در اختیار شما قرار می‌دهد.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col group hover:scale-105 transition-transform duration-200">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg">
                  <div className={`${feature.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Additional Feature Highlights */}
        <div className="mt-24">
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8 lg:p-16">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">+۱۰۰۰</div>
                <div className="mt-2 text-lg font-medium text-gray-900">فروشگاه فعال</div>
                <div className="mt-1 text-sm text-gray-600">در سراسر کشور</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">۹۹.۹٪</div>
                <div className="mt-2 text-lg font-medium text-gray-900">آپتایم سرور</div>
                <div className="mt-1 text-sm text-gray-600">در دسترس بودن مداوم</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">۲۴/۷</div>
                <div className="mt-2 text-lg font-medium text-gray-900">پشتیبانی فنی</div>
                <div className="mt-1 text-sm text-gray-600">همه روزه هفته</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}