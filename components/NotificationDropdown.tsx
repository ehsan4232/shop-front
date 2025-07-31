'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import Link from 'next/link';

const NotificationDropdown: React.FC = () => {
  const { state, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action?.url) {
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    const opacity = read ? 'bg-opacity-50' : 'bg-opacity-100';
    
    switch (type) {
      case 'success':
        return `bg-green-50 ${opacity}`;
      case 'warning':
        return `bg-yellow-50 ${opacity}`;
      case 'error':
        return `bg-red-50 ${opacity}`;
      case 'info':
      default:
        return `bg-blue-50 ${opacity}`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return time.toLocaleDateString();
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {state.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {state.unreadCount > 99 ? '99+' : state.unreadCount}
          </span>
        )}
        
        {/* Connection status indicator */}
        <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
          state.isConnected ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {state.unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {state.unreadCount} new
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {state.unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4 text-gray-500" />
                </button>
              )}
              
              <button
                onClick={() => clearAll()}
                className="p-1 hover:bg-gray-100 rounded"
                title="Clear all"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {state.loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : state.notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {state.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      getNotificationBgColor(notification.type, notification.read)
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-sm mt-1 ${
                              notification.read ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              {notification.action && (
                                <Link
                                  href={notification.action.url}
                                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 space-x-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>{notification.action.label}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 hover:bg-white rounded"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3 text-gray-400" />
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="p-1 hover:bg-white rounded"
                              title="Remove"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <Link
                href="/notifications"
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;