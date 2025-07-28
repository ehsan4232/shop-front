import axios, { AxiosResponse } from 'axios'
import { useAuthStore } from './store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// API Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

// Auth API
export const authApi = {
  sendOtp: (phone: string) => api.post('/auth/send-otp/', { phone }),
  verifyOtp: (phone: string, code: string) => api.post('/auth/verify-otp/', { phone, code }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
}

// Store API
export const storeApi = {
  getStores: () => api.get('/stores/'),
  getStore: (id: string) => api.get(`/stores/${id}/`),
  createStore: (data: any) => api.post('/stores/', data),
  updateStore: (id: string, data: any) => api.patch(`/stores/${id}/`, data),
  getStoreByDomain: (domain: string) => api.get(`/stores/by-domain/${domain}/`),
}

// Product API
export const productApi = {
  getCategories: (storeId?: string) => api.get('/products/categories/', { params: { store: storeId } }),
  getProducts: (params?: any) => api.get('/products/products/', { params }),
  getProduct: (id: string) => api.get(`/products/products/${id}/`),
  createProduct: (data: any) => api.post('/products/products/', data),
  updateProduct: (id: string, data: any) => api.patch(`/products/products/${id}/`, data),
  deleteProduct: (id: string) => api.delete(`/products/products/${id}/`),
  getInstances: (productId: string) => api.get(`/products/instances/`, { params: { product: productId } }),
}

// Order API
export const orderApi = {
  getOrders: (params?: any) => api.get('/orders/orders/', { params }),
  getOrder: (id: string) => api.get(`/orders/orders/${id}/`),
  createOrder: (data: any) => api.post('/orders/orders/', data),
  updateOrder: (id: string, data: any) => api.patch(`/orders/orders/${id}/`, data),
  getCart: () => api.get('/orders/cart/'),
  addToCart: (data: any) => api.post('/orders/cart/add/', data),
  updateCartItem: (id: string, data: any) => api.patch(`/orders/cart/items/${id}/`, data),
  removeFromCart: (id: string) => api.delete(`/orders/cart/items/${id}/`),
  checkout: (data: any) => api.post('/orders/checkout/', data),
}

export default api