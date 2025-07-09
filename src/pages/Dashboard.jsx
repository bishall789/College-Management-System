import { useQuery } from "react-query"
import { studentsAPI, healthAPI } from "../services/api"
import { Users, BookOpen, Activity, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const { data: studentsData } = useQuery("students", () => studentsAPI.getAll({ limit: 100 }))
  const { data: healthData } = useQuery("health", healthAPI.check)

  const students = studentsData?.data?.data || []
  const health = healthData?.data

  const stats = [
    {
      name: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      name: "Courses",
      value: new Set(students.map((s) => s.course)).size,
      icon: BookOpen,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      name: "System Status",
      value: health?.status || "Unknown",
      icon: Activity,
      color: "bg-yellow-500",
      change: "Online",
    },
    {
      name: "Uptime",
      value: health?.uptime ? `${Math.floor(health.uptime / 60)}m` : "N/A",
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "Running",
    },
  ]

  const recentStudents = students.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the College Management System</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
          <a href="/students" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all
          </a>
        </div>

        <div className="space-y-3">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{student.course}</p>
                <p className="text-xs text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
