'use client';

import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface StockWarningProps {
  product: {
    id: string;
    stock_quantity: number;
    product_type: 'simple' | 'variable';
    variants?: Array<{
      id: string;
      stock_quantity: number;
      sku: string;
      attributes: any[];
      is_active: boolean;
    }>;
  };
  showForCustomers?: boolean;
  className?: string;
}

interface StockStatus {
  needs_warning: boolean;
  warning_message: string;
  stock_quantity: number;
  is_in_stock: boolean;
  level: 'out_of_stock' | 'critical' | 'low' | 'normal';
  variants?: Array<{
    variant_id: string;
    variant_sku: string;
    needs_warning: boolean;
    warning_message: string;
    stock_quantity: number;
  }>;
}

const StockWarning: React.FC<StockWarningProps> = ({
  product,
  showForCustomers = true,
  className = ''
}) => {
  const [stockStatus, setStockStatus] = useState<StockStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate stock status based on product type
  const calculateStockStatus = (): StockStatus => {
    if (product.product_type === 'simple') {
      const quantity = product.stock_quantity;
      return {
        needs_warning: quantity <= 3,
        warning_message: quantity === 0 ? 'ناموجود' : quantity <= 3 ? `تنها ${quantity} عدد باقی مانده` : '',
        stock_quantity: quantity,
        is_in_stock: quantity > 0,
        level: quantity === 0 ? 'out_of_stock' : quantity <= 1 ? 'critical' : quantity <= 3 ? 'low' : 'normal'
      };
    } else if (product.product_type === 'variable' && product.variants) {
      const activeVariants = product.variants.filter(v => v.is_active);
      const totalStock = activeVariants.reduce((sum, v) => sum + v.stock_quantity, 0);
      const hasLowStockVariants = activeVariants.some(v => v.stock_quantity <= 3);
      const hasOutOfStockVariants = activeVariants.some(v => v.stock_quantity === 0);
      
      const variantWarnings = activeVariants.map(variant => ({
        variant_id: variant.id,
        variant_sku: variant.sku,
        needs_warning: variant.stock_quantity <= 3,
        warning_message: variant.stock_quantity === 0 ? 'ناموجود' : 
                        variant.stock_quantity <= 3 ? `تنها ${variant.stock_quantity} عدد باقی مانده` : '',
        stock_quantity: variant.stock_quantity
      }));

      return {
        needs_warning: hasLowStockVariants,
        warning_message: totalStock === 0 ? 'ناموجود' : 
                        hasOutOfStockVariants ? 'برخی گزینه‌ها ناموجود' :
                        hasLowStockVariants ? 'موجودی محدود' : '',
        stock_quantity: totalStock,
        is_in_stock: totalStock > 0,
        level: totalStock === 0 ? 'out_of_stock' : 
               hasOutOfStockVariants ? 'critical' : 
               hasLowStockVariants ? 'low' : 'normal',
        variants: variantWarnings
      };
    }

    return {
      needs_warning: false,
      warning_message: '',
      stock_quantity: 0,
      is_in_stock: false,
      level: 'normal'
    };
  };

  // Fetch stock status from API (if needed for real-time updates)
  const fetchStockStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${product.id}/stock-warning/`);
      if (response.ok) {
        const data = await response.json();
        setStockStatus(data);
      } else {
        // Fallback to local calculation
        setStockStatus(calculateStockStatus());
      }
    } catch (error) {
      console.error('خطا در دریافت وضعیت موجودی:', error);
      // Fallback to local calculation
      setStockStatus(calculateStockStatus());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // For now, use local calculation. In production, you might want to fetch from API
    setStockStatus(calculateStockStatus());
    
    // Optionally fetch from API for real-time data
    // fetchStockStatus();
  }, [product]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (!stockStatus || (!stockStatus.needs_warning && stockStatus.is_in_stock)) {
    return null; // Don't show anything if stock is normal
  }

  // Different styles based on stock level
  const getStockStyles = (level: string) => {
    switch (level) {
      case 'out_of_stock':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-800',
          iconComponent: XCircleIcon
        };
      case 'critical':
        return {
          container: 'bg-orange-50 border-orange-200 text-orange-800',
          icon: 'text-orange-500',
          badge: 'bg-orange-100 text-orange-800',
          iconComponent: ExclamationTriangleIcon
        };
      case 'low':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          badge: 'bg-yellow-100 text-yellow-800',
          iconComponent: ClockIcon
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          badge: 'bg-gray-100 text-gray-800',
          iconComponent: ClockIcon
        };
    }
  };

  const styles = getStockStyles(stockStatus.level);
  const IconComponent = styles.iconComponent;

  if (!showForCustomers) {
    // Admin view - more detailed information
    return (
      <div className={`p-3 border rounded-lg ${styles.container} ${className}`}>
        <div className="flex items-start">
          <IconComponent className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
          <div className="mr-2 flex-1">
            <div className="font-medium text-sm">وضعیت موجودی</div>
            <div className="text-sm mt-1">{stockStatus.warning_message}</div>
            
            {/* Variant-specific warnings */}
            {stockStatus.variants && stockStatus.variants.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-xs font-medium">وضعیت گزینه‌ها:</div>
                {stockStatus.variants
                  .filter(v => v.needs_warning)
                  .map(variant => (
                    <div key={variant.variant_id} className="text-xs flex justify-between">
                      <span>{variant.variant_sku}:</span>
                      <span className={`px-1 rounded ${styles.badge}`}>
                        {variant.warning_message}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Customer view - simplified, user-friendly display
  return (
    <div className={`inline-flex items-center space-x-2 space-x-reverse ${className}`}>
      {stockStatus.level === 'out_of_stock' ? (
        <>
          <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            ناموجود
          </span>
        </>
      ) : stockStatus.needs_warning ? (
        <>
          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
            {stockStatus.warning_message}
          </span>
        </>
      ) : null}
    </div>
  );
};

// Hook for real-time stock monitoring
export const useStockWarning = (productId: string) => {
  const [stockStatus, setStockStatus] = useState<StockStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshStockStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}/stock-warning/`);
      if (response.ok) {
        const data = await response.json();
        setStockStatus(data);
      }
    } catch (error) {
      console.error('خطا در بروزرسانی وضعیت موجودی:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStockStatus();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(refreshStockStatus, 30000);
    
    return () => clearInterval(interval);
  }, [productId]);

  return { stockStatus, loading, refreshStockStatus };
};

// Component for product listings
export const ProductListStockWarning: React.FC<{
  product: any;
  showIcon?: boolean;
}> = ({ product, showIcon = true }) => {
  const needsWarning = product.stock_quantity <= 3;
  const isOutOfStock = product.stock_quantity === 0;

  if (!needsWarning && !isOutOfStock) return null;

  return (
    <div className="flex items-center space-x-1 space-x-reverse">
      {showIcon && (
        <div className="flex-shrink-0">
          {isOutOfStock ? (
            <XCircleIcon className="w-3 h-3 text-red-500" />
          ) : (
            <ExclamationTriangleIcon className="w-3 h-3 text-yellow-500" />
          )}
        </div>
      )}
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
        isOutOfStock 
          ? 'bg-red-100 text-red-700' 
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        {isOutOfStock ? 'ناموجود' : `${product.stock_quantity} عدد`}
      </span>
    </div>
  );
};

// Component for shopping cart
export const CartStockWarning: React.FC<{
  item: any;
  onStockChange?: (hasStockIssue: boolean) => void;
}> = ({ item, onStockChange }) => {
  const hasStockIssue = item.stock_quantity < item.requested_quantity;
  
  useEffect(() => {
    onStockChange?.(hasStockIssue);
  }, [hasStockIssue, onStockChange]);

  if (!hasStockIssue) return null;

  return (
    <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm mt-1">
      <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
      <span>
        موجودی کافی نیست! (موجود: {item.stock_quantity})
      </span>
    </div>
  );
};

export default StockWarning;