# IAFP - Intelligent Assignment Feedback Platform

## 📋 Description

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to provide intelligent assignment feedback. It offers a comprehensive platform where teachers can efficiently create, manage, and evaluate assignments, while students can easily submit their work and receive automated feedback powered by AI.

## ✨ Features

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

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap
- Tailwind CSS
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- JWT (JSON Web Tokens)
- bcryptjs
- Multer (File uploads)

### Database
- MongoDB

### AI Evaluation
- Google Gemini API

### File Storage
- Google Drive API (OAuth 2.0)

### Email Service
- SendGrid API

## 📁 Project Structure

```
IAFP/
├── backEnd/
│   ├── controllers/          # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── config/              # Configuration files (Google Drive, AI)
│   ├── uploads/             # Temporary file uploads
│   ├── scripts/             # Utility scripts
│   ├── .env                 # Environment variables (DO NOT COMMIT)
│   ├── index.js             # Entry point
│   └── package.json
│
└── frontEnd/IAFP/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/          # Page components
    │   └── App.jsx         # Main app component
    ├── public/
    ├── .env                # Frontend environment variables
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.18.2 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** account - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/BhuvanRajDJ/IAFP.git
cd IAFP
```

---

### 2️⃣ Backend Setup

#### Install Dependencies

```bash
cd backEnd
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backEnd` directory:

```bash
# Create .env file (Windows PowerShell)
New-Item .env

# Or use any text editor
notepad .env
```

Add the following environment variables to your `.env` file:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
Mongodb_Url=your_mongodb_connection_string_here

# JWT Authentication
SECRET_KEY=your_jwt_secret_key_here
SECRET_NUMBER=your_teacher_secret_number_here

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
BEARER_TOKEN=your_gemini_api_key_here

# Google Drive OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
```

---

### 3️⃣ Frontend Setup

#### Install Dependencies

```bash
cd ../frontEnd/IAFP
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontEnd/IAFP` directory:

```bash
# Create .env file (Windows PowerShell)
New-Item .env

# Or use any text editor
notepad .env
```

Add the following:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🔑 How to Obtain API Keys & Credentials

### 1. MongoDB Connection String

#### Step 1: Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Create a Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select your preferred cloud provider and region
4. Click **"Create Cluster"**

#### Step 3: Create Database User
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and strong password (save these!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

#### Step 4: Whitelist IP Address
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP address for better security
4. Click **"Confirm"**

#### Step 5: Get Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `IAFP`)

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/IAFP?retryWrites=true&w=majority
```

**Add to `.env`:**
```env
Mongodb_Url=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/IAFP?retryWrites=true&w=majority
```

---

### 2. JWT Secret Key

This is a random string used to sign JWT tokens for authentication.

#### Generate a Secure Secret Key:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using PowerShell**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

**Option 3: Online Generator**
- Visit [RandomKeygen](https://randomkeygen.com/)
- Copy a "CodeIgniter Encryption Key" or similar

**Add to `.env`:**
```env
SECRET_KEY=your_generated_secret_key_here
```

---

### 3. Teacher Secret Number

This is a simple numeric code that teachers must enter during registration to verify they are authorized to create a teacher account.

**Choose any number (e.g., 123456):**

```env
SECRET_NUMBER=123456
```

---

### 4. SendGrid API Key

SendGrid is used to send email notifications to students.

#### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://signup.sendgrid.com/)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

#### Step 2: Complete Sender Authentication
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details (use your real email)
4. Verify the email sent to your address

#### Step 3: Create API Key
1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it (e.g., "IAFP Backend")
4. Choose **"Full Access"** (or "Restricted Access" with Mail Send permissions)
5. Click **"Create & View"**
6. **IMPORTANT:** Copy the API key immediately (you won't see it again!)

**Add to `.env`:**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 5. Google Gemini API Key

Gemini AI is used for automated assignment evaluation.

#### Step 1: Access Google AI Studio
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

#### Step 2: Create API Key
1. Click **"Get API Key"**
2. Click **"Create API Key in new project"** (or select existing project)
3. Copy the generated API key

#### Step 3: Enable Gemini API
1. The API should be enabled automatically
2. If not, go to [Google Cloud Console](https://console.cloud.google.com/)
3. Enable **"Generative Language API"**

**Add to `.env`:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
BEARER_TOKEN=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

### 6. Google Drive OAuth 2.0 Credentials

Google Drive is used to store uploaded assignment files.

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it (e.g., "IAFP Drive Storage")
4. Click **"Create"**

#### Step 2: Enable Google Drive API
1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click on it and click **"Enable"**

#### Step 3: Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"**
   - Fill in app name (e.g., "IAFP")
   - Add your email as developer contact
   - Click **"Save and Continue"** through all steps
4. Back to **"Create OAuth client ID"**:
   - Application type: **"Web application"**
   - Name: "IAFP Backend"
   - Authorized redirect URIs: Add `https://developers.google.com/oauthplayground`
   - Click **"Create"**
5. **Copy the Client ID and Client Secret**

**Add to `.env`:**
```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 4: Get Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the **Settings** icon (⚙️) in the top right
3. Check **"Use your own OAuth credentials"**
4. Enter your **Client ID** and **Client Secret**
5. Close settings
6. In **"Step 1"**, find **"Drive API v3"**
7. Select `https://www.googleapis.com/auth/drive`
8. Click **"Authorize APIs"**
9. Sign in with your Google account
10. Click **"Allow"**
11. In **"Step 2"**, click **"Exchange authorization code for tokens"**
12. **Copy the Refresh Token**

**Add to `.env`:**
```env
GOOGLE_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
```

#### Step 5: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder (e.g., "IAFP Assignments")
3. Open the folder
4. Copy the folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Example: If URL is `https://drive.google.com/drive/folders/13kLWilJ4tS9WhFp5GNQ-lFrPBIKpOHkk`
   - Folder ID is: `13kLWilJ4tS9WhFp5GNQ-lFrPBIKpOHkk`

**Add to `.env`:**
```env
GOOGLE_DRIVE_FOLDER_ID=13kLWilJ4tS9WhFp5GNQ-lFrPBIKpOHkk
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backEnd
npm start
```

The backend will run on `http://localhost:3000`

**For development with auto-restart:**
```bash
npm run dev
```

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontEnd/IAFP
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

---

## 🧪 Testing the Setup

### 1. Test Backend
- Open `http://localhost:3000` in your browser
- You should see a response (or check terminal for "Server running" message)

### 2. Test Frontend
- Open `http://localhost:5173` in your browser
- You should see the IAFP login page

### 3. Test MongoDB Connection
- Check backend terminal for "MongoDB Connected Successfully" message

### 4. Test Email (SendGrid)
- Create an assignment as a teacher
- Check if students receive email notifications

### 5. Test Google Drive
- Submit an assignment as a student
- Check if files appear in your Google Drive folder

---

## 🔒 Security Best Practices

### ⚠️ NEVER Commit Sensitive Files

The following files contain sensitive information and should NEVER be committed to Git:

- `backEnd/.env`
- `frontEnd/IAFP/.env`
- `backEnd/google-credentials.json` (if used)

These are already included in `.gitignore`.

### 🛡️ Production Security Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Rotate API keys regularly
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS in production
- [ ] Restrict MongoDB network access to specific IPs
- [ ] Use restricted API keys (not full access) when possible
- [ ] Implement rate limiting on API endpoints
- [ ] Enable CORS only for trusted domains
- [ ] Use Google Secret Manager or AWS Secrets Manager for production secrets
- [ ] Regular security audits with `npm audit`

### 🔐 Recommended Secret Storage (Production)

Instead of `.env` files in production, use:
- **Google Cloud Secret Manager**
- **AWS Secrets Manager**
- **Azure Key Vault**
- **HashiCorp Vault**

---

## 📡 API Endpoints

### User Management
- `POST /signup` - Student registration
- `POST /teachersignup` - Teacher registration
- `POST /student_login` - Student login
- `POST /teacher_login` - Teacher login
- `GET /students-by-department` - Get students by department

### Assignment Management (Teacher)
- `POST /teacher/assignment` - Create assignment
- `GET /teacher/assignment` - Get all assignments
- `PUT /teacher/assignment/:id` - Update assignment
- `DELETE /teacher/assignment/:id` - Delete assignment
- `GET /submittedAssignments` - View all submissions
- `GET /fetchAllstudent-evaluations` - View all evaluations

### Assignment Management (Student)
- `GET /fetchAssignment_Student` - Get available assignments
- `POST /submitAssignment` - Submit assignment
- `GET /studentSubmittedAssignments` - View own submissions
- `DELETE /delete-submission/:submissionId/:questionId` - Delete submission
- `GET /student-evaluations` - View own evaluations
- `POST /assignmentSubmitionStatus` - Check submission status

### File Management
- `POST /api/upload` - Upload files to Google Drive

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```bash
cd backEnd
rm -rf node_modules package-lock.json
npm install
```

**Error: "MongoDB connection failed"**
- Check your `Mongodb_Url` in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database user credentials

**Error: "SendGrid Unauthorized"**
- Verify your `SENDGRID_API_KEY` is correct
- Check if sender email is verified in SendGrid

**Error: "Google Drive upload failed"**
- Verify all Google OAuth credentials
- Check if refresh token is valid
- Ensure Google Drive API is enabled

### Frontend won't start

**Error: "Port already in use"**
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Error: "Cannot connect to backend"**
- Ensure backend is running on port 3000
- Check `VITE_API_BASE_URL` in frontend `.env`

---

## 📝 Environment Variables Reference

### Backend `.env` Template

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000

# ============================================
# DATABASE
# ============================================
Mongodb_Url=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/IAFP?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION
# ============================================
SECRET_KEY=your_64_character_random_string_here
SECRET_NUMBER=123456

# ============================================
# EMAIL SERVICE (SendGrid)
# ============================================
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# AI EVALUATION (Google Gemini)
# ============================================
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
BEARER_TOKEN=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# FILE STORAGE (Google Drive OAuth 2.0)
# ============================================
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

### Frontend `.env` Template

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Bhuvan Raj DJ**
- GitHub: [@BhuvanRajDJ](https://github.com/BhuvanRajDJ)

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent evaluation
- SendGrid for email services
- MongoDB Atlas for database hosting
- Google Drive for file storage
- React and Node.js communities

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review your environment variables
3. Check the terminal/console for error messages
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

**Happy Coding! 🚀**
