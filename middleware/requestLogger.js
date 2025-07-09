const logger = require("../config/logger")

const requestLogger = (req, res, next) => {
  const start = Date.now()

  // Log request
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  // Override res.end to log response
  const originalEnd = res.end
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start

    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    })

    originalEnd.call(this, chunk, encoding)
  }

  next()
}

module.exports = requestLogger
