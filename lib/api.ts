// API Base URL from environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Request configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Generic request method
  private async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const { method = 'GET', headers = {}, body } = config;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          error: data.error || data.message || `HTTP ${response.status}`,
          errors: data.errors,
        };
      }

      return { data };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // GET request
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  // PUT request
  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  // PATCH request
  async patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload with FormData
  async uploadFile<T = any>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
          'Authorization': this.defaultHeaders['Authorization'],
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || data.message || `HTTP ${response.status}`,
          errors: data.errors,
        };
      }

      return { data };
    } catch (error) {
      console.error('File upload failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    sendOtp: '/api/auth/send-otp/',
    verifyOtp: '/api/auth/verify-otp/',
    refreshToken: '/api/auth/refresh-token/',
    profile: '/api/auth/profile/',
  },

  // Stores
  stores: {
    list: '/api/stores/',
    detail: (id: string) => `/api/stores/${id}/`,
    create: '/api/stores/',
    update: (id: string) => `/api/stores/${id}/`,
    delete: (id: string) => `/api/stores/${id}/`,
    statistics: '/api/stores/statistics/',
  },

  // Products
  products: {
    list: '/api/products/',
    detail: (slug: string) => `/api/products/${slug}/`,
    create: '/api/products/',
    update: (slug: string) => `/api/products/${slug}/`,
    delete: (slug: string) => `/api/products/${slug}/`,
    search: '/api/products/search/',
    bulkCreate: '/api/products/bulk_create/',
    createVariants: (slug: string) => `/api/products/${slug}/create_variants/`,
    recommendations: (slug: string) => `/api/products/${slug}/recommendations/`,
    analytics: '/api/products/analytics/',
    importFromSocial: '/api/products/import-from-social-media/',
  },

  // Product Classes
  productClasses: {
    list: '/api/product-classes/',
    detail: (slug: string) => `/api/product-classes/${slug}/`,
    create: '/api/product-classes/',
    update: (slug: string) => `/api/product-classes/${slug}/`,
    delete: (slug: string) => `/api/product-classes/${slug}/`,
    hierarchy: '/api/product-class-hierarchy/',
  },

  // Categories
  categories: {
    list: '/api/categories/',
    detail: (slug: string) => `/api/categories/${slug}/`,
    create: '/api/categories/',
    update: (slug: string) => `/api/categories/${slug}/`,
    delete: (slug: string) => `/api/categories/${slug}/`,
    filters: (slug: string) => `/api/categories/${slug}/filters/`,
  },

  // Brands
  brands: {
    list: '/api/brands/',
    detail: (slug: string) => `/api/brands/${slug}/`,
    create: '/api/brands/',
    update: (slug: string) => `/api/brands/${slug}/`,
    delete: (slug: string) => `/api/brands/${slug}/`,
  },

  // Tags
  tags: {
    list: '/api/tags/',
    detail: (slug: string) => `/api/tags/${slug}/`,
    create: '/api/tags/',
    update: (slug: string) => `/api/tags/${slug}/`,
    delete: (slug: string) => `/api/tags/${slug}/`,
  },

  // Collections
  collections: {
    list: '/api/collections/',
    detail: (slug: string) => `/api/collections/${slug}/`,
    create: '/api/collections/',
    update: (slug: string) => `/api/collections/${slug}/`,
    delete: (slug: string) => `/api/collections/${slug}/`,
  },

  // Attribute Types
  attributeTypes: {
    list: '/api/attribute-types/',
    detail: (slug: string) => `/api/attribute-types/${slug}/`,
    create: '/api/attribute-types/',
    update: (slug: string) => `/api/attribute-types/${slug}/`,
    delete: (slug: string) => `/api/attribute-types/${slug}/`,
  },

  // Orders
  orders: {
    list: '/api/orders/',
    detail: (id: string) => `/api/orders/${id}/`,
    create: '/api/orders/',
    update: (id: string) => `/api/orders/${id}/`,
    cancel: (id: string) => `/api/orders/${id}/cancel/`,
  },

  // Payments
  payments: {
    initiate: '/api/payments/initiate/',
    verify: '/api/payments/verify/',
    gateways: '/api/payments/gateways/',
  },

  // Social Media
  socialMedia: {
    telegram: {
      connect: '/api/social-media/telegram/connect/',
      posts: '/api/social-media/telegram/posts/',
      import: '/api/social-media/telegram/import/',
    },
    instagram: {
      connect: '/api/social-media/instagram/connect/',
      posts: '/api/social-media/instagram/posts/',
      import: '/api/social-media/instagram/import/',
    },
  },

  // Analytics
  analytics: {
    dashboard: '/api/analytics/dashboard/',
    storeStats: '/api/store-statistics/',
    trendingSearches: '/api/trending-searches/',
  },
};

// Utility functions for common API operations
export const api = {
  // Authentication helpers
  auth: {
    sendOtp: (phoneNumber: string) => 
      apiClient.post(endpoints.auth.sendOtp, { phone_number: phoneNumber }),
    
    verifyOtp: (phoneNumber: string, otpCode: string) => 
      apiClient.post(endpoints.auth.verifyOtp, { phone_number: phoneNumber, otp_code: otpCode }),
    
    refreshToken: (refreshToken: string) => 
      apiClient.post(endpoints.auth.refreshToken, { refresh: refreshToken }),
    
    getProfile: () => 
      apiClient.get(endpoints.auth.profile),
  },

  // Store helpers
  stores: {
    list: (params?: any) => 
      apiClient.get(endpoints.stores.list, params),
    
    get: (id: string) => 
      apiClient.get(endpoints.stores.detail(id)),
    
    create: (data: any) => 
      apiClient.post(endpoints.stores.create, data),
    
    update: (id: string, data: any) => 
      apiClient.patch(endpoints.stores.update(id), data),
    
    delete: (id: string) => 
      apiClient.delete(endpoints.stores.delete(id)),
    
    getStatistics: (storeId: string) => 
      apiClient.get(endpoints.analytics.storeStats, { store: storeId }),
  },

  // Product helpers
  products: {
    list: (params?: any) => 
      apiClient.get(endpoints.products.list, params),
    
    get: (slug: string, params?: any) => 
      apiClient.get(endpoints.products.detail(slug), params),
    
    create: (data: any) => 
      apiClient.post(endpoints.products.create, data),
    
    update: (slug: string, data: any) => 
      apiClient.patch(endpoints.products.update(slug), data),
    
    delete: (slug: string) => 
      apiClient.delete(endpoints.products.delete(slug)),
    
    search: (query: string, params?: any) => 
      apiClient.get(endpoints.products.search, { query, ...params }),
    
    bulkCreate: (data: any) => 
      apiClient.post(endpoints.products.bulkCreate, data),
    
    createVariants: (slug: string, attributes: any) => 
      apiClient.post(endpoints.products.createVariants(slug), { attributes }),
    
    getRecommendations: (slug: string) => 
      apiClient.get(endpoints.products.recommendations(slug)),
    
    getAnalytics: (storeId: string) => 
      apiClient.get(endpoints.products.analytics, { store: storeId }),
    
    importFromSocial: (data: any) => 
      apiClient.post(endpoints.products.importFromSocial, data),
  },

  // Category helpers
  categories: {
    list: (params?: any) => 
      apiClient.get(endpoints.categories.list, params),
    
    get: (slug: string, params?: any) => 
      apiClient.get(endpoints.categories.detail(slug), params),
    
    create: (data: any) => 
      apiClient.post(endpoints.categories.create, data),
    
    update: (slug: string, data: any) => 
      apiClient.patch(endpoints.categories.update(slug), data),
    
    delete: (slug: string) => 
      apiClient.delete(endpoints.categories.delete(slug)),
    
    getFilters: (slug: string, storeId: string) => 
      apiClient.get(endpoints.categories.filters(slug), { store: storeId }),
  },

  // Product class helpers
  productClasses: {
    list: (params?: any) => 
      apiClient.get(endpoints.productClasses.list, params),
    
    get: (slug: string, params?: any) => 
      apiClient.get(endpoints.productClasses.detail(slug), params),
    
    create: (data: any) => 
      apiClient.post(endpoints.productClasses.create, data),
    
    update: (slug: string, data: any) => 
      apiClient.patch(endpoints.productClasses.update(slug), data),
    
    delete: (slug: string) => 
      apiClient.delete(endpoints.productClasses.delete(slug)),
    
    getHierarchy: (storeId: string) => 
      apiClient.get(endpoints.productClasses.hierarchy, { store: storeId }),
  },

  // File upload helper
  uploadFile: (endpoint: string, file: File, additionalData?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    return apiClient.uploadFile(endpoint, formData);
  },

  // Generic CRUD helpers
  create: (endpoint: string, data: any) => apiClient.post(endpoint, data),
  read: (endpoint: string, params?: any) => apiClient.get(endpoint, params),
  update: (endpoint: string, data: any) => apiClient.patch(endpoint, data),
  delete: (endpoint: string) => apiClient.delete(endpoint),
};

export default apiClient;