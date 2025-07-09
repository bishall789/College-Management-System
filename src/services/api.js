import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
}

export const studentsAPI = {
  getAll: (params) => api.get("/api/students", { params }),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (data) => api.post("/api/students", data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`),
}

export const healthAPI = {
  check: () => api.get("/health"),
}

export default api
