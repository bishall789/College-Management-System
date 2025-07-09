const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "College Management System API",
      version: "1.0.0",
      description: "A comprehensive REST API for managing college students with JWT authentication",
      contact: {
        name: "API Support",
        email: "support@college-api.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Student: {
          type: "object",
          required: ["name", "email", "course"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the student",
            },
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Full name of the student",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the student",
            },
            course: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Course the student is enrolled in",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the student was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the student was last updated",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error type",
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./server.js"],
}

const specs = swaggerJsdoc(options)
module.exports = specs
