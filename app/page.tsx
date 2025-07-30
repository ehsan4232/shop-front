import { Metadata } from 'next';
import Hero from '@/components/homepage/Hero';
import Features from '@/components/homepage/Features';
import HowItWorks from '@/components/homepage/HowItWorks';
import Testimonials from '@/components/homepage/Testimonials';
import Pricing from '@/components/homepage/Pricing';
import CallToAction from '@/components/homepage/CallToAction';
import StoreOwnerLogin from '@/components/homepage/StoreOwnerLogin';
import OnlineChat from '@/components/homepage/OnlineChat';

export const metadata: Metadata = {
  title: 'مال - فروشگاه‌ساز آنلاین',
  description: 'پلتفرمی برای ساخت وبسایت فروشگاهی. صاحبان فروشگاه می‌توانند وارد وبسایت پلتفرم شوند تا فروشگاه‌های خود را مدیریت کنند و محصولاتشان را در وبسایت‌هایشان قابل فروش کنند.',
  keywords: 'فروشگاه ساز, وبسایت فروشگاهی, تجارت الکترونیک, مال',
  openGraph: {
    title: 'مال - فروشگاه‌ساز آنلاین',
    description: 'بهترین پلتفرم برای ساخت فروشگاه آنلاین در ایران',
    type: 'website',
    locale: 'fa_IR',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section with First CTA */}
      <Hero />
      
      {/* Platform Values and Features */}
      <Features />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Store Owner Login Section */}
      <StoreOwnerLogin />
      
      {/* Testimonials with Slider */}
      <Testimonials />
      
      {/* Pricing Plans */}
      <Pricing />
      
      {/* Second CTA (Middle/Bottom) */}
      <CallToAction />
      
      {/* Online Chat Component */}
      <OnlineChat />
    </>
  );
}