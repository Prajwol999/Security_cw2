import React from 'react';

const Badge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-blood-100 text-blood-600",
    secondary: "bg-gray-100 text-gray-600",
    success: "bg-blood-100 text-blood-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  }

  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge


