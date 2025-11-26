import './App.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SigninStudent from "./components/LoginStudent";
import SignupStudent from './components/SignupStudent';
import StudentHomePage from './components/StudentHomePage';
import SignupTeacher from './components/SignupTeacher';
import SignInTeacher from './components/SignInTeacher';

import TeacherHome from './components/TeacherHome';

import CreateAssignment from './components/CreateAssignment';
import A_fetchAssignments from './components/A_fetchAssignments';
import S_fetchAssignments from './components/S_fetchAssignments'
import StudentAssignmentTracker from './components/StudentAssignmentTracker';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      < ToastContainer position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignupStudent />} />
          <Route path="/student_Login" element={<SigninStudent />} />
          <Route path="/teacher_signup" element={<SignupTeacher />} />
          <Route path="/teacher_LogIn" element={<SignInTeacher />} />

          {/* Protected Routes */}
          <Route path="/Home" element={<Layout><StudentHomePage /></Layout>} />
          <Route path="/teacher_Home" element={<Layout><TeacherHome /></Layout>} />
          <Route path="/createAssignment" element={<Layout><CreateAssignment /></Layout>} />
          <Route path="/manage-assignments" element={<Layout><A_fetchAssignments /></Layout>} />
          <Route path="/studentAssignment" element={<Layout><S_fetchAssignments /></Layout>} />
          <Route path="/student-tracker" element={<Layout><StudentAssignmentTracker /></Layout>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
