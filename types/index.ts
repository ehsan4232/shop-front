// Base types
export interface BaseModel {
  id: string
  created_at: string
  updated_at: string
}

// User & Authentication types
export interface User extends BaseModel {
  phone: string
  first_name: string
  last_name: string
  email?: string
  is_store_owner: boolean
  is_customer: boolean
  is_verified: boolean
  avatar?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other'
  city?: string
  state?: string
  address?: string
  postal_code?: string
  language: 'fa' | 'en'
  timezone: string
  accepts_marketing: boolean
  last_login_ip?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface OTPVerification {
  phone: string
  otp_code: string
  purpose: 'login' | 'register' | 'password_reset' | 'phone_verification'
  is_verified: boolean
  expires_at: string
}

// Store types
export interface Store extends BaseModel {
  owner: string
  name: string
  name_fa: string
  slug: string
  description?: string
  store_type: 'general' | 'fashion' | 'jewelry' | 'electronics' | 'home_garden' | 'beauty' | 'sports' | 'books' | 'food' | 'automotive' | 'services'
  subscription_plan: 'free' | 'basic' | 'pro' | 'enterprise'
  subscription_expires_at?: string
  logo?: string
  banner?: string
  primary_color: string
  secondary_color: string
  theme: string
  layout: 'grid' | 'list' | 'masonry' | 'carousel'
  custom_css?: string
  custom_domain?: string
  is_subdomain_active: boolean
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  instagram_url?: string
  telegram_url?: string
  whatsapp_number?: string
  currency: string
  tax_rate: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  is_active: boolean
  is_verified: boolean
  is_featured: boolean
  total_products: number
  total_orders: number
  total_customers: number
  monthly_revenue: number
  last_activity: string
}

export interface StoreStaff extends BaseModel {
  store: string
  user: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  permissions: Record<string, any>
  is_active: boolean
  invited_by?: string
}

export interface StoreSetting extends BaseModel {
  store: string
  key: string
  value: string
  value_type: 'string' | 'integer' | 'float' | 'boolean' | 'json'
  description?: string
}

// Product types
export interface ProductCategory extends BaseModel {
  store: string
  name: string
  name_fa: string
  slug: string
  description?: string
  parent?: string
  children?: ProductCategory[]
  icon?: string
  image?: string
  display_order: number
  is_active: boolean
  product_count: number
  level: number
  lft: number
  rght: number
  tree_id: number
}

export interface Brand extends BaseModel {
  store: string
  name: string
  name_fa: string
  slug: string
  logo?: string
  description?: string
  is_active: boolean
  product_count: number
}

export interface ProductAttribute {
  name: string
  attribute_type: 'text' | 'color' | 'size' | 'number' | 'choice'
  values: string[]
}

export interface Product extends BaseModel {
  store: string
  category: string
  brand?: string
  name: string
  name_fa: string
  slug: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  cost_price?: number
  sku?: string
  stock_quantity: number
  manage_stock: boolean
  low_stock_threshold: number
  featured_image?: string
  weight?: number
  meta_title?: string
  meta_description?: string
  status: 'draft' | 'published' | 'archived' | 'out_of_stock'
  is_featured: boolean
  view_count: number
  sales_count: number
  imported_from_social: boolean
  social_media_source?: 'telegram' | 'instagram'
  social_media_post_id?: string
  published_at?: string
  
  // Computed properties
  in_stock: boolean
  discount_percentage: number
  is_low_stock: boolean
  
  // Related data
  images?: ProductImage[]
  variants?: ProductVariant[]
  category_data?: ProductCategory
  brand_data?: Brand
}

export interface ProductVariant extends BaseModel {
  product: string
  sku: string
  price: number
  compare_price?: number
  stock_quantity: number
  image?: string
  attributes: Record<string, any>
  is_active: boolean
  is_default: boolean
  
  // Computed properties
  in_stock: boolean
  discount_percentage: number
}

export interface ProductImage extends BaseModel {
  product: string
  variant?: string
  image: string
  alt_text?: string
  is_featured: boolean
  display_order: number
  imported_from_social: boolean
  social_media_url?: string
}

export interface Collection extends BaseModel {
  store: string
  name: string
  name_fa: string
  slug: string
  description?: string
  featured_image?: string
  is_featured: boolean
  display_order: number
  is_active: boolean
  products: string[]
}

// Order types
export interface Cart extends BaseModel {
  user?: string
  store: string
  session_key?: string
  total_items: number
  total_amount: number
  discount_amount: number
  tax_amount: number
  shipping_amount: number
  final_amount: number
  coupon_code?: string
  items: CartItem[]
}

export interface CartItem extends BaseModel {
  cart: string
  product: string
  variant?: string
  quantity: number
  unit_price: number
  custom_attributes: Record<string, any>
  notes?: string
  added_at: string
  
  // Computed properties
  total_price: number
  
  // Related data
  product_data?: Product
  variant_data?: ProductVariant
}

export interface Wishlist extends BaseModel {
  customer: string
  store: string
  product: string
  variant?: string
  notes?: string
  priority: 1 | 2 | 3
  price_when_added: number
  notify_on_discount: boolean
  notify_on_availability: boolean
  
  // Computed properties
  current_price: number
  price_difference: number
  has_discount: boolean
  is_available: boolean
  
  // Related data
  product_data?: Product
  variant_data?: ProductVariant
}

export interface Order extends BaseModel {
  order_number: string
  store: string
  customer: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  
  // Customer information
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  customer_email?: string
  
  // Shipping address
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  
  // Billing address
  billing_address?: string
  billing_city?: string
  billing_state?: string
  billing_postal_code?: string
  
  // Financial information
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  coupon_code?: string
  
  // Shipping information
  shipping_method?: string
  tracking_number?: string
  
  // Additional information
  notes?: string
  admin_notes?: string
  
  // Timestamps
  shipped_at?: string
  delivered_at?: string
  
  // Related data
  items: OrderItem[]
  customer_data?: User
  store_data?: Store
  status_history?: OrderStatusHistory[]
  payments?: Payment[]
}

export interface OrderItem extends BaseModel {
  order: string
  product: string
  variant?: string
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_sku?: string
  custom_attributes: Record<string, any>
  
  // Related data
  product_data?: Product
  variant_data?: ProductVariant
}

export interface OrderStatusHistory extends BaseModel {
  order: string
  old_status: string
  new_status: string
  notes?: string
  changed_by?: string
}

// Payment types
export interface PaymentMethod extends BaseModel {
  store: string
  name: string
  gateway: string
  config: Record<string, any>
  is_active: boolean
  display_order: number
  fee_percentage: number
  min_amount?: number
  max_amount?: number
}

export interface Payment extends BaseModel {
  order: string
  payment_method: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'
  gateway_transaction_id?: string
  gateway_payment_url?: string
  gateway_response?: Record<string, any>
  reference_number?: string
  failure_reason?: string
  refunded_amount: number
  paid_at?: string
  refunded_at?: string
  
  // Related data
  order_data?: Order
  payment_method_data?: PaymentMethod
}

// Social Media types
export interface SocialMediaAccount extends BaseModel {
  store: string
  platform: 'telegram' | 'instagram'
  username: string
  access_token?: string
  is_active: boolean
  last_sync_at?: string
  sync_settings: Record<string, any>
}

export interface SocialMediaPost extends BaseModel {
  store: string
  platform: 'telegram' | 'instagram'
  external_id: string
  content?: string
  post_url?: string
  published_at?: string
  media_files: Array<{
    type: 'image' | 'video'
    file_path: string
    original_url: string
  }>
  is_processed: boolean
  created_product?: string
  raw_data: Record<string, any>
  
  // Related data
  created_product_data?: Product
}

// Notification types
export interface UserNotification extends BaseModel {
  user: string
  title: string
  message: string
  notification_type: 'order_status' | 'payment' | 'promotion' | 'system' | 'security'
  is_read: boolean
  action_url?: string
  data: Record<string, any>
  read_at?: string
}

// Analytics types
export interface StoreAnalytics {
  total_products: number
  total_orders: number
  total_customers: number
  total_revenue: number
  monthly_revenue: number
  conversion_rate: number
  average_order_value: number
  top_products: Array<{
    product: Product
    sales_count: number
    revenue: number
  }>
  recent_orders: Order[]
  low_stock_products: Product[]
  revenue_chart: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

export interface ProductAnalytics {
  total_views: number
  total_sales: number
  conversion_rate: number
  revenue: number
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  view_chart: Array<{
    date: string
    views: number
  }>
  sales_chart: Array<{
    date: string
    sales: number
  }>
}

export interface PaymentAnalytics {
  total_payments: number
  successful_payments: number
  success_rate: number
  total_amount: number
  average_amount: number
  payment_methods: Array<{
    payment_method__name: string
    count: number
    amount: number
  }>
  daily_stats: Array<{
    day: string
    count: number
    amount: number
  }>
}

// API Response types
export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Form types
export interface LoginForm {
  phone: string
  password: string
}

export interface RegisterForm {
  phone: string
  first_name: string
  last_name: string
  password: string
  confirm_password: string
}

export interface OTPForm {
  phone: string
  otp: string
}

export interface StoreForm {
  name: string
  name_fa: string
  store_type: string
  description?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
}

export interface ProductForm {
  name: string
  name_fa: string
  category: string
  brand?: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  stock_quantity: number
  sku?: string
  weight?: number
  status: string
  is_featured: boolean
}

export interface OrderForm {
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  notes?: string
}

// Filter types
export interface ProductFilters {
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  is_featured?: boolean
  search?: string
  sort?: 'created_at' | '-created_at' | 'price' | '-price' | 'name' | '-name' | 'sales_count' | '-sales_count'
}

export interface OrderFilters {
  status?: string
  payment_status?: string
  start_date?: string
  end_date?: string
  customer?: string
  search?: string
  sort?: 'created_at' | '-created_at' | 'total_amount' | '-total_amount'
}

export interface StoreFilters {
  store_type?: string
  subscription_plan?: string
  is_verified?: boolean
  is_active?: boolean
  search?: string
  sort?: 'created_at' | '-created_at' | 'name' | '-name'
}

// Component prop types
export interface LoadingState {
  loading: boolean
  error?: string | null
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  loading?: boolean
}

export interface FilterProps<T> {
  filters: T
  onChange: (filters: T) => void
  onReset: () => void
}

// Chart data types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export interface MetricCard {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: string
}
