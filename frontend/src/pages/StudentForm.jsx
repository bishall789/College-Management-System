"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, BookOpen, ChevronDown, Mail, Plus, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { studentsAPI } from "../services/api"

export default function StudentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const queryClient = useQueryClient()
  const [showCustomCourse, setShowCustomCourse] = useState(false)
  const [customCourse, setCustomCourse] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm()

  const selectedCourse = watch("course")

  // Get all students to extract existing courses
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsAPI.getAll({ limit: 1000 }),
  })

  const { data: student } = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentsAPI.getById(id),
    enabled: isEditing,
  })

  // Extract unique courses from existing students
  const students = studentsData?.data?.data || []
  const existingCourses = [...new Set(students.map((s) => s.course))].sort()

  // Popular courses to suggest
  const suggestedCourses = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Cybersecurity",
    "Web Development",
    "Mobile Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Business Administration",
    "Marketing",
    "Finance",
    "Accounting",
    "Psychology",
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "English Literature",
    "History",
  ]

  // Combine existing and suggested courses, remove duplicates
  const allCourses = [...new Set([...existingCourses, ...suggestedCourses])].sort()

  const createMutation = useMutation({
    mutationFn: studentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student created successfully!")
      navigate("/students")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create student")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => studentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student updated successfully!")
      navigate("/students")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update student")
    },
  })

  useEffect(() => {
    if (student?.data?.data) {
      const studentData = student.data.data
      reset(studentData)

      // Check if the student's course is in our predefined list
      if (!allCourses.includes(studentData.course)) {
        setShowCustomCourse(true)
        setCustomCourse(studentData.course)
        setValue("course", "custom")
      }
    }
  }, [student, reset, allCourses, setValue])

  const onSubmit = (data) => {
    // Use custom course if "custom" is selected
    const finalData = {
      ...data,
      course: data.course === "custom" ? customCourse : data.course,
    }

    if (isEditing) {
      updateMutation.mutate(finalData)
    } else {
      createMutation.mutate(finalData)
    }
  }

  const handleCourseChange = (e) => {
    const value = e.target.value
    setValue("course", value)

    if (value === "custom") {
      setShowCustomCourse(true)
    } else {
      setShowCustomCourse(false)
      setCustomCourse("")
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/students")}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 border border-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Student" : "Add New Student"}</h1>
          <p className="text-gray-600">
            {isEditing ? "Update student information" : "Register a new student to the system"}
          </p>
        </div>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
          <p className="text-gray-600">Fill in the details below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Full Name
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              type="text"
              className="input"
              placeholder="Enter student's full name"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              className="input"
              placeholder="Enter student's email"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <BookOpen className="inline h-4 w-4 mr-2" />
              Course
            </label>

            <div className="relative">
              <select
                {...register("course", { required: "Course is required" })}
                onChange={handleCourseChange}
                className="input appearance-none pr-10"
              >
                <option value="">Select a course</option>

                {/* Existing courses from database */}
                {existingCourses.length > 0 && (
                  <>
                    <optgroup label="📚 Current Courses">
                      {existingCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </optgroup>
                  </>
                )}

                {/* Suggested courses */}
                <optgroup label="💡 Suggested Courses">
                  {suggestedCourses
                    .filter((course) => !existingCourses.includes(course))
                    .map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                </optgroup>

                <option value="custom">➕ Add New Course</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {errors.course && <p className="mt-2 text-sm text-red-600">{errors.course.message}</p>}

            {/* Custom course input */}
            {showCustomCourse && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Plus className="h-4 w-4 text-blue-600" />
                  <label className="text-sm font-medium text-blue-700">New Course Name</label>
                </div>
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="input border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
                  placeholder="Enter new course name"
                  required={selectedCourse === "custom"}
                />
                <p className="mt-1 text-xs text-blue-600">This will create a new course option for future students</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => navigate("/students")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary disabled:opacity-50">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : isEditing ? (
                "Update Student"
              ) : (
                "Create Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
