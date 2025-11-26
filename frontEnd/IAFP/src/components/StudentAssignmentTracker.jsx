import React, { useState, useEffect } from 'react';
import { students_by_department, submittedAssignments } from '../services/Api';
import { Users, BookOpen, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, Calendar, Filter, Search } from 'lucide-react';

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
          // Backend returns an array of student objects, so we can use it directly
          const parsedStudents = studentsResponse.data.students || [];
          const sortedStudents = parsedStudents.sort((a, b) => a.USN.localeCompare(b.USN));
          setStudents(sortedStudents);
        }

        // Fetch submitted assignments
        const submissionsResponse = await submittedAssignments();
        if (submissionsResponse.data && submissionsResponse.data.success) {
          setSubmissions(submissionsResponse.data.submissions || []);
        }

        try {
          const { fetchAssignment } = await import('../services/Api');
          const assignmentsResponse = await fetchAssignment();
          if (assignmentsResponse.data && assignmentsResponse.data.success) {
            setAssignments(assignmentsResponse.data.assignments || []);
          }
        } catch (apiError) {
          console.warn("fetchAssignment not available, using submitted assignments data");
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
                  questions: [],
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

  const toggleAssignmentExpansion = (assignmentId) => {
    setExpandedAssignments(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  const toggleSubmissionDetails = (studentId, assignmentId) => {
    const key = `${studentId}-${assignmentId}`;
    setExpandedSubmissionDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

  const hasSubmittedAssignment = (studentId, assignmentId) => {
    return submissions.some(
      submission =>
        submission.studentId._id === studentId &&
        submission.assignmentId._id === assignmentId
    );
  };

  const getSubmissionDetails = (studentId, assignmentId) => {
    return submissions.find(
      submission =>
        submission.studentId._id === studentId &&
        submission.assignmentId._id === assignmentId
    );
  };

  const calculateTotalMarks = (submission, assignment) => {
    if (!submission) return 0;

    // Use the actual evaluated marks if available
    if (submission.evaluation && typeof submission.evaluation.totalMarks === 'number') {
      return submission.evaluation.totalMarks;
    }

    // Fallback logic (only if evaluation is missing, which shouldn't happen for processed assignments)
    return 0;
  };

  const calculateTotalPossibleMarks = (assignment) => {
    if (!assignment) return 0;
    if (!assignment.questions || assignment.questions.length === 0) return 40;
    return assignment.questions.reduce((total, question) => total + (question.marks || 10), 0);
  };

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

  const studentGroups = groupStudents();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-center h-screen">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Tracker</h1>
          <p className="text-gray-500">Monitor student performance and submissions</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveSection('students')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'students'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          All Students
        </button>
        <button
          onClick={() => setActiveSection('groups')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'groups'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          Student Groups
        </button>
        <button
          onClick={() => setActiveSection('submission-status')}
          disabled={!selectedGroup}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'submission-status'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          Assignment Status
        </button>
        <button
          onClick={() => setActiveSection('detailed-submissions')}
          disabled={!selectedGroup}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'detailed-submissions'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
        >
          Detailed Submissions
        </button>
      </div>

      {/* Section 1: Students Table */}
      {activeSection === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">DOB</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">USN</th>
                  <th className="px-6 py-4">Batch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, index) => (
                  <tr key={student._id || index} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(student.dateOfBirth)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">{student.USN}</td>
                    <td className="px-6 py-4 text-gray-500">{student.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Student Groups */}
      {activeSection === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(studentGroups).map(groupKey => (
            <button
              key={groupKey}
              onClick={() => {
                setSelectedGroup(groupKey);
                setActiveSection('submission-status');
              }}
              className={`p-6 rounded-xl border text-left transition-all hover:shadow-md ${selectedGroup === groupKey
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-50'
                : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">{studentGroups[groupKey].name}</h3>
              </div>
              <p className="text-sm text-gray-500">
                {studentGroups[groupKey].students.length} Students Enrolled
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Section 3: Assignment Submission Status */}
      {activeSection === 'submission-status' && selectedGroup && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Assignment Status: {studentGroups[selectedGroup].name}
            </h2>
          </div>

          {assignments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No assignments available for this group.</p>
            </div>
          ) : (
            assignments.map(assignment => (
              <div key={assignment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {assignment.subject || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Due: {formatDate(assignment.deadline)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAssignmentExpansion(assignment._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {expandedAssignments[assignment._id] ? (
                      <>Hide Details <ChevronUp size={16} /></>
                    ) : (
                      <>Show Details <ChevronDown size={16} /></>
                    )}
                  </button>
                </div>

                {expandedAssignments[assignment._id] && (
                  <div className="border-t border-gray-100">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">USN</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Marks</th>
                          <th className="px-6 py-3">Submitted On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {studentGroups[selectedGroup].students.map((student, index) => {
                          const hasSubmitted = hasSubmittedAssignment(student._id, assignment._id);
                          const submissionDetails = getSubmissionDetails(student._id, assignment._id);
                          const totalMarks = calculateTotalMarks(submissionDetails, assignment);
                          const totalPossibleMarks = calculateTotalPossibleMarks(assignment);

                          return (
                            <tr key={`${student._id || index}-${assignment._id}`} className="hover:bg-gray-50/50">
                              <td className="px-6 py-3 font-medium text-gray-900">{student.name}</td>
                              <td className="px-6 py-3 font-mono text-gray-600">{student.USN}</td>
                              <td className="px-6 py-3">
                                {hasSubmitted ? (
                                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                                    <CheckCircle size={12} /> Submitted
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                                    <XCircle size={12} /> Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 font-medium">
                                {hasSubmitted ? `${totalMarks}/${totalPossibleMarks}` : '-'}
                              </td>
                              <td className="px-6 py-3 text-gray-500">
                                {hasSubmitted && submissionDetails.answers && submissionDetails.answers.length > 0
                                  ? formatDate(submissionDetails.answers[0].submissionTimestamp)
                                  : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Section 4: Detailed Submissions */}
      {activeSection === 'detailed-submissions' && selectedGroup && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Detailed Submissions</h2>

          {assignments.map(assignment => {
            const submittedStudents = studentGroups[selectedGroup].students.filter(student =>
              hasSubmittedAssignment(student._id, assignment._id)
            );

            if (submittedStudents.length === 0) return null;

            return (
              <div key={`detail-${assignment._id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{assignment.subject}</span>
                    <span>•</span>
                    <span>Due: {formatDate(assignment.deadline)}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {submittedStudents.map((student, index) => {
                    const submissionDetails = getSubmissionDetails(student._id, assignment._id);
                    if (!submissionDetails || !submissionDetails.answers) return null;

                    const totalMarks = calculateTotalMarks(submissionDetails, assignment);
                    const totalPossibleMarks = calculateTotalPossibleMarks(assignment);
                    const detailKey = `${student._id}-${assignment._id}`;

                    return (
                      <div key={`summary-${student._id || index}-${assignment._id}`} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500 font-mono">{student.USN}</p>
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                              Score: {totalMarks}/{totalPossibleMarks}
                            </div>
                            {/* Plagiarism and AI Status in Header */}
                            {submissionDetails.evaluation && (
                              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${submissionDetails.evaluation.plagiarismScore > 10 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                Plagiarism: {submissionDetails.evaluation.plagiarismScore}%
                              </div>
                            )}
                            {submissionDetails.evaluation && submissionDetails.evaluation.isAIGenerated && (
                              <div className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                                AI Generated
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSubmissionDetails(student._id, assignment._id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            {expandedSubmissionDetails[detailKey] ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>

                        {expandedSubmissionDetails[detailKey] && (
                          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-700 font-medium">
                                <tr>
                                  <th className="px-4 py-2">Question</th>
                                  <th className="px-4 py-2">Marks</th>
                                  <th className="px-4 py-2">Submitted On</th>
                                  <th className="px-4 py-2">File</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {submissionDetails.answers.map((answer, qIndex) => {
                                  const question = assignment.questions && assignment.questions.find(q => q._id === answer.questionId);
                                  const questionText = question ? question.questionText : `Question ${qIndex + 1}`;
                                  const marks = question ? question.marks : 10;

                                  // Find evaluation detail
                                  const evaluationDetail = submissionDetails.evaluation &&
                                    submissionDetails.evaluation.marksPerQuestion &&
                                    submissionDetails.evaluation.marksPerQuestion.find(m => m.questionId === questionText);

                                  return (
                                    <React.Fragment key={`${student._id || index}-${answer.questionId || qIndex}`}>
                                      <tr>
                                        <td className="px-4 py-2 text-gray-800">{questionText}</td>
                                        <td className="px-4 py-2 text-gray-600">{marks}</td>
                                        <td className="px-4 py-2 text-gray-500">
                                          {formatDate(answer.submissionTimestamp)}
                                        </td>
                                        <td className="px-4 py-2">
                                          {answer.uploadedFile ? (
                                            <a
                                              href={answer.uploadedFile}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                              <FileText size={14} /> View
                                            </a>
                                          ) : (
                                            <span className="text-gray-400">No file</span>
                                          )}
                                        </td>
                                      </tr>
                                      {evaluationDetail && (
                                        <tr>
                                          <td colSpan="4" className="px-4 py-3 bg-blue-50/50 text-sm text-gray-700">
                                            <div className="space-y-2">
                                              {evaluationDetail.reasonForDeduction && evaluationDetail.reasonForDeduction !== 'None' && (
                                                <div className="flex gap-2">
                                                  <span className="font-semibold text-red-600 min-w-[140px]">Reason for Deduction:</span>
                                                  <span>{evaluationDetail.reasonForDeduction}</span>
                                                </div>
                                              )}
                                              {evaluationDetail.missingPoints && evaluationDetail.missingPoints !== 'None' && (
                                                <div className="flex gap-2">
                                                  <span className="font-semibold text-orange-600 min-w-[140px]">Missing Points:</span>
                                                  <span>{evaluationDetail.missingPoints}</span>
                                                </div>
                                              )}
                                              <div className="flex gap-2">
                                                <span className="font-semibold text-blue-600 min-w-[140px]">AI Comments:</span>
                                                <span>{evaluationDetail.comments}</span>
                                              </div>
                                              {/* AI Generated Feedback in Detail */}
                                              {submissionDetails.evaluation && submissionDetails.evaluation.isAIGenerated && (
                                                <div className="flex gap-2">
                                                  <span className="font-semibold text-red-600 min-w-[140px]">AI Warning:</span>
                                                  <span className="text-red-600">{submissionDetails.evaluation.aiGeneratedFeedback}</span>
                                                </div>
                                              )}
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentTracker;