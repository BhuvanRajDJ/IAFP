import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, BookOpen, PlusCircle, List, BarChart2 } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine role based on token presence or path (simple heuristic for now)
    const isTeacher = !!localStorage.getItem('TeacherToken');
    const isStudent = !!localStorage.getItem('StudentToken');

    const handleLogout = () => {
        localStorage.removeItem('StudentToken');
        localStorage.removeItem('TeacherToken');
        localStorage.removeItem('user'); // Assuming user details might be stored here
        navigate('/student_Login'); // Default redirect
    };

    const isActive = (path) => location.pathname === path;

    const LinkItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(to)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 shadow-xl">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    IAFP
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {isStudent && (
                    <>
                        <LinkItem to="/Home" icon={Home} label="Dashboard" />
                        <LinkItem to="/studentAssignment" icon={BookOpen} label="Assignments" />
                    </>
                )}

                {isTeacher && (
                    <>
                        <LinkItem to="/teacher_Home" icon={Home} label="Dashboard" />
                        <LinkItem to="/createAssignment" icon={PlusCircle} label="Create Assignment" />
                        <LinkItem to="/manage-assignments" icon={List} label="Manage Assignments" />
                        <LinkItem to="/student-tracker" icon={BarChart2} label="Student Tracker" />
                    </>
                )}

                {/* Show something if no role is detected, or maybe nothing */}
                {!isStudent && !isTeacher && (
                    <div className="text-gray-500 text-sm px-4">Please log in</div>
                )}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
