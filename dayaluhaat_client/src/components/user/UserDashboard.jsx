"use client"

import React from 'react';
import { Link } from "react-router-dom"
import { LayoutDashboard, MessageSquare, Bell, Heart, Smile, Settings, Calendar, ArrowRight, Sparkles } from 'lucide-react'

export default function UserDashboard() {
  const quickActions = [
    {
      to: "/user/myrequests",
      icon: MessageSquare,
      title: "My Requests",
      description: "Track your medical assistance requests",
      color: "from-blood-500 to-blood-600",
      hoverColor: "hover:from-blood-600 hover:to-blood-700",
      iconBg: "bg-blood-100",
      iconColor: "text-blood-600"
    },
    {
      to: "/user/notifications",
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with important alerts",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      to: "/user/message",
      icon: Heart,
      title: "Message",
      description: "View available funding options",
      color: "from-pink-500 to-rose-500",
      hoverColor: "hover:from-pink-600 hover:to-rose-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      to: "/user/mental-health",
      icon: Smile,
      title: "Mental Health Corner",
      description: "Access wellness resources",
      color: "from-blood-500 to-blood-1000",
      hoverColor: "hover:from-blood-600 hover:to-emerald-600",
      iconBg: "bg-blood-100",
      iconColor: "text-blood-600"
    },
    {
      to: "/user/settings",
      icon: Settings,
      title: "Settings",
      description: "Manage your account preferences",
      color: "from-gray-500 to-gray-600",
      hoverColor: "hover:from-gray-600 hover:to-gray-700",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blood-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blood-500 to-blood-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <LayoutDashboard className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">Your health journey continues here</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Today</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500 hover:bg-white/90">
                  {/* Icon Container */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 ${action.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${action.iconColor}`} />
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom Stats/Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Fast</p>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Secure</p>
                <p className="text-sm text-gray-600">Data Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


