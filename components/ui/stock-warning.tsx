'use client'

import { AlertTriangle, Package, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product, ProductVariant } from '@/types'

interface StockWarningProps {
  product: Product
  variant?: ProductVariant
  className?: string
  showIcon?: boolean
  showAddToCart?: boolean
  onAddToCart?: () => void
}

/**
 * Stock warning component for customers
 * Product requirement: "warning for store customer when the count is less than 3"
 */
export function StockWarning({
  product,
  variant,
  className = '',
  showIcon = true,
  showAddToCart = true,
  onAddToCart
}: StockWarningProps) {
  // Determine which stock to check
  const stockItem = variant || product
  const stockQuantity = stockItem.stock_quantity || 0
  
  // Check if warning should be shown
  const shouldShowWarning = stockQuantity < 3
  const isOutOfStock = stockQuantity === 0
  
  if (!shouldShowWarning) {
    return null
  }
  
  // Get appropriate warning message and style
  const getWarningConfig = () => {
    if (isOutOfStock) {
      return {
        message: 'ناموجود',
        bgColor: 'bg-red-50 border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        buttonDisabled: true,
        buttonText: 'ناموجود'
      }
    } else {
      return {
        message: `تنها ${stockQuantity} عدد باقی مانده`,
        bgColor: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        buttonDisabled: false,
        buttonText: 'افزودن به سبد خرید'
      }
    }
  }
  
  const config = getWarningConfig()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center justify-between gap-3 p-3 rounded-lg border
        ${config.bgColor} ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {showIcon && (
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            {isOutOfStock ? (
              <Package className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
        )}
        
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.message}
          </span>
          
          {!isOutOfStock && (
            <span className="text-xs text-gray-600">
              برای تهیه سریع‌تر عجله کنید
            </span>
          )}
        </div>
      </div>
      
      {showAddToCart && (
        <button
          onClick={onAddToCart}
          disabled={config.buttonDisabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
            transition-colors duration-200
            ${config.buttonDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800'
            }
          `}
        >
          <ShoppingCart className="w-4 h-4" />
          {config.buttonText}
        </button>
      )}
    </motion.div>
  )
}

/**
 * Compact stock badge for product cards
 */
export function StockBadge({
  product,
  variant,
  className = ''
}: {
  product: Product
  variant?: ProductVariant
  className?: string
}) {
  const stockItem = variant || product
  const stockQuantity = stockItem.stock_quantity || 0
  
  if (stockQuantity >= 3) {
    return null
  }
  
  const isOutOfStock = stockQuantity === 0
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
        ${isOutOfStock
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-orange-100 text-orange-800 border border-orange-200'
        }
        ${className}
      `}
    >
      {isOutOfStock ? 'ناموجود' : `${stockQuantity} عدد`}
    </motion.div>
  )
}

/**
 * Hook for checking stock status
 */
export function useStockStatus(product: Product, variant?: ProductVariant) {
  const stockItem = variant || product
  const stockQuantity = stockItem.stock_quantity || 0
  
  return {
    stockQuantity,
    isOutOfStock: stockQuantity === 0,
    isLowStock: stockQuantity < 3 && stockQuantity > 0,
    shouldShowWarning: stockQuantity < 3,
    stockMessage: stockQuantity === 0 ? 'ناموجود' : `${stockQuantity} عدد موجود`,
    stockStatus: stockQuantity === 0 ? 'out_of_stock' : stockQuantity < 3 ? 'low_stock' : 'in_stock'
  }
}

/**
 * Advanced stock warning with urgency indicators
 */
export function AdvancedStockWarning({
  product,
  variant,
  showSalesData = false,
  className = ''
}: {
  product: Product
  variant?: ProductVariant
  showSalesData?: boolean
  className?: string
}) {
  const { stockQuantity, isOutOfStock, isLowStock, shouldShowWarning } = useStockStatus(product, variant)
  
  if (!shouldShowWarning) {
    return null
  }
  
  // Calculate urgency level
  const urgencyLevel = stockQuantity === 0 ? 'critical' : stockQuantity === 1 ? 'high' : 'medium'
  
  const urgencyConfig = {
    critical: {
      bgColor: 'bg-red-50 border-red-300',
      textColor: 'text-red-900',
      accentColor: 'bg-red-500',
      pulseColor: 'bg-red-400'
    },
    high: {
      bgColor: 'bg-orange-50 border-orange-300',
      textColor: 'text-orange-900',
      accentColor: 'bg-orange-500',
      pulseColor: 'bg-orange-400'
    },
    medium: {
      bgColor: 'bg-yellow-50 border-yellow-300',
      textColor: 'text-yellow-900',
      accentColor: 'bg-yellow-500',
      pulseColor: 'bg-yellow-400'
    }
  }
  
  const config = urgencyConfig[urgencyLevel]
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden rounded-lg border p-4
        ${config.bgColor} ${className}
      `}
    >
      {/* Animated accent bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${config.accentColor}`}>
        {urgencyLevel === 'critical' && (
          <motion.div
            className={`h-full w-full ${config.pulseColor}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 p-2 rounded-full ${config.accentColor}`}>
          {isOutOfStock ? (
            <Package className="w-5 h-5 text-white" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-lg font-semibold ${config.textColor}`}>
            {isOutOfStock ? 'محصول ناموجود' : 'موجودی محدود'}
          </h4>
          
          <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
            {isOutOfStock
              ? 'این محصول در حال حاضر موجود نیست'
              : `تنها ${stockQuantity} عدد از این محصول باقی مانده است`
            }
          </p>
          
          {showSalesData && !isOutOfStock && (
            <div className={`text-xs ${config.textColor} opacity-70 mt-2`}>
              <div className="flex items-center gap-4">
                <span>فروش امروز: {product.sales_count || 0}</span>
                <span>بازدید: {product.view_count || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!isOutOfStock && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
            افزودن به سبد خرید
          </button>
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            اطلاع از موجودی
          </button>
        </div>
      )}
    </motion.div>
  )
}
