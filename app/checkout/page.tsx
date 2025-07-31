'use client';

import React, { useState, useEffect } from 'react';
import { useCart, clearCart } from '@/contexts/CartContext';
import { CreditCard, MapPin, User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const CheckoutPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99,
  };

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', cost: shippingCosts.standard },
    { id: 'express', name: 'Express Shipping', description: '2-3 business days', cost: shippingCosts.express },
    { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', cost: shippingCosts.overnight },
  ];

  const tax = state.total * 0.08; // 8% tax rate
  const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts];
  const grandTotal = state.total + tax + shippingCost;

  useEffect(() => {
    if (state.items.length === 0) {
      // Redirect to cart if empty
      window.location.href = '/';
    }
  }, [state.items]);

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
      return required.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '');
    }
    
    if (step === 2) {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      return required.every(field => paymentInfo[field as keyof PaymentInfo].trim() !== '') && acceptTerms;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) {
      setError('Please fill in all required fields and accept the terms');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: state.items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: shippingAddress,
        payment_info: {
          // Note: In a real app, never send actual payment info to your backend
          // Use a payment processor like Stripe, PayPal, etc.
          method: 'card',
          cardholderName: paymentInfo.cardholderName,
        },
        shipping_method: shippingMethod,
        subtotal: state.total,
        tax_amount: tax,
        shipping_cost: shippingCost,
        total_amount: grandTotal,
      };

      const response = await apiClient.post('/orders/', orderData);
      
      // Clear cart after successful order
      clearCart(dispatch);
      
      // Redirect to success page
      window.location.href = `/order-confirmation/${response.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center space-x-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          <span className={`ml-2 text-sm ${step <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
            {step === 1 && 'Shipping'}
            {step === 2 && 'Payment'}
            {step === 3 && 'Review'}
          </span>
          {step < 3 && <div className="mx-4 h-px w-8 bg-gray-300" />}
        </div>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-semibold">Shipping Information</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name *</label>
          <input
            type="text"
            value={shippingAddress.firstName}
            onChange={(e) => handleShippingChange('firstName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name *</label>
          <input
            type="text"
            value={shippingAddress.lastName}
            onChange={(e) => handleShippingChange('lastName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            value={shippingAddress.email}
            onChange={(e) => handleShippingChange('email', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={shippingAddress.phone}
            onChange={(e) => handleShippingChange('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address *</label>
        <input
          type="text"
          value={shippingAddress.address}
          onChange={(e) => handleShippingChange('address', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            value={shippingAddress.city}
            onChange={(e) => handleShippingChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">State *</label>
          <input
            type="text"
            value={shippingAddress.state}
            onChange={(e) => handleShippingChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
          <input
            type="text"
            value={shippingAddress.zipCode}
            onChange={(e) => handleShippingChange('zipCode', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipping Method</h3>
        {shippingOptions.map((option) => (
          <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={shippingMethod === option.id}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.name}</span>
                <span className="font-medium">${option.cost.toFixed(2)}</span>
              </div>
              <span className="text-sm text-gray-500">{option.description}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-semibold">Payment Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cardholder Name *</label>
          <input
            type="text"
            value={paymentInfo.cardholderName}
            onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number *</label>
          <input
            type="text"
            value={paymentInfo.cardNumber}
            onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date *</label>
            <input
              type="text"
              value={paymentInfo.expiryDate}
              onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV *</label>
            <input
              type="text"
              value={paymentInfo.cvv}
              onChange={(e) => handlePaymentChange('cvv', e.target.value)}
              placeholder="123"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </label>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Order Review</h2>
      
      {/* Order Items */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Order Items</h3>
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              {item.image && (
                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded" />
              )}
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Info */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <div className="text-sm text-gray-600">
          <div>{shippingAddress.firstName} {shippingAddress.lastName}</div>
          <div>{shippingAddress.address}</div>
          <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
          <div>{shippingAddress.email}</div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${state.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (state.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {currentStep === 1 && renderShippingStep()}
              {currentStep === 2 && renderPaymentStep()}
              {currentStep === 3 && renderReviewStep()}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;