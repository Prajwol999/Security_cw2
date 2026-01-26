const DiseaseCard = ({ title, count, color = "bg-blood-500", image, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-sm ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60 z-10"></div>
      <img
        src={image || "/placeholder.svg?height=200&width=300"}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 p-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div
          className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} bg-opacity-90 text-white`}
        >
          {count} patients
        </div>
      </div>
    </div>
  )
}

export default DiseaseCard


