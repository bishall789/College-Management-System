import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import Courses from "./pages/Courses"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import StudentForm from "./pages/StudentForm"
import Students from "./pages/Students"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id/edit" element={<StudentForm />} />
          <Route path="courses" element={<Courses />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
