'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthResponse } from '@/types'
import { api } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string, otpCode: string) => Promise<void>
  logout: () => void
  sendOtp: (phoneNumber: string) => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          // Set token in API client
          api.setAuthToken(token)
          
          // Get user profile
          const response = await api.auth.getProfile()
          if (response.data) {
            setUser(response.data)
          } else {
            // Invalid token, clear it
            localStorage.removeItem('auth_token')
            api.removeAuthToken()
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          localStorage.removeItem('auth_token')
          api.removeAuthToken()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const sendOtp = async (phoneNumber: string) => {
    const response = await api.auth.sendOtp(phoneNumber)
    if (response.error) {
      throw new Error(response.error)
    }
  }

  const login = async (phoneNumber: string, otpCode: string) => {
    const response = await api.auth.verifyOtp(phoneNumber, otpCode)
    
    if (response.error) {
      throw new Error(response.error)
    }

    if (response.data) {
      const authData = response.data as AuthResponse
      
      // Store token
      localStorage.setItem('auth_token', authData.tokens.access)
      localStorage.setItem('refresh_token', authData.tokens.refresh)
      
      // Set token in API client
      api.setAuthToken(authData.tokens.access)
      
      // Set user
      setUser(authData.user)
    }
  }

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    
    // Remove token from API client
    api.removeAuthToken()
    
    // Clear user
    setUser(null)
    
    // Redirect to home
    window.location.href = '/'
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      logout()
      return
    }

    try {
      const response = await api.auth.refreshToken(refreshToken)
      
      if (response.data) {
        const newToken = response.data.access
        localStorage.setItem('auth_token', newToken)
        api.setAuthToken(newToken)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    sendOtp,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    }
    
    if (!isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }
    
    return <Component {...props} />
  }
}