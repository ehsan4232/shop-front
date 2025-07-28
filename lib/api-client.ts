const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
  meta?: {
    pagination?: {
      page: number
      pages: number
      per_page: number
      total: number
    }
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get auth token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    const headers = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || 'خطایی رخ داده است',
          errors: data.errors,
          status: response.status,
        } as ApiError
      }

      return data
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'خطا در اتصال به سرور',
          status: 0,
        } as ApiError
      }
      throw error
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<T>(`${endpoint}${searchParams}`)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // File upload method
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    })
  }

  // Authentication methods
  async login(credentials: { phone: string; password?: string; otp_code?: string }) {
    return this.post<{ token: string; user: any }>('/auth/login/', credentials)
  }

  async register(userData: { phone: string; first_name?: string; last_name?: string }) {
    return this.post<{ user: any }>('/auth/register/', userData)
  }

  async requestOTP(phone: string) {
    return this.post<{ message: string }>('/auth/otp/request/', { phone })
  }

  async verifyOTP(phone: string, otp_code: string) {
    return this.post<{ token: string; user: any }>('/auth/otp/verify/', { phone, otp_code })
  }

  async logout() {
    const response = await this.post<{ message: string }>('/auth/logout/')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
    return response
  }

  async refreshToken() {
    return this.post<{ token: string }>('/auth/refresh/')
  }

  // Store methods
  async getStores(params?: { page?: number; search?: string }) {
    return this.get<any[]>('/stores/', params)
  }

  async getStore(storeId: string) {
    return this.get<any>(`/stores/${storeId}/`)
  }

  async createStore(storeData: any) {
    return this.post<any>('/stores/', storeData)
  }

  async updateStore(storeId: string, storeData: any) {
    return this.patch<any>(`/stores/${storeId}/`, storeData)
  }

  // Product methods
  async getProducts(storeId: string, params?: { 
    page?: number
    category?: string
    search?: string
    min_price?: number
    max_price?: number
  }) {
    return this.get<any[]>(`/stores/${storeId}/products/`, params)
  }

  async getProduct(storeId: string, productId: string) {
    return this.get<any>(`/stores/${storeId}/products/${productId}/`)
  }

  async createProduct(storeId: string, productData: any) {
    return this.post<any>(`/stores/${storeId}/products/`, productData)
  }

  async updateProduct(storeId: string, productId: string, productData: any) {
    return this.patch<any>(`/stores/${storeId}/products/${productId}/`, productData)
  }

  async deleteProduct(storeId: string, productId: string) {
    return this.delete<any>(`/stores/${storeId}/products/${productId}/`)
  }

  // Category methods
  async getCategories(storeId: string) {
    return this.get<any[]>(`/stores/${storeId}/categories/`)
  }

  async createCategory(storeId: string, categoryData: any) {
    return this.post<any>(`/stores/${storeId}/categories/`, categoryData)
  }

  // Order methods
  async getOrders(storeId: string, params?: { page?: number; status?: string }) {
    return this.get<any[]>(`/stores/${storeId}/orders/`, params)
  }

  async getOrder(storeId: string, orderId: string) {
    return this.get<any>(`/stores/${storeId}/orders/${orderId}/`)
  }

  async updateOrderStatus(storeId: string, orderId: string, status: string) {
    return this.patch<any>(`/stores/${storeId}/orders/${orderId}/`, { status })
  }

  // Cart methods
  async getCart(storeId: string) {
    return this.get<any>(`/stores/${storeId}/cart/`)
  }

  async addToCart(storeId: string, productId: string, quantity: number, variantId?: string) {
    return this.post<any>(`/stores/${storeId}/cart/items/`, {
      product_id: productId,
      quantity,
      variant_id: variantId,
    })
  }

  async updateCartItem(storeId: string, itemId: string, quantity: number) {
    return this.patch<any>(`/stores/${storeId}/cart/items/${itemId}/`, { quantity })
  }

  async removeFromCart(storeId: string, itemId: string) {
    return this.delete<any>(`/stores/${storeId}/cart/items/${itemId}/`)
  }

  // Social media methods
  async getSocialAccounts(storeId: string) {
    return this.get<any[]>(`/stores/${storeId}/social-accounts/`)
  }

  async addSocialAccount(storeId: string, accountData: any) {
    return this.post<any>(`/stores/${storeId}/social-accounts/`, accountData)
  }

  async importFromSocial(storeId: string, accountId: string, options?: any) {
    return this.post<any>(`/stores/${storeId}/social-accounts/${accountId}/import/`, options)
  }

  // Analytics methods
  async getAnalytics(storeId: string, params?: { 
    start_date?: string
    end_date?: string
    metrics?: string[]
  }) {
    return this.get<any>(`/stores/${storeId}/analytics/`, params)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
