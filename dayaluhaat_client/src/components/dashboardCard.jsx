import React from 'react';

const DashboardCard = ({ children, className = "", hover = true, padding = "medium", ...props }) => {
  const baseClasses = "bg-white rounded-lg shadow-md border border-gray-100"
  const hoverClasses = hover ? "hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2" : ""

  const paddings = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  }

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default DashboardCard

