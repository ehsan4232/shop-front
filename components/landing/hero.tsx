import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20 sm:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Logo & Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 rounded-2xl shadow-lg">
              <span className="text-2xl font-bold text-white">مال</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              فروشگاه‌ساز
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                مال
              </span>
            </h1>
          </div>
          
          <p className="mt-6 text-lg leading-8 text-gray-600">
            پلتفرم جامع ایجاد و مدیریت فروشگاه آنلاین با پشتیبانی کامل از زبان فارسی.
            فروشگاه خود را در کمترین زمان راه‌اندازی کنید و فروش آنلاین خود را شروع کنید.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700">
              شروع رایگان
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <PlayIcon className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              مشاهده ویدیو
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-x-8 text-sm text-gray-500">
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>بدون نیاز به دانش فنی</span>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>پشتیبانی ۲۴/۷</span>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>نامحدود محصول</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-white p-8 shadow-2xl ring-1 ring-gray-900/10">
              <div className="flex items-center gap-x-4 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-center text-sm text-gray-500">
                  داشبورد مدیریت فروشگاه
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                  <div className="text-2xl font-bold text-blue-600">۱,۲۳۴</div>
                  <div className="text-sm text-blue-600">کل فروش (تومان)</div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4">
                  <div className="text-2xl font-bold text-green-600">۱۲</div>
                  <div className="text-sm text-green-600">سفارش امروز</div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4">
                  <div className="text-2xl font-bold text-red-600">۸۵</div>
                  <div className="text-sm text-red-600">محصولات فعال</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}