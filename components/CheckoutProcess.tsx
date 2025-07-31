import React, { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon, 
  CreditCardIcon, 
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/api';

interface CartItem {
  id: string;
  product: {
    id: string;
    name_fa: string;
    featured_image?: string;
    base_price: number;
  };
  variant?: {
    id: string;
    sku: string;
    price: number;
  };
  quantity: number;
  total_price: number;
}

interface ShippingAddress {
  id?: string;
  title: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

interface CheckoutStepProps {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({ step, currentStep, title, children }) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;
  
  return (
    <div className={`border rounded-lg ${isActive ? 'border-blue-500 bg-blue-50' : isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : step}
          </div>
          <h3 className={`mr-3 font-medium ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
      </div>
      {isActive && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckoutProcessProps {
  storeId: string;
  onOrderComplete: (orderId: string) => void;
}

const CheckoutProcess: React.FC<CheckoutProcessProps> = ({ storeId, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    title: '',
    recipient_name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    is_default: false
  });
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    loadCartItems();
    loadShippingAddresses();
  }, [storeId]);

  const loadCartItems = async () => {
    try {
      const response = await apiClient.get(`/cart/items/?store=${storeId}`);
      setCartItems(response.data.results || response.data);
      calculateTotals(response.data.results || response.data);
    } catch (error) {
      console.error('خطا در دریافت سبد خرید:', error);
    }
  };

  const loadShippingAddresses = async () => {
    try {
      const response = await apiClient.get('/accounts/profile/');
      setShippingAddresses(response.data.addresses || []);
      
      // Auto-select default address
      const defaultAddress = response.data.addresses?.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error('خطا در دریافت آدرس‌ها:', error);
    }
  };

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const shipping = subtotal > 500000 ? 0 : 50000; // Free shipping over 500k
    const tax = subtotal * 0.09; // 9% tax
    const total = subtotal + shipping + tax;
    
    setTotals({
      subtotal,
      shipping,
      tax,
      total
    });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await apiClient.delete(`/cart/items/${itemId}/`);
      } else {
        await apiClient.patch(`/cart/items/${itemId}/`, { quantity });
      }
      loadCartItems();
    } catch (error) {
      console.error('خطا در به‌روزرسانی سبد خرید:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/cart/items/${itemId}/`);
      loadCartItems();
    } catch (error) {
      console.error('خطا در حذف آیتم:', error);
    }
  };

  const saveNewAddress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/accounts/addresses/', newAddress);
      setShippingAddresses(prev => [...prev, response.data]);
      setSelectedAddress(response.data.id);
      setNewAddress({
        title: '',
        recipient_name: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        is_default: false
      });
    } catch (error) {
      console.error('خطا در ذخیره آدرس:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = async () => {
    if (!selectedAddress || !shippingMethod) {
      alert('لطفاً آدرس و روش ارسال را انتخاب کنید');
      return;
    }
    setCurrentStep(3);
  };

  const completeOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        store_id: storeId,
        shipping_address_id: selectedAddress,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        notes: orderNotes,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          variant_id: item.variant?.id,
          quantity: item.quantity
        }))
      };

      const response = await apiClient.post('/orders/', orderData);
      
      if (paymentMethod === 'online') {
        // Redirect to payment gateway
        const paymentResponse = await apiClient.post(`/orders/${response.data.id}/payment/`, {
          gateway: 'zarinpal'
        });
        window.location.href = paymentResponse.data.payment_url;
      } else {
        onOrderComplete(response.data.id);
      }
      
    } catch (error) {
      console.error('خطا در ثبت سفارش:', error);
      alert('خطا در ثبت سفارش');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">تسویه حساب</h1>

          {/* Step 1: Cart Review */}
          <CheckoutStep step={1} currentStep={currentStep} title="بررسی سبد خرید">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b border-gray-200 pb-4">
                  <img
                    src={item.product.featured_image || '/placeholder.jpg'}
                    alt={item.product.name_fa}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name_fa}</h4>
                    {item.variant && (
                      <p className="text-sm text-gray-500">کد: {item.variant.sku}</p>
                    )}
                    <p className="text-sm text-blue-600">
                      {formatPrice(item.variant?.price || item.product.base_price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {cartItems.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    ادامه خرید
                  </button>
                </div>
              )}
            </div>
          </CheckoutStep>

          {/* Step 2: Shipping & Address */}
          <CheckoutStep step={2} currentStep={currentStep} title="آدرس و ارسال">
            <div className="space-y-6">
              {/* Shipping Addresses */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">انتخاب آدرس تحویل</h4>
                
                {shippingAddresses.map((address) => (
                  <div key={address.id} className="mb-3">
                    <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 ml-3"
                      />
                      <div>
                        <div className="font-medium">{address.title}</div>
                        <div className="text-sm text-gray-600">
                          {address.recipient_name} - {address.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          {address.address}, {address.city}
                        </div>
                        {address.is_default && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                            آدرس پیش‌فرض
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}

                {/* New Address Form */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  <h5 className="font-medium mb-3">آدرس جدید</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="عنوان آدرس"
                      value={newAddress.title}
                      onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="نام گیرنده"
                      value={newAddress.recipient_name}
                      onChange={(e) => setNewAddress({...newAddress, recipient_name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="tel"
                      placeholder="شماره تماس"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="شهر"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="استان"
                      value={newAddress.province}
                      onChange={(e) => setNewAddress({...newAddress, province: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="کد پستی"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <textarea
                    placeholder="آدرس کامل"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    rows={3}
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={saveNewAddress}
                    disabled={loading}
                    className="mt-3 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                  >
                    ذخیره آدرس
                  </button>
                </div>
              </div>

              {/* Shipping Methods */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">روش ارسال</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="ml-3"
                    />
                    <TruckIcon className="w-5 h-5 text-gray-400 ml-3" />
                    <div>
                      <div className="font-medium">ارسال عادی</div>
                      <div className="text-sm text-gray-600">۳-۵ روز کاری - {formatPrice(50000)}</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="ml-3"
                    />
                    <TruckIcon className="w-5 h-5 text-blue-500 ml-3" />
                    <div>
                      <div className="font-medium">ارسال سریع</div>
                      <div className="text-sm text-gray-600">۱-۲ روز کاری - {formatPrice(100000)}</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  بازگشت
                </button>
                <button
                  onClick={proceedToPayment}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  ادامه
                </button>
              </div>
            </div>
          </CheckoutStep>

          {/* Step 3: Payment */}
          <CheckoutStep step={3} currentStep={currentStep} title="روش پرداخت">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">انتخاب روش پرداخت</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="ml-3"
                    />
                    <CreditCardIcon className="w-5 h-5 text-green-500 ml-3" />
                    <div>
                      <div className="font-medium">پرداخت آنلاین</div>
                      <div className="text-sm text-gray-600">پرداخت با کارت بانکی</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="ml-3"
                    />
                    <TruckIcon className="w-5 h-5 text-orange-500 ml-3" />
                    <div>
                      <div className="font-medium">پرداخت در محل</div>
                      <div className="text-sm text-gray-600">پرداخت هنگام تحویل</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  یادداشت سفارش (اختیاری)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="توضیحات یا درخواست خاصی دارید..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  بازگشت
                </button>
                <button
                  onClick={completeOrder}
                  disabled={loading || !paymentMethod}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'در حال پردازش...' : 'تکمیل سفارش'}
                </button>
              </div>
            </div>
          </CheckoutStep>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>جمع کل</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>{totals.shipping === 0 ? 'رایگان' : formatPrice(totals.shipping)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>مالیات</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>مبلغ قابل پرداخت</span>
                  <span className="text-green-600">{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>

            {totals.shipping === 0 && totals.subtotal > 0 && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 text-sm rounded-lg">
                🎉 ارسال رایگان فعال شد!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;