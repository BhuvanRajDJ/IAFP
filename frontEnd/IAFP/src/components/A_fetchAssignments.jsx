import React, { useEffect, useState } from 'react';
import { fetchAssignment, deleteAssignment, updateAssignement } from '../services/Api';
import { notify } from '../services/Utils';
import { Edit2, Trash2, ChevronDown, ChevronUp, PlusCircle, Save, BookOpen, Calendar, Layers, FileText, AlertCircle } from 'lucide-react';

function A_fetchAssignments() {
  const [assignment, setAssignment] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    year: "",
    description: "",
    department: "",
    questions: [{ questionText: "", marks: "" }],
    deadline: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const response = await fetchAssignment();
      setAssignment(response.data.assignments);
    } catch (error) {
      console.log(`Could not fetch the data. error:${error}`);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

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
    document.querySelector('.update-form').scrollIntoView({ behavior: 'smooth' });
  };

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

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await updateAssignement(editingId, formData);
        notify(response.message, 'success');
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
      } else {
        notify("No assignment selected for update.", 'error');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update assignment";
      notify(errorMsg, 'error');
    }
  };

  const deleteAssignments = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const response = await deleteAssignment(id);
        if (response.data.success) {
          notify(response.data.message, 'success');
          fetchAssignments();
        } else {
          notify(response.data.message, 'error');
        }
      } catch (error) {
        notify("Failed to delete the task", "error");
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Assignments</h1>
          <p className="text-gray-500">View, edit, and delete existing assignments</p>
        </div>
      </div>

      <div className="grid gap-6">
        {assignment.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div
              className="p-6 flex items-center justify-between cursor-pointer bg-gray-50/50"
              onClick={() => toggleExpand(item._id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {item.subject}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    {item.department}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Due: {item.deadline.split("T")[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers size={14} />
                    Batch: {item.year}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteAssignments(item._id); }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                {expandedId === item._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === item._id && (
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{item.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Questions ({item.questions.length})</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                          <th className="px-4 py-3 w-16">#</th>
                          <th className="px-4 py-3">Question</th>
                          <th className="px-4 py-3 w-24 text-right">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {item.questions.map((qt, index) => (
                          <tr key={qt._id || index} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                            <td className="px-4 py-3 text-gray-800">{qt.questionText}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-600">{qt.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {assignment.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="text-gray-500 mt-1">Create your first assignment to get started.</p>
          </div>
        )}
      </div>

      {editingId && (
        <div className="update-form bg-white rounded-xl shadow-lg border border-blue-100 p-8 mt-12 ring-4 ring-blue-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Edit2 size={24} className="text-blue-600" />
              Update Assignment
            </h2>
            <button
              onClick={() => setEditingId(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Batch</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <PlusCircle size={16} /> Add Question
                </button>
              </div>

              {formData.questions.map((q, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full border text-xs font-medium text-gray-500 shrink-0 mt-2">
                    {index + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9">
                      <input
                        type="text"
                        name="questionText"
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(index, e)}
                        placeholder="Question"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="number"
                        name="marks"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(index, e)}
                        placeholder="Marks"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors mt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default A_fetchAssignments;