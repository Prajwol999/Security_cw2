"use client";
import { useState, useContext } from "react";
import { useAdminUser } from "../../hooks/admin/useAdminUser";
import AddUserModal from "./modal/AdminUserModal";
import EditUserModal from "./modal/EditUserModal";
import DeleteUserModal from "./modal/DeleteUserModal";
import UserDetailModal from "./modal/adminUserViewModal"; // Import the UserDetailModal
import AdminSendNotificationModal from './modal/AdminSendNotificationModal';
import { getBackendImageUrl } from "../../utils/backend-image";
import { Toaster } from "react-hot-toast";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Phone,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  ImageIcon,
} from "lucide-react";
import { AuthContext } from '../../auth/AuthProvider';

export default function AdminUser() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // State for detail modal
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user details
  const [searchQuery, setSearchQuery] = useState("");
  const [notifUserId, setNotifUserId] = useState(null);
  const { token } = useContext(AuthContext);

  const { users, isLoading, isError, pagination, setPageNumber, canNextPage, canPreviousPage } = useAdminUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blood-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
              <p className="text-gray-600 font-medium">Loading Users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blood-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Activity className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-red-600 font-medium text-lg">Error fetching Users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const openEditModal = (id) => {
    setSelectedUserId(id);
    setShowEditModal(true);
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailModal(false);
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blood-50 to-indigo-100">
      <Toaster />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blood-600 p-3 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage and monitor User records</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blood-600 hover:bg-blood-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New User
            </button>
          </div>
        </div>

        <AddUserModal isOpen={showAddModal} onClose={closeAllModals} />
        <EditUserModal isOpen={showEditModal} onClose={closeAllModals} userId={selectedUserId} />
        <DeleteUserModal isOpen={showDeleteModal} onClose={closeAllModals} userId={selectedUserId} />
        <UserDetailModal isOpen={showDetailModal} onClose={closeAllModals} user={selectedUser} />
        <AdminSendNotificationModal isOpen={!!notifUserId} onClose={() => setNotifUserId(null)} token={token} userId={notifUserId} />

        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blood-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">TotalTen Users</p>
                  <p className="text-3xl font-bold text-gray-900">{pagination.totalCount || users.length}</p>
                </div>
                <div className="bg-blood-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blood-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Page</p>
                  <p className="text-3xl font-bold text-gray-900">{pagination.page}</p>
                </div>
                <div className="bg-blood-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blood-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-900">{pagination.totalPages}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openDetailModal(user)} // Open detail modal on card click
            >
              <div className="h-32 bg-gradient-to-r from-blood-100 to-indigo-100 relative">
                {user.filepath ? (
                  <>
                    <img
                      src={getBackendImageUrl(user.filepath) || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Card image load error:", e.target.src);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="w-full h-full absolute inset-0 items-center justify-center bg-gradient-to-r from-blood-100 to-indigo-100 hidden">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-blood-100 text-blood-800 text-xs px-2 py-1 rounded-full">
                    ID: {user._id.slice(-6)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blood-500 to-purple-600 p-2 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Activity className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Disease</p>
                      <p className="text-sm text-gray-600">{user.disease}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Description</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{user.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-blood-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact</p>
                      <p className="text-sm text-gray-600">{user.contact}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering modal
                      openEditModal(user._id);
                    }}
                    className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering modal
                      openDeleteModal(user._id);
                    }}
                    className="flex-1 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering modal
                      setNotifUserId(user._id);
                    }}
                    className="flex-1 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Notify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white shadow-lg border-0 rounded-lg">
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first user record.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blood-600 hover:bg-blood-700 text-white px-4 py-2 rounded-md flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </button>
            </div>
          </div>
        )}

        {users.length > 0 && (
          <div className="bg-white shadow-lg border-0 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={!canPreviousPage}
                  className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  disabled={!canNextPage}
                  className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

