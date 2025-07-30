'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Store } from '@/types'
import { api } from '@/lib/api'
import { useAuth } from './auth-context'

interface StoreContextType {
  currentStore: Store | null
  stores: Store[]
  isLoading: boolean
  setCurrentStore: (store: Store) => void
  refreshStores: () => Promise<void>
  createStore: (storeData: Partial<Store>) => Promise<Store>
  updateStore: (storeId: string, storeData: Partial<Store>) => Promise<Store>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentStore, setCurrentStore] = useState<Store | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()

  // Load stores when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.is_store_owner) {
      loadStores()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  // Set current store from URL subdomain or localStorage
  useEffect(() => {
    if (stores.length > 0 && !currentStore) {
      // Try to get store from subdomain
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      // Find store by subdomain or custom domain
      let store = stores.find(s => 
        s.custom_domain === hostname || 
        s.slug === subdomain
      )
      
      // Fallback to localStorage
      if (!store) {
        const savedStoreId = localStorage.getItem('current_store_id')
        if (savedStoreId) {
          store = stores.find(s => s.id === savedStoreId)
        }
      }
      
      // Fallback to first store
      if (!store && stores.length > 0) {
        store = stores[0]
      }
      
      if (store) {
        setCurrentStore(store)
        localStorage.setItem('current_store_id', store.id)
      }
    }
  }, [stores, currentStore])

  const loadStores = async () => {
    setIsLoading(true)
    try {
      const response = await api.stores.list()
      if (response.data) {
        setStores(response.data)
      }
    } catch (error) {
      console.error('Failed to load stores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetCurrentStore = (store: Store) => {
    setCurrentStore(store)
    localStorage.setItem('current_store_id', store.id)
    
    // Update URL if we're on admin pages
    if (window.location.pathname.startsWith('/admin')) {
      // Optionally redirect to store-specific admin
      const newUrl = `${window.location.protocol}//${store.custom_domain || `${store.slug}.${window.location.hostname.split('.').slice(1).join('.')}`}/admin`
      // For now, just store in localStorage and refresh will handle it
    }
  }

  const refreshStores = async () => {
    await loadStores()
  }

  const createStore = async (storeData: Partial<Store>): Promise<Store> => {
    const response = await api.stores.create(storeData)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    if (response.data) {
      const newStore = response.data as Store
      setStores(prev => [...prev, newStore])
      
      // Set as current store if it's the first one
      if (stores.length === 0) {
        setCurrentStore(newStore)
        localStorage.setItem('current_store_id', newStore.id)
      }
      
      return newStore
    }
    
    throw new Error('Failed to create store')
  }

  const updateStore = async (storeId: string, storeData: Partial<Store>): Promise<Store> => {
    const response = await api.stores.update(storeId, storeData)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    if (response.data) {
      const updatedStore = response.data as Store
      
      // Update stores list
      setStores(prev => prev.map(store => 
        store.id === storeId ? updatedStore : store
      ))
      
      // Update current store if it's the one being updated
      if (currentStore?.id === storeId) {
        setCurrentStore(updatedStore)
      }
      
      return updatedStore
    }
    
    throw new Error('Failed to update store')
  }

  const value: StoreContextType = {
    currentStore,
    stores,
    isLoading,
    setCurrentStore: handleSetCurrentStore,
    refreshStores,
    createStore,
    updateStore,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

// Higher-order component for store owner routes
export function withStoreOwner<P extends object>(Component: React.ComponentType<P>) {
  return function StoreOwnerComponent(props: P) {
    const { isAuthenticated, user } = useAuth()
    const { isLoading } = useStore()
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    }
    
    if (!isAuthenticated || !user?.is_store_owner) {
      // Redirect to home or show unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      return null
    }
    
    return <Component {...props} />
  }
}

// Hook to get current store with loading state
export function useCurrentStore() {
  const { currentStore, isLoading } = useStore()
  
  return {
    store: currentStore,
    isLoading,
    hasStore: !!currentStore
  }
}

// Hook for store-specific API calls
export function useStoreApi() {
  const { currentStore } = useStore()
  
  if (!currentStore) {
    throw new Error('No current store available')
  }
  
  return {
    storeId: currentStore.id,
    
    // Products
    getProducts: (params?: any) => 
      api.products.list({ store: currentStore.id, ...params }),
    
    getProduct: (slug: string) => 
      api.products.get(slug, { store: currentStore.id }),
    
    createProduct: (data: any) => 
      api.products.create({ ...data, store: currentStore.id }),
    
    updateProduct: (slug: string, data: any) => 
      api.products.update(slug, data),
    
    deleteProduct: (slug: string) => 
      api.products.delete(slug),
    
    // Categories  
    getCategories: (params?: any) => 
      api.categories.list({ store: currentStore.id, ...params }),
    
    createCategory: (data: any) => 
      api.categories.create({ ...data, store: currentStore.id }),
    
    // Product Classes
    getProductClasses: (params?: any) => 
      api.productClasses.list({ store: currentStore.id, ...params }),
    
    getProductClassHierarchy: () => 
      api.productClasses.getHierarchy(currentStore.id),
    
    createProductClass: (data: any) => 
      api.productClasses.create({ ...data, store: currentStore.id }),
    
    // Brands
    getBrands: (params?: any) => 
      api.brands.list({ store: currentStore.id, ...params }),
    
    createBrand: (data: any) => 
      api.brands.create({ ...data, store: currentStore.id }),
    
    // Tags
    getTags: (params?: any) => 
      api.tags.list({ store: currentStore.id, ...params }),
    
    createTag: (data: any) => 
      api.tags.create({ ...data, store: currentStore.id }),
    
    // Analytics
    getStoreStatistics: () => 
      api.stores.getStatistics(currentStore.id),
    
    getProductAnalytics: () => 
      api.products.getAnalytics(currentStore.id),
  }
}