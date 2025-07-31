import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface StockWarningData {
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
}

interface StockWarningProps {
  stockData: StockWarningData;
  className?: string;
}

export const StockWarning: React.FC<StockWarningProps> = ({ 
  stockData, 
  className = '' 
}) => {
  if (!stockData.needs_warning) return null;

  const isCritical = stockData.level === 'critical';
  const bgColor = isCritical ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
  const textColor = isCritical ? 'text-red-800' : 'text-yellow-800';
  const iconColor = isCritical ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className={`rounded-lg border p-4 ${bgColor} ${className}`}>
      <div className="flex items-start space-x-3 space-x-reverse">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {isCritical ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1">
          {/* Main Warning Message */}
          {stockData.message && (
            <div className={`font-medium ${textColor} mb-2`}>
              {stockData.message}
            </div>
          )}
          
          {/* Simple Product Stock Warning */}
          {stockData.stock_count !== undefined && !stockData.variant_warnings && (
            <div className={`text-sm ${textColor}`}>
              {isCritical ? (
                <span>این محصول در حال حاضر موجود نیست.</span>
              ) : (
                <span>
                  تعداد محدودی از این محصول باقی مانده است. 
                  برای خرید عجله کنید!
                </span>
              )}
            </div>
          )}
          
          {/* Variable Product Warnings */}
          {stockData.variant_warnings && stockData.variant_warnings.length > 0 && (
            <div className="space-y-2">
              <div className={`text-sm font-medium ${textColor}`}>
                موجودی محدود برای انواع زیر:
              </div>
              <div className="space-y-1">
                {stockData.variant_warnings.map((variant) => (
                  <div 
                    key={variant.variant_id}
                    className={`text-xs ${textColor} bg-white bg-opacity-50 rounded px-2 py-1`}
                  >
                    <span className="font-medium">{variant.attributes}:</span>{' '}
                    <span>{variant.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Call to Action */}
          <div className={`text-xs ${textColor} mt-2 opacity-75`}>
            {isCritical ? (
              'برای اطلاع از زمان موجود شدن مجدد، با ما تماس بگیرید.'
            ) : (
              'برای تضمین خرید، هر چه زودتر سفارش دهید.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for product cards
interface CompactStockWarningProps {
  stockData: StockWarningData;
  className?: string;
}

export const CompactStockWarning: React.FC<CompactStockWarningProps> = ({ 
  stockData, 
  className = '' 
}) => {
  if (!stockData.needs_warning) return null;

  const isCritical = stockData.level === 'critical';
  const bgColor = isCritical ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${className}`}>
      {isCritical ? (
        <AlertCircle className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      <span>{stockData.message}</span>
    </div>
  );
};

// Hook for fetching stock warning data
export const useStockWarning = (productId: string) => {
  const [stockData, setStockData] = React.useState<StockWarningData>({ needs_warning: false });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/stock-warning/`);
        if (response.ok) {
          const data = await response.json();
          setStockData(data);
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات موجودی:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchStockData();
    }
  }, [productId]);

  return { stockData, loading };
};

// Stock badge component for product lists
interface StockBadgeProps {
  stockCount: number;
  lowStockThreshold?: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ 
  stockCount, 
  lowStockThreshold = 3,
  className = '' 
}) => {
  if (stockCount === 0) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ${className}`}>
        ناموجود
      </span>
    );
  }

  if (stockCount <= lowStockThreshold) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
        {stockCount} عدد باقی‌مانده
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
      موجود
    </span>
  );
};

export default StockWarning;
