"use client"
import { Link } from "react-router-dom"
import {
  Users,
  Activity,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Zap,
  ChevronRight,
  Eye,
  Download,
  Stethoscope,
  Phone,
} from "lucide-react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"
import { useAdminUser } from "../../hooks/admin/useAdminUser"
import React, { useState, useContext } from 'react';
import AdminSendNotificationModal from './modal/AdminSendNotificationModal';
import { AuthContext } from '../../auth/AuthProvider';
import AuditLogViewer from './AuditLogViewer';

export default function AdminDashboard() {
  const [showNotifModal, setShowNotifModal] = useState(false);
  const { token } = useContext(AuthContext);
  const { users, isLoading: usersLoading, isError: usersError } = useAdminUser()

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (usersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <p className="text-red-600 font-medium text-lg">Error loading dashboard data</p>
        </div>
      </div>
    )
  }

  const totalusers = users?.length || 0
  const totalRecords = totalusers

  const chartData = [
    { name: "users", count: totalusers, color: "#3b82f6" },
  ]

  const diseaseStats = users?.reduce((acc, user) => {
    const disease = user.disease || "Unknown"
    acc[disease] = (acc[disease] || 0) + 1
    return acc
  }, {}) || {}

  const pieData = Object.entries(diseaseStats)
    .slice(0, 5)
    .map(([disease, count], index) => ({
      name: disease,
      value: count,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index] || "#6b7280",
    }))

  const recentusers = users?.slice(0, 5) || []
  const userGrowth = "+12%"
  const recordGrowth = "+12%"

  const stats = [
    {
      title: "Total users",
      value: totalusers,
      change: userGrowth,
      changeType: "positive",
      icon: Users,
      color: "blue",
      bgGradient: "from-blood-500 to-blood-600",
    },
    {
      title: "Total Records",
      value: totalRecords,
      change: recordGrowth,
      changeType: "positive",
      icon: Activity,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blood-600 to-blood-700 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-gray-600 font-medium">Welcome back! Here's your system overview.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <button className="bg-gradient-to-r from-blood-600 to-blood-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blood-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.title}
                className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${stat.changeType === "positive" ? "bg-blood-100 text-blood-700" : "bg-red-100 text-red-700"}`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {stat.value.toLocaleString()}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm">{stat.title}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/admin/user"
              className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blood-50 to-indigo-50 border border-blue-100 hover:from-blood-100 hover:to-indigo-100 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blood-500 to-blood-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Manage users</p>
                <p className="text-xs text-gray-600">Add, edit, view users ({totalusers} total)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Log Viewer - Takes up full width on specific row or 2 columns if integrated */}
          <div className="lg:col-span-3">
            <AuditLogViewer />
          </div>

          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Records Overview</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm" />
                <YAxis axisLine={false} tickLine={false} className="text-sm" />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Disease Distribution</h2>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No disease data</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blood-500" />
              <span>Recent users</span>
            </h2>
          </div>
          <div className="space-y-3">
            {recentusers.length > 0 ? (
              recentusers.map((user) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blood-100 to-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blood-700 font-semibold text-sm">{user.name?.charAt(0)?.toUpperCase() || "P"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.disease}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">ID: {user._id?.slice(-5)}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{user.contact?.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent users</p>
              </div>
            )}
          </div>
        </div>

        <button className="bg-blood-600 text-white px-4 py-2 rounded font-semibold mb-4" onClick={() => setShowNotifModal(true)}>
          Send Notification to All Users
        </button>
        <AdminSendNotificationModal isOpen={showNotifModal} onClose={() => setShowNotifModal(false)} token={token} userId={null} />

      </div>
    </div>
  )
}


