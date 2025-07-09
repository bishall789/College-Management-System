const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      minlength: [2, "Course must be at least 2 characters long"],
      maxlength: [100, "Course cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
studentSchema.index({ course: 1 })

// Transform output
studentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model("Student", studentSchema)
