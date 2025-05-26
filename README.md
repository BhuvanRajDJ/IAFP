# IAFP - Intelligent Assignment Feedback Platform

## Description

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to provide intelligent assignment feedback. It offers a comprehensive platform where teachers can efficiently create, manage, and evaluate assignments, while students can easily submit their work and receive automated feedback powered by AI.

## Features

- **User Authentication:** Secure registration and login functionalities for both teacher and student roles.

- **Assignment Management:**
  - Teachers can create, update, and delete assignments with details like title, subject, deadline, and questions.
  - Students can view assignments relevant to their department and academic year.

- **Assignment Submission:**
  - Students can submit assignments with file uploads.

- **AI-Powered Evaluation:**
  - Integrated with Gemini API to automatically evaluate assignments.
  - Generates marks, plagiarism scores, and detailed feedback.

- **Teacher & Student Dashboard:**
  - Teachers review, override, and monitor feedback.
  - Students track submission statuses and view feedback.

- **Google Drive Integration:**
  - Stores files securely using Google Drive API.

- **Email Notifications:**
  - Automated emails sent via SendGrid on assignment creation/updates.

## Technologies Used

### Frontend
- React.js
- Vite
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### AI Evaluation
- Gemini API

### File Storage
- Google Drive API

### Email Service
- SendGrid API

### Authentication
- jsonwebtoken
- bcryptjs

### Middleware
- cors
- body-parser
- multer

## Project Structure

```
IAFP/
├── backEnd/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── uploads/
│   ├── .env
│   ├── google-credentials.json
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
└── frontEnd/IAFP/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── .env
    ├── .eslintrc.cjs
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your_repository_url>
cd IAFP
```

### 2. Backend Setup
```bash
cd backEnd
npm install
```

Create a `.env` file:
```
PORT=3000
Mongodb_Url=<YOUR_MONGODB_URI>
SENDGRID_API_KEY=<YOUR_SENDGRID_API_KEY>
BEARER_TOKEN=<YOUR_GEMINI_API_KEY>
SECRET_KEY=<YOUR_JWT_SECRET_KEY>
SECRET_NUMBER=<YOUR_TEACHER_SECRET_NUMBER>
```

Place your Google Cloud service key:
- File: `google-credentials.json`
- Location: `backEnd/`
- Add to `.gitignore`

Start backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontEnd/IAFP
npm install
```

Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
```

### 4. Database Setup
Ensure MongoDB is running locally or on the cloud. Confirm `Mongodb_Url` is valid.

## Security Notes

- Do not commit `.env` or `google-credentials.json`
- Use secure secret storage (e.g., Google Secret Manager) in production
- Enable HTTPS
- Use strong validation, token auth, and secure CORS settings

## API Endpoints

### User Management
- `POST /signup`
- `POST /teachersignup`
- `POST /student_login`
- `POST /teacher_login`
- `GET /students-by-department`

### Assignment Management
- `POST /teacher/assignment`
- `GET /teacher/assignment`
- `PUT /teacher/assignment/:id`
- `DELETE /teacher/assignment/:id`
- `POST /submitAssignment`
- `GET /submittedAssignments`
- `GET /studentSubmittedAssignments`
- `DELETE /delete-submission/:submissionId/:questionId`
- `GET /student-evaluations`
- `GET /fetchAllstudent-evaluations`
- `GET /fetchAssignment_Student`
- `POST /assignmentSubmitionStatus`

### File Uploads
- `POST /api/upload`

## Contributing

1. Fork the repo
2. Create a feature branch
3. Write and test code
4. Submit a PR

## License
MIT License
