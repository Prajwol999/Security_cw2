import { Link } from "react-router-dom"
import ProgressBar from "../progress-bar"
import Badge from "../badge"

const DonationCard = ({
  id,
  name,
  age,
  location,
  disease,
  image,
  description,
  raised,
  goal,
  progress,
  urgency = "medium",
  className = "",
}) => {
  const urgencyColors = {
    low: "bg-blood-100 text-blood-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-600 text-white",
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <img
            src={image || "/placeholder.svg?height=200&width=300"}
            alt={name}
            className="w-full h-full object-cover md:h-full max-h-48 md:max-h-full"
          />
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${urgencyColors[urgency]}`}>
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)} urgency
          </div>
        </div>
        <div className="p-5 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {name}, {age}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{location}</span>
                <span className="mx-2">•</span>
                <Badge variant={disease === "Cancer" ? "error" : "warning"}>{disease}</Badge>
              </div>
            </div>
          </div>

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

          <div className="flex space-x-3">
            <Link
              to={`/dashboard/donations/${id}`}
              className="flex-1 text-center bg-blood-600 hover:bg-blood-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
            >
              Donate Now
            </Link>
            <Link
              to={`/dashboard/donations/${id}/details`}
              className="flex-1 text-center border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationCard


