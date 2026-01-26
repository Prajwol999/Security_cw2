"use client"

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blood-500 focus:border-blood-500 ${className}`}
      {...props}
    />
  )
}

export default Textarea;


