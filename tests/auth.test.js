const request = require("supertest")
const mongoose = require("mongoose")

// Create app instance for testing (without starting server)
const express = require("express")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const cors = require("cors")

// Import middleware
const { generalLimiter } = require("../middleware/rateLimiter")

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

  // Routes (without rate limiting for tests)
  app.use("/api/auth", authRoutes)
  app.use("/api/students", studentRoutes)

  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Test API is running",
    })
  })

  return app
}

describe("Authentication Endpoints", () => {
  let app

  beforeAll(() => {
    app = createTestApp()
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "admin",
          password: "admin123",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.username).toBe("admin")
    }, 10000)

    it("should reject invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "admin",
          password: "wrongpassword",
        })
        .expect(401)

      expect(response.body.error).toBe("Invalid credentials")
    }, 10000)

    it("should reject missing credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({}).expect(400)

      expect(response.body.error).toBe("Validation error")
    }, 10000)
  })
})
