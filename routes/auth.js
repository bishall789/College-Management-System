const express = require("express")
const jwt = require("jsonwebtoken")
const { authLimiter } = require("../middleware/rateLimiter")
const { validateLogin } = require("../middleware/validation")
const logger = require("../config/logger")
const router = express.Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                 expiresIn:
 *                   type: string
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body

    // Check hardcoded credentials
    const validUsername = process.env.ADMIN_USERNAME || "admin"
    const validPassword = process.env.ADMIN_PASSWORD || "admin123"

    if (username !== validUsername || password !== validPassword) {
      logger.warn(`Failed login attempt for username: ${username} from IP: ${req.ip}`)
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      })
    }

    // Generate JWT token
    const payload = {
      username: username,
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    })

    logger.info(`Successful login for username: ${username} from IP: ${req.ip}`)

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        username: username,
        role: "admin",
      },
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    })
  } catch (error) {
    logger.error("Login error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "An error occurred during login",
    })
  }
})

module.exports = router
