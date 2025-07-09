const mongoose = require("mongoose")
const logger = require("./logger")

const connectDB = async () => {
  try {
    // Don't connect if already connected (for tests)
    if (mongoose.connection.readyState === 1) {
      logger.info("MongoDB already connected")
      return
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI)

    logger.info(`MongoDB Connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected")
    })

    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      logger.info("MongoDB connection closed through app termination")
      process.exit(0)
    })
  } catch (error) {
    logger.error("Database connection failed:", error)
    process.exit(1)
  }
}

module.exports = connectDB
