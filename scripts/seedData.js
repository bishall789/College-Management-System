const mongoose = require("mongoose")
const Student = require("../models/Student")
const logger = require("../config/logger")
require("dotenv").config()

const sampleStudents = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    course: "Computer Science",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    course: "Data Science",
  },
  {
    name: "Carol Davis",
    email: "carol.davis@example.com",
    course: "Software Engineering",
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    course: "Information Technology",
  },
  {
    name: "Eva Brown",
    email: "eva.brown@example.com",
    course: "Cybersecurity",
  },
  {
    name: "Frank Miller",
    email: "frank.miller@example.com",
    course: "Machine Learning",
  },
  {
    name: "Grace Lee",
    email: "grace.lee@example.com",
    course: "Web Development",
  },
  {
    name: "Henry Taylor",
    email: "henry.taylor@example.com",
    course: "Mobile Development",
  },
]

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    logger.info("Connected to MongoDB for seeding")

    // Clear existing data
    await Student.deleteMany({})
    logger.info("Cleared existing student data")

    // Insert sample data
    const createdStudents = await Student.insertMany(sampleStudents)
    logger.info(`Created ${createdStudents.length} sample students`)

    // Display created students
    console.log("\n📚 Sample Students Created:")
    console.log("=".repeat(50))
    createdStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}`)
      console.log(`   Email: ${student.email}`)
      console.log(`   Course: ${student.course}`)
      console.log(`   ID: ${student._id}`)
      console.log("")
    })

    logger.info("Database seeding completed successfully")
    process.exit(0)
  } catch (error) {
    logger.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
