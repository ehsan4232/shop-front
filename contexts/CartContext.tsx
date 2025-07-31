'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  name: string;
  name_fa: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, string>;
  max_quantity?: number;
  sku?: string;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { 
                ...item, 
                quantity: Math.min(
                  item.quantity + action.payload.quantity,
                  item.max_quantity || 999
                )
              }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        itemCount,
        totalAmount,
        error: null,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        itemCount,
        totalAmount,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { 
              ...item, 
              quantity: Math.max(
                1, 
                Math.min(action.payload.quantity, item.max_quantity || 999)
              )
            }
          : item
      ).filter(item => item.quantity > 0);
      
      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        itemCount,
        totalAmount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        totalAmount: 0,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };
    
    case 'LOAD_CART':
      const itemCount = action.payload.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: action.payload,
        itemCount,
        totalAmount,
        isLoading: false,
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
  isOpen: false,
  isLoading: false,
  error: null,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart persistence helpers
const CART_STORAGE_KEY = 'mall_cart';

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.items.length > 0 || state.itemCount === 0) {
      saveCartToStorage(state.items);
    }
  }, [state.items, state.itemCount]);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartElement = document.getElementById('cart-sidebar');
      if (cartElement && !cartElement.contains(event.target as Node) && state.isOpen) {
        dispatch({ type: 'SET_CART_OPEN', payload: false });
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.isOpen]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper functions for cart actions
export const addToCart = (dispatch: React.Dispatch<CartAction>, item: Omit<CartItem, 'id'>) => {
  const cartItem: CartItem = {
    ...item,
    id: item.variant_id || item.product_id,
  };
  
  dispatch({ type: 'ADD_ITEM', payload: cartItem });
};

export const removeFromCart = (dispatch: React.Dispatch<CartAction>, itemId: string) => {
  dispatch({ type: 'REMOVE_ITEM', payload: itemId });
};

export const updateCartQuantity = (
  dispatch: React.Dispatch<CartAction>, 
  itemId: string, 
  quantity: number
) => {
  dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
};

export const clearCart = (dispatch: React.Dispatch<CartAction>) => {
  dispatch({ type: 'CLEAR_CART' });
};

export const toggleCart = (dispatch: React.Dispatch<CartAction>) => {
  dispatch({ type: 'TOGGLE_CART' });
};

export const setCartOpen = (dispatch: React.Dispatch<CartAction>, isOpen: boolean) => {
  dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
};

export default CartContext;