import { useQuery } from "@tanstack/react-query"
import { BookOpen, Home, UserPlus, Users } from "lucide-react"
import { NavLink } from "react-router-dom"
import { studentsAPI } from "../services/api"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Add Student", href: "/students/new", icon: UserPlus },
]

export default function Sidebar() {
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsAPI.getAll({ limit: 1000 }),
  })

  const students = studentsData?.data?.data || []
  const courseCount = new Set(students.map((s) => s.course)).size

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700 font-medium">Students</span>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200">
                {students.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700 font-medium">Courses</span>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200">
                {courseCount}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
