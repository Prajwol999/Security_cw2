"use client"

const PaymentMethodCard = ({ method, icon: Icon, selected = false, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 border rounded-lg cursor-pointer transition-all duration-200
        ${selected ? "border-blood-500 bg-blood-50" : "border-gray-200 hover:border-gray-300 bg-white"}
        ${className}
      `}
    >
      <div className="flex items-center">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${selected ? "bg-blood-100" : "bg-gray-100"}`}
        >
          <Icon className={`h-5 w-5 ${selected ? "text-blood-600" : "text-gray-500"}`} />
        </div>
        <div className="ml-3">
          <p className={`font-medium ${selected ? "text-blood-600" : "text-gray-700"}`}>{method}</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodCard


