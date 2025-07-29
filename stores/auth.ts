import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, User, handleApiError } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  
  // Getters
  isStoreOwner: () => boolean;
  isCustomer: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      sendOTP: async (phone: string) => {
        set({ loading: true, error: null });
        
        try {
          await apiClient.sendOTP(phone);
          set({ loading: false });
          return true;
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ loading: false, error: errorMessage });
          return false;
        }
      },

      verifyOTP: async (phone: string, code: string) => {
        set({ loading: true, error: null });
        
        try {
          const result = await apiClient.verifyOTP(phone, code);
          set({
            user: result.user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return true;
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ loading: false, error: errorMessage });
          return false;
        }
      },

      logout: async () => {
        set({ loading: true });
        
        try {
          await apiClient.logout();
        } catch (error) {
          // Ignore logout errors, clear local state anyway
          console.error('Logout error:', error);
        }
        
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      refreshToken: async () => {
        if (!get().isAuthenticated) {
          return false;
        }

        try {
          await apiClient.refreshToken();
          return true;
        } catch (error) {
          // If refresh fails, logout user
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          return false;
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ loading: true, error: null });
        
        try {
          const result = await apiClient.updateProfile(data);
          set({
            user: result.user,
            loading: false,
          });
          return true;
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({ loading: false, error: errorMessage });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Getters
      isStoreOwner: () => {
        const { user } = get();
        return user?.is_store_owner || false;
      },

      isCustomer: () => {
        const { user } = get();
        return user?.is_customer || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for checking authentication status
export const useAuth = () => {
  const auth = useAuthStore();
  
  return {
    ...auth,
    isReady: !auth.loading,
  };
};

// Hook for requiring authentication
export const useRequireAuth = () => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated && !auth.loading) {
    throw new Error('Authentication required');
  }
  
  return auth;
};
