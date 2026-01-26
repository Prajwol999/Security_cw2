const Buttons = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"

  const variants = {
    primary: "bg-blood-500 hover:bg-blood-600 text-white",
    secondary: "bg-navy-500 hover:bg-navy-600 text-white",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blood-500",
    ghost: "text-gray-700 hover:text-blood-600 hover:bg-blood-50",
  }

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Buttons


