"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  showRequirements = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Password requirements
  const requirements = [
    { text: "One 8 or more characters", regex: /.{8,}/ },
    { text: "One uppercase character", regex: /[A-Z]/ },
    { text: "One lowercase character", regex: /[a-z]/ },
    { text: "One special character", regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/ },
    { text: "One number", regex: /[0-9]/ },
  ]

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 pr-10 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-blood-500 focus:border-blood-500 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showRequirements && (
        <div className="mt-2 space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  value && req.regex.test(value) ? "bg-blood-500" : "bg-gray-300"
                }`}
              ></div>
              <span className="text-gray-600">{req.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PasswordInput


