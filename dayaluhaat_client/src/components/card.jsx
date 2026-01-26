// src/components/ui/card.jsx
import React from "react"

// Main Card container
export function Card({ children, className, ...props }) {
  return (
    <div className={`border rounded-lg shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Header
export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Title
export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  )
}

// Card Content
export function CardContent({ children, className, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

