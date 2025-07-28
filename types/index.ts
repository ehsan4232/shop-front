// Base types
export interface User {
  id: string
  phone: string
  first_name: string
  last_name: string
  email?: string
  is_store_owner: boolean
  is_customer: boolean
  is_verified: boolean
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Store {
  id: string
  owner: string
  name: string
  name_fa: string
  slug: string
  description?: string
  description_fa?: string
  logo?: string
  banner?: string
  domain?: string
  subdomain: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  currency: string
  is_active: boolean
  is_verified: boolean
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  store: string
  name: string
  name_fa: string
  slug: string
  description?: string
  parent?: string
  children: ProductCategory[]
  icon?: string
  banner_image?: string
  display_order: number
  show_in_menu: boolean
  is_active: boolean
  product_count: number
  created_at: string
}

export interface AttributeType {
  id: string
  name: string
  name_fa: string
  display_type: 'text' | 'number' | 'color' | 'choice' | 'multi_choice' | 'range' | 'boolean'
  filter_type: 'exact' | 'range' | 'choice' | 'boolean' | 'search' | 'none'
  unit?: string
  predefined_choices: string[]
  is_filterable: boolean
  is_searchable: boolean
  show_in_listing: boolean
}

export interface ProductAttribute {
  id: string
  category: string
  attribute_type: AttributeType
  is_required: boolean
  display_order: number
  custom_choices: string[]
  min_value?: number
  max_value?: number
}

export interface Brand {
  id: string
  store: string
  name: string
  name_fa: string
  slug: string
  logo?: string
  description?: string
  website?: string
  is_featured: boolean
  is_active: boolean
  product_count: number
}

export interface Tag {
  id: string
  store: string
  name: string
  name_fa: string
  slug: string
  tag_type: 'general' | 'occasion' | 'season' | 'style' | 'material' | 'feature' | 'target' | 'price'
  color: string
  icon?: string
  is_featured: boolean
  usage_count: number
}

export interface Product {
  id: string
  store: string
  category: ProductCategory
  brand?: Brand
  name: string
  name_fa: string
  slug: string
  description?: string
  short_description?: string
  product_type: 'simple' | 'variable' | 'digital' | 'bundle' | 'subscription'
  base_price: number
  compare_price?: number
  cost_price?: number
  sku?: string
  stock_quantity: number
  manage_stock: boolean
  low_stock_threshold: number
  featured_image?: string
  status: 'draft' | 'published' | 'archived' | 'out_of_stock'
  is_featured: boolean
  is_digital: boolean
  tags: Tag[]
  view_count: number
  sales_count: number
  rating_average: number
  rating_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface ProductVariant {
  id: string
  product: string
  sku: string
  price: number
  compare_price?: number
  cost_price?: number
  stock_quantity: number
  weight?: number
  image?: string
  is_active: boolean
  is_default: boolean
  attribute_values: ProductAttributeValue[]
}

export interface ProductAttributeValue {
  id: string
  product?: string
  variant?: string
  attribute: ProductAttribute
  value_text?: string
  value_number?: number
  value_boolean?: boolean
  color_hex?: string
  color_image?: string
  value_image?: string
  display_value: string
}

export interface ProductImage {
  id: string
  product: string
  variant?: string
  image: string
  alt_text?: string
  title?: string
  is_featured: boolean
  display_order: number
}

export interface Order {
  id: string
  store: string
  customer: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_method?: string
  tracking_code?: string
  customer_notes?: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order: string
  product: string
  product_variant?: string
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_sku?: string
  product_attributes: Record<string, any>
}

export interface Cart {
  id: string
  customer: string
  store: string
  items: CartItem[]
  total_amount: number
  total_items: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart: string
  product: Product
  product_variant?: ProductVariant
  quantity: number
  unit_price: number
  total_price: number
  added_at: string
}

export interface PaymentGateway {
  id: string
  store: string
  gateway: 'zarinpal' | 'parsian' | 'mellat' | 'saman' | 'pasargad'
  merchant_id: string
  is_active: boolean
  is_sandbox: boolean
}

export interface Payment {
  id: string
  order: string
  gateway: PaymentGateway
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded'
  transaction_id?: string
  authority?: string
  reference_id?: string
  tracking_code?: string
  created_at: string
  paid_at?: string
}

export interface SocialMediaAccount {
  id: string
  store: string
  platform: 'telegram' | 'instagram'
  username: string
  account_id?: string
  is_active: boolean
  auto_import: boolean
  import_hashtags: string[]
  last_sync?: string
  created_at: string
}

export interface SocialMediaPost {
  id: string
  account: string
  post_id: string
  post_type: 'post' | 'story' | 'reel' | 'photo' | 'video'
  caption?: string
  media_urls: string[]
  hashtags: string[]
  is_imported: boolean
  imported_to_product?: string
  likes_count: number
  comments_count: number
  views_count: number
  posted_at: string
  created_at: string
}

export interface StoreTheme {
  id: string
  store: string
  name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  font_family: 'vazir' | 'iran-sans' | 'shabnam' | 'sahel' | 'tanha'
  font_size_base: number
  layout: 'modern' | 'classic' | 'minimal' | 'colorful' | 'elegant' | 'bold'
  header_style: 'fixed' | 'sticky' | 'static'
  footer_style: 'minimal' | 'detailed' | 'simple'
  products_per_page: number
  product_card_style: 'card' | 'list' | 'grid'
  show_product_badges: boolean
  custom_css?: string
  homepage_banner?: string
}

export interface StoreSettings {
  id: string
  store: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  google_analytics_id?: string
  sms_provider: 'kavenegar' | 'farapayamak' | 'melipayamak'
  sms_api_key?: string
  logistics_provider: 'post' | 'tipax' | 'chapar' | 'miare'
  return_policy?: string
  privacy_policy?: string
  terms_of_service?: string
  shipping_policy?: string
  enable_chat: boolean
  enable_reviews: boolean
  enable_wishlist: boolean
  enable_compare: boolean
  low_stock_threshold: number
  auto_reduce_stock: boolean
  allow_backorders: boolean
}

export interface StoreAnalytics {
  id: string
  store: string
  date: string
  visitors: number
  page_views: number
  unique_visitors: number
  bounce_rate: number
  orders_count: number
  revenue: number
  conversion_rate: number
  average_order_value: number
}

// Form types
export interface LoginForm {
  phone: string
  otp_code?: string
  password?: string
}

export interface RegisterForm {
  phone: string
  first_name?: string
  last_name?: string
  email?: string
}

export interface StoreForm {
  name: string
  name_fa: string
  slug: string
  description?: string
  description_fa?: string
  subdomain: string
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
  slug: string
  description?: string
  short_description?: string
  category: string
  brand?: string
  product_type: 'simple' | 'variable' | 'digital'
  base_price: number
  compare_price?: number
  sku?: string
  stock_quantity: number
  manage_stock: boolean
  status: 'draft' | 'published'
  is_featured: boolean
  tags: string[]
  meta_title?: string
  meta_description?: string
}

// API Response types
export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// Filter types
export interface ProductFilters {
  category?: string
  brand?: string
  tags?: string[]
  min_price?: number
  max_price?: number
  in_stock?: boolean
  is_featured?: boolean
  search?: string
  ordering?: 'name' | '-name' | 'price' | '-price' | 'created_at' | '-created_at' | 'sales_count' | '-sales_count'
}

export interface OrderFilters {
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
  search?: string
}
