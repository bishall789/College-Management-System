const mongoose = require("mongoose")
const { beforeAll, afterAll, afterEach, jest } = require("@jest/globals")

// Increase timeout for database operations
jest.setTimeout(30000)

// Setup test database
beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }

  const MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/college_management_test"

  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to test database")
  } catch (error) {
    console.error("❌ Test database connection failed:", error)
    throw error
  }
})

// Clean up after tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      console.log("✅ Test database cleaned up")
    }
  } catch (error) {
    console.error("❌ Test cleanup failed:", error)
  }
}, 30000)

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }
}, 10000)
