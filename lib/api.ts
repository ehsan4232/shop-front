import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Types
export interface User {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  is_store_owner: boolean;
  is_customer: boolean;
  is_verified: boolean;
  avatar?: string;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  description?: string;
  logo?: string;
  domain_url?: string;
  theme: string;
  layout: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price: number;
  compare_price?: number;
  sku?: string;
  stock_quantity: number;
  featured_image?: string;
  status: string;
  is_featured: boolean;
  category: Category;
  brand?: Brand;
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  parent?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  logo?: string;
}

export interface Tag {
  id: string;
  name: string;
  name_fa: string;
  color: string;
  tag_type: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: any;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  total_amount: number;
  final_amount: number;
}

// API Error type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.error || errorData.message || 'خطا در ارتباط با سرور',
          errors: errorData.errors,
          status: response.status,
        });
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: 'خطا در ارتباط با سرور',
        status: 0,
      });
    }
  }

  // Authentication methods
  async sendOTP(phone: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, code: string): Promise<{
    access: string;
    refresh: string;
    user: User;
    message: string;
  }> {
    const result = await this.request<{
      access: string;
      refresh: string;
      user: User;
      message: string;
    }>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });

    // Store tokens
    this.token = result.access;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
    }

    return result;
  }

  async refreshToken(): Promise<{ access: string }> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const result = await this.request<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    this.token = result.access;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access);
    }

    return result;
  }

  async logout(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;

    if (refreshToken) {
      await this.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }

    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/profile/');
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>('/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Store methods
  async getStores(): Promise<Store[]> {
    const result = await this.request<{ results: Store[] }>('/stores/');
    return result.results;
  }

  async getStore(storeId: string): Promise<Store> {
    return this.request<Store>(`/stores/${storeId}/`);
  }

  async createStore(storeData: Partial<Store>): Promise<Store> {
    return this.request<Store>('/stores/', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async updateStore(storeId: string, storeData: Partial<Store>): Promise<Store> {
    return this.request<Store>(`/stores/${storeId}/`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  }

  // Product methods
  async getProducts(storeId?: string, filters?: any): Promise<{
    results: Product[];
    count: number;
    next?: string;
    previous?: string;
  }> {
    const params = new URLSearchParams(filters).toString();
    const endpoint = storeId 
      ? `/stores/${storeId}/products/?${params}`
      : `/products/?${params}`;
    
    return this.request<{
      results: Product[];
      count: number;
      next?: string;
      previous?: string;
    }>(endpoint);
  }

  async getProduct(productId: string, storeId?: string): Promise<Product> {
    const endpoint = storeId 
      ? `/stores/${storeId}/products/${productId}/`
      : `/products/${productId}/`;
    
    return this.request<Product>(endpoint);
  }

  async createProduct(storeId: string, productData: any): Promise<Product> {
    return this.request<Product>(`/stores/${storeId}/products/`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async createBulkProducts(storeId: string, productsData: any[]): Promise<Product[]> {
    return this.request<Product[]>(`/stores/${storeId}/products/bulk/`, {
      method: 'POST',
      body: JSON.stringify({ products: productsData }),
    });
  }

  async updateProduct(storeId: string, productId: string, productData: any): Promise<Product> {
    return this.request<Product>(`/stores/${storeId}/products/${productId}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(storeId: string, productId: string): Promise<void> {
    return this.request<void>(`/stores/${storeId}/products/${productId}/`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories(storeId?: string): Promise<Category[]> {
    const endpoint = storeId 
      ? `/stores/${storeId}/categories/`
      : `/categories/`;
    
    const result = await this.request<{ results: Category[] }>(endpoint);
    return result.results;
  }

  async getCategory(categoryId: string, storeId?: string): Promise<Category> {
    const endpoint = storeId 
      ? `/stores/${storeId}/categories/${categoryId}/`
      : `/categories/${categoryId}/`;
    
    return this.request<Category>(endpoint);
  }

  async createCategory(storeId: string, categoryData: any): Promise<Category> {
    return this.request<Category>(`/stores/${storeId}/categories/`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Brand methods
  async getBrands(storeId?: string): Promise<Brand[]> {
    const endpoint = storeId 
      ? `/stores/${storeId}/brands/`
      : `/brands/`;
    
    const result = await this.request<{ results: Brand[] }>(endpoint);
    return result.results;
  }

  // Cart methods
  async getCart(storeId: string): Promise<Cart> {
    return this.request<Cart>(`/stores/${storeId}/cart/`);
  }

  async addToCart(storeId: string, productId: string, variantId?: string, quantity: number = 1): Promise<Cart> {
    return this.request<Cart>(`/stores/${storeId}/cart/add/`, {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
        quantity,
      }),
    });
  }

  async updateCartItem(storeId: string, itemId: string, quantity: number): Promise<Cart> {
    return this.request<Cart>(`/stores/${storeId}/cart/items/${itemId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(storeId: string, itemId: string): Promise<Cart> {
    return this.request<Cart>(`/stores/${storeId}/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart(storeId: string): Promise<void> {
    return this.request<void>(`/stores/${storeId}/cart/clear/`, {
      method: 'POST',
    });
  }

  // Order methods
  async createOrder(storeId: string, orderData: any): Promise<any> {
    return this.request<any>(`/stores/${storeId}/orders/`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(storeId?: string, filters?: any): Promise<any[]> {
    const params = new URLSearchParams(filters).toString();
    const endpoint = storeId 
      ? `/stores/${storeId}/orders/?${params}`
      : `/orders/?${params}`;
    
    const result = await this.request<{ results: any[] }>(endpoint);
    return result.results;
  }

  async getOrder(orderId: string, storeId?: string): Promise<any> {
    const endpoint = storeId 
      ? `/stores/${storeId}/orders/${orderId}/`
      : `/orders/${orderId}/`;
    
    return this.request<any>(endpoint);
  }

  // Payment methods
  async createPayment(storeId: string, orderId: string, paymentData: any): Promise<any> {
    return this.request<any>(`/stores/${storeId}/orders/${orderId}/payment/`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(storeId: string, transactionId: string, verificationData: any): Promise<any> {
    return this.request<any>(`/stores/${storeId}/payments/${transactionId}/verify/`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  // Social Media methods
  async getSocialMediaPosts(storeId: string): Promise<any[]> {
    const result = await this.request<{ results: any[] }>(`/stores/${storeId}/social-media/posts/`);
    return result.results;
  }

  async importSocialMediaPost(storeId: string, postId: string, categoryId: string, additionalData?: any): Promise<Product> {
    return this.request<Product>(`/stores/${storeId}/social-media/import/`, {
      method: 'POST',
      body: JSON.stringify({
        social_media_post_id: postId,
        category_id: categoryId,
        additional_data: additionalData,
      }),
    });
  }

  async connectSocialMediaAccount(storeId: string, platform: string, accountData: any): Promise<any> {
    return this.request<any>(`/stores/${storeId}/social-media/connect/`, {
      method: 'POST',
      body: JSON.stringify({
        platform,
        ...accountData,
      }),
    });
  }

  // File upload helper
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.request<any>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set boundary for FormData
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  // Analytics methods
  async getStoreAnalytics(storeId: string, period?: string): Promise<any> {
    const params = period ? `?period=${period}` : '';
    return this.request<any>(`/stores/${storeId}/analytics/${params}`);
  }

  async getProductAnalytics(storeId: string, productId: string): Promise<any> {
    return this.request<any>(`/stores/${storeId}/products/${productId}/analytics/`);
  }
}

// Create ApiError class
class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor({ message, status, errors }: { message: string; status: number; errors?: Record<string, string[]> }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export class for creating custom instances
export { ApiClient, ApiError };

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'خطای ناشناخته';
};

// Helper function to format Iranian currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

// Helper function to format dates in Persian
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR').format(dateObj);
};
