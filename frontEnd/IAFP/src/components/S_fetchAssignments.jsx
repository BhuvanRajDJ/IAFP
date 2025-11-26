import React, { useState, useEffect } from 'react';
import { fetchAssignments, uploadFiles, fetchFeedback, submitAssignment } from "../services/Api";
import { notify } from '../services/Utils';
import { BookOpen, Calendar, Upload, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, AlertCircle, Clock } from 'lucide-react';

function S_fetchAssignments() {
  const [assignment, setAssignment] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [files, setFiles] = useState({});
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await fetchAssignments();
      setAssignment(response?.assignments || []);
    } catch (error) {
      console.log(`Could not fetch the data. error:${error}`);
      setError("Failed to fetch assignments");
      setAssignment([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackStudent = async () => {
    try {
      const response = await fetchFeedback();
      const data = response?.evaluations || [];
      setFeedback(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(`Could not fetch the data. error: ${error}`);
      setFeedback([]);
    }
  };

  useEffect(() => {
    fetchAssignment();
    fetchFeedbackStudent();
  }, []);

  const handleFileChange = (questionId, file) => {
    setFiles(prev => ({
      ...prev, [questionId]: file
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

    setUploading(prev => ({ ...prev, [questionId]: true }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("questionId", questionId);
    formData.append("assignmentId", assignmentId);

    try {
      const response = await uploadFiles(formData);
      if (response.success) {
        notify("File uploaded successfully.", 'success');
        await fetchFeedbackStudent();
        cancelUpload(questionId);
      } else {
        notify(response.message || "Upload failed.", "error");
      }
    } catch (err) {
      notify("An error occurred while uploading the file.", "error");
    } finally {
      setUploading(prev => ({ ...prev, [questionId]: false }));
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
        fetchAssignment();
      } else {
        notify(response.message || "Failed to submit assignment", "error");
      }
    } catch (error) {
      notify("An error occurred while submitting the assignment", "error");
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Assignments</h1>
          <p className="text-gray-500">View and submit your assignments</p>
        </div>
      </div>

      <div className="space-y-6">
        {assignment.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          assignment.map((item, index) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div
                className="p-6 flex items-center justify-between cursor-pointer bg-gray-50/50"
                onClick={() => toggleExpand(item._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {item.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 ml-9">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Due: {item.deadline?.split("T")[0] || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Created: {item.createdAt?.split("T")[0] || 'N/A'}
                    </span>
                  </div>
                </div>
                {expandedId === item._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>

              {expandedId === item._id && (
                <div className="p-6 border-t border-gray-100 bg-white">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{item.description}</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-gray-700">Questions</h4>
                    {(item.questions || []).map((qt, questionIndex) => {
                      const fileInputRef = React.createRef();
                      const questionFeedback = Array.isArray(feedback)
                        ? feedback.flatMap((fb) =>
                          (fb.marksPerQuestion || []).filter((obj) => obj.questionId === qt._id)
                        )
                        : [];

                      // Get parent evaluation for plagiarism and AI checks
                      const parentEval = Array.isArray(feedback)
                        ? feedback.find(f => f.marksPerQuestion?.some(m => m.questionId === qt._id))
                        : null;

                      return (
                        <div key={qt._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mt-0.5">
                                {questionIndex + 1}
                              </span>
                              <div>
                                <p className="text-gray-800 font-medium">{qt.questionText}</p>
                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                                  {qt.marks} marks
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="ml-9">
                            <div className="flex items-center gap-3 mb-4">
                              <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-600">Choose File</span>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(qt._id, e.target.files[0])}
                                />
                              </label>

                              {files[qt._id] && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <FileText size={14} />
                                  {files[qt._id].name}
                                </span>
                              )}

                              {files[qt._id] && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpload(item._id, qt._id)}
                                    disabled={uploading[qt._id]}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                  >
                                    {uploading[qt._id] ? "Uploading..." : "Upload"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      cancelUpload(qt._id);
                                      if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    disabled={uploading[qt._id]}
                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>

                            {questionFeedback.length > 0 && (
                              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-4">
                                <h5 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                                  <CheckCircle size={16} />
                                  Feedback
                                </h5>
                                {questionFeedback.map((fb, idx) => (
                                  <div key={idx} className="text-sm space-y-2">
                                    <div className="space-y-1">
                                      <p><span className="font-medium text-green-700">Marks Awarded:</span> {fb.marksAwarded || 'N/A'}</p>

                                      {fb.reasonForDeduction && fb.reasonForDeduction !== 'None' && (
                                        <p><span className="font-medium text-red-600">Reason for Deduction:</span> {fb.reasonForDeduction}</p>
                                      )}

                                      {fb.missingPoints && fb.missingPoints !== 'None' && (
                                        <p><span className="font-medium text-orange-600">Missing Points:</span> {fb.missingPoints}</p>
                                      )}

                                      <p><span className="font-medium text-green-700">Comment:</span> {fb.comments || 'No comments'}</p>
                                    </div>

                                    {/* Display plagiarism and AI detection results */}
                                    {parentEval && (
                                      <div className="mt-3 pt-3 border-t border-green-200 space-y-1">
                                        {parentEval.plagiarismScore !== undefined && (
                                          <p className={`font-medium ${parentEval.plagiarismScore > 10 ? 'text-red-600' : 'text-green-700'}`}>
                                            Plagiarism Score: {parentEval.plagiarismScore}%
                                          </p>
                                        )}

                                        {parentEval.isAIGenerated && (
                                          <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                                            <p className="font-semibold text-red-600">⚠ AI Generated Content Detected</p>
                                            <p className="text-red-600 text-xs mt-1">{parentEval.aiGeneratedFeedback}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleSubmitAssignment(item._id)}
                      disabled={submittingAssignment}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingAssignment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Submit Assignment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default S_fetchAssignments;