import React, { useState, useEffect } from 'react';
import { students_by_department, submittedAssignments} from '../services/Api';
import "../styles/StudentAssignmentTracker.css";

const StudentAssignmentTracker = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeSection, setActiveSection] = useState('students');
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [expandedSubmissionDetails, setExpandedSubmissionDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students data
        const studentsResponse = await students_by_department();
        if (studentsResponse.data && studentsResponse.data.success) {
          // Use regex to properly parse the student data string
          const parseStudentData = (studentString) => {
            // Extract individual student objects
            const studentStrings = studentString.match(/\{[^}]+\}/g) || [];
            
            return studentStrings.map(str => {
              // Extract individual fields
              const name = str.match(/name: '([^']+)'/) || str.match(/name: "([^"]+)"/);
              const email = str.match(/email: '([^']+)'/) || str.match(/email: "([^"]+)"/);
              const dobMatch = str.match(/dateOfBirth: ([^,]+),/);
              const department = str.match(/department: '([^']+)'/) || str.match(/department: "([^"]+)"/);
              const usn = str.match(/USN: '([^']+)'/) || str.match(/USN: "([^"]+)"/);
              const year = str.match(/year: '([^']+)'/) || str.match(/year: "([^"]+)"/);
              const id = str.match(/_id: new ObjectId\('([^']+)'\)/) || str.match(/_id: '([^']+)'/) || str.match(/_id: "([^"]+)"/);
              
              return {
                _id: id ? id[1] : `student-${Math.random().toString(36).substr(2, 9)}`,
                name: name ? name[1] : 'Unknown',
                email: email ? email[1] : 'No email',
                dateOfBirth: dobMatch ? new Date(dobMatch[1]) : new Date(),
                department: department ? department[1] : 'Unknown',
                USN: usn ? usn[1] : 'Unknown',
                year: year ? year[1] : 'Unknown'
              };
            });
          };
          
          const parsedStudents = parseStudentData(studentsResponse.data.students);
          // Sort students by USN in ascending order
          const sortedStudents = parsedStudents.sort((a, b) => a.USN.localeCompare(b.USN));
          setStudents(sortedStudents);
        }
        
        // Fetch submitted assignments
        const submissionsResponse = await submittedAssignments();
        if (submissionsResponse.data && submissionsResponse.data.success) {
          setSubmissions(submissionsResponse.data.submissions || []);
        }
        
        // Replace createAssignment with fetchAssignment
        try {
          // Assuming you have a fetchAssignment function in your API
          const { fetchAssignment } = await import('../services/Api');
          const assignmentsResponse = await fetchAssignment();
          if (assignmentsResponse.data && assignmentsResponse.data.success) {
            setAssignments(assignmentsResponse.data.assignments || []);
          }
        } catch (apiError) {
          console.warn("fetchAssignment not available, using submitted assignments data");
          // Fallback: Extract assignment data from submissions
          if (submissionsResponse.data && submissionsResponse.data.submissions) {
            const uniqueAssignments = {};
            submissionsResponse.data.submissions.forEach(submission => {
              const assignmentId = submission.assignmentId._id;
              if (!uniqueAssignments[assignmentId]) {
                uniqueAssignments[assignmentId] = {
                  _id: assignmentId,
                  title: submission.assignmentId.title,
                  subject: submission.assignmentId.subject,
                  deadline: submission.assignmentId.deadline,
                  questions: [], // We'll populate this from submission data if possible
                };
              }
            });
            setAssignments(Object.values(uniqueAssignments));
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Toggle assignment expansion
  const toggleAssignmentExpansion = (assignmentId) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  // Toggle student submission details
  const toggleSubmissionDetails = (studentId, assignmentId) => {
    const key = `${studentId}-${assignmentId}`;
    setExpandedSubmissionDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate age based on DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Group students by year/batch and branch
  const groupStudents = () => {
    const groups = {};
    
    students.forEach(student => {
      const groupKey = `${student.department}-${student.year}`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: `${student.department} - ${student.year}`,
          students: []
        };
      }
      groups[groupKey].students.push(student);
    });
    
    return groups;
  };

  // Check if student has submitted a specific assignment
  const hasSubmittedAssignment = (studentId, assignmentId) => {
    return submissions.some(
      submission => 
        submission.studentId._id === studentId && 
        submission.assignmentId._id === assignmentId
    );
  };

  // Get submission details for a specific student and assignment
  const getSubmissionDetails = (studentId, assignmentId) => {
    return submissions.find(
      submission => 
        submission.studentId._id === studentId && 
        submission.assignmentId._id === assignmentId
    );
  };

  // Calculate total marks obtained by a student for an assignment
  const calculateTotalMarks = (submission, assignment) => {
    if (!submission || !assignment) return 0;
    
    // If questions aren't available, count the number of answers
    if (!assignment.questions || assignment.questions.length === 0) {
      return submission.answers ? submission.answers.length * 10 : 0; // Assuming 10 marks per question
    }
    
    let totalMarks = 0;
    submission.answers.forEach(answer => {
      const question = assignment.questions.find(q => q._id === answer.questionId);
      if (question) {
        totalMarks += question.marks;
      } else {
        totalMarks += 10; // Default 10 marks if question details not available
      }
    });
    
    return totalMarks;
  };

  // Calculate total possible marks for an assignment
  const calculateTotalPossibleMarks = (assignment) => {
    if (!assignment) return 0;
    if (!assignment.questions || assignment.questions.length === 0) return 40; // Default total marks
    
    return assignment.questions.reduce((total, question) => total + (question.marks || 10), 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get student groups
  const studentGroups = groupStudents();
  
  // Navigation bar
  const NavBar = () => (
    <div className="bg-blue-600 p-3 mb-4 sticky top-0 z-10">
      <nav className="flex justify-around">
        <button 
          className={`text-white font-medium px-4 py-2 rounded ${activeSection === 'students' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          onClick={() => setActiveSection('students')}
        >
          Students
        </button>
        <button 
          className={`text-white font-medium px-4 py-2 rounded ${activeSection === 'groups' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          onClick={() => setActiveSection('groups')}
        >
          Student Groups
        </button>
        <button 
          className={`text-white font-medium px-4 py-2 rounded ${activeSection === 'submission-status' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          onClick={() => setActiveSection('submission-status')}
          disabled={!selectedGroup}
        >
          Assignment Status
        </button>
        <button 
          className={`text-white font-medium px-4 py-2 rounded ${activeSection === 'detailed-submissions' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          onClick={() => setActiveSection('detailed-submissions')}
          disabled={!selectedGroup}
        >
          Detailed Submissions
        </button>
      </nav>
    </div>
  );
  
  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Student Assignment Tracker</h1>
    
      
      <NavBar />
      
      {/* Section 1: Students Table */}
      {activeSection === 'students' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Date of Birth</th>
                  <th className="py-2 px-4 border">Age</th>
                  <th className="py-2 px-4 border">Department</th>
                  <th className="py-2 px-4 border">USN</th>
                  <th className="py-2 px-4 border">Year/Batch</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id || index}>
                    <td className="py-2 px-4 border">{student.name}</td>
                    <td className="py-2 px-4 border">{student.email}</td>
                    <td className="py-2 px-4 border">{formatDate(student.dateOfBirth)}</td>
                    <td className="py-2 px-4 border">{calculateAge(student.dateOfBirth)}</td>
                    <td className="py-2 px-4 border">{student.department}</td>
                    <td className="py-2 px-4 border">{student.USN}</td>
                    <td className="py-2 px-4 border">{student.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Section 2: Student Groups */}
      {activeSection === 'groups' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Student Groups</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(studentGroups).map(groupKey => (
              <button
                key={groupKey}
                className={`px-4 py-2 rounded ${selectedGroup === groupKey ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
                onClick={() => {
                  setSelectedGroup(groupKey);
                  setActiveSection('submission-status');
                }}
              >
                {studentGroups[groupKey].name} ({studentGroups[groupKey].students.length} students)
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Section 3: Assignment Submission Status */}
      {activeSection === 'submission-status' && selectedGroup && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Assignment Submission Status - {studentGroups[selectedGroup].name}</h2>
          
          {assignments.length === 0 ? (
            <p>No assignments available for this group.</p>
          ) : (
            assignments.map(assignment => (
              <div key={assignment._id} className="mb-6 bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{assignment.title} - {assignment.subject || 'N/A'}</h3>
                  <button 
                    className="px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => toggleAssignmentExpansion(assignment._id)}
                  >
                    {expandedAssignments[assignment._id] ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                <p className="mb-2">Deadline: {formatDate(assignment.deadline)}</p>
                <p className="mb-4">Total Marks: {calculateTotalPossibleMarks(assignment)}</p>
                
                {expandedAssignments[assignment._id] && (
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">USN</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Marks Obtained</th>
                        <th className="py-2 px-4 border">Submission Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGroups[selectedGroup].students.map((student, index) => {
                        const hasSubmitted = hasSubmittedAssignment(student._id, assignment._id);
                        const submissionDetails = getSubmissionDetails(student._id, assignment._id);
                        const totalMarks = calculateTotalMarks(submissionDetails, assignment);
                        const totalPossibleMarks = calculateTotalPossibleMarks(assignment);
                        
                        return (
                          <tr key={`${student._id || index}-${assignment._id}`}>
                            <td className="py-2 px-4 border">{student.name}</td>
                            <td className="py-2 px-4 border">{student.USN}</td>
                            <td className={`py-2 px-4 border ${hasSubmitted ? 'text-green-600' : 'text-red-600'}`}>
                              {hasSubmitted ? 'Submitted' : 'Not Submitted'}
                            </td>
                            <td className="py-2 px-4 border">
                              {hasSubmitted ? `${totalMarks}/${totalPossibleMarks}` : 'N/A'}
                            </td>
                            <td className="py-2 px-4 border">
                              {hasSubmitted && submissionDetails.answers && submissionDetails.answers.length > 0 
                                ? formatDate(submissionDetails.answers[0].submissionTimestamp)
                                : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Section 4: Detailed Assignment Submissions */}
      {activeSection === 'detailed-submissions' && selectedGroup && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Detailed Assignment Submissions</h2>
          
          {assignments.map(assignment => {
            // Get students from selected group who have submitted this assignment
            const submittedStudents = studentGroups[selectedGroup].students.filter(student => 
              hasSubmittedAssignment(student._id, assignment._id)
            );
            
            if (submittedStudents.length === 0) return null;
            
            return (
              <div key={`detail-${assignment._id}`} className="mb-6 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">{assignment.title} - {assignment.subject || 'N/A'}</h3>
                <p className="mb-4">Deadline: {formatDate(assignment.deadline)}</p>
                
                <h4 className="font-medium mb-2">Submitted Students:</h4>
                <table className="min-w-full bg-white border border-gray-200 mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Name</th>
                      <th className="py-2 px-4 border">USN</th>
                      <th className="py-2 px-4 border">Marks</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedStudents.map((student, index) => {
                      const submissionDetails = getSubmissionDetails(student._id, assignment._id);
                      if (!submissionDetails || !submissionDetails.answers) return null;
                      
                      const totalMarks = calculateTotalMarks(submissionDetails, assignment);
                      const totalPossibleMarks = calculateTotalPossibleMarks(assignment);
                      const detailKey = `${student._id}-${assignment._id}`;
                      
                      return (
                        <React.Fragment key={`summary-${student._id || index}-${assignment._id}`}>
                          <tr>
                            <td className="py-2 px-4 border">{student.name}</td>
                            <td className="py-2 px-4 border">{student.USN}</td>
                            <td className="py-2 px-4 border">{totalMarks}/{totalPossibleMarks}</td>
                            <td className="py-2 px-4 border">
                              <button 
                                onClick={() => toggleSubmissionDetails(student._id, assignment._id)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                {expandedSubmissionDetails[detailKey] ? 'Hide Details' : 'View Details'}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Expandable submission details */}
                          {expandedSubmissionDetails[detailKey] && (
                            <tr>
                              <td colSpan="4" className="p-0 border">
                                <div className="p-3 bg-gray-50">
                                  <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border">Question</th>
                                        <th className="py-2 px-4 border">Marks</th>
                                        <th className="py-2 px-4 border">Submission Date</th>
                                        <th className="py-2 px-4 border">File</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {submissionDetails.answers.map((answer, qIndex) => {
                                        // Try to find question text
                                        const question = assignment.questions && assignment.questions.find(q => q._id === answer.questionId);
                                        const questionText = question ? question.questionText : `Question ${qIndex + 1}`;
                                        const marks = question ? question.marks : 10;
                                        
                                        return (
                                          <tr key={`${student._id || index}-${answer.questionId || qIndex}`}>
                                            <td className="py-2 px-4 border">{questionText}</td>
                                            <td className="py-2 px-4 border">{marks}</td>
                                            <td className="py-2 px-4 border">
                                              {formatDate(answer.submissionTimestamp)}
                                            </td>
                                            <td className="py-2 px-4 border">
                                              {answer.uploadedFile ? (
                                                <a 
                                                  href={answer.uploadedFile} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:underline"
                                                >
                                                  View Submission
                                                </a>
                                              ) : 'No file'}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentTracker;