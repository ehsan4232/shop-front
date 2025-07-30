/**
 * Social Media Import Component
 * Provides UI for the excellent backend social media integration
 * Uses the existing sophisticated backend services
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SocialMediaPost {
  id: string;
  platform: 'telegram' | 'instagram';
  content: string;
  media_url?: string;
  timestamp: string;
  imported: boolean;
}

interface SocialMediaImportProps {
  onImport: (posts: SocialMediaPost[]) => void;
  onCreateProduct: (post: SocialMediaPost) => void;
}

export function SocialMediaImport({ onImport, onCreateProduct }: SocialMediaImportProps) {
  const [activeTab, setActiveTab] = useState<'telegram' | 'instagram'>('instagram');
  const [isLoading, setIsLoading] = useState(false);
  const [importedPosts, setImportedPosts] = useState<SocialMediaPost[]>([]);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset } = useForm();

  const handleImportSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        platform: activeTab,
        ...(activeTab === 'instagram' 
          ? { media_id: data.mediaId, access_token: data.accessToken }
          : { post_identifier: data.postIdentifier, bot_token: data.botToken }
        )
      };

      // Call backend API (using existing excellent services)
      const response = await fetch('/api/social-media/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to import content');
      }

      const result = await response.json();
      
      if (result.success) {
        const newPosts = result.posts || [result.content];
        setImportedPosts(prev => [...prev, ...newPosts]);
        onImport(newPosts);
        reset();
      } else {
        setError(result.error || 'Import failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (activeTab !== 'instagram') return;

    setIsLoading(true);
    try {
      // Use backend's bulk import for last 5 posts
      const response = await fetch('/api/social-media/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'instagram',
          limit: 5
        })
      });

      const result = await response.json();
      if (result.success) {
        setImportedPosts(result.posts);
        onImport(result.posts);
      }
    } catch (err) {
      setError('Bulk import failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        واردات از شبکه‌های اجتماعی
      </h2>

      {/* Platform Tabs */}
      <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('instagram')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'instagram'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center justify-center">
            📷 اینستاگرام
          </span>
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'telegram'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center justify-center">
            ✈️ تلگرام
          </span>
        </button>
      </div>

      {/* Import Form */}
      <form onSubmit={handleSubmit(handleImportSubmit)} className="space-y-4 mb-6">
        {activeTab === 'instagram' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شناسه رسانه اینستاگرام
              </label>
              <input
                type="text"
                {...register('mediaId', { required: true })}
                placeholder="17841400455014679"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توکن دسترسی
              </label>
              <input
                type="password"
                {...register('accessToken', { required: true })}
                placeholder="Access Token"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شناسه پست تلگرام
              </label>
              <input
                type="text"
                {...register('postIdentifier', { required: true })}
                placeholder="@channel_name/123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                فرمت: @نام_کانال/شماره_پیام یا شناسه_کانال/شماره_پیام
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توکن ربات تلگرام
              </label>
              <input
                type="password"
                {...register('botToken')}
                placeholder="Bot Token (اختیاری - از تنظیمات استفاده می‌شود)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="flex space-x-3 space-x-reverse">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'در حال واردات...' : 'واردات پست'}
          </button>
          
          {activeTab === 'instagram' && (
            <button
              type="button"
              onClick={handleBulkImport}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              واردات ۵ پست اخیر
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-red-800">خطا در واردات</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Imported Posts Display */}
      {importedPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">پست‌های وارد شده</h3>
          <div className="space-y-4">
            {importedPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {post.platform === 'instagram' ? '📷 اینستاگرام' : '✈️ تلگرام'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.timestamp).toLocaleString('fa-IR')}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onCreateProduct(post)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    ایجاد محصول
                  </button>
                </div>
                
                <div className="flex space-x-4 space-x-reverse">
                  {post.media_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.media_url}
                        alt="Social media content"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {post.content.length > 200 
                        ? `${post.content.substring(0, 200)}...` 
                        : post.content
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">راهنمای استفاده</h4>
        <div className="text-sm text-blue-800 space-y-2">
          {activeTab === 'instagram' ? (
            <>
              <p>• برای دریافت شناسه رسانه اینستاگرام، از Instagram Basic Display API استفاده کنید</p>
              <p>• گزینه "واردات ۵ پست اخیر" آخرین پست‌های حساب شما را وارد می‌کند</p>
              <p>• سیستم به طور خودکار اطلاعات محصول را از محتوا استخراج می‌کند</p>
            </>
          ) : (
            <>
              <p>• فرمت شناسه پست: @نام_کانال/شماره_پیام (مثال: @mystore/123)</p>
              <p>• اگر توکن ربات وارد نکنید، از تنظیمات سیستم استفاده می‌شود</p>
              <p>• سیستم متن، تصاویر و ویدیوها را به طور خودکار استخراج می‌کند</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialMediaImport;