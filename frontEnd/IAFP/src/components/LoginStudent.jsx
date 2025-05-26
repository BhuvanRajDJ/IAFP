import  {useState} from "react";
import { Link } from "react-router-dom";
// import { notify } from '../services/Utils';
// import { ToastContainer } from "react-toastify";
import { student_Signin } from "../services/Api"
import { useNavigate } from "react-router-dom";
import "../styles/StudentSignIn.css"
function SigninStudent(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
        const response = await student_Signin(formData);
        console.log("Signin response:", response);
        if (response.data && response.data.success) {
    localStorage.setItem("StudentToken", response.data.token);
    navigate("/studentAssignment");
    console.log("Move to next page page!")
  } else {
    setError(response.data ? response.data.message : "Signup failed. Try again.");
  }
}catch(error){
        setError("Signup failed. Try again");
    }
};

return(
<>

<div className="signInContainer" id="formSection2">
<h2>Sign-In</h2>

<form onSubmit={handleSubmit}>

{error && <p style={{color:"red"}}>{error}</p>}

<input type="email" name="email" placeholder="Email" onChange={handleChange} required/>

<input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
<br/>
Student:<Link to="/">Sign-up</Link> <br/>
Teacher:<Link to="/teacher_LogIn">Sign-in</Link><br/>
Teacher:<Link to="/teacher_signup">Sign up</Link><br/>
<br/>
<button type="submit">Sign Up</button>

</form>
</div>

</>
);
}


export default SigninStudent;