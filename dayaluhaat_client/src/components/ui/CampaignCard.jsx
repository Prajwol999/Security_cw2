import { Link } from "lucide-react"
import ProgressBar from "../progress-bar"
import React from "react"


const CampaignCard = ({ id, title, description, image, raised, goal, daysLeft, progress, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=200&width=300"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {daysLeft && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {daysLeft} days left
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <ProgressBar progress={progress} className="mb-3" />

        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-500">
            Raised: <span className="font-medium text-gray-900">{raised}</span>
          </span>
          <span className="text-gray-500">
            Goal: <span className="font-medium text-gray-900">{goal}</span>
          </span>
        </div>

        <Link
          to={`/dashboard/donations/${id}`}
          className="block w-full text-center bg-blood-600 hover:bg-blood-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
        >
          Donate Now
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard


