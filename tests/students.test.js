const request = require("supertest")
const mongoose = require("mongoose")

// Create test app (same as auth.test.js)
const express = require("express")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const cors = require("cors")

// Import routes
const authRoutes = require("../routes/auth")
const studentRoutes = require("../routes/students")

// Create test app
const createTestApp = () => {
  const app = express()

  // Security middleware
  app.use(helmet())
  app.use(compression())
  app.use(mongoSanitize())

  // CORS
  app.use(cors())

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true, limit: "10mb" }))

  // Routes
  app.use("/api/auth", authRoutes)
  app.use("/api/students", studentRoutes)

  return app
}

describe("Student Endpoints", () => {
  let app
  let authToken
  let studentId

  beforeAll(async () => {
    app = createTestApp()

    // Get auth token
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "admin123",
    })

    authToken = loginResponse.body.token
  }, 15000)

  describe("POST /api/students", () => {
    it("should create a new student", async () => {
      const studentData = {
        name: "Test Student",
        email: "test@example.com",
        course: "Computer Science",
      }

      const response = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${authToken}`)
        .send(studentData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(studentData.name)
      expect(response.body.data.email).toBe(studentData.email)
      expect(response.body.data.course).toBe(studentData.course)

      studentId = response.body.data.id
    }, 10000)

    it("should reject invalid student data", async () => {
      const response = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "A", // Too short
          email: "invalid-email",
          course: "",
        })
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    }, 10000)
  })

  describe("GET /api/students", () => {
    it("should get all students", async () => {
      const response = await request(app).get("/api/students").set("Authorization", `Bearer ${authToken}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.pagination).toBeDefined()
    }, 10000)
  })

  describe("GET /api/students/:id", () => {
    it("should get a student by ID", async () => {
      if (!studentId) {
        // Create a student first if none exists
        const createResponse = await request(app)
          .post("/api/students")
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            name: "Test Student 2",
            email: "test2@example.com",
            course: "Data Science",
          })

        studentId = createResponse.body.data.id
      }

      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(studentId)
    }, 10000)
  })

  describe("PUT /api/students/:id", () => {
    it("should update a student", async () => {
      if (!studentId) {
        // Create a student first if none exists
        const createResponse = await request(app)
          .post("/api/students")
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            name: "Test Student 3",
            email: "test3@example.com",
            course: "Software Engineering",
          })

        studentId = createResponse.body.data.id
      }

      const updateData = {
        name: "Updated Student",
        course: "Data Science",
      }

      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(updateData.name)
      expect(response.body.data.course).toBe(updateData.course)
    }, 10000)
  })

  describe("DELETE /api/students/:id", () => {
    it("should delete a student", async () => {
      if (!studentId) {
        // Create a student first if none exists
        const createResponse = await request(app)
          .post("/api/students")
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            name: "Test Student 4",
            email: "test4@example.com",
            course: "Cybersecurity",
          })

        studentId = createResponse.body.data.id
      }

      const response = await request(app)
        .delete(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe("Student deleted successfully")
    }, 10000)
  })

  describe("Authentication", () => {
    it("should reject requests without token", async () => {
      const response = await request(app).get("/api/students").expect(401)

      expect(response.body.error).toBe("Access denied")
    }, 10000)
  })
})
