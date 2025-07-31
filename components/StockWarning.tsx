import React from 'react';

interface StockWarningProps {
  stockData: {
    needs_warning: boolean;
    stock_count?: number;
    message?: string;
    level?: 'warning' | 'critical';
    variant_warnings?: Array<{
      variant_id: string;
      stock_count: number;
      message: string;
      attributes: string;
    }>;
  };
}

export const StockWarning: React.FC<StockWarningProps> = ({ stockData }) => {
  if (!stockData.needs_warning) return null;
  
  const bgColor = stockData.level === 'critical' ? 'bg-red-100' : 'bg-yellow-100';
  const textColor = stockData.level === 'critical' ? 'text-red-800' : 'text-yellow-800';
  const borderColor = stockData.level === 'critical' ? 'border-red-200' : 'border-yellow-200';
  
  return (
    <div className={`p-3 rounded-lg border ${bgColor} ${textColor} ${borderColor} text-sm`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">
            {stockData.level === 'critical' ? '🔴' : '⚠️'}
          </span>
        </div>
        <div className="mr-3">
          {stockData.message && (
            <div className="font-medium mb-1">
              {stockData.message}
            </div>
          )}
          
          {stockData.variant_warnings && stockData.variant_warnings.length > 0 && (
            <div className="space-y-1">
              <div className="font-medium text-xs opacity-80">
                موجودی کم برای انواع:
              </div>
              {stockData.variant_warnings.map((variant) => (
                <div key={variant.variant_id} className="text-xs">
                  <span className="font-medium">{variant.attributes}</span>
                  <span className="mr-2 opacity-80">
                    ({variant.message})
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs mt-1 opacity-80">
            برای سفارش بیشتر با فروشگاه تماس بگیرید
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage example:
export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  return (
    <div className="product-card">
      {/* Product details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name_fa}</h3>
        <p className="text-gray-600">{product.price} تومان</p>
        
        {/* Stock Warning - Critical feature per product description */}
        <StockWarning stockData={product.stock_warning_data} />
        
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
          افزودن به سبد
        </button>
      </div>
    </div>
  );
};