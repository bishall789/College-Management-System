import { NavLink } from "react-router-dom"
import { Home, Users, UserPlus } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Add Student", href: "/students/new", icon: UserPlus },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
