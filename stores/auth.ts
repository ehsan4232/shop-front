/**
 * Authentication Store
 * Manages user authentication state and related operations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, User } from '../lib/api';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      sendOtp: async (phone: string) => {
        set({ isLoading: true });
        try {
          await api.sendOtp(phone);
          toast.success('کد تأیید ارسال شد');
          return true;
        } catch (error) {
          console.error('Send OTP error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await api.verifyOtp(phone, otp);
          api.setToken(response.token);
          
          set({
            user: response.user,
            isAuthenticated: true,
          });
          
          toast.success('با موفقیت وارد شدید');
          return true;
        } catch (error) {
          console.error('Verify OTP error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        api.clearToken();
        set({
          user: null,
          isAuthenticated: false,
        });
        toast.success('با موفقیت خارج شدید');
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        try {
          const updatedUser = await api.updateProfile(data);
          set({ user: updatedUser });
          toast.success('پروفایل به‌روزرسانی شد');
          return true;
        } catch (error) {
          console.error('Update profile error:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) return;

        try {
          const user = await api.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid, clear it
          api.clearToken();
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
