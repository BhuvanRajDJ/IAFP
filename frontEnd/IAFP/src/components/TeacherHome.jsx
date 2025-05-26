import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/TeacherHome.css";

function TeacherHome() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardHover = (index) => {
    setActiveCard(index);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  const navigationCards = [
    {
      emoji: "📝",
      title: "Create Assignment",
      description: "Create new assignments with questions and deadlines",
      path: "/createAssignment",
      color: "bg-blue-100 border-blue-500"
    },
    {
      emoji: "📋",
      title: "Manage Assignments",
      description: "View, edit, and delete existing assignments",
      path: "/manage-assignments",
      color: "bg-green-100 border-green-500"
    },
    {
      emoji: "👨‍🎓",
      title: "Student Tracker",
      description: "Track student submissions and performance",
      path: "/student-tracker",
      color: "bg-purple-100 border-purple-500"
    },
    // {
    //   emoji: "📊",
    //   title: "Department Analytics",
    //   description: "View analytics by department and batch",
    //   path: "/department-analytics",
    //   color: "bg-amber-100 border-amber-500"
    // },
    // {
    //   emoji: "📅",
    //   title: "Upcoming Deadlines",
    //   description: "See assignments with approaching deadlines",
    //   path: "/upcoming-deadlines",
    //   color: "bg-red-100 border-red-500"
    // },
    // {
    //   emoji: "✅",
    //   title: "Grade Submissions",
    //   description: "Review and grade student submissions",
    //   path: "/grade-submissions",
    //   color: "bg-teal-100 border-teal-500"
    // }
  ];

  return (
    <div className="teacher-home-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome, Teacher!</h1>
        <p className="welcome-subtitle">Manage your classroom assignments and track student progress</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-emoji">📚</span>
          <div className="stat-content">
            <h3>Active Assignments</h3>
            <p className="stat-number">12</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">👨‍🎓</span>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">156</p>
          </div>
        </div>
        {/* <div className="stat-card">
          <span className="stat-emoji">📊</span>
          <div className="stat-content">
            <h3>Submission Rate</h3>
            <p className="stat-number">87%</p>
          </div>
        </div> */}
        {/* <div className="stat-card">
          <span className="stat-emoji">⏰</span>
          <div className="stat-content">
            <h3>Pending Reviews</h3>
            <p className="stat-number">24</p>
          </div>
        </div> */}
      </div>

      <h2 className="section-title">Quick Navigation</h2>
      <div className="navigation-grid">
        {navigationCards.map((card, index) => (
          <Link 
            to={card.path} 
            key={index} 
            className={`navigation-card ${card.color} ${activeCard === index ? 'active-card' : ''}`}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
          >
            <div className="card-emoji">{card.emoji}</div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>

      {/* <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p className="activity-text">Assignment "Data Structures Quiz 2" created</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-text">Graded 15 submissions for "Python Basics"</p>
              <p className="activity-time">Yesterday</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-content">
              <p className="activity-text">Deadline extended for "Database Design"</p>
              <p className="activity-time">2 days ago</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="upcoming-deadlines">
        <h2 className="section-title">Upcoming Deadlines</h2>
        <div className="deadline-list">
          <div className="deadline-item urgent">
            <div className="deadline-date">
              <span className="date-number">28</span>
              <span className="date-month">Apr</span>
            </div>
            <div className="deadline-content">
              <h4>Algorithm Analysis</h4>
              <p>CSE - 3rd Year</p>
            </div>
            <div className="deadline-status">Tomorrow</div>
          </div>
          <div className="deadline-item">
            <div className="deadline-date">
              <span className="date-number">02</span>
              <span className="date-month">May</span>
            </div>
            <div className="deadline-content">
              <h4>Network Security Concepts</h4>
              <p>ISE - 4th Year</p>
            </div>
            <div className="deadline-status">5 days left</div>
          </div>
          <div className="deadline-item">
            <div className="deadline-date">
              <span className="date-number">10</span>
              <span className="date-month">May</span>
            </div>
            <div className="deadline-content">
              <h4>Machine Learning Basics</h4>
              <p>AIML - 2nd Year</p>
            </div>
            <div className="deadline-status">2 weeks left</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TeacherHome;