/**
 * API Client for Mall Platform Frontend
 * Handles all backend API communications with proper error handling,
 * authentication, and tenant context
 */

import { toast } from 'react-hot-toast';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Product {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  short_description: string;
  featured_image: string;
  brand_name: string;
  brand_slug: string;
  category_name: string;
  price_range: {
    min: number;
    max: number;
    formatted_min: string;
    formatted_max: string;
  };
  rating_average: number;
  rating_count: number;
  in_stock: boolean;
  discount_percentage: number;
  view_count: number;
  sales_count: number;
  images: ProductImage[];
  tags: Tag[];
  is_featured: boolean;
  is_digital: boolean;
  created_at: string;
}

export interface ProductDetail extends Product {
  description: string;
  base_price: number;
  compare_price: number;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  related_products: Product[];
  brand: Brand;
  category: Category;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compare_price: number;
  stock_quantity: number;
  image: string;
  is_default: boolean;
  attributes: ProductAttribute[];
  in_stock: boolean;
  discount_percentage: number;
  attribute_summary: string;
}

export interface ProductAttribute {
  attribute_name: string;
  attribute_type: string;
  unit: string;
  display_value: string;
  color_hex: string;
  value_image: string;
}

export interface ProductImage {
  id: string;
  image: string;
  alt_text: string;
  title: string;
  is_featured: boolean;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  description: string;
  icon: string;
  banner_image: string;
  children: Category[];
  product_count: number;
  path: Array<{
    id: string;
    name: string;
    name_fa: string;
    slug: string;
  }>;
}

export interface Brand {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  logo: string;
  description: string;
  product_count: number;
  is_featured: boolean;
}

export interface Tag {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  tag_type: string;
  color: string;
  icon: string;
  usage_count: number;
  is_featured: boolean;
}

export interface Store {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  description: string;
  logo: string;
  domain: string;
  currency: string;
}

export interface User {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  is_store_owner: boolean;
  is_verified: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  product_variant?: ProductVariant;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_amount: number;
  total_items: number;
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // HTTP methods
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private async handleErrorResponse(response: Response) {
    let errorMessage = 'خطای غیرمنتظره';
    
    try {
      const errorData = await response.json();
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.errors) {
        // Handle field validation errors
        const fieldErrors = Object.values(errorData.errors).flat();
        errorMessage = fieldErrors.join(', ');
      }
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || `خطای ${response.status}`;
    }

    // Handle specific status codes
    if (response.status === 401) {
      this.clearToken();
      errorMessage = 'لطفاً مجدداً وارد شوید';
      
      // Redirect to login if on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } else if (response.status === 403) {
      errorMessage = 'دسترسی غیرمجاز';
    } else if (response.status === 404) {
      errorMessage = 'یافت نشد';
    } else if (response.status >= 500) {
      errorMessage = 'خطای سرور. لطفاً بعداً تلاش کنید';
    }

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication API
  async sendOtp(phone: string): Promise<{ message: string }> {
    return this.post('/auth/send-otp/', { phone });
  }

  async verifyOtp(phone: string, otp: string): Promise<{ token: string; user: User }> {
    return this.post('/auth/verify-otp/', { phone, otp });
  }

  async getCurrentUser(): Promise<User> {
    return this.get('/auth/me/');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.patch('/auth/profile/', data);
  }

  // Products API
  async getProducts(params?: {
    store?: string;
    category?: string;
    brand?: string;
    tags?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return this.get(`/products/${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(slug: string): Promise<ProductDetail> {
    return this.get(`/products/${slug}/`);
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    return this.get(`/products/${productId}/recommendations/`);
  }

  async searchProducts(query: string, store?: string, limit?: number): Promise<{
    products: Product[];
    total_found: number;
  }> {
    const params = new URLSearchParams({ q: query });
    if (store) params.append('store', store);
    if (limit) params.append('limit', limit.toString());
    
    return this.get(`/products/search/?${params.toString()}`);
  }

  // Categories API
  async getCategories(store?: string): Promise<Category[]> {
    const params = store ? `?store=${store}` : '';
    return this.get(`/categories/${params}`);
  }

  async getCategory(slug: string): Promise<Category> {
    return this.get(`/categories/${slug}/`);
  }

  async getCategoryFilters(slug: string): Promise<Record<string, any>> {
    return this.get(`/categories/${slug}/filters/`);
  }

  // Brands API
  async getBrands(store?: string): Promise<Brand[]> {
    const params = store ? `?store=${store}` : '';
    return this.get(`/brands/${params}`);
  }

  async getBrand(slug: string): Promise<Brand> {
    return this.get(`/brands/${slug}/`);
  }

  // Tags API
  async getTags(store?: string, type?: string, featured?: boolean): Promise<Tag[]> {
    const params = new URLSearchParams();
    if (store) params.append('store', store);
    if (type) params.append('type', type);
    if (featured) params.append('featured', 'true');
    
    const queryString = params.toString();
    return this.get(`/tags/${queryString ? `?${queryString}` : ''}`);
  }

  // Cart API
  async getCart(): Promise<Cart> {
    return this.get('/cart/');
  }

  async addToCart(productId: string, variantId?: string, quantity: number = 1): Promise<CartItem> {
    return this.post('/cart/add/', {
      product: productId,
      product_variant: variantId,
      quantity
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    return this.patch(`/cart/items/${itemId}/`, { quantity });
  }

  async removeFromCart(itemId: string): Promise<void> {
    return this.delete(`/cart/items/${itemId}/`);
  }

  async clearCart(): Promise<void> {
    return this.delete('/cart/clear/');
  }

  // Wishlist API
  async getWishlist(): Promise<Product[]> {
    return this.get('/wishlist/');
  }

  async addToWishlist(productId: string): Promise<void> {
    return this.post('/wishlist/add/', { product: productId });
  }

  async removeFromWishlist(productId: string): Promise<void> {
    return this.delete(`/wishlist/remove/${productId}/`);
  }

  // Store API
  async getStoreInfo(storeId?: string): Promise<Store> {
    const params = storeId ? `?store=${storeId}` : '';
    return this.get(`/store/info/${params}`);
  }

  async getStoreStatistics(storeId?: string): Promise<{
    total_products: number;
    total_categories: number;
    total_brands: number;
    featured_products: number;
    recent_products: Product[];
    popular_products: Product[];
    featured_collections: any[];
  }> {
    const params = storeId ? `?store=${storeId}` : '';
    return this.get(`/store/statistics/${params}`);
  }

  // Social Media API
  async getSocialAccounts(): Promise<any[]> {
    return this.get('/social-media/accounts/');
  }

  async connectSocialAccount(platform: string, data: any): Promise<any> {
    return this.post('/social-media/connect/', { platform, ...data });
  }

  async importSocialPosts(accountId: string, options: {
    limit?: number;
    create_products?: boolean;
  } = {}): Promise<any> {
    return this.post(`/social-media/import/${accountId}/`, options);
  }

  async getSocialPosts(accountId?: string): Promise<any[]> {
    const params = accountId ? `?account=${accountId}` : '';
    return this.get(`/social-media/posts/${params}`);
  }

  // File Upload
  async uploadFile(file: File, type: 'image' | 'video' | 'document' = 'image'): Promise<{
    url: string;
    filename: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseURL}/upload/`, {
      method: 'POST',
      headers: {
        Authorization: this.token ? `Token ${this.token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json();
  }
}

// Create singleton instance
export const api = new ApiClient();

// Export API client class for testing or custom instances
export default ApiClient;

// Utility functions
export const buildImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000';
  return `${baseUrl}${path}`;
};

export const formatPrice = (price: number, currency: string = 'تومان'): string => {
  return `${price.toLocaleString('fa-IR')} ${currency}`;
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fa-IR').format(new Date(date));
};

// React Query keys for caching
export const queryKeys = {
  products: (params?: any) => ['products', params],
  product: (slug: string) => ['product', slug],
  categories: (store?: string) => ['categories', store],
  category: (slug: string) => ['category', slug],
  brands: (store?: string) => ['brands', store],
  brand: (slug: string) => ['brand', slug],
  cart: () => ['cart'],
  wishlist: () => ['wishlist'],
  user: () => ['user'],
  store: (id?: string) => ['store', id],
  storeStats: (id?: string) => ['store-stats', id],
  socialAccounts: () => ['social-accounts'],
  socialPosts: (accountId?: string) => ['social-posts', accountId],
};
