'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  dateJoined: string;
  profile?: {
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    bio?: string;
  };
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tenant?: Tenant } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<boolean>;
} | null>(null);

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tenantDomain?: string;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tenant: action.payload.tenant || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Set token in API client
      apiClient.setToken(token);

      // Verify token and get user info
      const response = await apiClient.get<{ user: User; profile?: any }>('/auth/profile/');
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: { ...response.user, profile: response.profile },
        },
      });
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      apiClient.setToken(null);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiClient.post<{
        access: string;
        refresh: string;
        user: User;
        tenant?: Tenant;
      }>('/auth/login/', { email, password });

      // Store tokens
      localStorage.setItem('auth-token', response.access);
      localStorage.setItem('refresh-token', response.refresh);

      // Set token in API client
      apiClient.setToken(response.access);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          tenant: response.tenant,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiClient.post<{
        access: string;
        refresh: string;
        user: User;
        tenant?: Tenant;
      }>('/auth/register/', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        tenant_domain: userData.tenantDomain,
      });

      // Store tokens
      localStorage.setItem('auth-token', response.access);
      localStorage.setItem('refresh-token', response.refresh);

      // Set token in API client
      apiClient.setToken(response.access);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          tenant: response.tenant,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refresh-token');
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');

      // Clear API client token
      apiClient.setToken(null);

      // Update state
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    try {
      const response = await apiClient.put<{
        user: User;
        profile?: any;
      }>('/auth/profile/', profileData);

      dispatch({
        type: 'UPDATE_USER',
        payload: { ...response.user, profile: response.profile },
      });
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh-token');
      if (!refreshTokenValue) {
        return false;
      }

      const response = await apiClient.post<{
        access: string;
      }>('/auth/token/refresh/', { refresh: refreshTokenValue });

      localStorage.setItem('auth-token', response.access);
      apiClient.setToken(response.access);

      return true;
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      return false;
    }
  };

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(async () => {
      await refreshToken();
    }, 14 * 60 * 1000); // Refresh every 14 minutes (assuming 15-minute access token)

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        register,
        logout,
        updateProfile,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions
export const isAuthenticated = (state: AuthState): boolean => {
  return state.isAuthenticated && state.user !== null;
};

export const getUser = (state: AuthState): User | null => {
  return state.user;
};

export const getTenant = (state: AuthState): Tenant | null => {
  return state.tenant;
};