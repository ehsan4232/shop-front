import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'IRR') {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('fa-IR').format(num)
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // Keep Persian characters, alphanumeric, spaces, and hyphens
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidPhoneNumber(phone: string) {
  const phoneRegex = /^09\d{9}$/
  return phoneRegex.test(phone)
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}