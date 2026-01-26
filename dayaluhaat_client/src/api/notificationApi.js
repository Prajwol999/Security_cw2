// Notification API service
const API_BASE = 'http://localhost:5050/api/notifications';

export async function fetchNotifications(token) {
  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return (await res.json()).notifications;
}

export async function markNotificationAsRead(notificationId, token) {
  const res = await fetch(`${API_BASE}/mark-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationId }),
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
}

export async function markAllNotificationsAsRead(token) {
  const res = await fetch(`${API_BASE}/mark-all-read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to mark all as read');
}

export async function createNotification({ userId, title, body, data }, token) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, title, body, data }),
  });
  if (!res.ok) throw new Error('Failed to create notification');
  return (await res.json()).notification;
}

export async function adminSendNotification({ userId, title, body, data }, token) {
  const res = await fetch(`${API_BASE}/admin/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, title, body, data }),
  });
  if (!res.ok) throw new Error('Failed to send admin notification');
} 