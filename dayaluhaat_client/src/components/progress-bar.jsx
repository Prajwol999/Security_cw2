const ProgressBar = ({ progress = 0, className = "", animated = true }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`bg-blood-500 h-2 rounded-full ${animated ? "transition-all duration-1000 ease-out" : ""}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar


