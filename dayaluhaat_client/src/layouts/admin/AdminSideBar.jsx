import { useNavigate, NavLink } from "react-router-dom"
import { LayoutDashboard, Users, UserPlus, LogOut, GitPullRequest, MessageCircleHeart, DollarSign } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"


export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    navigate("/login")
  }

  const linkClasses =
    "flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blood-50 hover:to-indigo-50 rounded-xl transition-all duration-200 group"

  const activeClasses = "bg-gradient-to-r from-blood-500 to-blood-600 text-white shadow-lg transform scale-[1.02]"

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-xl flex flex-col justify-between">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 mb-12 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl p-3 shadow-lg">
            <span className="text-2xl">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">दयालु हात</h1>
            <p className="text-sm text-gray-500 font-medium">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-[1px] bg-gradient-to-r from-gray-300 to-transparent"></div>
            <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Navigation</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-gray-300 to-transparent"></div>
          </div>

          <nav className="space-y-3">
            <NavLink to="/admin" end className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}>
              <div className="relative">
                <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-blood-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink to="/admin/user" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}>
              <div className="relative">
                <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-blood-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="font-medium">Users</span>
            </NavLink>

            <NavLink
              to="/admin/request"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}
            >
              <div className="relative">
                <GitPullRequest className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="font-medium">Requests</span>
            </NavLink>

            <NavLink
              to="/admin/message"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}
            >
              <div className="relative">
                <MessageCircleHeart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="font-medium">message</span>
            </NavLink>

            <NavLink
              to="/admin/donations"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ""}`}
            >
              <div className="relative">
                <DollarSign className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <span className="font-medium">Donations</span>
            </NavLink>
          </nav>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 p-4 bg-gradient-to-br from-blood-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-blood-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">HC</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Managing care with compassion</p>
          </div>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <button
          onClick={handleLogout}
          className={`${linkClasses} w-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600`}
        >
          <div className="relative">
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
            <div className="absolute -inset-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <span className="font-medium">Sign Out</span>
        </button>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">© 2024 दयालु हात</p>
        </div>
      </div>
    </aside>
  )
}


