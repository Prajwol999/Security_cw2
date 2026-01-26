"use client"

const Checkbox = ({ id, label, checked, onChange, className = "", ...props }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blood-600 border-gray-300 rounded focus:ring-blood-500"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="text-gray-700">
          {label}
        </label>
      </div>
    </div>
  )
}

export default Checkbox


