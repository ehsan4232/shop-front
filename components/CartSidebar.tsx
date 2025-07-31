'use client';

import React from 'react';
import { useCart, removeFromCart, updateQuantity, clearCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CartSidebar: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(dispatch, id);
    } else {
      updateQuantity(dispatch, id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(dispatch, id);
  };

  const handleClearCart = () => {
    clearCart(dispatch);
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Shopping Cart ({state.itemCount})</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    {/* Product Image */}
                    {item.image && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      
                      {/* Attributes */}
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="rounded-md p-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 min-w-[2rem] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="rounded-md p-1 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="rounded-md p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t px-4 py-4">
              {/* Total */}
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${state.total.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/checkout" className="block">
                  <button
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                    onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  >
                    Proceed to Checkout
                  </button>
                </Link>
                
                <button
                  onClick={handleClearCart}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;