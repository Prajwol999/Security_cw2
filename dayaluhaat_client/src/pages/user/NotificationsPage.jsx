// pages/user/NotificationsPage.jsx
"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext'; // Path from pages/user/ to contexts/
import { Bell, Check, MailOpen, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blood-50 to-indigo-100">
                <div className="text-xl text-gray-600">Loading notifications...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blood-50 to-indigo-100 p-6 lg:p-8 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl mb-8 p-6 bg-white rounded-2xl shadow-xl flex items-center justify-between space-x-6">
                <Link to="/user/dashboard" className="group flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">Your Notifications</h1>
                <div className="relative">
                    <Bell className="h-8 w-8 text-blood-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Mark All As Read Button */}
            {notifications.length > 0 && unreadCount > 0 && (
                <div className="w-full max-w-4xl mb-6 flex justify-end">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center space-x-2 px-4 py-2 bg-blood-500 text-white rounded-lg hover:bg-blood-600 transition-colors text-sm font-semibold"
                    >
                        <MailOpen className="h-4 w-4" />
                        <span>Mark All as Read</span>
                    </button>
                </div>
            )}

            {/* Notifications List */}
            <div className="w-full max-w-4xl space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-10 text-center text-gray-600">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-semibold mb-2">No Notifications Yet!</p>
                        <p>You'll see updates about your requests and profile changes here.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-center space-x-4 p-4 rounded-xl shadow-md transition-all duration-300 ${
                                notif.read ? 'bg-gray-50 text-gray-600' : 'bg-white border border-blue-200 shadow-lg'
                            }`}
                        >
                            {/* Icon/Status Indicator (Left) */}
                            <div className="flex-shrink-0">
                                {notif.read ? (
                                    <MailOpen className="h-6 w-6 text-gray-400" />
                                ) : (
                                    <Bell className="h-6 w-6 text-red-500 animate-pulse" />
                                )}
                            </div>

                            {/* Notification Content (Middle - Flexible to be row-like for larger screens) */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex-1">
                                    <p className={`font-semibold text-lg ${notif.read ? 'text-gray-700' : 'text-blood-800'}`}>
                                        {notif.title}
                                    </p>
                                    <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                                        {notif.body}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                    {new Date(notif.timestamp).toLocaleString()}
                                </span>
                            </div>

                            {/* Mark as Read Button (Right) */}
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="flex-shrink-0 ml-4 p-2 bg-blood-500 text-white rounded-full hover:bg-blood-600 transition-colors"
                                    title="Mark as Read"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

