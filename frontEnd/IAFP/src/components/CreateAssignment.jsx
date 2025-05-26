import React from 'react'
import {createAssignment} from "../services/Api";
import { useState, useEffect } from 'react';
import {notify} from '../services/Utils'
import "../styles/CreateAssignment.css";

function CreateAssignment() {
    const [formData, setFormData] = useState({
      title: "",
      subject: "",
      year: "",
      description: "",
      questions: [{ questionText: "", marks: "" }],
      deadline: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleQuestionChange = (index, e) => {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[index][e.target.name] = e.target.value;
      setFormData({ ...formData, questions: updatedQuestions });
    };
  
    const addQuestion = () => {
      setFormData({
        ...formData,
        questions: [...formData.questions, { questionText: "", marks: "" }],
      });
    };
  
    const deleteQuestion = (index, e) => {
      const updatedQuestions = [...formData.questions];
      const afterDeletingQuestion = updatedQuestions.filter((_, index1) => index != index1)
      setFormData({...formData, questions:afterDeletingQuestion});

    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setMessage("");
      
      try {
        const response = await createAssignment(formData);
        console.log("Assignment creation response:", response);
        
        if (response.data && response.data.success === true) {
          setMessage(response.data.message);
          notify(response.data.message, 'success');
          
          // Reset form after success
          setFormData({
            title: "",
            subject: "",
            year: "",
            description: "",
            department: "",
            questions: [{ questionText: "", marks: "" }],
            deadline: ""
          });
        } else {
          // Handle case where backend returns success: false
          setError(response.data.message || "Failed to create assignment");
          notify(response.data.message || "Failed to create assignment", 'error');
        }
      } catch (err) {
        console.error("Assignment creation error:", err);
        const errorMessage = err.response?.data?.message || "Failed to create assignment";
        
        // Check if it's a network error
        if (!err.response) {
          notify("Network error. Please check your connection.", 'error');
        } else {
          setError(errorMessage);
          notify(errorMessage, 'error');
        }
      }
    };
  
    return (<>
      <div>
  <h2>Create Assignment</h2>
  {error && <p style={{ color: "red" }}>{error}</p>}
  <div className='form_CreateAssignment'>
  <form onSubmit={handleSubmit}>
    <label htmlFor="title">Title:</label>
    <input type="text" id="title" name="title" placeholder="Title" onChange={handleChange} required />

    <label htmlFor="subject">Subject:</label>
    <input type="text" id="subject" name="subject" placeholder="Subject" onChange={handleChange} required />

    <label htmlFor="year">Batch:</label>
    <input type="text" id="year" name="year" placeholder="Year" onChange={handleChange} required />

    <label htmlFor="description">Description:</label>
    <textarea id="description" name="description" placeholder="Description" onChange={handleChange} required />

    <label htmlFor="department">Department:</label>
    <select id="department" name="department" onChange={handleChange} value={formData.department} required>
      <option value="" >Select Department</option>
      <option value="CSE">CSE</option>
      <option value="ISE">ISE</option>
      <option value="ECE">ECE</option>
      <option value="EEE">EEE</option>
      <option value="CIVIL">CIVIL</option>
      <option value="MECH">MECH</option>
      <option value="AIML">AIML</option>
    </select>

    <label htmlFor="deadline">Deadline:</label>
    <input type="date" id="deadline" name="deadline" onChange={handleChange} required />

    <h3>Questions</h3>
    {formData.questions.map((q, index) => (
      <div key={index}>
        <label htmlFor={`questionText-${index}`}>Question:</label>
        <input
          type="text"
          id={`questionText-${index}`}
          name="questionText"
          placeholder="Question"
          value={q.questionText}
          onChange={(e) => handleQuestionChange(index, e)}
          required
        />
        <label htmlFor={`marks-${index}`}>Marks:</label>
        <input
          type="number"
          id={`marks-${index}`}
          name="marks"
          placeholder="Marks"
          value={q.marks}
          onChange={(e) => handleQuestionChange(index, e)}
          required
        />
        <button type="button" onClick={() => deleteQuestion(index)}>Delete Question</button>
      </div>
    ))}
    <button type="button" onClick={addQuestion}>Add Question</button>
    <button type="submit">Create Assignment</button>
  </form>
</div>
</div>
</>
    );
  }
export default CreateAssignment