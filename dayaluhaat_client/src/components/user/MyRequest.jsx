"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Plus, FileText, Calendar, DollarSign, Clock, CheckCircle, XCircle, Trash2, AlertTriangle, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { useMyRequests, useDeleteRequest } from "../../hooks/useRequest"
import AddRequestModal from "./modal/AddRequest"

export default function MyRequests() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { myRequests, isLoading, error } = useMyRequests()
  const deleteRequestMutation = useDeleteRequest()

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteRequestMutation.mutateAsync(requestId)
      } catch (error) {
        console.error("Error deleting request:", error)
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />
      case "approved":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "declined":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200 shadow-amber-100"
      case "approved":
        return "bg-gradient-to-r from-emerald-50 to-blood-50 text-emerald-800 border-emerald-200 shadow-emerald-100"
      case "declined":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100"
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200 shadow-gray-100"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blood-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-center min-h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse delay-150"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Requests</h3>
                <p className="text-gray-600">Please wait while we fetch your data...</p>
              </div>
            </div>
          </div>
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <Link 
                to="/user/dashboard" 
                className="group flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800 group-hover:-translate-x-1 transition-all duration-300" />
              </Link>
              
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-blood-500 to-blood-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    My Requests
                  </h1>
                </div>
                <p className="text-lg text-gray-600 ml-18">Track and manage your medical assistance requests</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="group relative bg-gradient-to-r from-blood-600 to-blood-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blood-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10 font-semibold">New Request</span>
              <Sparkles className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Requests</h3>
            <p className="text-red-600">{error.message}</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blood-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto">
                <FileText className="w-12 h-12 text-blood-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Requests Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start your journey by submitting your first medical assistance request.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blood-600 to-blood-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {myRequests.map((request, index) => {
              const isAmountModified =
                request.status === "approved" &&
                request.originalAmount != null &&
                request.originalAmount !== request.neededAmount

              return (
                <div
                  key={request._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {getStatusIcon(request.status)}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blood-600 to-purple-600 rounded-full opacity-20 blur-sm"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                          {request.description}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {isAmountModified ? (
                            <div className="flex items-center space-x-3 bg-gradient-to-r from-blood-50 to-blood-100 rounded-full px-3 py-1">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-red-500 line-through text-sm">
                                ${Number.parseFloat(request.originalAmount).toLocaleString()}
                              </span>
                              <TrendingUp className="w-3 h-3 text-blood-600" />
                              <span className="font-bold text-blood-600">
                                ${Number.parseFloat(request.neededAmount).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 bg-blood-50 rounded-full px-3 py-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">
                                ${Number.parseFloat(request.neededAmount).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleDelete(request._id)}
                          disabled={deleteRequestMutation.isPending}
                          className="group/delete p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-300" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Amount Modified Alert */}
                  {isAmountModified && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-r-2xl mb-6 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 mb-1">Amount Adjusted</p>
                          <p className="text-sm text-amber-700">
                            An admin has modified your approved amount from{" "}
                            <span className="font-semibold">
                              ${Number.parseFloat(request.originalAmount).toLocaleString()}
                            </span>{" "}
                            to the new approved amount.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Request Details */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Medical Condition</p>
                        <p className="text-sm text-gray-600">{request.condition}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Citizenship Status</p>
                        <p className="text-sm text-gray-600 capitalize">{request.citizen.replace("_", " ")}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Your Story</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{request.inDepthStory}</p>
                    </div>
                  </div>

                  {/* File Info */}
                  {request.filename && (
                    <div className="flex items-center space-x-3 bg-blood-50 rounded-2xl p-4 mb-6">
                      <div className="w-10 h-10 bg-blood-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blood-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blood-800">Attached Document</p>
                        <p className="text-sm text-blood-600">{request.filename}</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Feedback */}
                  {request.feedback && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blood-50 rounded-2xl p-6 border-l-4 border-indigo-400 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blood-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-blood-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-indigo-800 mb-2">Admin Feedback</p>
                          <p className="text-sm text-blood-700 leading-relaxed">{request.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add Request Modal */}
        {showAddModal && <AddRequestModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  )
}


