import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Calendar, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { fetchAssignments, fetchFeedback } from '../services/Api';

function StudentHomePage() {
  const [assignments, setAssignments] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student's assignments
        const assignmentsRes = await fetchAssignments();
        if (assignmentsRes?.success) {
          setAssignments(assignmentsRes.assignments || []);
        }

        // Fetch student's evaluations
        const evaluationsRes = await fetchFeedback();
        if (evaluationsRes?.success) {
          setEvaluations(evaluationsRes.evaluations || []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();

    // Get pending assignments (deadline not passed)
    const pendingAssignments = assignments.filter(assignment =>
      new Date(assignment.deadline) > now
    );

    // Get available assignments count
    const availableCount = assignments.length;

    // Calculate average grade from published evaluations
    const publishedEvaluations = evaluations.filter(evaluation => evaluation.isPublished);
    const averageGrade = publishedEvaluations.length > 0
      ? (publishedEvaluations.reduce((sum, evaluation) => sum + evaluation.totalMarks, 0) / publishedEvaluations.length).toFixed(1)
      : 0;

    // Count unique subjects
    const subjects = new Set(assignments.map(a => a.subject));
    const totalSubjects = subjects.size;

    return {
      pending: pendingAssignments.length,
      available: availableCount,
      averageGrade,
      totalSubjects,
      pendingAssignments
    };
  };

  // Get assignment history with grades
  const getAssignmentHistory = () => {
    return evaluations
      .filter(evaluation => evaluation.isPublished)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); // Show last 5
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = calculateStats();
  const history = getAssignmentHistory();

  const metricsCards = [
    { label: 'Pending Assignments', value: stats.pending, icon: Clock, color: 'bg-orange-500' },
    { label: 'Available Assignments', value: stats.available, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Average Grade', value: `${stats.averageGrade}%`, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Total Subjects', value: stats.totalSubjects, icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-500">Track your assignments, grades, and academic performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${metric.color} text-white`}>
              <metric.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            <Link to="/studentAssignment" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.pendingAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No pending assignments. Great job!</p>
              </div>
            ) : (
              stats.pendingAssignments.slice(0, 5).map((assignment, index) => {
                const daysUntil = getDaysUntilDeadline(assignment.deadline);
                const isUrgent = daysUntil <= 2;

                return (
                  <div
                    key={assignment._id || index}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{assignment.title}</p>
                        <p className="text-xs text-gray-500">{assignment.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${isUrgent
                          ? 'text-red-600 bg-red-100'
                          : 'text-yellow-600 bg-yellow-100'
                        }`}>
                        {daysUntil === 0 ? 'Today' :
                          daysUntil === 1 ? 'Tomorrow' :
                            `${daysUntil} days`}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(assignment.deadline)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Assignment History / Recent Grades */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Grades</h2>
            <Link to="/studentAssignment" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View History →
            </Link>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No grades available yet</p>
              </div>
            ) : (
              history.map((evaluation, index) => {
                const assignment = assignments.find(a =>
                  a._id === evaluation.assignmentSubmissionId?.assignmentId?._id
                );

                return (
                  <div
                    key={evaluation._id || index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">
                        {assignment?.title || 'Assignment'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-600">
                          {evaluation.totalMarks}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{assignment?.subject || 'Subject'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(evaluation.createdAt)}
                      </span>
                    </div>
                    {evaluation.aiGeneratedFeedback && (
                      <p className="mt-2 text-xs text-gray-600 italic line-clamp-1">
                        {evaluation.aiGeneratedFeedback}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Available Assignments */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Available Assignments</h2>
          <Link to="/studentAssignment" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No assignments available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.slice(0, 6).map((assignment, index) => {
              const deadline = new Date(assignment.deadline);
              const now = new Date();
              const isPending = deadline > now;
              const daysUntil = getDaysUntilDeadline(assignment.deadline);

              return (
                <Link
                  to="/studentAssignment"
                  key={assignment._id || index}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{assignment.title}</h3>
                    {isPending && (
                      <span className={`text-xs px-2 py-1 rounded-full ${daysUntil <= 2
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                        }`}>
                        {daysUntil <= 0 ? 'Due' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{assignment.subject}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(assignment.deadline)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {assignment.questions?.length || 0} Qs
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/studentAssignment"
          className="block p-6 rounded-xl border border-blue-200 bg-blue-50 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <BookOpen size={24} className="text-blue-600 mb-3" />
          <h3 className="text-lg font-bold mb-2 text-gray-800">My Assignments</h3>
          <p className="text-sm text-gray-600">View and submit all your assignments</p>
        </Link>

        <Link
          to="/studentAssignment"
          className="block p-6 rounded-xl border border-purple-200 bg-purple-50 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <TrendingUp size={24} className="text-purple-600 mb-3" />
          <h3 className="text-lg font-bold mb-2 text-gray-800">Performance</h3>
          <p className="text-sm text-gray-600">Track your grades and progress</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentHomePage;