import React, { useState } from 'react';
import { adminSendNotification } from '../../../api/notificationApi';

export default function AdminSendNotificationModal({ isOpen, onClose, token, userId }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await adminSendNotification({ userId, title, body }, token);
      setSuccess(true);
      setTitle('');
      setBody('');
    } catch (err) {
      setError('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Send Notification</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body</label>
            <textarea className="w-full border rounded px-3 py-2" value={body} onChange={e => setBody(e.target.value)} required rows={3} />
          </div>
          <button type="submit" className="w-full bg-blood-600 text-white py-2 rounded font-semibold disabled:opacity-50" disabled={loading}>{loading ? 'Sending...' : 'Send Notification'}</button>
          {success && <div className="text-blood-600 text-sm mt-2">Notification sent!</div>}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
} 

