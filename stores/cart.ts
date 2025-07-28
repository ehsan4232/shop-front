/**
 * Cart Store
 * Manages shopping cart state and operations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, Cart, CartItem, Product, ProductVariant } from '../lib/api';
import { toast } from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  
  // Computed
  getTotalItems: () => number;
  getTotalAmount: () => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await api.getCart();
          set({ cart });
        } catch (error) {
          console.error('Fetch cart error:', error);
          // If user not authenticated, reset cart
          set({ cart: null });
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (product: Product, variant?: ProductVariant, quantity = 1) => {
        set({ isLoading: true });
        try {
          const item = await api.addToCart(product.id, variant?.id, quantity);
          
          // Update cart state
          const currentCart = get().cart;
          if (currentCart) {
            const existingItemIndex = currentCart.items.findIndex(
              (i) => 
                i.product.id === product.id && 
                i.product_variant?.id === variant?.id
            );

            if (existingItemIndex >= 0) {
              // Update existing item
              currentCart.items[existingItemIndex] = item;
            } else {
              // Add new item
              currentCart.items.push(item);
            }

            // Update totals
            currentCart.total_items = currentCart.items.reduce((sum, i) => sum + i.quantity, 0);
            currentCart.total_amount = currentCart.items.reduce((sum, i) => sum + i.total_price, 0);

            set({ cart: { ...currentCart } });
          } else {
            // If no cart exists, create one
            set({
              cart: {
                id: 'temp',
                items: [item],
                total_items: quantity,
                total_amount: item.total_price,
              },
            });
          }

          const variantText = variant ? ` - ${variant.attribute_summary}` : '';
          toast.success(`${product.name_fa}${variantText} به سبد خرید اضافه شد`);
          return true;
        } catch (error) {
          console.error('Add to cart error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        set({ isLoading: true });
        try {
          const updatedItem = await api.updateCartItem(itemId, quantity);
          
          const currentCart = get().cart;
          if (currentCart) {
            const itemIndex = currentCart.items.findIndex((i) => i.id === itemId);
            if (itemIndex >= 0) {
              currentCart.items[itemIndex] = updatedItem;
              
              // Update totals
              currentCart.total_items = currentCart.items.reduce((sum, i) => sum + i.quantity, 0);
              currentCart.total_amount = currentCart.items.reduce((sum, i) => sum + i.total_price, 0);
              
              set({ cart: { ...currentCart } });
            }
          }

          toast.success('تعداد محصول به‌روزرسانی شد');
          return true;
        } catch (error) {
          console.error('Update quantity error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true });
        try {
          await api.removeFromCart(itemId);
          
          const currentCart = get().cart;
          if (currentCart) {
            currentCart.items = currentCart.items.filter((i) => i.id !== itemId);
            
            // Update totals
            currentCart.total_items = currentCart.items.reduce((sum, i) => sum + i.quantity, 0);
            currentCart.total_amount = currentCart.items.reduce((sum, i) => sum + i.total_price, 0);
            
            set({ cart: { ...currentCart } });
          }

          toast.success('محصول از سبد خرید حذف شد');
          return true;
        } catch (error) {
          console.error('Remove item error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await api.clearCart();
          set({ cart: null });
          toast.success('سبد خرید خالی شد');
          return true;
        } catch (error) {
          console.error('Clear cart error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      getTotalItems: () => {
        const cart = get().cart;
        return cart ? cart.total_items : 0;
      },

      getTotalAmount: () => {
        const cart = get().cart;
        return cart ? cart.total_amount : 0;
      },

      isInCart: (productId: string, variantId?: string) => {
        const cart = get().cart;
        if (!cart) return false;
        
        return cart.items.some(
          (item) =>
            item.product.id === productId &&
            item.product_variant?.id === variantId
        );
      },

      getCartItem: (productId: string, variantId?: string) => {
        const cart = get().cart;
        if (!cart) return undefined;
        
        return cart.items.find(
          (item) =>
            item.product.id === productId &&
            item.product_variant?.id === variantId
        );
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);
