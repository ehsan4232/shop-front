'use client';

import React, { useState, useEffect } from 'react';
import { Instagram, Send, Download, Loader2, CheckCircle, AlertCircle, Image, Video, FileText, X } from 'lucide-react';
import { Button } from './ui/button';

interface SocialMediaPost {
  id: string;
  content: string;
  media_url?: string;
  thumbnail_url?: string;
  post_type: 'image' | 'video' | 'text' | 'carousel';
  posted_at: string;
  permalink?: string;
  extracted_info?: any;
  can_convert: boolean;
}

interface SocialMediaAccount {
  id: string;
  platform: 'instagram' | 'telegram';
  username: string;
  display_name: string;
  status: string;
}

interface SocialMediaImportProps {
  onImport: (selectedData: {
    posts: SocialMediaPost[];
    selectedImages: string[];
    selectedVideos: string[];
    selectedTexts: string[];
  }) => void;
  storeId?: string;
  className?: string;
}

export const SocialMediaImport: React.FC<SocialMediaImportProps> = ({ 
  onImport, 
  storeId,
  className = '' 
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'telegram' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedTexts, setSelectedTexts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPosts, setShowPosts] = useState(false);

  // Load user's social media accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/social-media/accounts/');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
      }
    };

    loadAccounts();
  }, []);

  const handlePlatformImport = async (platform: 'instagram' | 'telegram') => {
    setSelectedPlatform(platform);
    setError(null);
    
    // Find accounts for this platform
    const platformAccounts = accounts.filter(acc => acc.platform === platform);
    
    if (platformAccounts.length === 0) {
      setError(`هیچ اکانت ${platform === 'instagram' ? 'اینستاگرام' : 'تلگرام'} متصل نیست`);
      return;
    }
    
    // If only one account, use it directly
    if (platformAccounts.length === 1) {
      await fetchRecentPosts(platform, platformAccounts[0].id);
    } else {
      // Show account selection
      // For now, use the first account (can be enhanced with selection UI)
      await fetchRecentPosts(platform, platformAccounts[0].id);
    }
  };

  const fetchRecentPosts = async (platform: 'instagram' | 'telegram', accountId: string) => {
    setLoading(platform);
    setSelectedAccount(accountId);
    
    try {
      // Call the backend API endpoint for getting last 5 posts
      const response = await fetch(`/api/social-media/${platform}/${accountId}/last-posts/`);
      
      if (!response.ok) {
        throw new Error('خطا در دریافت پست‌ها');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
        setShowPosts(true);
        setError(null);
      } else {
        setError(data.message || 'خطا در دریافت پست‌ها');
      }
    } catch (error) {
      setError(`خطا در دریافت پست‌های ${platform === 'instagram' ? 'اینستاگرام' : 'تلگرام'}`);
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(null);
    }
  };

  const handlePostSelection = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const handleMediaSelection = (mediaUrl: string, type: 'image' | 'video', checked: boolean) => {
    if (type === 'image') {
      if (checked) {
        setSelectedImages([...selectedImages, mediaUrl]);
      } else {
        setSelectedImages(selectedImages.filter(url => url !== mediaUrl));
      }
    } else {
      if (checked) {
        setSelectedVideos([...selectedVideos, mediaUrl]);
      } else {
        setSelectedVideos(selectedVideos.filter(url => url !== mediaUrl));
      }
    }
  };

  const handleTextSelection = (content: string, checked: boolean) => {
    if (checked) {
      setSelectedTexts([...selectedTexts, content]);
    } else {
      setSelectedTexts(selectedTexts.filter(text => text !== content));
    }
  };

  const handleImport = () => {
    const selectedPostsData = posts.filter(post => selectedPosts.includes(post.id));
    
    onImport({
      posts: selectedPostsData,
      selectedImages,
      selectedVideos,
      selectedTexts
    });
    
    // Reset state
    setShowPosts(false);
    setSelectedPosts([]);
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedTexts([]);
  };

  const handleCancel = () => {
    setShowPosts(false);
    setSelectedPosts([]);
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedTexts([]);
    setPosts([]);
    setError(null);
  };

  if (showPosts) {
    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            انتخاب محتوا از {selectedPlatform === 'instagram' ? 'اینستاگرام' : 'تلگرام'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id={`post-${post.id}`}
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => handlePostSelection(post.id, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  {/* Post Media */}
                  {post.media_url && (
                    <div className="mb-3">
                      {post.post_type === 'image' ? (
                        <div className="relative">
                          <img
                            src={post.thumbnail_url || post.media_url}
                            alt="پست"
                            className="w-full max-w-xs h-40 object-cover rounded"
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(post.media_url)}
                              onChange={(e) => handleMediaSelection(post.media_url!, 'image', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-white rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                            <Image className="w-3 h-3 ml-1" />
                            تصویر
                          </div>
                        </div>
                      ) : post.post_type === 'video' ? (
                        <div className="relative">
                          <video
                            src={post.media_url}
                            className="w-full max-w-xs h-40 object-cover rounded"
                            controls={false}
                            muted
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="checkbox"
                              checked={selectedVideos.includes(post.media_url)}
                              onChange={(e) => handleMediaSelection(post.media_url!, 'video', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-white rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                            <Video className="w-3 h-3 ml-1" />
                            ویدیو
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Post Content */}
                  {post.content && (
                    <div className="mb-3">
                      <div className="flex items-start space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={selectedTexts.includes(post.content)}
                          onChange={(e) => handleTextSelection(post.content, e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <FileText className="w-4 h-4 text-gray-500 ml-1" />
                            <span className="text-sm text-gray-600">متن پست</span>
                          </div>
                          <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                            {post.content.length > 150 
                              ? `${post.content.substring(0, 150)}...` 
                              : post.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="text-xs text-gray-500">
                    {new Date(post.posted_at).toLocaleDateString('fa-IR')} •
                    نوع: {post.post_type === 'image' ? 'تصویر' : post.post_type === 'video' ? 'ویدیو' : 'متن'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 space-x-reverse mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            انصراف
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={selectedPosts.length === 0 && selectedImages.length === 0 && selectedVideos.length === 0 && selectedTexts.length === 0}
            className="flex items-center"
          >
            <Download className="w-4 h-4 ml-2" />
            واردکردن انتخاب شده ({selectedPosts.length + selectedImages.length + selectedVideos.length + selectedTexts.length})
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          واردکردن از شبکه‌های اجتماعی
        </h3>
        <p className="text-gray-600 mb-4">
          5 پست آخر از تلگرام یا اینستاگرام را دریافت کرده و محتوای دلخواه را انتخاب کنید
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-center space-x-4 space-x-reverse">
          <Button
            type="button"
            onClick={() => handlePlatformImport('telegram')}
            disabled={loading === 'telegram'}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading === 'telegram' ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-2" />
            )}
            {loading === 'telegram' ? 'در حال دریافت...' : 'دریافت از تلگرام'}
          </Button>
          
          <Button
            type="button"
            onClick={() => handlePlatformImport('instagram')}
            disabled={loading === 'instagram'}
            className="flex items-center px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {loading === 'instagram' ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Instagram className="w-4 h-4 ml-2" />
            )}
            {loading === 'instagram' ? 'در حال دریافت...' : 'دریافت از اینستاگرام'}
          </Button>
        </div>

        {accounts.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm">
              برای استفاده از این قابلیت، ابتدا اکانت‌های شبکه اجتماعی خود را متصل کنید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaImport;