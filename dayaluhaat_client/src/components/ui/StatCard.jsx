const StatCard = ({ title, value, icon: Icon, change, changeType = "increase", className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blood-100 text-blood-600">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${changeType === "increase" ? "text-blood-600" : "text-red-600"}`}>
            <span>{change}</span>
            <span className="ml-1">{changeType === "increase" ? "increase" : "decrease"}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatCard


