// User Types
export interface User {
  id: string
  phone: string
  first_name?: string
  last_name?: string
  email?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

// Store Types
export interface Store {
  id: string
  name: string
  description?: string
  domain: string
  subdomain?: string
  logo?: string
  banner?: string
  owner: User
  is_active: boolean
  theme: StoreTheme
  created_at: string
  updated_at: string
}

export interface StoreTheme {
  id: string
  name: string
  primary_color: string
  secondary_color: string
  font_family: string
  layout: string
  custom_css?: string
  store: string
}

// Product Types
export interface ProductClass {
  id: string
  name: string
  slug: string
  description?: string
  parent?: string
  store: string
  attributes: ProductAttribute[]
  is_categorizer: boolean
  level: number
  created_at: string
  updated_at: string
}

export interface ProductAttribute {
  id: string
  name: string
  attribute_type: 'text' | 'number' | 'color' | 'boolean' | 'choice'
  is_required: boolean
  choices?: string[]
  product_class: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  product_class: ProductClass
  base_price: number
  images: ProductImage[]
  videos: ProductVideo[]
  is_active: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ProductInstance {
  id: string
  product: Product
  sku?: string
  price: number
  stock_quantity: number
  attribute_values: ProductAttributeValue[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductAttributeValue {
  id: string
  attribute: ProductAttribute
  value: string
  product_instance: string
}

export interface ProductImage {
  id: string
  image: string
  alt_text?: string
  is_primary: boolean
  order: number
  product: string
}

export interface ProductVideo {
  id: string
  video: string
  thumbnail?: string
  title?: string
  order: number
  product: string
}

// Order Types
export interface Order {
  id: string
  customer: User
  store: Store
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: ShippingAddress
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  tracking_code?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order: string
  product_instance: ProductInstance
  quantity: number
  price: number
  total: number
}

export interface ShippingAddress {
  id: string
  order: string
  full_name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code: string
  phone: string
}

// Cart Types
export interface CartItem {
  id: string
  product_instance: ProductInstance
  quantity: number
  price: number
}

export interface Cart {
  id: string
  customer: User
  store: Store
  items: CartItem[]
  total_amount: number
  created_at: string
  updated_at: string
}

// API Response Types
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

export interface ErrorResponse {
  error: string
  details?: Record<string, string[]>
  code?: string
}