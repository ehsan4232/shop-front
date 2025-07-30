class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  private async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params
    } = config

    // Build URL with query parameters
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    // Prepare headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData (browser will set it)
        delete requestHeaders['Content-Type']
        requestOptions.body = body
      } else {
        requestOptions.body = JSON.stringify(body)
      }
    }

    try {
      const response = await fetch(url.toString(), requestOptions)

      // Handle different response types
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new ApiError(
          data?.message || data?.detail || `HTTP Error: ${response.status}`,
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Handle network errors
      throw new ApiError(
        'شبکه در دسترس نیست',
        0,
        { originalError: error }
      )
    }
  }

  // GET request
  async get<T = any>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  // POST request
  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  // PUT request
  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  // PATCH request
  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Upload file
  async upload<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
    }

    return this.request<T>(endpoint, { method: 'POST', body: formData })
  }

  // Set auth token
  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  // Clear auth token
  clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Get current auth token
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// Export types and client
export { ApiClient, ApiError, type RequestConfig }
export default apiClient

// API Service Classes
export class AuthService {
  static async login(phone: string, password: string) {
    return apiClient.post('/auth/login/', { phone, password })
  }

  static async register(userData: {
    phone: string
    first_name: string
    last_name: string
    password: string
  }) {
    return apiClient.post('/auth/register/', userData)
  }

  static async sendOTP(phone: string) {
    return apiClient.post('/auth/send-otp/', { phone })
  }

  static async verifyOTP(phone: string, otp: string) {
    return apiClient.post('/auth/verify-otp/', { phone, otp })
  }

  static async logout() {
    const result = await apiClient.post('/auth/logout/')
    apiClient.clearAuthToken()
    return result
  }

  static async getProfile() {
    return apiClient.get('/auth/profile/')
  }

  static async updateProfile(data: any) {
    return apiClient.put('/auth/profile/', data)
  }
}

export class StoreService {
  static async getStores(params?: Record<string, string>) {
    return apiClient.get('/stores/', params)
  }

  static async getStore(id: string) {
    return apiClient.get(`/stores/${id}/`)
  }

  static async createStore(data: any) {
    return apiClient.post('/stores/', data)
  }

  static async updateStore(id: string, data: any) {
    return apiClient.put(`/stores/${id}/`, data)
  }

  static async deleteStore(id: string) {
    return apiClient.delete(`/stores/${id}/`)
  }

  static async getStoreAnalytics(id: string, params?: Record<string, string>) {
    return apiClient.get(`/stores/${id}/analytics/`, params)
  }
}

export class ProductService {
  static async getProducts(storeId?: string, params?: Record<string, string>) {
    const endpoint = storeId ? `/stores/${storeId}/products/` : '/products/'
    return apiClient.get(endpoint, params)
  }

  static async getProduct(id: string) {
    return apiClient.get(`/products/${id}/`)
  }

  static async createProduct(data: any) {
    return apiClient.post('/products/', data)
  }

  static async updateProduct(id: string, data: any) {
    return apiClient.put(`/products/${id}/`, data)
  }

  static async deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}/`)
  }

  static async uploadProductImage(productId: string, file: File) {
    return apiClient.upload(`/products/${productId}/images/`, file)
  }

  static async getCategories(storeId: string) {
    return apiClient.get(`/stores/${storeId}/categories/`)
  }

  static async createCategory(storeId: string, data: any) {
    return apiClient.post(`/stores/${storeId}/categories/`, data)
  }

  static async getBrands(storeId: string) {
    return apiClient.get(`/stores/${storeId}/brands/`)
  }

  static async createBrand(storeId: string, data: any) {
    return apiClient.post(`/stores/${storeId}/brands/`, data)
  }
}

export class OrderService {
  static async getOrders(storeId?: string, params?: Record<string, string>) {
    const endpoint = storeId ? `/stores/${storeId}/orders/` : '/orders/'
    return apiClient.get(endpoint, params)
  }

  static async getOrder(id: string) {
    return apiClient.get(`/orders/${id}/`)
  }

  static async createOrder(data: any) {
    return apiClient.post('/orders/', data)
  }

  static async updateOrderStatus(id: string, status: string, notes?: string) {
    return apiClient.patch(`/orders/${id}/`, { status, notes })
  }

  static async getCart(storeId: string) {
    return apiClient.get(`/stores/${storeId}/cart/`)
  }

  static async addToCart(storeId: string, productId: string, quantity: number, variantId?: string) {
    return apiClient.post(`/stores/${storeId}/cart/items/`, {
      product_id: productId,
      variant_id: variantId,
      quantity
    })
  }

  static async updateCartItem(storeId: string, itemId: string, quantity: number) {
    return apiClient.patch(`/stores/${storeId}/cart/items/${itemId}/`, { quantity })
  }

  static async removeFromCart(storeId: string, itemId: string) {
    return apiClient.delete(`/stores/${storeId}/cart/items/${itemId}/`)
  }

  static async clearCart(storeId: string) {
    return apiClient.delete(`/stores/${storeId}/cart/`)
  }
}

export class PaymentService {
  static async createPayment(orderId: string, gateway: string = 'zarinpal') {
    return apiClient.post('/payments/', {
      order_id: orderId,
      gateway
    })
  }

  static async verifyPayment(paymentId: string, authority?: string) {
    return apiClient.post(`/payments/${paymentId}/verify/`, { authority })
  }

  static async getPaymentMethods(storeId: string) {
    return apiClient.get(`/stores/${storeId}/payment-methods/`)
  }

  static async getPaymentHistory(params?: Record<string, string>) {
    return apiClient.get('/payments/', params)
  }
}
