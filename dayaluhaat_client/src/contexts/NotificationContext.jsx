import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getSocket } from '../services/socketService';
import { useSocket } from '../hooks/useSocket';
import { showInAppNotification } from '../services/admin/notificationDisplayService';
import { AuthContext } from '../auth/AuthProvider';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from '../api/notificationApi';

export const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const { isConnected } = useSocket(token);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchNotifications(token)
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!isConnected || !token) return;
    const socket = getSocket();
    if (!socket) return;

    const onInAppNotification = async (payload) => {
      showInAppNotification(payload);
      // Save to backend for persistence
      try {
        const saved = await createNotification({
          userId: null, // backend will use req.user.id
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
        }, token);
        setNotifications((prev) => [saved, ...prev]);
      } catch {
        // fallback: add to local state if backend fails
        setNotifications((prev) => [{
          id: payload.data?.requestId || payload.data?.userId || Date.now().toString(),
          title: payload.title,
          body: payload.body,
          timestamp: payload.timestamp || new Date().toISOString(),
          read: false,
          data: payload.data || {},
        }, ...prev]);
      }
    };
    socket.on('inAppNotification', onInAppNotification);
    return () => socket.off('inAppNotification', onInAppNotification);
  }, [isConnected, token]);

  // Mark as read (sync with backend)
  const markAsRead = useCallback(async (notificationId) => {
    setNotifications((prev) => prev.map((notif) => notif._id === notificationId || notif.id === notificationId ? { ...notif, read: true } : notif));
    if (token) {
      try { await markNotificationAsRead(notificationId, token); } catch {}
    }
  }, [token]);

  // Mark all as read (sync with backend)
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    if (token) {
      try { await markAllNotificationsAsRead(token); } catch {}
    }
  }, [token]);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

