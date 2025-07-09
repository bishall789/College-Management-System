const { body, param, query, validationResult } = require("express-validator")

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation error",
      message: "Invalid input data",
      details: errors.array(),
    })
  }
  next()
}

// Student validation rules
const validateStudent = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("course").trim().isLength({ min: 2, max: 100 }).withMessage("Course must be between 2 and 100 characters"),

  handleValidationErrors,
]

// Student update validation (fields are optional)
const validateStudentUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("course")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Course must be between 2 and 100 characters"),

  handleValidationErrors,
]

// Login validation
const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
]

// ID parameter validation
const validateId = [
  param("id").isMongoId().withMessage("Invalid student ID format"),

  handleValidationErrors,
]

// Query parameter validation
const validateQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("course")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Course filter must be between 1 and 100 characters"),

  handleValidationErrors,
]

module.exports = {
  validateStudent,
  validateStudentUpdate,
  validateLogin,
  validateId,
  validateQuery,
}
