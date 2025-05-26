import React from 'react'
import {useState} from "react";
import {Teacher_SignUp} from "../services/Api"
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/SignupStudent.css";
function SignupTeacher() {
const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmpassword:"",
    department:"",
    secretNumber:"",
    role:"teacher"
});
const [error, setError] = useState("");
const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
        ...formData, [e.target.name]: e.target.value
    });
};

const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        
        const response = await Teacher_SignUp(formData);
        if(response.data && response.data.success){
            navigate("/Teacher_LogIn");
            console.log("Teacher data submitted successfully!")
        }else{
            setError(response.data ? response.data.message: "Sinup failed. Try again");
        }

    }catch(error){
        setError("Signup failed. Try again");
    }
};



return (
    <>
    <div className='TeacherSignupContainer' id="formSection3">
        <h2>Teacher Signup</h2>
        <form onSubmit={handleSubmit}>
        {error && <p style={{color:"red"}}>{error}</p>}
        
        <input type="text" name='name' placeholder='Name' onChange={handleChange} required />
        
        <input type="email" name='email' placeholder='Email' onChange={handleChange} required />
        
        <input type="password" name='password' placeholder='Password' onChange={handleChange} required />

        <input type="password" name='confirmpassword' placeholder='Confirm Password' onChange={handleChange} required />

        <input type="password" name='secretNumber' placeholder='Secret Number' onChange={handleChange} required />

        <select name="department" onChange={handleChange} value={formData.department} id='departments1' required>
            <option value="" disabled>Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ISE">ISE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
            <option value="AIML">AIML</option>

        </select>
<select name='role' onChange={handleChange} value={formData.role} required>
    <option value="teacher" selected>teacher</option>
</select>

<button type='submit'>Sign Up</button>
<Link to="/signInTeacher">Teacher Log-in</Link>
</form>
</div>
</>
)
}

export default SignupTeacher;