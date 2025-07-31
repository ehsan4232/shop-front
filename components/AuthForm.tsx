'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, User, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api';

interface OTPAuthFormProps {
  mode: 'login' | 'register';
  onModeChange?: (mode: 'login' | 'register') => void;
  redirectUrl?: string;
}

interface FormData {
  phoneNumber: string;
  otpCode: string;
  firstName: string;
  lastName: string;
  isStoreOwner: boolean;
}

const OTPAuthForm: React.FC<OTPAuthFormProps> = ({ 
  mode, 
  onModeChange,
  redirectUrl = '/' 
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    otpCode: '',
    firstName: '',
    lastName: '',
    isStoreOwner: false,
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const router = useRouter();

  // Timer for OTP resend
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validatePhoneNumber = (phone: string): boolean => {
    // Iranian mobile number format
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone);
  };

  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Convert to standard format
    if (digits.startsWith('0098')) {
      return digits.slice(4);
    } else if (digits.startsWith('98')) {
      return digits.slice(2);
    } else if (digits.startsWith('0')) {
      return digits.slice(1);
    }
    
    return digits;
  };

  const handleSendOTP = async () => {
    if (!formData.phoneNumber) {
      setErrors({ phoneNumber: 'شماره تلفن الزامی است' });
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrors({ phoneNumber: 'شماره تلفن نامعتبر است' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const normalizedPhone = normalizePhoneNumber(formData.phoneNumber);
      
      const response = await apiClient.post('/auth/send-otp/', {
        phone_number: normalizedPhone,
        code_type: mode
      });

      if (response.success !== false) {
        setStep('otp');
        setOtpTimer(120); // 2 minutes
        setFormData(prev => ({ ...prev, phoneNumber: normalizedPhone }));
      }
    } catch (error: any) {
      setErrors({ phoneNumber: error.message || 'خطا در ارسال کد تایید' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otpCode) {
      setErrors({ otpCode: 'کد تایید الزامی است' });
      return;
    }

    if (mode === 'register' && (!formData.firstName || !formData.lastName)) {
      setErrors({ 
        firstName: !formData.firstName ? 'نام الزامی است' : '',
        lastName: !formData.lastName ? 'نام خانوادگی الزامی است' : ''
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const requestData: any = {
        phone_number: formData.phoneNumber,
        code: formData.otpCode,
        code_type: mode
      };

      if (mode === 'register') {
        requestData.user_data = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          is_store_owner: formData.isStoreOwner
        };
      }

      const response = await apiClient.post('/auth/verify-otp/', requestData);

      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem('auth-token', response.access);
        localStorage.setItem('refresh-token', response.refresh);
        apiClient.setToken(response.access);
        
        router.push(redirectUrl);
      }
    } catch (error: any) {
      setErrors({ otpCode: error.message || 'کد تایید نامعتبر است' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;

    setIsLoading(true);
    try {
      await apiClient.post('/auth/resend-otp/', {
        phone_number: formData.phoneNumber,
        code_type: mode
      });
      
      setOtpTimer(120);
    } catch (error: any) {
      setErrors({ otpCode: error.message || 'خطا در ارسال مجدد کد' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir="rtl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Store className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          {step === 'phone' 
            ? 'شماره تلفن همراه خود را وارد کنید'
            : 'کد تایید ارسال شده را وارد کنید'
          }
        </p>
      </CardHeader>

      <CardContent>
        {step === 'phone' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                شماره تلفن همراه *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="09123456789"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`pr-10 text-right ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  dir="ltr"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber}</p>
              )}
              <p className="text-xs text-gray-500">
                کد تایید به این شماره ارسال خواهد شد
              </p>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      نام *
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="نام"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`text-right ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      نام خانوادگی *
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="نام خانوادگی"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`text-right ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-reverse space-x-2">
                  <input
                    id="isStoreOwner"
                    type="checkbox"
                    checked={formData.isStoreOwner}
                    onChange={(e) => handleInputChange('isStoreOwner', e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isStoreOwner" className="text-sm text-gray-700">
                    می‌خواهم فروشگاه آنلاین داشته باشم
                  </label>
                </div>
              </>
            )}

            <Button
              onClick={handleSendOTP}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  در حال ارسال...
                </div>
              ) : (
                'ارسال کد تایید'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otpCode" className="text-sm font-medium text-gray-700">
                کد تایید *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="123456"
                  value={formData.otpCode}
                  onChange={(e) => handleInputChange('otpCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`pr-10 text-center text-lg tracking-widest ${errors.otpCode ? 'border-red-500' : ''}`}
                  maxLength={6}
                  dir="ltr"
                />
              </div>
              {errors.otpCode && (
                <p className="text-sm text-red-600">{errors.otpCode}</p>
              )}
              <p className="text-xs text-gray-500">
                کد تایید به شماره {formatPhoneNumber(formData.phoneNumber)} ارسال شد
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-sm text-blue-600 hover:underline"
              >
                تغییر شماره تلفن
              </button>
              
              {otpTimer > 0 ? (
                <span className="text-sm text-gray-500">
                  ارسال مجدد تا {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              disabled={isLoading || formData.otpCode.length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  در حال تایید...
                </div>
              ) : (
                mode === 'login' ? 'ورود' : 'ایجاد حساب'
              )}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? "حساب کاربری ندارید؟" : 'قبلاً ثبت‌نام کرده‌اید؟'}{' '}
            {onModeChange ? (
              <button
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:underline font-medium"
              >
                {mode === 'login' ? 'ثبت‌نام' : 'ورود'}
              </button>
            ) : (
              <Link
                href={mode === 'login' ? '/register' : '/login'}
                className="text-blue-600 hover:underline font-medium"
              >
                {mode === 'login' ? 'ثبت‌نام' : 'ورود'}
              </Link>
            )}
          </p>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            با ادامه، 
            <Link href="/terms" className="text-blue-600 hover:underline mx-1">
              قوانین و مقررات
            </Link>
            و
            <Link href="/privacy" className="text-blue-600 hover:underline mx-1">
              حریم خصوصی
            </Link>
            را می‌پذیرید
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPAuthForm;