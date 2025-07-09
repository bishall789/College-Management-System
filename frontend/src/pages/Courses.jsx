"use client"

import { useQuery } from "@tanstack/react-query"
import { studentsAPI } from "../services/api"
import { GraduationCap, Users, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Courses() {
  const navigate = useNavigate()
  const [expandedCourse, setExpandedCourse] = useState(null)

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsAPI.getAll({ limit: 1000 }),
  })

  const students = studentsData?.data?.data || []

  // Group students by course
  const courseData = students.reduce((acc, student) => {
    if (!acc[student.course]) {
      acc[student.course] = []
    }
    acc[student.course].push(student)
    return acc
  }, {})

  // Sort courses by student count
  const sortedCourses = Object.entries(courseData).sort(([, a], [, b]) => b.length - a.length)

  const toggleCourse = (course) => {
    setExpandedCourse(expandedCourse === course ? null : course)
  }

  if (isLoading) return <div className="text-center py-8">Loading courses...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-600">Browse courses and their enrolled students</p>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{sortedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Students/Course</p>
              <p className="text-2xl font-bold text-gray-900">
                {sortedCourses.length > 0 ? Math.round(students.length / sortedCourses.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
          <Link to="/students" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all students
          </Link>
        </div>

        <div className="space-y-4">
          {sortedCourses.length > 0 ? (
            sortedCourses.map(([course, courseStudents]) => (
              <div key={course} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleCourse(course)}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{course}</h3>
                      <p className="text-sm text-gray-600">
                        {courseStudents.length} student{courseStudents.length !== 1 ? "s" : ""} enrolled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600">{courseStudents.length} students</span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedCourse === course ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {expandedCourse === course && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Students in {course}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {courseStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                            <p className="text-xs text-gray-600">{student.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <Link
                        to={`/students?course=${encodeURIComponent(course)}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all {course} students →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No courses found. Add some students to see courses!</p>
              <Link
                to="/students/new"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
              >
                Add your first student
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
