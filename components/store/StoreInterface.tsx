'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  EyeIcon,
  ShareIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { ProductService, OrderService } from '@/lib/api'
import { Product, ProductFilters, ProductCategory, Brand } from '@/types'
import { toast } from 'react-hot-toast'

interface StoreInterfaceProps {
  storeId: string
  storeName: string
  storeConfig: {
    theme: string
    layout: string
    primaryColor: string
    secondaryColor: string
  }
}

export function StoreInterface({ storeId, storeName, storeConfig }: StoreInterfaceProps) {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(storeConfig.layout as 'grid' | 'list' || 'grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('-created_at')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isGridMode, setIsGridMode] = useState(true)

  // Advanced filtering options
  const [advancedFilters, setAdvancedFilters] = useState({
    inStock: true,
    onSale: false,
    featured: false,
    rating: 0,
    attributes: {} as Record<string, string[]>
  })

  // Load initial data
  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchBrands(),
      loadWishlist(),
      loadCart()
    ])
  }, [])

  // Fetch products with advanced filtering
  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy, searchQuery, selectedCategory, currentPage, advancedFilters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: Record<string, string> = {
        page: currentPage.toString(),
        search: searchQuery || '',
        sort: sortBy,
        category: selectedCategory || '',
        min_price: priceRange[0].toString(),
        max_price: priceRange[1].toString(),
        in_stock: advancedFilters.inStock.toString(),
        is_featured: advancedFilters.featured.toString(),
        ...filters
      }

      // Remove empty values
      Object.keys(params).forEach(key => 
        (!params[key] || params[key] === 'false' || params[key] === '0') && delete params[key]
      )
      
      const response = await ProductService.getProducts(storeId, params)
      setProducts(response.results || [])
      setTotalPages(Math.ceil((response.count || response.length) / 12))
    } catch (err: any) {
      setError('خطا در بارگذاری محصولات')
      toast.error('خطا در بارگذاری محصولات')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await ProductService.getCategories(storeId)
      setCategories(response)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await ProductService.getBrands(storeId)
      setBrands(response)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const loadWishlist = () => {
    const saved = localStorage.getItem(`wishlist_${storeId}`)
    if (saved) {
      setWishlist(new Set(JSON.parse(saved)))
    }
  }

  const loadCart = () => {
    const saved = localStorage.getItem(`cart_${storeId}`)
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }

  const saveWishlist = (newWishlist: Set<string>) => {
    localStorage.setItem(`wishlist_${storeId}`, JSON.stringify(Array.from(newWishlist)))
  }

  const saveCart = (newCart: Record<string, number>) => {
    localStorage.setItem(`cart_${storeId}`, JSON.stringify(newCart))
  }

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const newCart = { ...cart }
      newCart[productId] = (newCart[productId] || 0) + quantity
      setCart(newCart)
      saveCart(newCart)
      
      // Also sync with backend
      await OrderService.addToCart(storeId, productId, quantity)
      
      toast.success('محصول به سبد خرید اضافه شد', {
        icon: '🛒',
        duration: 2000
      })
    } catch (err) {
      toast.error('خطا در افزودن به سبد خرید')
    }
  }

  const handleToggleWishlist = async (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
      toast.success('از لیست علاقه‌مندی‌ها حذف شد')
    } else {
      newWishlist.add(productId)
      toast.success('به لیست علاقه‌مندی‌ها اضافه شد', {
        icon: '❤️'
      })
    }
    setWishlist(newWishlist)
    saveWishlist(newWishlist)
  }

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
  }

  const handleShare = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name_fa,
          text: product.short_description,
          url: window.location.href + `/products/${product.slug}`
        })
      } catch (err) {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href + `/products/${product.slug}`)
        toast.success('لینک کپی شد')
      }
    } else {
      navigator.clipboard.writeText(window.location.href + `/products/${product.slug}`)
      toast.success('لینک کپی شد')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  const calculateDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Apply advanced filters
      if (advancedFilters.inStock && !product.in_stock) return false
      if (advancedFilters.onSale && !product.discount_percentage) return false
      if (advancedFilters.featured && !product.is_featured) return false
      
      return true
    })
  }, [products, advancedFilters])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = calculateDiscount(product.price, product.compare_price || 0)
    const isInWishlist = wishlist.has(product.id)
    const cartQuantity = cart[product.id] || 0

    return (
      <motion.div
        variants={itemVariants}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
        whileHover={{ y: -8 }}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.featured_image || '/placeholder-product.jpg'}
            alt={product.name_fa}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                ویژه
              </span>
            )}
            {discount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                {discount}% تخفیف
              </span>
            )}
            {!product.in_stock && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                ناموجود
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => handleToggleWishlist(product.id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              {isInWishlist ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={() => handleQuickView(product)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleShare(product)}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-500 hover:text-white transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {product.in_stock ? (
              <motion.button
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartQuantity > 0 ? `در سبد (${cartQuantity})` : 'افزودن به سبد'}
              </motion.button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
              >
                ناموجود
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight">
              {product.name_fa}
            </h3>
            {product.brand_data && (
              <p className="text-sm text-gray-500 mt-1">{product.brand_data.name_fa}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {renderStars(4)} {/* Mock rating, replace with actual */}
            </div>
            <span className="text-sm text-gray-500">(۲۳ نظر)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>
            
            {product.is_low_stock && product.in_stock && (
              <span className="text-xs text-orange-500 font-medium">
                تنها {product.stock_quantity} عدد!
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TruckIcon className="w-4 h-4" />
              <span>ارسال رایگان</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>گارانتی</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const FilterPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">فیلترها</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">دسته‌بندی‌ها</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{category.name_fa}</span>
                    <span className="text-xs text-gray-500">({category.product_count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">برندها</h4>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brand === brand.id}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        brand: e.target.checked ? brand.id : undefined
                      }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{brand.name_fa}</span>
                    <span className="text-xs text-gray-500">({brand.product_count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">محدوده قیمت</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="حداقل"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="حداکثر"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">فیلترهای پیشرفته</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedFilters.inStock}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      inStock: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">فقط موجود</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedFilters.onSale}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      onSale: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">تخفیف‌دار</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedFilters.featured}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      featured: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">محصولات ویژه</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setFilters({})
                setSelectedCategory(null)
                setPriceRange([0, 10000000])
                setAdvancedFilters({
                  inStock: true,
                  onSale: false,
                  featured: false,
                  rating: 0,
                  attributes: {}
                })
              }}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const QuickViewModal = () => (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">نمایش سریع</h2>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square">
                  <img
                    src={quickViewProduct.featured_image || '/placeholder-product.jpg'}
                    alt={quickViewProduct.name_fa}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                
                {/* Product Details */}
                <div>
                  <h3 className="text-2xl font-bold mb-4">{quickViewProduct.name_fa}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(4)}
                    </div>
                    <span className="text-sm text-gray-500">(۲۳ نظر)</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(quickViewProduct.price)}
                      </span>
                      {quickViewProduct.compare_price && quickViewProduct.compare_price > quickViewProduct.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(quickViewProduct.compare_price)}
                        </span>
                      )}
                    </div>
                    
                    {calculateDiscount(quickViewProduct.price, quickViewProduct.compare_price || 0) > 0 && (
                      <span className="text-green-600 font-medium">
                        شما {formatPrice((quickViewProduct.compare_price || 0) - quickViewProduct.price)} صرفه‌جویی می‌کنید!
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {quickViewProduct.short_description || quickViewProduct.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(quickViewProduct.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                      disabled={!quickViewProduct.in_stock}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      {quickViewProduct.in_stock ? 'افزودن به سبد خرید' : 'ناموجود'}
                    </button>
                    
                    <button
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        wishlist.has(quickViewProduct.id)
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <HeartIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="w-5 h-5 text-gray-400" />
                        <span>ارسال رایگان</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                        <span>گارانتی ۱۸ ماهه</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                        <span>بازگشت وجه</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-5 h-5 text-gray-400" />
                        <span>کیفیت تضمینی</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
            
            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در محصولات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Cart Icon */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCartIcon className="w-6 h-6" />
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(cart).reduce((sum, qty) => sum + qty, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              فیلترها
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="-created_at">جدیدترین</option>
              <option value="price">ارزان‌ترین</option>
              <option value="-price">گران‌ترین</option>
              <option value="-sales_count">پرفروش‌ترین</option>
              <option value="-view_count">محبوب‌ترین</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={fetchProducts}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  قبلی
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2)
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  بعدی
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">محصولی یافت نشد</div>
                <button
                  onClick={() => {
                    setFilters({})
                    setSearchQuery('')
                    setSelectedCategory(null)
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Overlay for filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
