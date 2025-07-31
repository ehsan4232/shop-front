import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api';

interface OTPFormProps {
  onSuccess: (userData: any) => void;
  onError?: (error: string) => void;
}

interface OTPFormData {
  phone_number: string;
  otp_code: string;
}

const OTPAuthForm: React.FC<OTPFormProps> = ({ onSuccess, onError }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // For development only

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<OTPFormData>();

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const requestOTP = async (data: { phone_number: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/request-otp/', {
        phone_number: data.phone_number
      });

      if (response.data.dev_otp) {
        setDevOtp(response.data.dev_otp); // Show OTP in development
      }

      setPhoneNumber(data.phone_number);
      setStep('otp');
      setOtpSent(true);
      setCountdown(300); // 5 minutes countdown
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'خطا در ارسال کد تأیید';
      if (onError) {
        onError(errorMessage);
      }
      setError('phone_number', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: { otp_code: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp/', {
        phone_number: phoneNumber,
        otp_code: data.otp_code
      });

      // Store tokens
      const { tokens, user } = response.data;
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      // Set API client authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

      onSuccess({
        user,
        tokens,
        message: 'ورود موفقیت‌آمیز'
      });

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'کد تأیید نامعتبر است';
      if (onError) {
        onError(errorMessage);
      }
      setError('otp_code', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await requestOTP({ phone_number: phoneNumber });
    } catch (error) {
      console.error('خطا در ارسال مجدد کد:', error);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ورود به مال
        </h2>
        <p className="text-gray-600">
          {step === 'phone' 
            ? 'شماره تلفن همراه خود را وارد کنید'
            : 'کد تأیید ارسال شده را وارد کنید'
          }
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSubmit(requestOTP)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره تلفن همراه
            </label>
            <input
              type="tel"
              {...register('phone_number', {
                required: 'شماره تلفن همراه الزامی است',
                pattern: {
                  value: /^09\d{9}$/,
                  message: 'شماره تلفن همراه معتبر نیست (مثال: 09123456789)'
                }
              })}
              placeholder="09123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
              dir="ltr"
              disabled={isLoading}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                در حال ارسال...
              </div>
            ) : (
              'ارسال کد تأیید'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(verifyOTP)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کد تأیید
            </label>
            <input
              type="text"
              {...register('otp_code', {
                required: 'کد تأیید الزامی است',
                pattern: {
                  value: /^\d{4,6}$/,
                  message: 'کد تأیید باید ۴ تا ۶ رقم باشد'
                }
              })}
              placeholder="12345"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
              maxLength={6}
              disabled={isLoading}
            />
            {errors.otp_code && (
              <p className="text-red-500 text-sm mt-1">{errors.otp_code.message}</p>
            )}
            
            {/* Development OTP Display */}
            {devOtp && process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                <strong>کد توسعه:</strong> {devOtp}
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>کد تأیید به شماره {phoneNumber} ارسال شد</p>
            {countdown > 0 ? (
              <p className="text-blue-600 mt-1">
                ارسال مجدد در {formatCountdown(countdown)}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-800 mt-1"
                disabled={isLoading}
              >
                ارسال مجدد کد
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                در حال تأیید...
              </div>
            ) : (
              'تأیید و ورود'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setOtpSent(false);
              setCountdown(0);
              reset();
            }}
            className="w-full text-gray-600 hover:text-gray-800 py-2"
            disabled={isLoading}
          >
            تغییر شماره تلفن
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          با ورود به سایت، قوانین و مقررات مال را می‌پذیرید
        </p>
      </div>
    </div>
  );
};

export default OTPAuthForm;