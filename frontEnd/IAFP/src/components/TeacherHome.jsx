import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  FileText
} from 'lucide-react';
import { fetchAssignment, submittedAssignments, students_by_department } from '../services/Api';

function TeacherHome() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedBatches, setExpandedBatches] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data
        const [assignmentsRes, submissionsRes, studentsRes] = await Promise.all([
          fetchAssignment(),
          submittedAssignments(),
          students_by_department()
        ]);

        if (assignmentsRes.data?.success) {
          setAssignments(assignmentsRes.data.assignments || []);
        }

        if (submissionsRes.data?.success) {
          setSubmissions(submissionsRes.data.submissions || []);
        }

        if (studentsRes.data?.success) {
          // Parse students data if it's in string format
          const parseStudentData = (studentString) => {
            const studentStrings = studentString.match(/\{[^}]+\}/g) || [];
            return studentStrings.map(str => {
              const name = str.match(/name: '([^']+)'/) || str.match(/name: "([^"]+)"/);
              const department = str.match(/department: '([^']+)'/) || str.match(/department: "([^"]+)"/);
              const year = str.match(/year: '([^']+)'/) || str.match(/year: "([^"]+)"/);
              const id = str.match(/_id: new ObjectId\('([^']+)'\)/) || str.match(/_id: '([^']+)'/) || str.match(/_id: "([^"]+)"/);

              return {
                _id: id ? id[1] : `student-${Math.random().toString(36).substr(2, 9)}`,
                name: name ? name[1] : 'Unknown',
                department: department ? department[1] : 'Unknown',
                year: year ? year[1] : 'Unknown'
              };
            });
          };

          const parsedStudents = typeof studentsRes.data.students === 'string'
            ? parseStudentData(studentsRes.data.students)
            : studentsRes.data.students;

          setStudents(parsedStudents || []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Organize data by department and batch
  const organizeByDepartmentAndBatch = () => {
    const structure = {};

    // Group assignments by department and year
    assignments.forEach(assignment => {
      const dept = assignment.department || 'Unknown';
      const batch = assignment.year || 'Unknown';

      if (!structure[dept]) {
        structure[dept] = {};
      }

      if (!structure[dept][batch]) {
        structure[dept][batch] = {
          completed: [],
          pending: [],
          students: students.filter(s => s.department === dept && s.year === batch)
        };
      }

      // Check if deadline is passed
      const deadline = new Date(assignment.deadline);
      const now = new Date();

      if (deadline < now) {
        structure[dept][batch].completed.push(assignment);
      } else {
        structure[dept][batch].pending.push(assignment);
      }
    });

    return structure;
  };

  const getSubmissionCount = (assignmentId) => {
    return submissions.filter(sub => sub.assignmentId._id === assignmentId).length;
  };

  const toggleDepartment = (dept) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  const toggleBatch = (dept, batch) => {
    const key = `${dept}-${batch}`;
    setExpandedBatches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const departmentData = organizeByDepartmentAndBatch();
  const departments = Object.keys(departmentData);

  // Calculate stats
  const totalAssignments = assignments.length;
  const totalStudents = students.length;
  const pendingReviews = submissions.filter(sub => !sub.isCompleted).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-500">Monitor assignments and student progress by department and batch</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500 text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Assignments</p>
            <p className="text-2xl font-bold text-gray-800">{totalAssignments}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500 text-white">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-500 text-white">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Reviews</p>
            <p className="text-2xl font-bold text-gray-800">{pendingReviews}</p>
          </div>
        </div>
      </div>

      {/* Department/Batch/Assignment Hierarchy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Assignments by Department & Batch</h2>
          <p className="text-sm text-gray-500">Organized by deadlines - Completed vs Pending</p>
        </div>

        <div className="divide-y divide-gray-100">
          {departments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No assignments found. Create your first assignment to get started.</p>
            </div>
          ) : (
            departments.map(dept => (
              <div key={dept}>
                {/* Department Header */}
                <button
                  onClick={() => toggleDepartment(dept)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedDepts[dept] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span className="font-semibold text-gray-800">{dept} Department</span>
                    <span className="text-sm text-gray-500">
                      ({Object.keys(departmentData[dept]).length} batch{Object.keys(departmentData[dept]).length !== 1 ? 'es' : ''})
                    </span>
                  </div>
                </button>

                {/* Batches */}
                {expandedDepts[dept] && (
                  <div className="bg-gray-50">
                    {Object.keys(departmentData[dept]).map(batch => {
                      const batchKey = `${dept}-${batch}`;
                      const batchData = departmentData[dept][batch];
                      const totalBatchAssignments = batchData.completed.length + batchData.pending.length;

                      return (
                        <div key={batchKey} className="border-t border-gray-200">
                          {/* Batch Header */}
                          <button
                            onClick={() => toggleBatch(dept, batch)}
                            className="w-full p-4 pl-12 flex items-center justify-between hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {expandedBatches[batchKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              <Calendar size={18} className="text-blue-600" />
                              <span className="font-medium text-gray-700">Batch {batch}</span>
                              <span className="text-sm text-gray-500">
                                ({batchData.students.length} students, {totalBatchAssignments} assignments)
                              </span>
                            </div>
                          </button>

                          {/* Assignment Columns */}
                          {expandedBatches[batchKey] && (
                            <div className="p-4 pl-16 bg-white">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pending Assignments Column */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Clock size={18} className="text-orange-600" />
                                    <h4 className="font-semibold text-gray-800">
                                      Pending ({batchData.pending.length})
                                    </h4>
                                  </div>
                                  <div className="space-y-3">
                                    {batchData.pending.length === 0 ? (
                                      <p className="text-sm text-gray-500 italic">No pending assignments</p>
                                    ) : (
                                      batchData.pending.map(assignment => (
                                        <div
                                          key={assignment._id}
                                          className="p-4 border border-orange-200 rounded-lg bg-orange-50 hover:shadow-md transition-shadow"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-medium text-gray-800">{assignment.title}</h5>
                                            <Link
                                              to="/student-tracker"
                                              className="text-blue-600 hover:text-blue-700"
                                            >
                                              <Eye size={18} />
                                            </Link>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1 text-orange-600">
                                              <Clock size={14} />
                                              Due: {formatDate(assignment.deadline)}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600">
                                              <Users size={14} />
                                              {getSubmissionCount(assignment._id)} submitted
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>

                                {/* Completed Assignments Column */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    <h4 className="font-semibold text-gray-800">
                                      Completed ({batchData.completed.length})
                                    </h4>
                                  </div>
                                  <div className="space-y-3">
                                    {batchData.completed.length === 0 ? (
                                      <p className="text-sm text-gray-500 italic">No completed assignments</p>
                                    ) : (
                                      batchData.completed.map(assignment => (
                                        <div
                                          key={assignment._id}
                                          className="p-4 border border-green-200 rounded-lg bg-green-50 hover:shadow-md transition-shadow"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-medium text-gray-800">{assignment.title}</h5>
                                            <Link
                                              to="/student-tracker"
                                              className="text-blue-600 hover:text-blue-700"
                                            >
                                              <Eye size={18} />
                                            </Link>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1 text-green-600">
                                              <CheckCircle2 size={14} />
                                              Closed: {formatDate(assignment.deadline)}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600">
                                              <Users size={14} />
                                              {getSubmissionCount(assignment._id)} submitted
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/createAssignment"
          className="block p-6 rounded-xl border border-blue-200 bg-blue-50 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <BookOpen size={24} className="text-blue-600 mb-3" />
          <h3 className="text-lg font-bold mb-2 text-gray-800">Create Assignment</h3>
          <p className="text-sm text-gray-600">Create new assignments with questions and deadlines</p>
        </Link>

        <Link
          to="/manage-assignments"
          className="block p-6 rounded-xl border border-green-200 bg-green-50 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <FileText size={24} className="text-green-600 mb-3" />
          <h3 className="text-lg font-bold mb-2 text-gray-800">Manage Assignments</h3>
          <p className="text-sm text-gray-600">View, edit, and delete existing assignments</p>
        </Link>

        <Link
          to="/student-tracker"
          className="block p-6 rounded-xl border border-purple-200 bg-purple-50 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <Users size={24} className="text-purple-600 mb-3" />
          <h3 className="text-lg font-bold mb-2 text-gray-800">Student Tracker</h3>
          <p className="text-sm text-gray-600">Track student submissions and performance</p>
        </Link>
      </div>
    </div>
  );
}

export default TeacherHome;