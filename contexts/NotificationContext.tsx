'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  loading: boolean;
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
} | null>(null);

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
        loading: false,
      };

    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length,
      };

    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };

    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(n => ({ ...n, read: true }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };

    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length,
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  loading: true,
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { state: authState } = useAuth();

  useEffect(() => {
    if (authState.isAuthenticated) {
      initializeNotifications();
      connectWebSocket();
    } else {
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    }
  }, [authState.isAuthenticated]);

  const initializeNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Fetch initial notifications from API
      const response = await fetch('/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_NOTIFICATIONS', payload: data.results || [] });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const connectWebSocket = () => {
    if (!authState.user) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/notifications/${authState.user.id}/`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const notification: Notification = {
            id: data.notification.id,
            title: data.notification.title,
            message: data.notification.message,
            type: data.notification.type || 'info',
            timestamp: data.notification.timestamp,
            read: false,
            action: data.notification.action,
          };
          
          dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (authState.isAuthenticated) {
          connectWebSocket();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/mark-read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        dispatch({ type: 'MARK_AS_READ', payload: id });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        dispatch({ type: 'MARK_ALL_AS_READ' });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch('/api/notifications/clear-all/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (response.ok) {
        dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      }
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove after 5 seconds for non-persistent notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
      }, 5000);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        state,
        dispatch,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        showNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};