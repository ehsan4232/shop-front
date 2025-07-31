// API Client for Mall Platform
// Handles authentication, request/response, and error handling

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    
    // Initialize token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
    }
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh-token') 
      : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      this.clearToken();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setToken(data.access);
    return data.access;
  }

  private async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    let response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle token refresh for 401 responses
    if (response.status === 401 && this.token) {
      try {
        await this.refreshToken();
        
        // Retry the request with new token
        headers.Authorization = `Bearer ${this.token}`;
        response = await fetch(fullUrl, {
          ...options,
          headers,
        });
      } catch (error) {
        // Refresh failed, redirect to login
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Authentication failed');
      }
    }

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || data || 'خطای ناشناخته';
      throw new Error(errorMessage);
    }

    return data;
  }

  // HTTP Methods
  async get<T = any>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T = any>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // File upload method
  async upload<T = any>(url: string, formData: FormData): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error || errorData?.message || 'خطا در آپلود فایل';
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Authentication methods
  async sendOTP(phoneNumber: string, type: 'login' | 'register' = 'login') {
    return this.post('/send-otp/', {
      phone_number: phoneNumber,
      code_type: type,
    });
  }

  async verifyOTP(phoneNumber: string, code: string, type: 'login' | 'register' = 'login', userData?: any) {
    const requestData: any = {
      phone_number: phoneNumber,
      code,
      code_type: type,
    };

    if (type === 'register' && userData) {
      requestData.user_data = userData;
    }

    const response = await this.post('/verify-otp/', requestData);
    
    if (response.access && response.refresh) {
      this.setToken(response.access);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh-token', response.refresh);
      }
    }

    return response;
  }

  async resendOTP(phoneNumber: string, type: 'login' | 'register' = 'login') {
    return this.post('/resend-otp/', {
      phone_number: phoneNumber,
      code_type: type,
    });
  }

  async checkPhone(phoneNumber: string) {
    return this.post('/check-phone/', {
      phone_number: phoneNumber,
    });
  }

  async logout() {
    try {
      await this.post('/auth/logout/', {});
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.clearToken();
    }
  }

  // Profile methods
  async getProfile() {
    return this.get('/profile/');
  }

  async updateProfile(profileData: any) {
    return this.post('/profile/update/', profileData);
  }

  // Store methods
  async getStores() {
    return this.get('/stores/');
  }

  async getStore(storeId: string) {
    return this.get(`/stores/${storeId}/`);
  }

  async createStore(storeData: any) {
    return this.post('/stores/', storeData);
  }

  // Product methods
  async getProducts(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/products/${queryString}`);
  }

  async getProduct(productId: string) {
    return this.get(`/products/${productId}/`);
  }

  async createProduct(productData: any) {
    return this.post('/products/', productData);
  }

  async updateProduct(productId: string, productData: any) {
    return this.put(`/products/${productId}/`, productData);
  }

  async deleteProduct(productId: string) {
    return this.delete(`/products/${productId}/`);
  }

  // Social media methods
  async importFromSocialMedia(importData: any) {
    return this.post('/social-media/import/', importData);
  }

  async getSocialMediaAccounts() {
    return this.get('/social-media/accounts/');
  }

  async getLastPosts(platform: string, accountId: string) {
    return this.get(`/social-media/${platform}/${accountId}/last-posts/`);
  }

  // Order methods
  async getOrders(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/orders/${queryString}`);
  }

  async getOrder(orderId: string) {
    return this.get(`/orders/${orderId}/`);
  }

  async createOrder(orderData: any) {
    return this.post('/orders/', orderData);
  }

  // Analytics methods
  async getStoreAnalytics(storeId: string) {
    return this.get(`/analytics/store/${storeId}/`);
  }

  async getProductAnalytics(storeId: string) {
    return this.get(`/analytics/products/?store=${storeId}`);
  }

  // File upload utilities
  uploadProductImage(productId: string, imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.upload(`/products/${productId}/upload-image/`, formData);
  }

  uploadStoreMedia(storeId: string, mediaFile: File, mediaType: 'logo' | 'banner' | 'gallery') {
    const formData = new FormData();
    formData.append('media', mediaFile);
    formData.append('type', mediaType);
    return this.upload(`/stores/${storeId}/upload-media/`, formData);
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };

// Type definitions for common API responses
export interface User {
  id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  is_store_owner: boolean;
  is_phone_verified: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  domain?: string;
  is_active: boolean;
  theme: string;
  layout: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_fa: string;
  description?: string;
  base_price: number;
  compare_price?: number;
  stock_quantity: number;
  sku: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at: string;
  store: Store;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  customer: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}