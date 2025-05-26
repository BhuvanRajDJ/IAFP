const router = require("express").Router();
const {
  createAssignment,
  fetchAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  fetchSubmittedAssignment,
  fetchstudentsubmission,
  deleteSubmittedAssignment,
  getStudentevaluations,
  getEvaluationsForTeacher,
  assignmentSubmitionStatus,
  fetchAssignment_Student
} = require("../controllers/assignmentController");
const { authenticationToken } = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/teacher/assignment", authenticationToken, createAssignment);
router.get("/teacher/assignment", authenticationToken, fetchAssignment);
router.put("/teacher/assignment/:id", authenticationToken, updateAssignment);
router.delete("/teacher/assignment/:id", authenticationToken, deleteAssignment);

router.post(
  "/submitAssignment",
  authenticationToken,
  upload.single("file"),
  submitAssignment
);

router.get(
  "/submittedAssignments",
  authenticationToken,
  fetchSubmittedAssignment
);
router.get(
  "/studentSubmittedAssignments",
  authenticationToken,
  fetchstudentsubmission
);

router.delete("/delete-submission/:submissionId/:questionId", authenticationToken, deleteSubmittedAssignment);

router.get("/student-evaluations", authenticationToken,getStudentevaluations);

router.get("/fetchAllstudent-evaluations", authenticationToken,getEvaluationsForTeacher);

router.get("/fetchAssignment_Student", authenticationToken,fetchAssignment_Student);

router.post("/assignmentSubmitionStatus", authenticationToken, assignmentSubmitionStatus);

module.exports = router;
