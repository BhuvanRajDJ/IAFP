import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Teacher_LogIn } from "../services/Api";
import { Mail, Lock, LogIn, ArrowRight, BookOpen, GraduationCap } from "lucide-react";

function SignInTeacher() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await Teacher_LogIn(formData);
            if (response.data && response.data.success) {
                localStorage.setItem("TeacherToken", response.data.token);
                navigate("/teacher_Home");
                console.log("Move to next page");
            } else {
                setError(response.data ? response.data.message : "Sign-in failed. Try again!");
            }
        } catch (error) {
            setError("Sign-in failed. Try again!");
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark text-white font-display">
            {/* Abstract background elements */}
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute -right-24 top-1/4 h-56 w-56 rounded-full bg-[#8A2BE2]/20 blur-3xl"></div>
            <div className="absolute bottom-0 -left-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>

            <main className="relative z-10 flex flex-grow flex-col lg:flex-row">
                {/* Left Side: Branding */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <h1 className="text-white tracking-light text-[48px] font-bold leading-tight">Inspire the Future.</h1>
                    <p className="text-white/80 text-lg font-normal leading-normal mt-4">Manage courses, grade assignments, and mentor students.</p>

                    <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <BookOpen size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Manage Assignments</h3>
                                <p className="text-white/60 text-sm">Create and distribute work effortlessly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <GraduationCap size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Track Student Progress</h3>
                                <p className="text-white/60 text-sm">Monitor performance with AI insights</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex w-full flex-col justify-center p-4 lg:w-1/2 lg:items-center">
                    <div className="w-full max-w-md rounded-xl glassmorphism p-6 md:p-8">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Inspire the Future.</h1>
                            <p className="text-white/80 text-base font-normal leading-normal mt-1">Manage courses, grade assignments, and mentor students.</p>
                        </div>

                        <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-3 pt-2">Teacher Portal</h1>

                        {/* Role Toggle */}
                        <div className="flex py-3 mb-4">
                            <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-input-dark p-1">
                                <Link to="/student_Login" className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-text-muted hover:text-white text-sm font-medium leading-normal transition-colors">
                                    <span className="truncate">I am a Student</span>
                                </Link>
                                <div className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 bg-primary shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white text-sm font-medium leading-normal transition-colors cursor-default">
                                    <span className="truncate">I am a Teacher</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <label className="flex flex-col">
                                <p className="text-white text-sm font-medium leading-normal pb-2">Email</p>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-dark h-12 pl-11 pr-4 placeholder:text-text-muted/50 text-sm font-normal"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                            </label>

                            <label className="flex flex-col">
                                <p className="text-white text-sm font-medium leading-normal pb-2">Password</p>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-dark h-12 pl-11 pr-4 placeholder:text-text-muted/50 text-sm font-normal"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </label>

                            <button className="flex items-center justify-center h-12 w-full rounded-lg bg-primary text-white text-base font-bold mt-4 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25" type="submit">
                                <span>Sign In</span>
                                <ArrowRight size={20} className="ml-2" />
                            </button>

                            <p className="text-center text-sm text-white/60 mt-2">
                                Don't have an account? <Link className="font-medium text-primary hover:text-primary/80 transition-colors" to="/teacher_signup">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignInTeacher;