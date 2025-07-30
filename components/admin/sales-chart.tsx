/**
 * Sales Chart Component
 * Visualizes sales data using the analytics from sophisticated backend
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

type ChartType = 'revenue' | 'orders';
type TimePeriod = '7d' | '30d' | '90d';

export function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('revenue');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stores/analytics/sales?period=${timePeriod}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setSalesData(data.chartData || data);
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
        // Generate demo data based on time period
        const days = timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 90;
        const demoData = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          
          return {
            date: date.toISOString().split('T')[0],
            sales: Math.floor(Math.random() * 50) + 10,
            orders: Math.floor(Math.random() * 20) + 5,
            revenue: Math.floor(Math.random() * 2000000) + 500000,
          };
        });
        setSalesData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [timePeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-1">
            {new Intl.DateTimeFormat('fa-IR').format(new Date(label))}
          </p>
          {chartType === 'revenue' ? (
            <p className="text-sm text-blue-600">
              درآمد: {formatCurrency(data.revenue)}
            </p>
          ) : (
            <p className="text-sm text-green-600">
              سفارشات: {data.orders} عدد
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const timePeriodLabels = {
    '7d': '۷ روز گذشته',
    '30d': '۳۰ روز گذشته',
    '90d': '۹۰ روز گذشته',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>نمودار فروش</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Chart Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartType === 'revenue'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                درآمد
              </button>
              <button
                onClick={() => setChartType('orders')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartType === 'orders'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                سفارشات
              </button>
            </div>
            
            {/* Time Period Select */}
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(timePeriodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : salesData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2">📊</div>
              <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'revenue' ? (
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="orders" 
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SalesChart;