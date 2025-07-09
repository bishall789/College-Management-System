const express = require("express")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const swaggerUi = require("swagger-ui-express")
const cors = require("cors")
require("dotenv").config()

// Import configurations
const connectDB = require("./config/database")
const logger = require("./config/logger")
const swaggerSpecs = require("./config/swagger")

// Import middleware
const { generalLimiter } = require("./middleware/rateLimiter")
const requestLogger = require("./middleware/requestLogger")

// Import routes
const authRoutes = require("./routes/auth")
const studentRoutes = require("./routes/students")

const app = express()
const PORT = process.env.PORT || 3000

// Connect to database
connectDB()

// Security middleware
app.use(helmet())
app.use(compression())
app.use(mongoSanitize())

// Rate limiting
app.use(generalLimiter)

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging
app.use(requestLogger)

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "College Management API Documentation",
  }),
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information and available endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 documentation:
 *                   type: string
 *                 endpoints:
 *                   type: object
 */
app.get("/", (req, res) => {
  res.json({
    message: "🎓 Welcome to College Management System API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      health: "/health",
      login: "POST /api/auth/login",
      students: {
        list: "GET /api/students",
        create: "POST /api/students",
        get: "GET /api/students/:id",
        update: "PUT /api/students/:id",
        delete: "DELETE /api/students/:id",
      },
    },
  })
})

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 environment:
 *                   type: string
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "College Management System API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: "Check the API documentation at /api-docs",
  })
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 Server is running on port ${PORT}`)
  logger.info(`📍 Health check: http://localhost:${PORT}/health`)
  logger.info(`📖 API docs: http://localhost:${PORT}/api-docs`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
