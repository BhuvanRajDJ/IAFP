import React, { useState, useEffect } from 'react'
import {fetchAssignments, uploadFiles, fetchFeedback, submitAssignment} from "../services/Api"
import {notify} from '../services/Utils'
import "../styles/StudentAssignemnt.css";

function S_fetchAssignments() {
  const [assignment, setAssignment] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [files, setFiles] = useState({});
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAssignment = async () => {
    try{
      setLoading(true);
      const response = await fetchAssignments();
      // Add null check and ensure it's an array
      setAssignment(response?.assignments || []);
    }catch(error){
      console.log(`Could not fetch the data. error:${error}`);
      setError("Failed to fetch assignments");
      setAssignment([]);
    } finally {
      setLoading(false);
    }
  }

  const fetchFeedbackStudent = async () => {
    try{
      const response = await fetchFeedback();
      // Add null check and ensure it's an array
      const data = response?.evaluations || [];
      setFeedback(Array.isArray(data) ? data : []);
    }catch(error){
      console.log(`Could not fetch the data. error: ${error}`);
      setFeedback([]); // Set empty array on error
    }
  }

  useEffect(() => {
    fetchAssignment();
    fetchFeedbackStudent();
  },[])

  const handleFileChange = (questionId, file) => {
    setFiles(prev => ({
      ...prev, [questionId]:file
    }));
  };

  const cancelUpload = (questionId) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleUpload = async (assignmentId, questionId) => {
    const file = files[questionId];
    if (!file) {
      notify("Please select a file first", "error");
      return;
    }
    
    // Set uploading state for this specific question
    setUploading(prev => ({
      ...prev,
      [questionId]: true
    }));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionId", questionId);
    formData.append("assignmentId", assignmentId);

    try {
      console.log("Uploading file:", file.name);
      console.log("Question ID:", questionId);
      console.log("Assignment ID:", assignmentId);
      
      const response = await uploadFiles(formData);
      
      if (response.success) {
        notify("File uploaded successfully.", 'success');
        // Refresh feedback after successful upload
        await fetchFeedbackStudent();
        // Clear the file input after successful upload
        cancelUpload(questionId);
      } else {
        notify(response.message || "Upload failed.", "error");
      }

    } catch (err) {
      console.error("Upload error:", err);
      notify("An error occurred while uploading the file.", "error");
    } finally {
      // Reset uploading state regardless of success or failure
      setUploading(prev => ({
        ...prev,
        [questionId]: false
      }));
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    setSubmittingAssignment(true);
    try {
        const assignmentData = {
            assignmentId: assignmentId,
            isCompleted: true
        };
        
        const response = await submitAssignment(assignmentData);
        
        if (response.success) {
            notify("Assignment submitted successfully", "success");
            // Refresh assignments to update status
            fetchAssignment();
        } else {
            notify(response.message || "Failed to submit assignment", "error");
        }
    } catch (error) {
        console.error("Error submitting assignment:", error);
        notify("An error occurred while submitting the assignment", "error");
    } finally {
        setSubmittingAssignment(false);
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading assignments...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>Assignments</h1>
      <div className='studentAssignmentSubmissiom'>
        {assignment.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          assignment.map((item, index) => (
            <div key={item._id} className='studentAssigmentCard'>
              <details>
                <summary>
                  <h4>SL NO: {index+1}</h4>
                  <h5>Title: {item.title}</h5>
                  <h5>Subject: {item.subject}</h5>
                  <p>Description: {item.description}</p>
                  <p>Created Time: {item.createdAt?.split("T")[0] || 'N/A'}</p>
                  <p>Deadline: {item.deadline?.split("T")[0] || 'N/A'}</p>
                </summary>
                
                <h3>Questions</h3>
                <div className="question-list">
                  {(item.questions || []).map((qt, questionIndex) => {
                    const fileInputRef = React.createRef();
                    // Add safe array check for feedback
                    const questionFeedback = Array.isArray(feedback) 
                      ? feedback.flatMap((fb) =>
                          (fb.marksPerQuestion || []).filter((obj) => obj.questionId === qt._id)
                        )
                      : [];

                    return (
                      <div key={qt._id}>
                        <div className="question-item">
                          <div className="question-number">{questionIndex+1}</div>
                          <div className="question-text">{qt.questionText}</div>
                          <div className="question-marks">{qt.marks} pts</div>
                        </div>
                        
                        <div className="file-upload-section">
                          <div className="file-input-container">
                            <input 
                              ref={fileInputRef} 
                              type='file' 
                              onChange={(e) => handleFileChange(qt._id, e.target.files[0])}  
                            />
                          </div>
                          <button 
                            className="cancel" 
                            onClick={() => {
                              cancelUpload(qt._id);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            disabled={uploading[qt._id]}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleUpload(item._id, qt._id)}
                            disabled={uploading[qt._id] || !files[qt._id]}
                          >
                            {uploading[qt._id] ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                        
                        {questionFeedback.length > 0 && (
                          <div className="feedback-section">
                            <strong>Feedback:</strong>
                            {questionFeedback.map((fb, idx) => (
                              <div key={idx} className="feedback-item">
                                <p>Marks: {fb.marksAwarded || 'N/A'}</p>
                                <p>Comment: {fb.comments || 'No comments'}</p>
                                <p>Feedback: {fb.feedback || 'No feedback'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="total-marks">
                  <h3>Total Marks:</h3>
                </div>
                
                <button 
                  className="submit-assignment"
                  onClick={() => handleSubmitAssignment(item._id)}
                  disabled={submittingAssignment}
                >
                  {submittingAssignment ? "Submitting..." : "Submit Assignment"}
                </button>
              </details>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default S_fetchAssignments;