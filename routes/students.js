const express = require("express")
const Student = require("../models/Student")
const authenticateToken = require("../middleware/auth")
const { validateStudent, validateStudentUpdate, validateId, validateQuery } = require("../middleware/validation")
const logger = require("../config/logger")
const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students with pagination and filtering
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of students per page
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course name
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalStudents:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", validateQuery, async (req, res) => {
  try {
    const { page = 1, limit = 10, course } = req.query

    // Build filter
    const filter = {}
    if (course) {
      filter.course = new RegExp(course, "i")
    }

    const students = await Student.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Student.countDocuments(filter)

    logger.info(`Retrieved ${students.length} students (page ${page})`)

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    logger.error("Error fetching students:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch students",
    })
  }
})

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               course:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Computer Science
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error or duplicate email
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", validateStudent, async (req, res) => {
  try {
    const { name, email, course } = req.body

    const student = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
    })

    const savedStudent = await student.save()
    logger.info(`Student created: ${savedStudent.name} (${savedStudent.email})`)

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: savedStudent,
    })
  } catch (error) {
    logger.error("Error creating student:", error)

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate email",
        message: "A student with this email already exists",
      })
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        error: "Validation error",
        message: messages.join(", "),
      })
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create student",
    })
  }
})

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params

    const student = await Student.findById(id)

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
        message: `No student found with ID: ${id}`,
      })
    }

    logger.info(`Student retrieved: ${student.name} (${id})`)

    res.status(200).json({
      success: true,
      data: student,
    })
  } catch (error) {
    logger.error("Error fetching student:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch student",
    })
  }
})

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               course:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error or duplicate email
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", validateId, validateStudentUpdate, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, course } = req.body

    // Build update object
    const updateData = {}
    if (name) updateData.name = name.trim()
    if (email) updateData.email = email.trim().toLowerCase()
    if (course) updateData.course = course.trim()

    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
        message: `No student found with ID: ${id}`,
      })
    }

    logger.info(`Student updated: ${student.name} (${id})`)

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    })
  } catch (error) {
    logger.error("Error updating student:", error)

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate email",
        message: "A student with this email already exists",
      })
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        error: "Validation error",
        message: messages.join(", "),
      })
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update student",
    })
  }
})

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", validateId, async (req, res) => {
  try {
    const { id } = req.params

    const student = await Student.findByIdAndDelete(id)

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
        message: `No student found with ID: ${id}`,
      })
    }

    logger.info(`Student deleted: ${student.name} (${id})`)

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    })
  } catch (error) {
    logger.error("Error deleting student:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete student",
    })
  }
})

module.exports = router
