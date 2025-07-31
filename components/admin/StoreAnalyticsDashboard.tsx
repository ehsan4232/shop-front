import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUpIcon, 
  EyeIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  total_sales: number;
  total_orders: number;
  total_customers: number;
  website_views: number;
  conversion_rate: number;
  average_order_value: number;
  sales_growth: number;
  popular_products: Array<{
    name: string;
    sales_count: number;
    revenue: number;
  }>;
  sales_by_day: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  traffic_sources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const changeColor = change && change > 0 ? 'text-green-600' : change && change < 0 ? 'text-red-600' : 'text-gray-500';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${changeColor}`}>
              {change > 0 && '+'}
              {change}%
              <span className="text-gray-500 mr-1">نسبت به ماه قبل</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

interface StoreAnalyticsDashboardProps {
  storeId: string;
  timeRange?: string;
}

const StoreAnalyticsDashboard: React.FC<StoreAnalyticsDashboardProps> = ({ 
  storeId, 
  timeRange = '30d' 
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    loadDashboardData();
  }, [storeId, selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/stores/${storeId}/analytics/dashboard/`, {
        params: { time_range: selectedTimeRange }
      });
      setStats(response.data);
    } catch (error) {
      console.error('خطا در دریافت آمار داشبورد:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: '۷ روز گذشته' },
    { value: '30d', label: '۳۰ روز گذشته' },
    { value: '90d', label: '۳ ماه گذشته' },
    { value: '1y', label: '۱ سال گذشته' },
  ];

  // Chart configurations
  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'روند فروش و سفارشات',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const salesChartData = {
    labels: stats?.sales_by_day.map(item => 
      new Date(item.date).toLocaleDateString('fa-IR')
    ) || [],
    datasets: [
      {
        label: 'فروش (تومان)',
        data: stats?.sales_by_day.map(item => item.sales) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'تعداد سفارشات',
        data: stats?.sales_by_day.map(item => item.orders) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const trafficSourcesData = {
    labels: stats?.traffic_sources.map(item => item.source) || [],
    datasets: [
      {
        data: stats?.traffic_sources.map(item => item.visitors) || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
        borderWidth: 2,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3">در حال بارگذاری آمار...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">خطا در دریافت آمار داشبورد</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد تحلیلات</h1>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="کل فروش"
          value={formatCurrency(stats.total_sales)}
          change={stats.sales_growth}
          icon={CurrencyDollarIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="تعداد سفارشات"
          value={formatNumber(stats.total_orders)}
          icon={ShoppingCartIcon}
          color="bg-green-500"
        />
        <StatCard
          title="بازدیدکنندگان"
          value={formatNumber(stats.website_views)}
          icon={EyeIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="مشتریان"
          value={formatNumber(stats.total_customers)}
          icon={UsersIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">متریک‌های کلیدی</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">نرخ تبدیل</span>
              <span className="font-semibold text-green-600">
                {stats.conversion_rate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">متوسط ارزش سفارش</span>
              <span className="font-semibold">
                {formatCurrency(stats.average_order_value)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">رشد فروش</span>
              <span className={`font-semibold ${stats.sales_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.sales_growth > 0 && '+'}
                {stats.sales_growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">محبوب‌ترین محصولات</h3>
          <div className="space-y-3">
            {stats.popular_products.slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(product.sales_count)} فروش
                  </p>
                </div>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">روند فروش</h3>
          <div className="h-80">
            <Line 
              data={salesChartData} 
              options={{
                ...salesChartOptions,
                maintainAspectRatio: false,
                scales: {
                  ...salesChartOptions.scales,
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Traffic Sources Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">منابع ترافیک</h3>
          <div className="h-80 flex items-center justify-center">
            <Doughnut 
              data={trafficSourcesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
          
          {/* Traffic Sources List */}
          <div className="mt-4 space-y-2">
            {stats.traffic_sources.map((source, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{source.source}</span>
                <div className="flex items-center">
                  <span className="font-medium ml-2">
                    {formatNumber(source.visitors)}
                  </span>
                  <span className="text-gray-500">
                    ({source.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center mb-4">
          <TrendingUpIcon className="w-6 h-6 text-blue-600 ml-2" />
          <h3 className="text-lg font-semibold text-blue-900">خلاصه عملکرد</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-800 font-medium">بهترین روز فروش</p>
            <p className="text-blue-600">
              {stats.sales_by_day.length > 0 && 
                new Date(
                  stats.sales_by_day.reduce((max, day) => 
                    day.sales > max.sales ? day : max
                  ).date
                ).toLocaleDateString('fa-IR')
              }
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium">میانگین بازدید روزانه</p>
            <p className="text-blue-600">
              {formatNumber(Math.round(stats.website_views / (stats.sales_by_day.length || 1)))}
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium">میانگین سفارش روزانه</p>
            <p className="text-blue-600">
              {formatNumber(Math.round(stats.total_orders / (stats.sales_by_day.length || 1)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalyticsDashboard;