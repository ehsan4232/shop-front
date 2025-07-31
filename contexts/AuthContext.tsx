'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  is_store_owner: boolean;
  is_phone_verified: boolean;
  profile?: {
    avatar?: string;
    bio?: string;
    city?: string;
    state?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (phoneNumber: string, otpCode: string, userType?: 'login' | 'register', userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (phoneNumber: string, type?: 'login' | 'register') => Promise<any>;
  resendOTP: (phoneNumber: string, type?: 'login' | 'register') => Promise<any>;
  checkPhone: (phoneNumber: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API client for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = {
  async post(url: string, data: any) {
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || 'خطای ناشناخته');
    }

    return result;
  },

  async get(url: string) {
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken();
        // Retry the request
        return this.get(url);
      }
      throw new Error('خطا در دریافت اطلاعات');
    }

    return response.json();
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('auth-token', data.access);
    return data;
  },

  setToken(token: string) {
    localStorage.setItem('auth-token', token);
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const userData = await apiClient.get('/profile/');
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const sendOTP = async (phoneNumber: string, type: 'login' | 'register' = 'login') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiClient.post('/send-otp/', {
        phone_number: phoneNumber,
        code_type: type,
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const resendOTP = async (phoneNumber: string, type: 'login' | 'register' = 'login') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiClient.post('/resend-otp/', {
        phone_number: phoneNumber,
        code_type: type,
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const login = async (
    phoneNumber: string,
    otpCode: string,
    userType: 'login' | 'register' = 'login',
    userData?: any
  ) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const requestData: any = {
        phone_number: phoneNumber,
        code: otpCode,
        code_type: userType,
      };

      if (userType === 'register' && userData) {
        requestData.user_data = userData;
      }

      const response = await apiClient.post('/verify-otp/', requestData);

      // Store tokens
      localStorage.setItem('auth-token', response.access);
      localStorage.setItem('refresh-token', response.refresh);
      apiClient.setToken(response.access);

      // Set user
      dispatch({ type: 'SET_USER', payload: response.user });

      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Try to logout on server (optional, fire and forget)
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          await apiClient.post('/auth/logout/', {});
        } catch (error) {
          // Ignore logout errors
        }
      }
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkPhone = async (phoneNumber: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/check-phone/', {
        phone_number: phoneNumber,
      });
      return response.exists;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiClient.post('/profile/update/', userData);
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    sendOTP,
    resendOTP,
    checkPhone,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;