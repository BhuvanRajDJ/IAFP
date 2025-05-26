import React from 'react'
import { useState } from 'react'
import {Teacher_LogIn} from '../services/Api'
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import "../styles/TeacherSignIn.css";

function SignInTeacher() {
  const [formData, setFormData] = useState({
    email:"",
    password:""
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleChange = async (event) => {
    setFormData({
      ...formData, [event.target.name]:event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await Teacher_LogIn(formData);
      if(response.data && response.data.success){
        navigate("/teacher_Home")
        localStorage.setItem("TeacherToken", response.data.token);
        console.log("Move to next page");
      }else{
        setError(response.data ? response.data.message: "Sig-in failed. Try again!");
      }
    }catch(error){
      setError("Sig-in failed. Try again!");
    }
  }


  return (
    <>
    <div className='teacherSignInContainer'>
  <h2>Teacher Sign-In</h2>
    <form onSubmit={handleSubmit}>
      {error && <p style={{color:"red"}}>{error}</p>}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required/><br/>
     Student:<Link to="/">Sign up</Link><br/>
     Student:<Link to="/student_Login" >Sign In</Link><br />
     Teacher:<Link to="/teacher_signup">Sign up</Link><br/>
      <br/>
      <button type="submit">Sign Up</button>
    </form></div>
    </>
  )
}

export default SignInTeacher