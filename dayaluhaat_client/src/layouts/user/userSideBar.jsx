// src/layouts/user/UserSidebar.jsx
"use client"
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  MessageSquare,
  Settings,
  Smile,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthProvider"; // Adjust this path if needed
// import { useNotifications } from '../../contexts/NotificationContext'; // Uncomment if you have this

export default function UserSidebar() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const { unreadCount } = useNotifications(); // Dummy value for example
  const unreadCount = 3; // Remove or replace with your context

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard" },
    { name: "My Requests", icon: MessageSquare, path: "/user/requests" },
    { name: "Notifications", icon: Bell, path: "/user/notifications", hasBadge: true },
    { name: "Message", icon: MessageCircle, path: "/user/message" },
    { name: "Mental Health", icon: Smile, path: "/user/mental-health" },
    { name: "Settings", icon: Settings, path: "/user/settings" },
  ];

  const handleSignOut = () => {
    logout();
    navigate("/"); // Navigate to home page on sign out
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold text-blood-600 mb-8">User Panel</div>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-blood-50 text-blood-600"
                      : "text-gray-700 hover:bg-gray-50"
                  } relative`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.hasBadge && unreadCount > 0 && (
                    <span className="absolute top-1 right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Section */}
        <div className="border-t border-gray-200 pt-6">
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all w-full"
            onClick={() => setShowConfirmDialog(true)}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Sign Out</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

