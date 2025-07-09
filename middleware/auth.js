const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access denied",
      message: "No token provided. Please include Bearer token in Authorization header.",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please login again.",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Invalid token",
        message: "The provided token is invalid.",
      })
    }

    return res.status(403).json({
      error: "Token verification failed",
      message: "Unable to verify token.",
    })
  }
}

module.exports = authenticateToken
