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
    // Validate required fields
    if (!name || !email || !password || !confirmpassword || !department || !USN || !year) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    // Check if user already exists
    const existinguser = await studentModel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "Email is already registered", success: false });
    }

    // Check if USN already exists
    const existingUsn = await studentModel.findOne({ USN });
    if (existingUsn) {
      return res.status(400).json({
        message: "USN already registered",
        success: false
      });
    }

    // Validate password match
    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Password and confirm password mismatch",
        success: false,
      });
    }

    // Validate password strength (optional but recommended)
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Hash password
    const hashedpassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    
    // Create new student
    const user = new studentModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: parseInt(age),
      dateOfBirth,
      password: hashedpassword,
      department,
      USN: USN.toUpperCase().trim(),
      year,
      role: role || "student",
    });
    
    await user.save();
    
    res.status(201).json({
      message: "Student created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({
      message: "Failed to create student",
      success: false,
      error: error.message,
    });
  }
};

const signinStudent = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Find user
    const user = await studentModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({
        message: "Student does not exist",
        success: false,
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        userName: user.name,
        role: user.role,
        department: user.department,
      },
      SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "Student logged in successfully",
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error signing in student:", error);
    return res.status(500).json({
      message: "Failed to login",
      success: false,
      error: error.message,
    });
  }
};

//TEACHER
// Fetch students by department
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
    }).select('-password'); // Exclude password from response

    res.status(200).json({
      message: "Students fetched successfully",
      success: true,
      students: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      message: "Failed to fetch students",
      success: false,
      error: error.message,
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
    // Validate required fields
    if (!name || !email || !password || !confirmpassword || !department || !secretNumber) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    // Check if user already exists
    const existinguser = await teacherModel.findOne({ email: email.toLowerCase().trim() });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "Email is already registered", success: false });
    }

    // Validate password match
    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Password and confirm password mismatch",
        success: false,
      });
    }

    // Validate secret number
    if (secretNumber != SECRET_NUMBER) {
      return res.status(400).json({
        message: "Invalid secret number",
        success: false,
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Hash password
    const hashedpassword = await bcrypt.hash(password, 12);
    
    // Create new teacher
    const user = new teacherModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedpassword,
      department,
      role: role || "teacher",
    });
    
    await user.save();
    
    res.status(201).json({
      message: "Teacher created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return res.status(500).json({
      message: "Failed to create teacher",
      success: false,
      error: error.message,
    });
  }
};

const signinTeacher = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Find user
    const user = await teacherModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Teacher does not exist", success: false });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.name,
        role: user.role,
        department: user.department,
      },
      SECRET_KEY,
      {
        expiresIn: "30D",
      }
    );
    
    res.status(200).json({
      message: "Teacher logged in successfully",
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error signing in teacher:", error);
    return res.status(500).json({
      message: "Failed to login",
      success: false,
      error: error.message,
    });
  }
};

// Authentication middleware
function authenticationToken(req, res, next) {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({
      message: "Access denied, no token provided",
      success: false,
    });
  }

  try {
    const token1 = token.split("Bearer ")[1];
    
    if (!token1) {
      return res.status(401).json({
        message: "Invalid token format. Use 'Bearer <token>'",
        success: false,
      });
    }

    jwt.verify(token1, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
          success: false,
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token format",
      success: false,
    });
  }
}

module.exports = {
  createStudent,
  createTeacher,
  signinStudent,
  signinTeacher,
  authenticationToken,
  getstudentsByDepartment,
};