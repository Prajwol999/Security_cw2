import { useState } from "react"
import { X } from "lucide-react"

const Banner = ({ title, description, type = "info", onClose, className = "" }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  const types = {
    info: "bg-blood-50 border-blue-200 text-blood-800",
    success: "bg-blood-50 border-green-200 text-blood-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  }

  return (
    <div className={`rounded-lg border p-4 ${types[type]} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
        </div>
        <button onClick={handleClose} className="ml-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default Banner


