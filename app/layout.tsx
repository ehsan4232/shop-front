import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'

// Persian fonts for better RTL support
const vazirFont = localFont({
  src: [
    {
      path: '../public/fonts/Vazir-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Vazir-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazir',
  display: 'swap',
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | مال - فروشگاه‌ساز',
    default: 'مال - فروشگاه‌ساز',
  },
  description: 'پلتفرم جامع ساخت فروشگاه آنلاین با پشتیبانی کامل زبان فارسی',
  keywords: ['فروشگاه ساز', 'ایجاد فروشگاه', 'تجارت الکترونیک', 'فروش آنلاین'],
  authors: [{ name: 'Mall Platform' }],
  creator: 'Mall Platform',
  publisher: 'Mall Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    title: 'مال - فروشگاه‌ساز',
    description: 'پلتفرم جامع ساخت فروشگاه آنلاین با پشتیبانی کامل زبان فارسی',
    siteName: 'مال',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مال - فروشگاه‌ساز',
    description: 'پلتفرم جامع ساخت فروشگاه آنلاین با پشتیبانی کامل زبان فارسی',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirFont.variable}>
      <body className="font-vazir antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
