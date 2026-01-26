// contexts/NotificationContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getSocket } from '../../services/socketService'; // Adjust path
import { useSocket } from '../../hooks/useSocket';     // Adjust path
import { showInAppNotification } from '../../services/notificationDisplayService'; // Adjust path

// Create the Context
export const NotificationContext = createContext(null);

// Custom hook to consume the context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider Component
export const NotificationProvider = ({ children, token }) => {
  // Notification structure: { id, title, body, timestamp, read, data }
  const [notifications, setNotifications] = useState([]);
  const { isConnected } = useSocket(token); // Use your existing socket hook

  // --- WebSocket Listener for New Notifications ---
  useEffect(() => {
    if (!isConnected) {
      console.log("NotificationProvider: Not connected to socket, cannot listen.");
      return;
    }

    const socket = getSocket();
    if (!socket) {
      console.error("NotificationProvider: Socket instance not available.");
      return;
    }

    const onInAppNotification = (payload) => {
      console.log("NotificationProvider: Received new in-app notification:", payload);
      // Display a toast immediately for new notifications (using the display service)
      showInAppNotification(payload);

      // Add to global notification list, assign unique ID and mark as unread
      const newNotification = {
        id: payload.data?.requestId || payload.data?.userId || Date.now().toString(),
        title: payload.title,
        body: payload.body,
        timestamp: payload.timestamp || new Date().toISOString(),
        read: false, // New notifications are unread by default
        data: payload.data || {},
      };
      setNotifications(prev => [newNotification, ...prev]); // Add new notification to the top
    };

    socket.on('inAppNotification', onInAppNotification);
    console.log("NotificationProvider: Subscribed to 'inAppNotification' events.");

    // --- Cleanup Listener ---
    return () => {
      socket.off('inAppNotification', onInAppNotification);
      console.log("NotificationProvider: Unsubscribed from 'inAppNotification' events.");
    };
  }, [isConnected, token]);

  // --- Actions to manage notifications ---

  // Mark a specific notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    // Optional: If you need persistence across sessions/devices,
    // you would send an API call to your backend here to update the read status in your database.
    // E.g., fetch('/api/notifications/mark-read', { method: 'POST', body: JSON.stringify({ notificationId, userId: tokenExtractedId }) });
    console.log(`Notification ${notificationId} marked as read.`);
  }, []);

  // Mark all unread notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    // Optional: Send a bulk API call to backend if needed for persistence
    console.log("All notifications marked as read.");
  }, []);

  // Filter and sort notifications (e.g., newest first, unread prioritized)
  const getSortedNotifications = useCallback(() => {
    // Sort by timestamp (newest first) and then by unread status (unread first)
    return [...notifications].sort((a, b) => {
      // Unread notifications come before read ones
      if (a.read && !b.read) return 1;
      if (!a.read && b.read) return -1;
      // Otherwise, sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const contextValue = {
    notifications: getSortedNotifications(), // Provide sorted list
    unreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

