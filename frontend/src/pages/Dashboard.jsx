"use client"

import { useQuery } from "@tanstack/react-query"
import { studentsAPI } from "../services/api"
import { Users, BookOpen, GraduationCap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsAPI.getAll({ limit: 1000 }),
  })

  const students = studentsData?.data?.data || []

  // Calculate course statistics
  const courseStats = students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1
    return acc
  }, {})

  const topCourses = Object.entries(courseStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const stats = [
    {
      name: "Total Students",
      value: students.length,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      description: "Active students",
      onClick: () => navigate("/students"),
    },
    {
      name: "Total Courses",
      value: Object.keys(courseStats).length,
      icon: BookOpen,
      gradient: "from-indigo-500 to-indigo-600",
      description: "Available courses",
      onClick: () => navigate("/courses"),
    },
  ]

  const recentStudents = students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const handleCourseClick = (course) => {
    navigate(`/students?course=${encodeURIComponent(course)}`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Dashboard</h1>
        <p className="text-gray-600">Welcome to your College Management Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="card hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            onClick={stat.onClick}
          >
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6 flex-1">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Click to view</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="h-6 w-6 mr-3 text-blue-600" />
              Popular Courses
            </h2>
            <button
              onClick={() => navigate("/courses")}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {topCourses.length > 0 ? (
              topCourses.map(([course, count], index) => (
                <div
                  key={course}
                  onClick={() => handleCourseClick(course)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all cursor-pointer group border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-900">{course}</p>
                      <p className="text-sm text-gray-600">
                        {count} student{count !== 1 ? "s" : ""} enrolled
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded-full border border-gray-200">
                    {count} students
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Students */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-3 text-blue-600" />
              Recent Students
            </h2>
            <Link
              to="/students"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleCourseClick(student.course)}
                      className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                    >
                      {student.course}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">{new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/students/new"
            className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all group border border-blue-200"
          >
            <Users className="h-10 w-10 text-blue-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-blue-900">Add New Student</p>
              <p className="text-sm text-blue-700">Register a new student</p>
            </div>
          </Link>

          <Link
            to="/students"
            className="flex items-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all group border border-green-200"
          >
            <BookOpen className="h-10 w-10 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-green-900">Manage Students</p>
              <p className="text-sm text-green-700">View and edit students</p>
            </div>
          </Link>

          <Link
            to="/courses"
            className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all group border border-purple-200"
          >
            <GraduationCap className="h-10 w-10 text-purple-600 mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-purple-900">View Courses</p>
              <p className="text-sm text-purple-700">Browse all courses</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
