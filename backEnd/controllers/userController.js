const { studentModel, teacherModel } = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { response } = require("express");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_NUMBER = process.env.SECRET_NUMBER;

// STUDENT

// create student
const createStudent = async (req, res) => {
  const {
    name,
    email,
    age,
    dateOfBirth,
    password,
    confirmpassword,
    department,
    USN,
    year,
    role,
  } = req.body;
  try {
    const existinguser = await studentModel.findOne({ email });
    // console.log(req.body);
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "Email is already registered", success: false });
    }

    const existingUsn = await studentModel.findOne({USN});
    if(existingUsn){
      return res.status(400).json({
        message:"USN already registerd",
        success:false
      })
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Password and confirm password mismatch",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new studentModel({
      name,
      email,
      age,
      dateOfBirth,
      password: hashedpassword,
      department,
      USN,
      year,
      role,
    });
    await user.save();
    res.status(201).json({
      message: "user created",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create a user",
      success: false,
      error: `${error}`,
    });
  }
};

const signinStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await studentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Student does not exists",
        success: false,
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "password does not match",
        success: false,
      });
    }
    const token = jwt.sign(
      {
        email: email,
        id: user._id,
        userName: user.name,
      },
      SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token: `${token}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login",
      success: false,
      error: `${error}`,
    });
  }
};

//TEACHER
// Fetch students
const getstudentsByDepartment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found", success: false });
    }

    const students = await studentModel.find({
      department: teacher.department,
    });

    res.status(200).json({
      message: "students fetched successfully",
      success: true,
      students: `${students}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch the students",
      success: false,
      error: `${error}`,
    });
  }
};

// create Teacher
const createTeacher = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmpassword,
    department,
    secretNumber,
    role,
  } = req.body;
  try {
    const existinguser = await teacherModel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "Email is already registered", success: false });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Password and confirm password mismatch",
        success: false,
      });
    }

    if (secretNumber != SECRET_NUMBER) {
      return res.status(400).json({
        message: "Secret Number does not match",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new teacherModel({
      name,
      email,
      password: hashedpassword,
      department,
      role,
    });
    await user.save();
    res.status(201).json({
      message: "user created",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create a user",
      success: false,
      error: `${error}`,
    });
  }
};

const signinTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await teacherModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user does not exists", success: false });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "password does not match", success: false });
    }
    const token = jwt.sign(
      {
        email: email,
        id: user._id,
        name: user.name,
      },
      SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );
    res.status(200).json({
      message: "user logged in successfully",
      success: true,
      token: `${token}`,
    });
  } catch {
    res.status(500).json({
      message: "Failed to login",
      success: false,
      error: `${error}`,
    });
  }
};

function authenticationToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      message: "Access denied, no token provided",
      success: false,
    });
  }
  const token1 = token.split("Bearer ")[1];
  jwt.verify(token1, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.user = user;
    next();
  });
}

// const teacherAuthenticationToken = async () => {
// try{
//   const token = req.headers["authorization"];
//   if(!token){
//     return res.status(401).json({
//       message:"Access denied, no token provided",
//       success:false
//     });
//   }
//   const token1 = 

// }catch(error){
//   res.status(500).json({
//     message:"Internal Server Error",
//     success:false,
//     error:error.message
//   })
// }
// }



module.exports = {
  createStudent,
  createTeacher,
  signinStudent,
  signinTeacher,
  authenticationToken,
  getstudentsByDepartment,
};
