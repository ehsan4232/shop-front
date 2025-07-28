import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
interface AuthState {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  login: (user: any, token: string) => void
  logout: () => void
  updateUser: (user: any) => void
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (user, token) => set({ user, token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
    updateUser: (user) => set((state) => ({ ...state, user })),
  }),
  {
    name: 'auth-storage',
  }
))

// Store Management
interface StoreState {
  currentStore: any | null
  stores: any[]
  setCurrentStore: (store: any) => void
  setStores: (stores: any[]) => void
  addStore: (store: any) => void
  updateStore: (store: any) => void
}

export const useStoreStore = create<StoreState>()((set) => ({
  currentStore: null,
  stores: [],
  setCurrentStore: (store) => set({ currentStore: store }),
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  updateStore: (updatedStore) => set((state) => ({
    stores: state.stores.map((store) => 
      store.id === updatedStore.id ? updatedStore : store
    ),
    currentStore: state.currentStore?.id === updatedStore.id ? updatedStore : state.currentStore
  })),
}))

// Cart Store
interface CartItem {
  id: string
  product: any
  quantity: number
  price: number
}

interface CartState {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => void
}

export const useCartStore = create<CartState>()(persist(
  (set, get) => ({
    items: [],
    total: 0,
    addItem: (item) => {
      const items = get().items
      const existingItem = items.find((i) => i.id === item.id)
      
      if (existingItem) {
        set({
          items: items.map((i) => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        })
      } else {
        set({ items: [...items, item] })
      }
      get().calculateTotal()
    },
    removeItem: (id) => {
      set({ items: get().items.filter((item) => item.id !== id) })
      get().calculateTotal()
    },
    updateQuantity: (id, quantity) => {
      if (quantity <= 0) {
        get().removeItem(id)
        return
      }
      set({
        items: get().items.map((item) => 
          item.id === id ? { ...item, quantity } : item
        )
      })
      get().calculateTotal()
    },
    clearCart: () => set({ items: [], total: 0 }),
    calculateTotal: () => {
      const total = get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      set({ total })
    }
  }),
  {
    name: 'cart-storage',
  }
))

// UI Store
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  language: 'fa' | 'en'
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'fa' | 'en') => void
}

export const useUIStore = create<UIState>()(persist(
  (set) => ({
    sidebarOpen: false,
    theme: 'light',
    language: 'fa',
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
  }),
  {
    name: 'ui-storage',
  }
))