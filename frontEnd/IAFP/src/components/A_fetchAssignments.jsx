import React, { useEffect } from 'react'
import { fetchAssignment, deleteAssignment, updateAssignement } from '../services/Api'
import {useState} from 'react';
import {notify} from '../services/Utils'
import "../styles/A_fetchAssignments.css";

function A_fetchAssignments() {
  const [assignment, setAssignment] = useState([]);
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
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      subject: item.subject,
      year: item.year,
      description: item.description,
      department: item.department,
      deadline: item.deadline.split("T")[0], 
      questions: item.questions.map(q => ({
        questionText: q.questionText,
        marks: q.marks
      }))
    });
    setEditingId(item._id); 
    
    // Scroll to update form
    document.querySelector('.update-assignment-section').scrollIntoView({ 
      behavior: 'smooth'
    });
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setFormData({...formData, questions:updatedQuestions});
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {questionText: "", marks: ""}],
    });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    const afterDeletingQuestion = updatedQuestions.filter((_, index1) => index != index1)
    setFormData({...formData, questions:afterDeletingQuestion});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        const response = await updateAssignement(editingId, formData);
        const successMsg = await response.message;
        console.log("response: ", response);
        setMessage(successMsg);
        notify(`${successMsg}`, 'success');
      } else {
        notify("No assignment selected for update.", 'error');
      }

      setEditingId(null); 
      setFormData({
        title: "",
        subject: "",
        year: "",
        description: "",
        department: "",
        deadline: "",
        questions: [{ questionText: "", marks: "" }]
      });

      fetchAssignments(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update assignment";
      setError(errorMsg);
      console.log("error: ", err.message)
      notify(errorMsg, 'error');
    }
  };

  const fetchAssignments = async () => {
    try{
      const response = await fetchAssignment();
      setAssignment(response.data.assignments);
    }catch(error){
      console.log(`Could not fetch the data. error:${error}`)
    }
  }

  useEffect(() => {
    fetchAssignments();
  },[]);

  const deleteAssignments = async (id) => {
    try{
      const response = await deleteAssignment(id);
      if(response.data.success){
        const message = response.data.message;
        notify(`${message}`, 'success');
      }
      else{
        const message = response.data.message;
        notify(`${message}`, 'error');
      }
      fetchAssignments();
    }catch(error){
      console.log(error);
      notify("Failed to delete the task", "error");
    }
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h1><span className="header-emoji">📚</span> Assignments</h1>
        <div className="subtitle">Manage your assignments</div>
      </div>
      
      <div className='assignments'>
        {assignment.map((item) => (
          <div key={item._id} className='assignmentCard'>
            <details>
              <summary>{item.title}</summary>
              <h3>Subject: {item.subject}</h3>
              <p>Description: {item.description}</p>
              <p>Created Time: {item.createdAt.split("T")[0]}</p>
              <p>Deadline: {item.deadline.split("T")[0]}</p>
              <h3>Questions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Sl. no</th>
                    <th>Questions</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {item.questions.map((qt, index) => (
                    <tr key={qt._id || index}>
                      <td>{index+1}</td>
                      <td>{qt.questionText}</td>
                      <td>{qt.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="card-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => deleteAssignments(item._id)}>Delete</button>
              </div>
            </details>
          </div>
        ))}
      </div>
      
      <div className="update-assignment-section">
        <h2>Update Assignment</h2>
        
        {message && <div className="message-box success">{message}</div>}
        {error && <div className="message-box error">{error}</div>}
        
        <div className='form_CreateAssignment'>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              placeholder="Title" 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="subject">Subject:</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}  
              placeholder="Subject" 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="year">Batch:</label>
            <input 
              type="text" 
              id="year" 
              name="year" 
              value={formData.year} 
              placeholder="Year" 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="description">Description:</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              placeholder="Description" 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="department">Department:</label>
            <select 
              id="department" 
              name="department" 
              onChange={handleChange} 
              value={formData.department} 
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MECH">MECH</option>
              <option value="AIML">AIML</option>
            </select>

            <label htmlFor="deadline">Deadline:</label>
            <input 
              type="date" 
              id="deadline" 
              name="deadline" 
              value={formData.deadline} 
              onChange={handleChange} 
              required 
            />

            <h3>Questions</h3>
            {formData.questions.map((q, index) => (
              <div key={index} className="question-item">
                <div className="question-number">{index + 1}</div>
                
<label htmlFor={`questionText-${index}`}>Question:</label>
<input type="text"
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
                
                <div className="question-actions">
                  <button type="button" onClick={() => deleteQuestion(index)}>Delete Question</button>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addQuestion}>Add Question</button>
            <button type="submit">Update Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default A_fetchAssignments