'use client';

import React from 'react';
import { AlertTriangle, Package, XCircle } from 'lucide-react';

interface StockWarningProps {
  stockData: {
    needs_warning: boolean;
    stock_count?: number;
    message?: string;
    level?: 'info' | 'warning' | 'critical';
    show_to_customer?: boolean;
    variant_warnings?: Array<{
      variant_id: string;
      stock_count: number;
      message: string;
      level: string;
      attributes: string;
    }>;
  };
  className?: string;
  showIcon?: boolean;
}

/**
 * StockWarning Component
 * Displays stock warnings to customers when products have 3 or fewer items remaining
 * As required by product description: "warning for store customer when the count is less than 3"
 */
export const StockWarning: React.FC<StockWarningProps> = ({ 
  stockData, 
  className = '',
  showIcon = true 
}) => {
  // Don't show warning if not needed or not meant for customers
  if (!stockData.needs_warning || !stockData.show_to_customer) {
    return null;
  }

  const getWarningStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          text: 'text-red-800 font-semibold'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          text: 'text-yellow-800 font-medium'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-500',
          text: 'text-blue-800'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          text: 'text-gray-800'
        };
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const level = stockData.level || 'warning';
  const styles = getWarningStyles(level);

  // Simple product warning
  if (!stockData.variant_warnings) {
    return (
      <div className={`
        flex items-center p-3 rounded-lg border-2 
        ${styles.container} 
        ${className}
      `}>
        {showIcon && (
          <div className={`ml-3 ${styles.icon}`}>
            {getIcon(level)}
          </div>
        )}
        <div className="flex-1">
          <p className={styles.text}>
            {stockData.message || `تنها ${stockData.stock_count} عدد باقی مانده`}
          </p>
          {level === 'critical' && (
            <p className="text-sm text-red-600 mt-1">
              برای خرید عجله کنید!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variable product with multiple variants
  return (
    <div className={`space-y-2 ${className}`}>
      <div className={`
        p-3 rounded-lg border-2 
        ${styles.container}
      `}>
        {showIcon && (
          <div className={`flex items-center mb-2 ${styles.icon}`}>
            {getIcon(level)}
            <span className={`mr-2 font-medium ${styles.text}`}>
              موجودی محدود
            </span>
          </div>
        )}
        
        <div className="space-y-2">
          {stockData.variant_warnings.map((variant) => {
            const variantStyles = getWarningStyles(variant.level);
            return (
              <div
                key={variant.variant_id}
                className={`
                  p-2 rounded border 
                  ${variantStyles.container}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {variant.attributes}
                  </span>
                  <span className={`text-sm ${variantStyles.text}`}>
                    {variant.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {level === 'critical' && (
          <p className="text-sm text-red-600 mt-2 font-medium">
            ⚡ برای خرید عجله کنید - موجودی رو به اتمام!
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Compact Stock Warning for product cards
 */
export const CompactStockWarning: React.FC<{ stockData: StockWarningProps['stockData'] }> = ({ 
  stockData 
}) => {
  if (!stockData.needs_warning || !stockData.show_to_customer) {
    return null;
  }

  const level = stockData.level || 'warning';
  const isOutOfStock = stockData.stock_count === 0;

  if (isOutOfStock) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 ml-1" />
        ناموجود
      </div>
    );
  }

  return (
    <div className={`
      inline-flex items-center px-2 py-1 rounded text-xs font-medium
      ${level === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
    `}>
      <AlertTriangle className="w-3 h-3 ml-1" />
      {stockData.stock_count && stockData.stock_count <= 3 ? (
        `${stockData.stock_count} عدد باقی مانده`
      ) : (
        'موجودی کم'
      )}
    </div>
  );
};

/**
 * Stock Badge for product listings
 */
export const StockBadge: React.FC<{ 
  stockCount: number;
  showWarningAt?: number;
  className?: string;
}> = ({ 
  stockCount, 
  showWarningAt = 3,
  className = '' 
}) => {
  if (stockCount > showWarningAt) {
    return (
      <span className={`
        inline-flex items-center px-2 py-1 rounded text-xs font-medium 
        bg-green-100 text-green-800 
        ${className}
      `}>
        <Package className="w-3 h-3 ml-1" />
        موجود
      </span>
    );
  }

  if (stockCount === 0) {
    return (
      <span className={`
        inline-flex items-center px-2 py-1 rounded text-xs font-medium 
        bg-red-100 text-red-800 
        ${className}
      `}>
        <XCircle className="w-3 h-3 ml-1" />
        ناموجود
      </span>
    );
  }

  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded text-xs font-medium 
      bg-yellow-100 text-yellow-800 
      ${className}
    `}>
      <AlertTriangle className="w-3 h-3 ml-1" />
      {stockCount} عدد باقی مانده
    </span>
  );
};

export default StockWarning;