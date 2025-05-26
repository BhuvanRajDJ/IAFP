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

function App() {
  return (
   <>
   <Toaster position="top-right" />
   < ToastContainer position="top-right" />
<Router>
  <Routes>
  <Route path="/teacher_Home" element={           <TeacherHome />   
        } />



    <Route path="/" element={<SignupStudent />} />
    <Route path="/student_Login" element={<SigninStudent />} />
    <Route path="/Home" element={<StudentHomePage/>} />
    <Route path="/teacher_signup" element={<SignupTeacher/>}/>
    <Route path="/teacher_LogIn" element={<SignInTeacher />}/>
 
    <Route path="/createAssignment" element={<CreateAssignment />} />

    <Route path="/manage-assignments" element={<A_fetchAssignments/>} />
   <Route path="/studentAssignment" element={<S_fetchAssignments />} />
   <Route path="/student-tracker" element={<StudentAssignmentTracker />} />

   
  </Routes>
</Router>
   </>
  )
}

export default App
