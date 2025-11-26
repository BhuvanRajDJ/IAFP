# Deployment Guide for IAFP

## Prerequisites
- **Node.js** (v20 or later) installed on the server.
- **MongoDB** instance reachable from the server.
- Valid **SendGrid API Key** (must start with `SG.`) and **Google Gemini API Key**.
- Environment variables defined in a `.env` file at the project root (see `.env.example`).

## Backend Setup
1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment**
   - Copy the example file:
     ```bash
     cp .env.example .env
     ```
   - Fill in the values:
     - `Mongodb_Url` – your MongoDB connection string.
     - `SENDGRID_API_KEY` – a valid SendGrid key (must start with `SG.`).
     - `GEMINI_API_KEY` – Google Gemini key.
3. **Run the server**
   ```bash
   npm start   # runs `node index.js`
   ```
   The server will listen on `PORT` (default **3000**).  Ensure the port is open.

## Frontend Setup (Vite + React)
1. **Install dependencies**
   ```bash
   cd frontEnd/IAFP
   npm install
   ```
2. **Build for production**
   ```bash
   npm run build   # creates a `dist/` folder
   ```
3. **Serve the built assets**
   You can use any static file server (e.g., `serve`, `nginx`).  Example with `serve`:
   ```bash
   npm i -g serve
   serve -s dist
   ```
   The app will be available on the chosen port (default **5000**).

## Common Issues & Fixes
- **SendGrid Unauthorized**: Verify that `SENDGRID_API_KEY` is correct and starts with `SG.`.  The backend now validates the key before sending emails and logs detailed errors.
- **MongoDB Deprecation Warning**: The driver option `useNewUrlParser` is now default. No action needed, but you can silence the warning by updating the connection code if desired.
- **Port Conflicts**: Frontend dev server automatically tries the next free port. For production, configure the static server to use an available port.

## Production Start Script (Optional)
Add a script to `backend/package.json` for convenience:
```json
"scripts": {
  "start": "node index.js",
  "start:prod": "npm run start"
}
```
Then run:
```bash
npm run start:prod
```

## Summary
- Backend runs on **Node.js** with proper environment configuration.
- Frontend is built with **Vite**; the `dist/` folder can be served statically.
- All lint and syntax errors have been resolved; the project builds without issues.
- Detailed error handling for SendGrid ensures graceful degradation if email sending fails.

Feel free to adjust the static server configuration (nginx, Apache, etc.) to match your deployment environment.
