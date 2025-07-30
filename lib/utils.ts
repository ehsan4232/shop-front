import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product, ProductFilters } from "@/types"

// Base utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Persian number utilities
export const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
export const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export function toPersianNumber(input: string | number): string {
  let str = input.toString()
  for (let i = 0; i < englishNumbers.length; i++) {
    str = str.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i])
  }
  return str
}

export function toEnglishNumber(input: string): string {
  let str = input.toString()
  for (let i = 0; i < persianNumbers.length; i++) {
    str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i])
  }
  return str
}

// Price formatting utilities
export function formatPrice(price: number, currency: string = 'تومان'): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(price)
  return `${toPersianNumber(formatted)} ${currency}`
}

export function formatCompactPrice(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000
    return `${toPersianNumber(millions.toFixed(1))} میلیون`
  } else if (price >= 1000) {
    const thousands = price / 1000
    return `${toPersianNumber(thousands.toFixed(0))} هزار`
  }
  return toPersianNumber(price.toString())
}

// Date formatting utilities
export function formatPersianDate(date: string | Date, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (includeTime) {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj)
  }
  
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'همین الان'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} روز پیش`
  
  return formatPersianDate(dateObj)
}

// Text utilities
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\u0600-\u06FF\w]+/g
  return text.match(hashtagRegex) || []
}

export function removeHashtags(text: string): string {
  return text.replace(/#[\u0600-\u06FF\w]+/g, '').trim()
}

// URL utilities
export function createSearchParams(filters: Partial<ProductFilters>): string {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()))
      } else {
        params.append(key, value.toString())
      }
    }
  })
  
  return params.toString()
}

export function parseSearchParams(searchParams: URLSearchParams): Partial<ProductFilters> {
  const filters: Partial<ProductFilters> = {}
  
  // Handle array parameters
  const arrayParams = ['tags']
  arrayParams.forEach(param => {
    const values = searchParams.getAll(param)
    if (values.length > 0) {
      filters[param as keyof ProductFilters] = values as any
    }
  })
  
  // Handle single value parameters
  const singleParams = ['category', 'brand', 'product_class', 'search', 'sort']
  singleParams.forEach(param => {
    const value = searchParams.get(param)
    if (value) {
      filters[param as keyof ProductFilters] = value as any
    }
  })
  
  // Handle numeric parameters
  const numericParams = ['min_price', 'max_price']
  numericParams.forEach(param => {
    const value = searchParams.get(param)
    if (value && !isNaN(Number(value))) {
      filters[param as keyof ProductFilters] = Number(value) as any
    }
  })
  
  // Handle boolean parameters
  const booleanParams = ['in_stock', 'is_featured']
  booleanParams.forEach(param => {
    const value = searchParams.get(param)
    if (value === 'true' || value === 'false') {
      filters[param as keyof ProductFilters] = value === 'true' as any
    }
  })
  
  return filters
}

// Image utilities
export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return '/placeholder-image.jpg'
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url
  
  // Add optimization parameters if needed
  if (width || height) {
    const params = new URLSearchParams()
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', '85') // Quality
    
    return `${url}?${params.toString()}`
  }
  
  return url
}

// Validation utilities
export function isValidIranianPhone(phone: string): boolean {
  const iranianPhoneRegex = /^(\+98|0)?9\d{9}$/
  return iranianPhoneRegex.test(phone)
}

export function normalizeIranianPhone(phone: string): string {
  // Remove spaces and dashes
  phone = phone.replace(/[\s-]/g, '')
  
  // Convert to +98 format
  if (phone.startsWith('0')) {
    return '+98' + phone.substring(1)
  } else if (phone.startsWith('98')) {
    return '+' + phone
  } else if (!phone.startsWith('+98')) {
    return '+98' + phone
  }
  
  return phone
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Product utilities
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function getProductStatus(product: Product): {
  label: string
  color: string
  icon: string
} {
  if (!product.in_stock) {
    return { label: 'ناموجود', color: 'red', icon: 'x-circle' }
  }
  
  if (product.is_low_stock) {
    return { label: 'موجودی کم', color: 'yellow', icon: 'exclamation-triangle' }
  }
  
  if (product.is_featured) {
    return { label: 'ویژه', color: 'purple', icon: 'star' }
  }
  
  return { label: 'موجود', color: 'green', icon: 'check-circle' }
}

// Storage utilities (for client-side only)
export function setLocalStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to set localStorage:', error)
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to get localStorage:', error)
    return defaultValue
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove localStorage:', error)
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Array utilities
export function groupBy<T, K extends string | number>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = key(item)
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export function unique<T>(array: T[], key?: (item: T) => any): T[] {
  if (!key) {
    return [...new Set(array)]
  }
  
  const seen = new Set()
  return array.filter(item => {
    const keyValue = key(item)
    if (seen.has(keyValue)) {
      return false
    }
    seen.add(keyValue)
    return true
  })
}

// API utilities
export function handleApiError(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors
    const firstError = Object.values(errors)[0]
    return Array.isArray(firstError) ? firstError[0] : firstError
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'خطای ناشناخته‌ای رخ داده است'
}

export function buildApiUrl(baseUrl: string, endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, baseUrl)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  
  return url.toString()
}