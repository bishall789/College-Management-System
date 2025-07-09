"use client"

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { studentsAPI } from "../services/api"
import { toast } from "react-hot-toast"
import { ArrowLeft } from "lucide-react"

export default function StudentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const { data: student } = useQuery(["student", id], () => studentsAPI.getById(id), { enabled: isEditing })

  const createMutation = useMutation(studentsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("students")
      toast.success("Student created successfully!")
      navigate("/students")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create student")
    },
  })

  const updateMutation = useMutation((data) => studentsAPI.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("students")
      toast.success("Student updated successfully!")
      navigate("/students")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update student")
    },
  })

  useEffect(() => {
    if (student?.data?.data) {
      reset(student.data.data)
    }
  }, [student, reset])

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate("/students")} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Student" : "Add New Student"}</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              type="text"
              className="input"
              placeholder="Enter student's full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <input
              {...register("course", {
                required: "Course is required",
                minLength: { value: 2, message: "Course must be at least 2 characters" },
              })}
              type="text"
              className="input"
              placeholder="Enter course name"
            />
            {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate("/students")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary disabled:opacity-50">
              {isLoading ? "Saving..." : isEditing ? "Update Student" : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
