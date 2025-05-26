import  {useState} from "react";
// import { notify } from '../services/Utils';
// import { ToastContainer } from "react-toastify";
import { student_Signup } from "../services/Api"
import {Link} from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "../styles/SignupStudent.css";


function SignupStudent(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dateOfBirth:"",
        age: "",
        password: "",
        confirmpassword: "",
        department:"",
        USN: "",
        year:"",
        role: "student",
    });

const [error, setError] = useState("");
const navigate = useNavigate();

const handleChange = (e) => {
      setFormData({
        ...formData, [e.target.name]:e.target.value
    });
};

const handleSubmit = async (event) => {
    event.preventDefault();
    try{
const response = await student_Signup(formData);
console.log("Signup response:", response);
if (response.data && response.data.success) {
    navigate("/student_Login");
    console.log("Move to signin page!")
  } else {
    setError(response.data ? response.data.message : "Signup failed. Try again.");
  }
}catch(error){
        setError("Signup failed. Try again");
    }
};

return(
    <>
    <div className="signUpContainer" id="formSection1">
    <h2>Student Signup</h2>
    <form onSubmit={handleSubmit}>
    {error && <p style={{color:"red"}}>{error}</p>}
    <input type="text" name="name" placeholder="Name" onChange={handleChange} required/>
    <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
    <input type="number" name="age" placeholder="Age" onChange={handleChange} required/>
    <input type="Date" name="dateOfBirth" placeholder="Date Of Birth" onChange={handleChange} required/>
    <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
    <input type="password" name="confirmpassword" placeholder="Confirm Password" onChange={handleChange} required/>
    <input type="input" name="USN" placeholder="USN" onChange={handleChange} required/>
    <input type="input" name="year" placeholder="Batch" onChange={handleChange} required/>
    <select name="department" onChange={handleChange} value={formData.department} id="departments" required>
        <option value="" >Select Department</option>
        <option value="CSE">CSE</option>
        <option value="ISE">ISE </option>
        <option value="ECE">ECE </option>
        <option value="EEE">EEE</option>
        <option value="CIVIL">CIVIL</option>
        <option value="MECH">MECH</option>
        <option value="AIML">AIML</option>
    </select>
    <select name="role" onChange={handleChange} value={formData.role} required>
    <option value="student" selected>Student</option>
    </select>
    <br/>
    <button type="submit">Sign Up</button>
    <div className="nav-links">
      Student:<Link to="/student_Login">Log in</Link> <br/>
      Teacher:<Link to="/teacher_LogIn">Sign-in</Link><br/>
      Teacher:<Link to="/teacher_signup">Sign up</Link><br/>
    </div>
    </form>
    </div>
    </>
    );
}


export default SignupStudent;