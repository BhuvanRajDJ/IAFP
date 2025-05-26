#   IAFP - Intelligent Assignment Feedback Platform

##   Description

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) to facilitate intelligent assignment feedback. It enables teachers to create and manage assignments, students to submit their work, and leverages AI for automated evaluation and feedback.

##   Features

* User Authentication: Secure registration and login for both teachers and students.
* Assignment Management:
     * Teachers can create, update, and delete assignments with details like title, subject, deadline, and questions.
     * Students can view available assignments based on their department and year.
* Assignment Submission: Students can submit assignments by uploading files.
* AI-Powered Evaluation:
     * Integrates with the Gemini API to automatically evaluate student submissions.
     * Provides feedback, marks, and plagiarism scores.
* Feedback and Results:
     * Teachers can view submitted assignments and AI-generated evaluations.
     * Students can view their submission status and feedback.
* Google Drive Integration: Utilizes Google Drive for file storage and retrieval.
* Email Notifications: Sends email notifications to students upon assignment creation and updates.

##   Technologies Used

* Frontend:
     * React.js
     * Vite
     * HTML
     * CSS
     * JavaScript
* Backend:
     * Node.js
     * Express.js
* Database:
     * MongoDB
* AI Evaluation:
     * Gemini API
* File Storage:
     * Google Drive API
* Email Service:
     * SendGrid API
* Authentication:
     * jsonwebtoken
     * bcryptjs
* Middleware:
     * cors
     * body-parser
     * multer

##   Project Structure
It looks like you're asking how to create a README file for your project. A README file is essential for documenting your project and providing instructions to others (or your future self) on how to use it. Here's a breakdown of how to create one and what to include, tailored to your MERN stack project.

1. Create the README File

Using a Text Editor:
Open your favorite text editor (VS Code, Sublime Text, Notepad++, etc.).
Create a new file.
Save it as README.md (the .md extension is important for Markdown formatting) in the root directory of your project (the main IAFP directory in your file structure).
Using the Command Line:
Navigate to your project's root directory in your terminal:
Bash

cd D:\Major Project\VVIET final one\IAFP
Create the file using a command like:
(Linux/macOS) touch README.md
(Windows) type nul > README.md
2.  Choose a Format (Markdown)

.md indicates that you'll be using Markdown. Markdown is a lightweight and easy-to-read formatting language. GitHub automatically renders Markdown files nicely.
3.  Essential Sections and Content

Here's a template of what to include in your README.md, customized for your MERN stack project:

Markdown

#   IAFP - Intelligent Assignment Feedback Platform

##   Description

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) to facilitate intelligent assignment feedback. It enables teachers to create and manage assignments, students to submit their work, and leverages AI for automated evaluation and feedback.

##   Features

* User Authentication: Secure registration and login for both teachers and students.
* Assignment Management:
     * Teachers can create, update, and delete assignments with details like title, subject, deadline, and questions.
     * Students can view available assignments based on their department and year.
* Assignment Submission: Students can submit assignments by uploading files.
* AI-Powered Evaluation:
     * Integrates with the Gemini API to automatically evaluate student submissions.
     * Provides feedback, marks, and plagiarism scores.
* Feedback and Results:
     * Teachers can view submitted assignments and AI-generated evaluations.
     * Students can view their submission status and feedback.
* Google Drive Integration: Utilizes Google Drive for file storage and retrieval.
* Email Notifications: Sends email notifications to students upon assignment creation and updates.

##   Technologies Used

* Frontend:
     * React.js
     * Vite
     * HTML
     * CSS
     * JavaScript
* Backend:
     * Node.js
     * Express.js
* Database:
     * MongoDB
* AI Evaluation:
     * Gemini API
* File Storage:
     * Google Drive API
* Email Service:
     * SendGrid API
* Authentication:
     * jsonwebtoken
     * bcryptjs
* Middleware:
     * cors
     * body-parser
     * multer

##   Project Structure

IAFP/
├── backEnd/
│   ├── controllers/         # Handles application logic
│   ├── models/              # Defines data schemas (MongoDB)
│   ├── routes/              # Defines API endpoints
│   ├── config/              # Configuration files (DB, Google AI, etc.)
│   ├── uploads/             # (Temporary) storage for uploaded files
│   ├── .env                 # Environment variables (API keys, DB connection) - (Add to .gitignore)
│   ├── google-credentials.json # Google Cloud credentials - (Add to .gitignore, handle securely)
│   ├── index.js             # Entry point for the backend application
│   ├── package-lock.json
│   └── package.json
│
└── frontEnd/IAFP/
│   ├── node_modules/
│   ├── public/              # Static assets (index.html)
│   ├── src/                 # React components and logic
│   ├── .env                 # Environment variables (API keys) - (Add to .gitignore)
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
|   └── vite.config.js
└── README.md            # Project documentation (this file)

##   Setup Instructions

1.  Clone the Repository:

     ```bash
     git clone <your_repository_url>
     cd IAFP
     ```

2.  Backend Setup:

     * Navigate to the `backEnd` directory:

         ```bash
         cd backEnd
         ```

     * Install dependencies:

         ```bash
         npm install
         ```

     * Create a `.env` file in the `backEnd` directory and add the following environment variables:

         ```
         PORT=3000                  # Or your desired port
         Mongodb_Url=<YOUR_MONGODB_URI>  # MongoDB connection string
         SENDGRID_API_KEY=<YOUR_SENDGRID_API_KEY>
         BEARER_TOKEN=<YOUR_GEMINI_API_KEY>  # OpenAI API Key (check if still used)
         SECRET_KEY=<YOUR_JWT_SECRET_KEY>  # Secret key for JWT
         SECRET_NUMBER=<YOUR_TEACHER_SECRET_NUMBER> # Secret number for teacher registration
         ```

         Note: Replace the `<...>` placeholders with your actual values. DO NOT COMMIT THIS `.env` FILE!

     * Google Cloud Credentials:
         * If using `google-credentials.json`, obtain the necessary credentials from your Google Cloud Console.
         * Place the `google-credentials.json` file in the `backEnd` directory.
         * Securely handle this file! Add it to `.gitignore` and transfer it securely to your server if needed.
         * Consider using Google Cloud Secret Manager or environment variables for credentials instead of storing the file.

     * Start the backend server:

         ```bash
         npm start
         ```

3.  Frontend Setup:

     * Navigate to the `frontEnd/IAFP` directory:

         ```bash
         cd frontEnd/IAFP
         ```

     * Install dependencies:

         ```bash
         npm install
         ```

     * Create a `.env` file in the `frontEnd/IAFP` directory if you have any frontend-specific environment variables:

         ```
         # Example (if needed)
         VITE_API_BASE_URL=http://localhost:3000  # Backend API URL
         ```

         Note: Prefix frontend environment variables with `VITE_` in React/Vite projects. DO NOT COMMIT THIS `.env` FILE!

     * Start the frontend development server:

         ```bash
         npm run dev
         ```

4.  Database Setup:

     * Ensure you have MongoDB installed and running.
     * Update the `Mongodb_Url` in the `backEnd/.env` file with your MongoDB connection string.

##   Important Security Notes

* `.env` Files: NEVER commit `.env` files containing sensitive information (API keys, database passwords, etc.) to your Git repository. Always add them to `.gitignore`.
* `google-credentials.json`: Handle this file with extreme care. It grants access to your Google Cloud resources. Add it to `.gitignore`, transfer it securely if necessary, and restrict permissions on your server. Consider using alternative secure methods for handling credentials (e.g., Google Cloud Secret Manager).
* Production Environment: For production deployments, use environment variables set directly on your server or hosting platform instead of `.env` files.
* Input Validation and Sanitization: Implement robust input validation and sanitization on both the frontend and backend to prevent security vulnerabilities like cross-site scripting (XSS) and SQL injection.
* Authentication and Authorization: Use strong authentication and authorization mechanisms to protect your API endpoints and data.
* Dependency Management: Keep your project dependencies up to date to avoid known security vulnerabilities. Use `npm audit` or `yarn audit` to check for vulnerabilities.

##   API Endpoints

_(Provide a list of your API endpoints with their methods, routes, and descriptions. Refer to your `routes` directory for details.)_

Example:


User Authentication and Management (userRouter.js)

* `POST /signup` - Registers a new student.
* `POST /teachersignup` - Registers a new teacher.
* `POST /student_login` - Authenticates a student and returns a JWT.
* `POST /teacher_login` - Authenticates a teacher and returns a JWT.
* `GET /students-by-department` - (Requires authentication) Fetches students within the teacher's department.

Assignment Management (assignmentRouter.js)

* `POST /teacher/assignment` - (Requires authentication) Creates a new assignment.
* `GET /teacher/assignment` - (Requires authentication) Fetches assignments created by the logged-in teacher.
* `PUT /teacher/assignment/:id` - (Requires authentication) Updates an assignment with the given ID.
* `DELETE /teacher/assignment/:id` - (Requires authentication) Deletes an assignment with the given ID.
* `POST /submitAssignment` - (Requires authentication, file upload) Allows a student to submit an assignment. Expects a file in the request field named "file".
* `GET /submittedAssignments` - (Requires authentication) Fetches all submitted assignments.
* `GET /studentSubmittedAssignments` - (Requires authentication) Fetches assignments submitted by a specific student.
* `DELETE /delete-submission/:submissionId/:questionId` - (Requires authentication) Deletes a student's submission for a specific question within an assignment.
* `GET /student-evaluations` - (Requires authentication) Fetches evaluations for the logged-in student.
* `GET /fetchAllstudent-evaluations` - (Requires authentication) Fetches all student evaluations (for teachers).
* `GET /fetchAssignment_Student` - (Requires authentication) Fetches assignments for students based on their department and year.
* `POST /assignmentSubmitionStatus` - (Requires authentication) Updates the submission status of an assignment.

File Uploads (uploadRoutes.js)

* `POST /api/upload` - (Requires authentication, file upload) Handles file uploads. Expects a file in the request field named "assignment".


