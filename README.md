# IAFP - Intelligent Assignment Feedback Platform

## Description

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to provide intelligent assignment feedback. It offers a comprehensive platform where teachers can efficiently create, manage, and evaluate assignments, while students can easily submit their work and receive automated feedback powered by AI.

## Features

- **User Authentication:** Secure registration and login functionalities for both teacher and student roles.

- **Assignment Management:**

  - Teachers have full control to create, update, and delete assignments, specifying details such as title, subject, deadline, and individual questions.

  - Students can conveniently view available assignments that are relevant to their specific department and academic year.

- **Assignment Submission:** Students can submit their completed assignments by uploading necessary files directly through the platform.

- **AI-Powered Evaluation:**

  - The platform integrates with the Gemini API to provide automated evaluation of student submissions.

  - It generates detailed feedback, assigns marks, and calculates plagiarism scores for each submission.

- **Feedback and Results:**

  - Teachers can access a comprehensive view of all submitted assignments and their corresponding AI-generated evaluations.

  - Students can track the status of their submissions and review the detailed feedback provided.

- **Google Drive Integration:** Utilizes the Google Drive API for secure and efficient storage and retrieval of assignment files.

- **Email Notifications:** Automated email notifications are sent to students upon the creation and subsequent updates of assignments.

## Technologies Used

- **Frontend:**

  - React.js

  - Vite

  - HTML

  - CSS

  - JavaScript

- **Backend:**

  - Node.js

  - Express.js

- **Database:**

  - MongoDB

- **AI Evaluation:**

  - Gemini API

- **File Storage:**

  - Google Drive API

- **Email Service:**

  - SendGrid API

- **Authentication:**

  - `jsonwebtoken`

  - `bcryptjs`

- **Middleware:**

  - `cors`

  - `body-parser`

  - `multer`

## Project Structure

IAFP/
├── backEnd/
│ ├── controllers/ # Handles application logic and interacts with models/services
│ ├── models/ # Defines Mongoose schemas for MongoDB data
│ ├── routes/ # Defines API endpoints and links them to controller functions
│ ├── config/ # Configuration files (e.g., database connection, Google AI setup)
│ ├── uploads/ # (Temporary) directory for storing uploaded files before Google Drive transfer
│ ├── .env # Environment variables (API keys, DB connection strings) - (Add to .gitignore)
│ ├── google-credentials.json # Google Cloud service account credentials - (Add to .gitignore, handle securely)
│ ├── index.js # Main entry point for the backend Express application
│ ├── package-lock.json # Records the exact dependency tree
│ └── package.json # Lists backend dependencies and scripts
│
└── frontEnd/IAFP/
├── node_modules/ # Installed frontend dependencies
├── public/ # Static assets (e.g., index.html, favicon)
├── src/ # React components, styles, and application logic
├── .env # Frontend environment variables - (Add to .gitignore)
├── .eslintrc.cjs # ESLint configuration for code linting
├── index.html # Main HTML file for the React application
├── package-lock.json # Records the exact frontend dependency tree
├── package.json # Lists frontend dependencies and scripts
├── README.md # Project documentation (this file)
└── vite.config.js # Vite build configuration file

## Setup Instructions

To get the project up and running on your local machine, follow these steps:

1. **Clone the Repository:**

git clone <your_repository_url>
cd IAFP

2.  **Backend Setup:** _ Navigate to the `backEnd` directory: `  cd backEnd     ` _ Install backend dependencies: `  npm install     ` _ **Environment Variables:** Create a `.env` file in the `backEnd` directory. **This file should NOT be committed to Git.** Add the following variables, replacing the placeholders with your actual values: `  PORT=3000                  # Or your desired port for the backend server   Mongodb_Url=<YOUR_MONGODB_URI>  # Your MongoDB connection string (e.g., from MongoDB Atlas or local)   SENDGRID_API_KEY=<YOUR_SENDGRID_API_KEY> # API key obtained from SendGrid   BEARER_TOKEN=<YOUR_GEMINI_API_KEY>  # Your API key for the Gemini API (or other AI service)   SECRET_KEY=<YOUR_JWT_SECRET_KEY>  # A strong, random secret key for JWT signing   SECRET_NUMBER=<YOUR_TEACHER_SECRET_NUMBER> # A secret number for teacher registration     ` _ **Google Cloud Credentials:** _ If your Google Drive integration requires a `google-credentials.json` file, obtain it from your Google Cloud Console. _ Place this `google-credentials.json` file in the `backEnd` directory. _ **Crucially, ensure this file is added to your `.gitignore` to prevent accidental public exposure.** For production, consider using Google Cloud Secret Manager or environment variables to inject these credentials securely. _ Start the backend server: `  npm start     ` 3. **Frontend Setup:** _ Navigate to the `frontEnd/IAFP` directory: `  cd ../frontEnd/IAFP     ` _ Install frontend dependencies: `  npm install     ` _ **Environment Variables (Frontend):** If your frontend needs access to environment variables (e.g., the backend API URL), create a `.env` file in the `frontEnd/IAFP` directory. **This file should NOT be committed to Git.** Remember to prefix variables with `VITE_` for Vite projects: `  VITE_API_BASE_URL=http://localhost:3000  # The URL where your backend server is running     ` _ Start the frontend development server: `  npm run dev     ` 4. **Database Setup:** _ Ensure you have a MongoDB instance running (either locally or a cloud service like MongoDB Atlas). _ Verify that the `Mongodb_Url` in your `backEnd/.env` file is correctly configured to connect to your MongoDB database. ## Important Security Notes _ **`.env` Files:** **NEVER** commit `.env` files containing sensitive information (API keys, database passwords, etc.) to your Git repository. Always ensure they are listed in your `.gitignore` files. _ **`google-credentials.json`:** This file grants access to your Google Cloud resources. Treat it with extreme caution. It must be in `.gitignore`. For production deployments, transfer it securely to your server and set restrictive file permissions (e.g., `chmod 400`). A more robust solution is to use Google Cloud Secret Manager or environment variables for these credentials. _ **Production Environment:** For deploying to a production environment, always use environment variables set directly on your hosting platform or server, rather than relying on `.env` files. _ **Input Validation and Sanitization:** Implement robust input validation on both the frontend and backend to prevent common web vulnerabilities such as Cross-Site Scripting (XSS) and SQL Injection. _ **Authentication and Authorization:** Ensure strong authentication and authorization mechanisms are in place to protect your API endpoints and sensitive data. _ **Dependency Management:** Regularly update your project dependencies to mitigate known security vulnerabilities. Utilize tools like `npm audit` or `yarn audit` to scan for and address security issues. _ **HTTPS:** Always use HTTPS for all communication in production to encrypt data in transit. ## API Endpoints Here's a comprehensive list of the API endpoints available in this application: **User Authentication and Management (`userRouter.js`)** _ `POST /signup` - Registers a new student. _ `POST /teachersignup` - Registers a new teacher. _ `POST /student_login` - Authenticates a student and returns a JWT. _ `POST /teacher_login` - Authenticates a teacher and returns a JWT. _ `GET /students-by-department` - (Requires authentication) Fetches students within the teacher's department. **Assignment Management (`assignmentRouter.js`)** _ `POST /teacher/assignment` - (Requires authentication) Creates a new assignment. _ `GET /teacher/assignment` - (Requires authentication) Fetches assignments created by the logged-in teacher. _ `PUT /teacher/assignment/:id` - (Requires authentication) Updates an assignment with the given ID. _ `DELETE /teacher/assignment/:id` - (Requires authentication) Deletes an assignment with the given ID. _ `POST /submitAssignment` - (Requires authentication, file upload) Allows a student to submit an assignment. Expects a file in the request field named "file". _ `GET /submittedAssignments` - (Requires authentication) Fetches all submitted assignments. _ `GET /studentSubmittedAssignments` - (Requires authentication) Fetches assignments submitted by a specific student. _ `DELETE /delete-submission/:submissionId/:questionId` - (Requires authentication) Deletes a student's submission for a specific question within an assignment. _ `GET /student-evaluations` - (Requires authentication) Fetches evaluations for the logged-in student. _ `GET /fetchAllstudent-evaluations` - (Requires authentication) Fetches all student evaluations (for teachers). _ `GET /fetchAssignment_Student` - (Requires authentication) Fetches assignments for students based on their department and year. _ `POST /assignmentSubmitionStatus` - (Requires authentication) Updates the submission status of an assignment. **File Uploads (`uploadRoutes.js`)** \* `POST /api/upload` - (Requires authentication, file upload) Handles file uploads. Expects a file in the request field named "assignment". ## Contributing We welcome contributions to the IAFP project! If you'd like to contribute, please follow these steps: 1. Fork the repository. 2. Create a new branch for your feature or bug fix. 3. Make your changes and ensure tests pass. 4. Commit your changes with clear, concise messages. 5. Push your branch to your fork. 6. Open a pull request to the main repository, describing your changes in detail. ## License This project is licensed under the [MIT License](LICENSE.md).
