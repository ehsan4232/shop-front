'use client';

import { useState, useEffect } from 'react';
import { 
  GlobeAltIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface Domain {
  id: string;
  domain: string;
  domain_type: 'subdomain' | 'custom';
  is_primary: boolean;
  is_active: boolean;
  is_https: boolean;
  ssl_verified: boolean;
  created_at: string;
}

interface DomainManagerProps {
  storeId: string;
  className?: string;
}

export default function DomainManager({ storeId, className = '' }: DomainManagerProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [domainType, setDomainType] = useState<'subdomain' | 'custom'>('subdomain');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDomains();
  }, [storeId]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stores/${storeId}/domains`);
      const data = await response.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error('خطا در دریافت دامنه‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/stores/${storeId}/domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: newDomain.trim(),
          domain_type: domainType,
        }),
      });

      if (response.ok) {
        await fetchDomains();
        setNewDomain('');
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'خطا در افزودن دامنه');
      }
    } catch (error) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (domainId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/domains/${domainId}/set-primary`, {
        method: 'PATCH',
      });

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('خطا در تنظیم دامنه اصلی:', error);
    }
  };

  const handleToggleActive = async (domainId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/domains/${domainId}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('خطا در تغییر وضعیت دامنه:', error);
    }
  };

  const handleVerifySSL = async (domainId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/domains/${domainId}/verify-ssl`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('خطا در تایید SSL:', error);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('آیا از حذف این دامنه اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/stores/${storeId}/domains/${domainId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchDomains();
      }
    } catch (error) {
      console.error('خطا در حذف دامنه:', error);
    }
  };

  const getDomainStatus = (domain: Domain) => {
    if (!domain.is_active) {
      return { status: 'inactive', label: 'غیرفعال', color: 'text-gray-500 bg-gray-100' };
    }
    
    if (domain.domain_type === 'custom' && !domain.ssl_verified) {
      return { status: 'pending', label: 'در انتظار تایید SSL', color: 'text-yellow-700 bg-yellow-100' };
    }
    
    if (domain.ssl_verified && domain.is_https) {
      return { status: 'active', label: 'فعال و امن', color: 'text-green-700 bg-green-100' };
    }
    
    return { status: 'active', label: 'فعال', color: 'text-blue-700 bg-blue-100' };
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`} dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GlobeAltIcon className="w-6 h-6 text-blue-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                مدیریت دامنه‌ها
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                دامنه‌های فروشگاه خود را مدیریت کنید
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 ml-2" />
            افزودن دامنه
          </button>
        </div>
      </div>

      {/* Add Domain Form */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleAddDomain} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع دامنه
              </label>
              <div className="flex space-x-4 space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="subdomain"
                    checked={domainType === 'subdomain'}
                    onChange={(e) => setDomainType(e.target.value as 'subdomain')}
                    className="ml-2"
                  />
                  زیردامنه (subdomain.mall.ir)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={domainType === 'custom'}
                    onChange={(e) => setDomainType(e.target.value as 'custom')}
                    className="ml-2"
                  />
                  دامنه اختصاصی (example.com)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {domainType === 'subdomain' ? 'نام زیردامنه' : 'دامنه اختصاصی'}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder={domainType === 'subdomain' ? 'mystore' : 'example.com'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 text-right"
                  required
                />
                {domainType === 'subdomain' && (
                  <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg text-gray-500">
                    .mall.ir
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewDomain('');
                  setError('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'در حال افزودن...' : 'افزودن دامنه'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Domains List */}
      <div className="p-6">
        {domains.length === 0 ? (
          <div className="text-center py-12">
            <GlobeAltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              هیچ دامنه‌ای تنظیم نشده
            </h3>
            <p className="text-gray-600 mb-4">
              برای شروع، یک دامنه یا زیردامنه اضافه کنید
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <PlusIcon className="w-4 h-4 ml-2" />
              افزودن اولین دامنه
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map(domain => {
              const status = getDomainStatus(domain);
              
              return (
                <div
                  key={domain.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium text-gray-900 ml-3">
                          {domain.domain}
                        </h4>
                        
                        {domain.is_primary && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            دامنه اصلی
                          </span>
                        )}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        
                        {domain.is_https && domain.ssl_verified && (
                          <ShieldCheckIcon className="w-4 h-4 text-green-600 mr-2" />
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span>نوع: {domain.domain_type === 'subdomain' ? 'زیردامنه' : 'دامنه اختصاصی'}</span>
                        <span className="mx-2">•</span>
                        <span>ایجاد شده: {new Date(domain.created_at).toLocaleDateString('fa-IR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      {/* SSL Verify Button */}
                      {domain.domain_type === 'custom' && !domain.ssl_verified && (
                        <button
                          onClick={() => handleVerifySSL(domain.id)}
                          className="text-yellow-600 hover:text-yellow-700 p-2"
                          title="تایید SSL"
                        >
                          <ClockIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Set Primary Button */}
                      {!domain.is_primary && domain.is_active && (
                        <button
                          onClick={() => handleSetPrimary(domain.id)}
                          className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
                          title="تنظیم به عنوان دامنه اصلی"
                        >
                          اصلی
                        </button>
                      )}

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(domain.id)}
                        className={`text-xs px-2 py-1 border rounded ${
                          domain.is_active
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        }`}
                        title={domain.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                      >
                        {domain.is_active ? 'غیرفعال' : 'فعال'}
                      </button>

                      {/* Delete Button (only if not primary) */}
                      {!domain.is_primary && (
                        <button
                          onClick={() => handleDeleteDomain(domain.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="حذف دامنه"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Domain Setup Instructions for Custom Domains */}
                  {domain.domain_type === 'custom' && !domain.ssl_verified && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="text-sm font-medium text-yellow-800 mb-2">
                        تنظیمات DNS مورد نیاز:
                      </h5>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <div>A Record: {domain.domain} → 185.143.232.xxx</div>
                        <div>CNAME Record: www.{domain.domain} → {domain.domain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}