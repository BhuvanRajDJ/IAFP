const router = require("express").Router();

const {
  createStudent,
  createTeacher,
  signinStudent,
  signinTeacher,
  authenticationToken,
  getstudentsByDepartment,
} = require("../controllers/userController");

router.post("/signup", createStudent);
router.post("/teachersignup", createTeacher);
router.post("/student_login", signinStudent);
router.post("/teacher_login", signinTeacher);
router.get(
  "/students-by-department",
  authenticationToken,
  getstudentsByDepartment
);

module.exports = router;
