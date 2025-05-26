const mongoose = require("mongoose");

// Teacher Schema
const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    enum: ["CSE", "ISE", "ECE", "EEE", "CIVIL", "MECH", "AIML"],
    required: true,
  },
  secretNumber: { type: Number },
  role: { type: String, default: "teacher" },
});

// Student Schema
const studentschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: { type: String, required: true },
  department: {
    type: String,
    enum: ["CSE", "ISE", "ECE", "EEE", "CIVIL", "MECH", "AIML"],
    required: true,
  },
  USN: { type: String, required: true, unique: true },
  year: {
    type: String,
    // enum: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    required: true,
  },
  role: { type: String, default: "student" },
});

const studentModel = mongoose.model("student", studentschema);
const teacherModel = mongoose.model("teacher", TeacherSchema);

module.exports = {
  studentModel,
  teacherModel,
};
