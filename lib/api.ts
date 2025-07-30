import { 
  Product, 
  ProductClass, 
  ProductCategory, 
  Brand, 
  Tag, 
  AttributeType,
  ProductFilters,
  PaginatedResponse,
  Store,
  Cart,
  Order
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private baseURL: string
  private authToken?: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async login(phone: string, password: string) {
    return this.request<{ access: string; refresh: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    })
  }

  async register(userData: {
    phone: string
    first_name: string
    last_name: string
    password: string
  }) {
    return this.request<{ access: string; refresh: string; user: any }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async sendOTP(phone: string, purpose: string = 'login') {
    return this.request<{ message: string }>('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose }),
    })
  }

  async verifyOTP(phone: string, otp: string) {
    return this.request<{ access: string; refresh: string; user: any }>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    })
  }

  // Stores
  async getStores(filters?: any) {
    const params = new URLSearchParams(filters).toString()
    return this.request<PaginatedResponse<Store>>(`/stores/?${params}`)
  }

  async getStore(storeId: string) {
    return this.request<Store>(`/stores/${storeId}/`)
  }

  async createStore(storeData: Partial<Store>) {
    return this.request<Store>('/stores/', {
      method: 'POST',
      body: JSON.stringify(storeData),
    })
  }

  async updateStore(storeId: string, storeData: Partial<Store>) {
    return this.request<Store>(`/stores/${storeId}/`, {
      method: 'PATCH',
      body: JSON.stringify(storeData),
    })
  }

  // NEW: Attribute Types
  async getAttributeTypes() {
    return this.request<PaginatedResponse<AttributeType>>('/products/attribute-types/')
  }

  async getAttributeType(id: string) {
    return this.request<AttributeType>(`/products/attribute-types/${id}/`)
  }

  async createAttributeType(data: Partial<AttributeType>) {
    return this.request<AttributeType>('/products/attribute-types/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // NEW: Tags
  async getTags(storeId?: string, filters?: any) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<Tag>>(`/products/tags/?${params}`)
  }

  async getTag(id: string) {
    return this.request<Tag>(`/products/tags/${id}/`)
  }

  async createTag(data: Partial<Tag>) {
    return this.request<Tag>('/products/tags/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // NEW: Product Classes (Object-Oriented Hierarchy)
  async getProductClasses(storeId?: string, filters?: any) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<ProductClass>>(`/products/product-classes/?${params}`)
  }

  async getProductClass(id: string) {
    return this.request<ProductClass>(`/products/product-classes/${id}/`)
  }

  async createProductClass(data: Partial<ProductClass>) {
    return this.request<ProductClass>('/products/product-classes/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProductClass(id: string, data: Partial<ProductClass>) {
    return this.request<ProductClass>(`/products/product-classes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // NEW: Product Class Hierarchy
  async getProductClassHierarchy(storeId: string) {
    return this.request<ProductClass[]>(`/products/product-class-hierarchy/?store=${storeId}`)
  }

  // Categories
  async getCategories(storeId?: string, filters?: any) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<ProductCategory>>(`/products/categories/?${params}`)
  }

  async getCategory(id: string) {
    return this.request<ProductCategory>(`/products/categories/${id}/`)
  }

  async createCategory(data: Partial<ProductCategory>) {
    return this.request<ProductCategory>('/products/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: Partial<ProductCategory>) {
    return this.request<ProductCategory>(`/products/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Brands
  async getBrands(storeId?: string, filters?: any) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<Brand>>(`/products/brands/?${params}`)
  }

  async getBrand(id: string) {
    return this.request<Brand>(`/products/brands/${id}/`)
  }

  async createBrand(data: Partial<Brand>) {
    return this.request<Brand>('/products/brands/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBrand(id: string, data: Partial<Brand>) {
    return this.request<Brand>(`/products/brands/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Products - UPDATED
  async getProducts(storeId?: string, filters?: ProductFilters) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<Product>>(`/products/products/?${params}`)
  }

  async getProduct(slug: string, storeId?: string) {
    const params = storeId ? `?store=${storeId}` : ''
    return this.request<Product>(`/products/products/${slug}/${params}`)
  }

  async createProduct(data: Partial<Product>) {
    return this.request<Product>('/products/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(slug: string, data: Partial<Product>) {
    return this.request<Product>(`/products/products/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(slug: string) {
    return this.request<void>(`/products/products/${slug}/`, {
      method: 'DELETE',
    })
  }

  // NEW: Product search with enhanced features
  async searchProducts(storeId: string, query: string, limit: number = 10) {
    return this.request<{ products: Product[]; total_found: number }>(
      `/products/products/search/?store=${storeId}&query=${encodeURIComponent(query)}&limit=${limit}`
    )
  }

  // NEW: Product recommendations
  async getProductRecommendations(productSlug: string, storeId: string) {
    return this.request<Product[]>(`/products/products/${productSlug}/recommendations/?store=${storeId}`)
  }

  // NEW: Category filters
  async getCategoryFilters(categorySlug: string) {
    return this.request<Record<string, any>>(`/products/categories/${categorySlug}/filters/`)
  }

  // NEW: Store statistics
  async getStoreStatistics(storeId: string) {
    return this.request<{
      total_products: number
      total_product_classes: number
      total_categories: number
      total_brands: number
      featured_products: number
      recent_products: Product[]
      popular_products: Product[]
      featured_collections: any[]
    }>(`/products/store-statistics/?store=${storeId}`)
  }

  // NEW: Product analytics
  async getProductAnalytics(storeId: string) {
    return this.request<{
      total_products: number
      published_products: number
      draft_products: number
      out_of_stock_products: number
      low_stock_products: number
      featured_products: number
      total_variants: number
      total_product_classes: number
      total_categories: number
      total_brands: number
      avg_price: number
      total_views: number
      total_sales: number
    }>(`/products/analytics/?store=${storeId}`)
  }

  // NEW: Social media import
  async importFromSocialMedia(data: {
    social_media_post_id: string
    product_class_id: string
    category_id: string
    additional_data?: Record<string, any>
  }) {
    return this.request<{ message: string; product: Product }>('/products/import-social-media/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // NEW: Trending searches
  async getTrendingSearches() {
    return this.request<{ trending: Array<{ term: string; count: number }> }>('/products/trending-searches/')
  }

  // Cart
  async getCart(storeId: string) {
    return this.request<Cart>(`/orders/cart/?store=${storeId}`)
  }

  async addToCart(storeId: string, productId: string, variantId?: string, quantity: number = 1) {
    return this.request<Cart>('/orders/cart/add/', {
      method: 'POST',
      body: JSON.stringify({
        store: storeId,
        product: productId,
        variant: variantId,
        quantity,
      }),
    })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<Cart>(`/orders/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeCartItem(itemId: string) {
    return this.request<Cart>(`/orders/cart/items/${itemId}/`, {
      method: 'DELETE',
    })
  }

  async clearCart(storeId: string) {
    return this.request<{ message: string }>(`/orders/cart/clear/?store=${storeId}`, {
      method: 'POST',
    })
  }

  // Orders
  async getOrders(storeId?: string, filters?: any) {
    const params = new URLSearchParams({ 
      ...(storeId && { store: storeId }), 
      ...filters 
    }).toString()
    return this.request<PaginatedResponse<Order>>(`/orders/orders/?${params}`)
  }

  async getOrder(id: string) {
    return this.request<Order>(`/orders/orders/${id}/`)
  }

  async createOrder(data: {
    store: string
    customer_info: any
    shipping_info: any
    payment_method?: string
  }) {
    return this.request<Order>('/orders/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request<Order>(`/orders/orders/${id}/update-status/`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    })
  }

  // Wishlist
  async getWishlist(storeId?: string) {
    const params = storeId ? `?store=${storeId}` : ''
    return this.request<PaginatedResponse<any>>(`/orders/wishlist/${params}`)
  }

  async addToWishlist(data: {
    store: string
    product: string
    variant?: string
  }) {
    return this.request<any>('/orders/wishlist/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async removeFromWishlist(id: string) {
    return this.request<void>(`/orders/wishlist/${id}/`, {
      method: 'DELETE',
    })
  }

  async moveWishlistToCart(id: string, quantity: number = 1) {
    return this.request<{ success: boolean; cart_item: any }>(`/orders/wishlist/${id}/move-to-cart/`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    })
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export individual API functions for easier use
export const authApi = {
  login: (phone: string, password: string) => apiClient.login(phone, password),
  register: (userData: any) => apiClient.register(userData),
  sendOTP: (phone: string, purpose?: string) => apiClient.sendOTP(phone, purpose),
  verifyOTP: (phone: string, otp: string) => apiClient.verifyOTP(phone, otp),
}

export const storeApi = {
  getStores: (filters?: any) => apiClient.getStores(filters),
  getStore: (storeId: string) => apiClient.getStore(storeId),
  createStore: (data: Partial<Store>) => apiClient.createStore(data),
  updateStore: (storeId: string, data: Partial<Store>) => apiClient.updateStore(storeId, data),
}

export const productApi = {
  // Core product operations
  getProducts: (storeId?: string, filters?: ProductFilters) => apiClient.getProducts(storeId, filters),
  getProduct: (slug: string, storeId?: string) => apiClient.getProduct(slug, storeId),
  createProduct: (data: Partial<Product>) => apiClient.createProduct(data),
  updateProduct: (slug: string, data: Partial<Product>) => apiClient.updateProduct(slug, data),
  deleteProduct: (slug: string) => apiClient.deleteProduct(slug),
  
  // Product classes (NEW)
  getProductClasses: (storeId?: string, filters?: any) => apiClient.getProductClasses(storeId, filters),
  getProductClass: (id: string) => apiClient.getProductClass(id),
  createProductClass: (data: Partial<ProductClass>) => apiClient.createProductClass(data),
  updateProductClass: (id: string, data: Partial<ProductClass>) => apiClient.updateProductClass(id, data),
  getProductClassHierarchy: (storeId: string) => apiClient.getProductClassHierarchy(storeId),
  
  // Categories
  getCategories: (storeId?: string, filters?: any) => apiClient.getCategories(storeId, filters),
  getCategory: (id: string) => apiClient.getCategory(id),
  createCategory: (data: Partial<ProductCategory>) => apiClient.createCategory(data),
  updateCategory: (id: string, data: Partial<ProductCategory>) => apiClient.updateCategory(id, data),
  
  // Brands
  getBrands: (storeId?: string, filters?: any) => apiClient.getBrands(storeId, filters),
  getBrand: (id: string) => apiClient.getBrand(id),
  createBrand: (data: Partial<Brand>) => apiClient.createBrand(data),
  updateBrand: (id: string, data: Partial<Brand>) => apiClient.updateBrand(id, data),
  
  // Tags (NEW)
  getTags: (storeId?: string, filters?: any) => apiClient.getTags(storeId, filters),
  getTag: (id: string) => apiClient.getTag(id),
  createTag: (data: Partial<Tag>) => apiClient.createTag(data),
  
  // Attribute types (NEW)
  getAttributeTypes: () => apiClient.getAttributeTypes(),
  getAttributeType: (id: string) => apiClient.getAttributeType(id),
  createAttributeType: (data: Partial<AttributeType>) => apiClient.createAttributeType(data),
  
  // Enhanced features
  searchProducts: (storeId: string, query: string, limit?: number) => apiClient.searchProducts(storeId, query, limit),
  getProductRecommendations: (productSlug: string, storeId: string) => apiClient.getProductRecommendations(productSlug, storeId),
  getCategoryFilters: (categorySlug: string) => apiClient.getCategoryFilters(categorySlug),
  
  // Analytics
  getStoreStatistics: (storeId: string) => apiClient.getStoreStatistics(storeId),
  getProductAnalytics: (storeId: string) => apiClient.getProductAnalytics(storeId),
  
  // Social media
  importFromSocialMedia: (data: any) => apiClient.importFromSocialMedia(data),
  getTrendingSearches: () => apiClient.getTrendingSearches(),
}

export const cartApi = {
  getCart: (storeId: string) => apiClient.getCart(storeId),
  addToCart: (storeId: string, productId: string, variantId?: string, quantity?: number) => 
    apiClient.addToCart(storeId, productId, variantId, quantity),
  updateCartItem: (itemId: string, quantity: number) => apiClient.updateCartItem(itemId, quantity),
  removeCartItem: (itemId: string) => apiClient.removeCartItem(itemId),
  clearCart: (storeId: string) => apiClient.clearCart(storeId),
}

export const orderApi = {
  getOrders: (storeId?: string, filters?: any) => apiClient.getOrders(storeId, filters),
  getOrder: (id: string) => apiClient.getOrder(id),
  createOrder: (data: any) => apiClient.createOrder(data),
  updateOrderStatus: (id: string, status: string, notes?: string) => apiClient.updateOrderStatus(id, status, notes),
}

export const wishlistApi = {
  getWishlist: (storeId?: string) => apiClient.getWishlist(storeId),
  addToWishlist: (data: any) => apiClient.addToWishlist(data),
  removeFromWishlist: (id: string) => apiClient.removeFromWishlist(id),
  moveWishlistToCart: (id: string, quantity?: number) => apiClient.moveWishlistToCart(id, quantity),
}

export default apiClient
