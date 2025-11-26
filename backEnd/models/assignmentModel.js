const mongoose = require("mongoose");
// const {studentModel} = require("./usersModel")
// const {studentModel} = require("./teacherModel")

// Assignment Creation Schema
const assignmentcreationsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    subject: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    questions: [
      {
        questionText: { type: String, required: true },
        expectedAnswer: { type: String }, // Teacher's expected answer for grading comparison
        marks: { type: Number, required: true },
      },
    ],
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

// Assignment Submission Schema
const assinmentsubmissionsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignmentcreations",
    required: true,
  },
  isCompleted: { type: Boolean, default: false, required: true },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      uploadedFile: { type: String, required: true },
      submissionTimestamp: { type: Date, default: Date.now },
    },
  ],
});

// evaluations Schema
const evaluationsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true
    },
    assignmentSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignmentsubmissions",
      required: true,
    },
    marksPerQuestion: [
      {
        questionId: { type: String, required: true },
        isRelevant: { type: String, required: true },
        marksAwarded: { type: Number, required: true, min: 0 },
        feedback: { type: String, required: true },
        comments: { type: String, default: "" },
      },
    ],
    totalMarks: { type: Number, required: true, min: 0 },
    plagiarismScore: { type: Number, required: true, min: 0, max: 100 },
    isAIGenerated: { type: String },
    aiGeneratedFeedback: { type: String, default: "" },
    isPublished: { type: Boolean, default: false }, // Teacher approval flag
    isManuallyOverridden: { type: Boolean, default: false }, // Tracks if teacher modified AI evaluation
    publishedAt: { type: Date }, // Timestamp when published
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" } // Teacher who published
  },
  { timestamps: true }
);

// Report Card Schema
const reportcardsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  subject: { type: String, required: true },
  assignmentResults: [
    { type: mongoose.Schema.Types.ObjectId, ref: "evaluations" },
  ],
  totalMarks: { type: Number, required: true },
  finalGrade: { type: String, required: true },
  gradeCalculationMethod: { type: String, required: true },
});



const assignmentcreations = mongoose.model(
  "assignmentcreations",
  assignmentcreationsSchema
);

const assignmentsubmissions = mongoose.model(
  "assignmentsubmissions",
  assinmentsubmissionsSchema
);
const evaluations = mongoose.model("evaluations", evaluationsSchema);
const reportcards = mongoose.model("reportcards", reportcardsSchema);

module.exports = {
  assignmentcreations,
  assignmentsubmissions,
  evaluations,
  reportcards,
};
