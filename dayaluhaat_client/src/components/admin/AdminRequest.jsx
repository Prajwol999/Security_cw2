"use client"

import { useState, useEffect } from "react"
import { useAdminRequests, useUpdateRequestStatus } from "../../hooks/useRequest"
import {
  GitPullRequest,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  Loader2,
  AlertTriangle,
  DollarSign,
  Calendar,
  UserIcon,
  FileBadge,
  Sparkles,
  Shield,
  Award,
  Users,
  Activity,
} from "lucide-react"
import toast from "react-hot-toast"

const UpdateStatusModal = ({ isOpen, onClose, request, isLoading }) => {
  const [status, setStatus] = useState("approved")
  const [feedback, setFeedback] = useState("")
  const [amount, setAmount] = useState(0)

  const { mutate: updateStatus, isPending } = useUpdateRequestStatus()

  useEffect(() => {
    if (isOpen && request) {
      setStatus("approved")
      setFeedback("")
      setAmount(request.neededAmount || 0)
    }
  }, [isOpen, request])

  if (!isOpen || !request) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!feedback.trim()) {
      return toast.error("Feedback is required.")
    }
    if (amount === undefined || isNaN(amount) || Number(amount) < 0) {
      return toast.error("A valid, non-negative amount is required.")
    }

    const payload = {
      status,
      feedback,
      neededAmount: Number(amount),
    }

    updateStatus(
      { id: request._id, data: payload },
      {
        onSuccess: () => {
          toast.success(`Request has been ${status}.`)
          onClose()
        },
        onError: (error) => {
          console.error("Update failed:", error)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blood-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blood-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blood-500 to-blood-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Request</h2>
              <p className="text-gray-600">Make your decision on this medical assistance request</p>
            </div>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blood-50 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-semibold text-gray-800">{request.uploadedBy?.name || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Requested Amount</p>
                  <p className="font-semibold text-gray-800">${Number(request.neededAmount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Decision</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="status"
                    value="approved"
                    checked={status === "approved"}
                    onChange={() => setStatus("approved")}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      status === "approved"
                        ? "border-blood-500 bg-gradient-to-r from-blood-50 to-blood-100 shadow-lg"
                        : "border-gray-200 bg-white hover:border-blood-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle
                        className={`w-6 h-6 ${status === "approved" ? "text-blood-600" : "text-gray-400"}`}
                      />
                      <span className={`font-semibold ${status === "approved" ? "text-blood-700" : "text-gray-600"}`}>
                        Approve
                      </span>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="status"
                    value="declined"
                    checked={status === "declined"}
                    onChange={() => setStatus("declined")}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      status === "declined"
                        ? "border-red-500 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <XCircle className={`w-6 h-6 ${status === "declined" ? "text-red-600" : "text-gray-400"}`} />
                      <span className={`font-semibold ${status === "declined" ? "text-red-700" : "text-gray-600"}`}>
                        Decline
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Approved Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blood-500 focus:ring-0 text-lg font-semibold bg-gray-50 focus:bg-white transition-all duration-300"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
                Feedback Message
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                className="block w-full rounded-2xl border-2 border-gray-200 focus:border-blood-500 focus:ring-0 p-4 bg-gray-50 focus:bg-white transition-all duration-300"
                placeholder="Provide detailed feedback for the patient..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-gradient-to-r from-blood-600 to-blood-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                {isPending && <Loader2 className="animate-spin h-5 w-5" />}
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const getStatusProps = (status) => {
  switch (status) {
    case "approved":
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-gradient-to-r from-emerald-50 to-blood-50",
        border: "border-emerald-200",
      }
    case "declined":
      return {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        border: "border-red-200",
      }
    default:
      return {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        border: "border-amber-200",
      }
  }
}

export default function AdminRequests() {
  const [statusFilter, setStatusFilter] = useState("pending")
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const {
    data: response,
    isLoading,
    isError,
  } = useAdminRequests({
    page,
    status: statusFilter === "all" ? "" : statusFilter,
  })

  const { isPending: isUpdatingStatus } = useUpdateRequestStatus()
  const requests = response?.data || []
  const pagination = response?.pagination

  const handleOpenModal = (request) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedRequest(null)
    setIsModalOpen(false)
  }

  const getFileUrl = (filePath) => {
    if (!filePath) return null
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"
    return `${backendUrl}/${filePath.replace(/\\/g, "/")}`
  }

  const filterButtons = [
    { key: "pending", label: "Pending", icon: Clock, color: "from-amber-500 to-orange-500" },
    { key: "approved", label: "Approved", icon: CheckCircle, color: "from-emerald-500 to-blood-500" },
    { key: "declined", label: "Declined", icon: XCircle, color: "from-red-500 to-rose-500" },
    { key: "all", label: "All Requests", icon: GitPullRequest, color: "from-blood-500 to-indigo-500" },
  ]

  if (isLoading && !requests.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blood-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-blood-600" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Requests</h3>
                <p className="text-gray-600">Fetching the latest patient requests...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-red-200 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-800 mb-4">Failed to Load Requests</h3>
          <p className="text-red-600">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blood-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blood-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blood-600 to-blood-700 rounded-3xl flex items-center justify-center shadow-2xl">
                <GitPullRequest className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Request Management
              </h1>
              <p className="text-xl text-gray-600">Review and process patient medical assistance requests</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blood-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "approved").length}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Fast</p>
                  <p className="text-sm text-gray-600">Response Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/20">
            {filterButtons.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    setStatusFilter(filter.key)
                    setPage(1)
                  }}
                  className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    statusFilter === filter.key
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105`
                      : "text-gray-600 hover:bg-white/80 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{filter.label}</span>
                  {statusFilter === filter.key && <div className="absolute inset-0 bg-white/20 rounded-xl"></div>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Request Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {requests.map((request, index) => {
            const statusProps = getStatusProps(request.status)
            const StatusIcon = statusProps.icon
            const userImageUrl = getFileUrl(request.userImage)
            const supportingDocUrl = getFileUrl(request.filePath)
            const citizenshipUrl = getFileUrl(request.citizenshipImage)

            return (
              <div
                key={request._id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      {userImageUrl ? (
                        <div className="relative">
                          <img
                            src={userImageUrl || "/placeholder.svg"}
                            alt={request.uploadedBy?.name}
                            className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blood-500 rounded-full border-2 border-white"></div>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
                          <UserIcon className="h-7 w-7 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-lg text-gray-900">{request.uploadedBy?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-500">{request.uploadedBy?.email}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold ${statusProps.bg} ${statusProps.color} ${statusProps.border} border shadow-sm`}
                    >
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-blood-50 rounded-xl p-3">
                      <DollarSign className="h-5 w-5 text-blood-500" />
                      <div>
                        <p className="text-xs text-blood-600">Amount</p>
                        <p className="text-sm font-bold text-blood-700">
                          ${Number(request.neededAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{request.description}</p>
                  </div>

                  {request.feedback && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blood-50 rounded-2xl p-4 border-l-4 border-indigo-400">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-blood-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-indigo-800 mb-1">Admin Feedback</p>
                          <p className="text-sm text-blood-700 leading-relaxed">{request.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={supportingDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Medical Doc</span>
                      </a>
                      <a
                        href={citizenshipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                      >
                        <FileBadge className="h-4 w-4" />
                        <span className="text-sm">Citizenship</span>
                      </a>
                    </div>

                    {request.status === "pending" && (
                      <button
                        onClick={() => handleOpenModal(request)}
                        className="w-full bg-gradient-to-r from-blood-600 to-blood-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Shield className="h-5 w-5" />
                        <span>Review Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {requests.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <GitPullRequest className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Requests Found</h3>
            <p className="text-lg text-gray-600">There are no requests matching the "{statusFilter}" filter.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between shadow-lg border border-white/20">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="flex items-center space-x-3 bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-700">
                Page {page} of {pagination.totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
              className="flex items-center space-x-3 bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Modal */}
        <UpdateStatusModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          isLoading={isUpdatingStatus}
        />
      </div>
    </div>
  )
}


