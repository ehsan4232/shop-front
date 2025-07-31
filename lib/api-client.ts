/**
 * Complete API Client for Mall Platform
 * Handles all API communications with proper error handling and auth
 */

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        this.logout();
        throw new Error('Authentication failed');
      }
      return null; // Indicate retry needed
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    let response = await fetch(url, config);
    let result = await this.handleResponse(response);

    // Retry once if token was refreshed
    if (result === null) {
      config.headers = {
        ...this.getHeaders(),
        ...options.headers,
      };
      response = await fetch(url, config);
      result = await this.handleResponse(response);
    }

    return result;
  }

  // Authentication Methods
  async sendOTP(phoneNumber: string) {
    return this.request('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async verifyOTP(phoneNumber: string, code: string) {
    const response = await this.request('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, code }),
    });

    if (response.access_token) {
      this.setToken(response.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }

    return response;
  }

  async refreshToken() {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;

    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access);
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.access);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  setToken(token: string) {
    this.token = token;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Store Methods
  async createStore(storeData: any) {
    return this.request('/stores/', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async getStores() {
    return this.request('/stores/');
  }

  async getStore(storeId: string) {
    return this.request(`/stores/${storeId}/`);
  }

  async updateStore(storeId: string, storeData: any) {
    return this.request(`/stores/${storeId}/`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  }

  async getStoreAnalytics(storeId: string, timeRange = '30d') {
    return this.request(`/stores/${storeId}/analytics/dashboard/?time_range=${timeRange}`);
  }

  // Theme Methods
  async getThemes(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/stores/themes/?${params}`);
  }

  async applyTheme(storeId: string, themeId: string, customColors?: any) {
    return this.request(`/stores/${storeId}/apply-theme/`, {
      method: 'POST',
      body: JSON.stringify({ theme_id: themeId, custom_colors: customColors }),
    });
  }

  async getThemeCustomization(storeId: string) {
    return this.request(`/stores/${storeId}/theme-customization/`);
  }

  // Product Methods
  async getProducts(storeId?: string, filters: any = {}) {
    const params = new URLSearchParams({ ...filters, ...(storeId && { store: storeId }) });
    return this.request(`/products/?${params}`);
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}/`);
  }

  async createProduct(productData: any) {
    return this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}/`, {
      method: 'DELETE',
    });
  }

  async getProductClasses(storeId?: string) {
    const params = storeId ? `?store=${storeId}` : '';
    return this.request(`/products/classes/${params}`);
  }

  async getCategories(storeId?: string) {
    const params = storeId ? `?store=${storeId}` : '';
    return this.request(`/products/categories/${params}`);
  }

  // Cart Methods
  async getCart(storeId: string) {
    return this.request(`/cart/items/?store=${storeId}`);
  }

  async addToCart(productId: string, quantity = 1, variantId?: string, storeId?: string) {
    return this.request('/cart/add-to-cart/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
        quantity,
        store_id: storeId,
      }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart(storeId: string) {
    return this.request('/cart/clear/', {
      method: 'POST',
      body: JSON.stringify({ store_id: storeId }),
    });
  }

  // Order Methods
  async createOrder(orderData: any) {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(storeId?: string) {
    const params = storeId ? `?store=${storeId}` : '';
    return this.request(`/orders/${params}`);
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}/`);
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return this.request(`/orders/${orderId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Payment Methods
  async initiatePayment(orderId: string, gateway = 'zarinpal') {
    return this.request(`/orders/${orderId}/payment/`, {
      method: 'POST',
      body: JSON.stringify({ gateway }),
    });
  }

  async verifyPayment(orderId: string, transactionData: any) {
    return this.request(`/orders/${orderId}/payment/verify/`, {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Social Media Import Methods
  async importFromSocialMedia(platform: string, accountUsername: string, maxPosts = 5) {
    return this.request('/social-media/import/', {
      method: 'POST',
      body: JSON.stringify({
        platform,
        account_username: accountUsername,
        max_posts: maxPosts,
      }),
    });
  }

  async getSocialMediaPosts(platform: string, accountUsername: string) {
    return this.request(`/social-media/posts/?platform=${platform}&username=${accountUsername}`);
  }

  // User Profile Methods
  async getProfile() {
    return this.request('/accounts/profile/');
  }

  async updateProfile(profileData: any) {
    return this.request('/accounts/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getAddresses() {
    const profile = await this.getProfile();
    return profile.addresses || [];
  }

  async addAddress(addressData: any) {
    return this.request('/accounts/addresses/', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(addressId: string, addressData: any) {
    return this.request(`/accounts/addresses/${addressId}/`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(addressId: string) {
    return this.request(`/accounts/addresses/${addressId}/`, {
      method: 'DELETE',
    });
  }

  // Store Settings Methods
  async getStoreSettings(storeId: string) {
    return this.request(`/stores/settings/?store=${storeId}`);
  }

  async updateStoreSettings(storeId: string, settings: any) {
    return this.request(`/stores/settings/?store=${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Analytics Methods
  async getStoreStatistics(storeId: string) {
    return this.request(`/stores/statistics/?store=${storeId}`);
  }

  async getSalesAnalytics(storeId: string, timeRange = '30d') {
    return this.request(`/stores/${storeId}/analytics/sales/?time_range=${timeRange}`);
  }

  async getVisitorAnalytics(storeId: string, timeRange = '30d') {
    return this.request(`/stores/${storeId}/analytics/visitors/?time_range=${timeRange}`);
  }

  // Domain Management Methods
  async validateSubdomain(subdomain: string) {
    return this.request('/stores/validate/subdomain/', {
      method: 'POST',
      body: JSON.stringify({ subdomain }),
    });
  }

  async validateDomain(domain: string) {
    return this.request('/stores/validate/domain/', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
  }

  async setupDomain(storeId: string, domain: string) {
    return this.request('/stores/domain/setup/', {
      method: 'POST',
      body: JSON.stringify({ store_id: storeId, domain }),
    });
  }

  // Utility Methods
  async uploadFile(file: File, path = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  }

  // Generic Methods
  async get(endpoint: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`${endpoint}${query}`);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;