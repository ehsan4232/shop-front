import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  MapPinIcon,
  HeartIcon,
  CogIcon,
  LogOutIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/api';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface CustomerProfile {
  id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  addresses: Array<{
    id: string;
    title: string;
    address: string;
    city: string;
    postal_code: string;
    is_default: boolean;
  }>;
}

interface CustomerAccountProps {
  storeId: string;
}

const CustomerAccount: React.FC<CustomerAccountProps> = ({ storeId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, [storeId]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const [profileResponse, ordersResponse] = await Promise.all([
        apiClient.get('/accounts/profile/'),
        apiClient.get(`/stores/${storeId}/orders/my-orders/`)
      ]);
      
      setProfile(profileResponse.data);
      setOrders(ordersResponse.data.results || ordersResponse.data);
    } catch (error) {
      console.error('خطا در دریافت اطلاعات مشتری:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData: any) => {
    try {
      const response = await apiClient.put('/accounts/profile/', formData);
      setProfile(response.data);
      alert('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('خطا در به‌روزرسانی پروفایل:', error);
      alert('خطا در به‌روزرسانی اطلاعات');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
  };

  const getOrderStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status: string) => {
    const statusMap = {
      'pending': 'در انتظار',
      'confirmed': 'تأیید شده',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده',
    };
    return statusMap[status] || status;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const tabs = [
    { id: 'profile', name: 'پروفایل', icon: UserIcon },
    { id: 'orders', name: 'سفارشات', icon: ShoppingBagIcon },
    { id: 'addresses', name: 'آدرس‌ها', icon: MapPinIcon },
    { id: 'wishlist', name: 'علاقه‌مندی‌ها', icon: HeartIcon },
    { id: 'settings', name: 'تنظیمات', icon: CogIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">حساب کاربری</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <LogOutIcon className="w-5 h-5 ml-2" />
              خروج
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            {profile?.first_name && profile?.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : profile?.phone_number
            }
          </p>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-l border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 ml-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <ProfileTab profile={profile} onUpdate={handleProfileUpdate} />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} />
            )}
            
            {activeTab === 'addresses' && (
              <AddressesTab profile={profile} onUpdate={loadCustomerData} />
            )}
            
            {activeTab === 'wishlist' && (
              <WishlistTab storeId={storeId} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab: React.FC<{ profile: CustomerProfile | null; onUpdate: (data: any) => void }> = ({ 
  profile, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">اطلاعات شخصی</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام خانوادگی
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره تلفن همراه
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            شماره تلفن قابل تغییر نیست
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
};

// Orders Tab Component
const OrdersTab: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getOrderStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status: string) => {
    const statusMap = {
      'pending': 'در انتظار',
      'confirmed': 'تأیید شده',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده',
    };
    return statusMap[status] || status;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">تاریخچه سفارشات</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    سفارش #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusText(order.status)}
                  </span>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">اقلام سفارش:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Addresses Tab Component  
const AddressesTab: React.FC<{ profile: CustomerProfile | null; onUpdate: () => void }> = ({ 
  profile, 
  onUpdate 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">آدرس‌های من</h2>
      
      {profile?.addresses?.length === 0 ? (
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">هنوز آدرسی ثبت نکرده‌اید</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            افزودن آدرس جدید
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profile?.addresses?.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{address.title}</h3>
                  <p className="text-gray-600 mt-1">{address.address}</p>
                  <p className="text-sm text-gray-500">
                    {address.city} - کد پستی: {address.postal_code}
                  </p>
                  {address.is_default && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                      آدرس پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    ویرایش
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-blue-500 hover:text-blue-500">
            + افزودن آدرس جدید
          </button>
        </div>
      )}
    </div>
  );
};

// Wishlist Tab Component
const WishlistTab: React.FC<{ storeId: string }> = ({ storeId }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">لیست علاقه‌مندی‌ها</h2>
      
      <div className="text-center py-12">
        <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">هنوز محصولی به لیست علاقه‌مندی‌هایتان اضافه نکرده‌اید</p>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">تنظیمات</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">اعلان‌های پیامکی</h3>
            <p className="text-sm text-gray-500">دریافت اطلاعیه‌های سفارش از طریق پیامک</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">اعلان‌های ایمیل</h3>
            <p className="text-sm text-gray-500">دریافت اطلاعیه‌های تخفیف و پیشنهادات ویژه</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;