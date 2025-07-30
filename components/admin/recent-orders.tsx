/**
 * Recent Orders Component
 * Shows latest orders using the comprehensive order system from backend
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  itemsCount: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'در انتظار',
  confirmed: 'تایید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch('/api/orders/recent?limit=10', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.results || data);
        }
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        // Fallback demo data
        setOrders([
          {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'علی احمدی',
            customerPhone: '09123456789',
            totalAmount: 1250000,
            status: 'pending',
            createdAt: new Date().toISOString(),
            itemsCount: 2,
          },
          {
            id: '2',
            orderNumber: 'ORD-002',
            customerName: 'زهرا محمدی',
            customerPhone: '09234567890',
            totalAmount: 890000,
            status: 'confirmed',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            itemsCount: 1,
          },
          {
            id: '3',
            orderNumber: 'ORD-003',
            customerName: 'محمد رضایی',
            customerPhone: '09345678901',
            totalAmount: 2100000,
            status: 'shipped',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            itemsCount: 3,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleOrderClick = (orderId: string) => {
    // Navigate to order details
    window.location.href = `/admin/orders/${orderId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>سفارشات اخیر</span>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            مشاهده همه
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 space-x-reverse py-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-gray-500">هنوز سفارشی ثبت نشده است</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {order.customerName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.customerName}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status]
                      }`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4 space-x-reverse">
                      <span>#{order.orderNumber}</span>
                      <span>{order.itemsCount} کالا</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customerPhone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentOrders;