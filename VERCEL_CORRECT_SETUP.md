# ✅ Correct Vercel Deployment - Step by Step

## 📋 Proper Architecture

Deploy as **TWO separate Vercel projects:**
```
Project 1: Backend (Express API)
Project 2: Frontend (React + Vite)
```

This is the recommended approach by Vercel for full-stack apps.

---

## 🔧 PART 1: Prepare Backend Repository

### Step 1.1: Create Backend Repository (Best Practice)

The cleanest way is to push ONLY the backend code to a separate GitHub repository.

**Option A: Create separate backend repo (Recommended)**
```bash
# On GitHub, create a new repository: genproject-backend

# Clone it locally
git clone https://github.com/your-username/genproject-backend.git
cd genproject-backend

# Copy all server files here
cp -r ../Genproject/server/* .

# Create proper structure at root level
```

**Option B: If keeping monorepo, use Vercel config**
Keep current structure but configure Vercel correctly.

### Step 1.2: Ensure Backend Root Structure

Your backend root should have:
```
genproject-backend/
├── package.json
├── server.js (or index.js)
├── .env.example
├── .gitignore
├── vercel.json (NEW)
└── src/
    ├── app.js
    ├── config/
    ├── routes/
    └── ...
```

### Step 1.3: Fix backend/package.json

```json
{
  "name": "genproject-backend",
  "version": "1.0.0",
  "description": "Interview Platform Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "24.x"
  },
  "dependencies": {
    "@google/genai": "^2.8.0",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.3",
    "multer": "^2.1.1",
    "pdf-parse": "^2.4.5",
    "zod": "^3.25.76",
    "zod-to-json-schema": "^3.25.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Step 1.4: Fix backend/server.js

**Keep it simple - NO PORT LISTENING for Vercel:**

```javascript
require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// Connect to database
connectToDB()

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Export for Vercel
module.exports = app
```

### Step 1.5: Create vercel.json in Backend Root

**Create:** `genproject-backend/vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 1.6: Backend .env.example

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/genproject
JWT_SECRET=your_strong_secret_key_minimum_32_chars
JWT_EXPIRE=7d
GOOGLE_GEMINI_API_KEY=your_api_key
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Step 1.7: Git Push Backend Code

```bash
cd genproject-backend  # or your backend directory
git add .
git commit -m "Initial backend setup for Vercel"
git push origin main
```

---

## 🚀 PART 2: Deploy Backend on Vercel (Website UI)

### Step 2.1: Go to Vercel Website

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**

### Step 2.2: Import GitHub Repository

1. Select **"Import Git Repository"**
2. Paste your backend repo URL: `https://github.com/your-username/genproject-backend`
3. Click **"Import"**

### Step 2.3: Configure Project

1. **Project Name:** `genproject-backend` (or your choice)
2. **Framework Preset:** `Other` (it's custom Node.js)
3. **Root Directory:** `.` (default, since files are at root)
4. Click **"Continue"**

### Step 2.4: Add Environment Variables

⚠️ **Critical Step!** This is where your build was failing.

In Vercel dashboard:

1. Under **"Environment Variables"** section, add these:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://your-user:your-password@cluster.mongodb.net/genproject` |
| `JWT_SECRET` | `your_very_strong_secret_key_here_at_least_32_characters` |
| `JWT_EXPIRE` | `7d` |
| `GOOGLE_GEMINI_API_KEY` | `your_gemini_api_key` |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` *(update after frontend deploy)* |

2. Click **"Deploy"**

### Step 2.5: Wait for Build & Deployment

✅ Build should complete successfully.

**After deployment:**
- Copy your backend URL: `https://genproject-backend.vercel.app`
- **Save this URL** - you need it for frontend

---

## 🎨 PART 3: Prepare Frontend

### Step 3.1: Frontend Repository Structure

```
genproject-frontend/
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
├── index.html
├── src/
├── public/
└── vercel.json (NEW)
```

### Step 3.2: Update frontend/vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### Step 3.3: Fix API files - frontend/src/features/services/auth.api.js

```javascript
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    })
    return response.data
  } catch (err) {
    console.error("Registration error:", err)
    throw err
  }
}

// ... rest of functions
```

### Step 3.4: Fix API files - frontend/src/features/interview/services/interview.api.js

```javascript
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const generateInterviewReport = async({ jobDescription, selfDescription, resumeFile }) => {
  // ... rest of code
}

// ... rest of functions
```

### Step 3.5: frontend/package.json

```json
{
  "name": "genproject-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "axios": "^1.17.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router": "^7.17.0",
    "sass": "^1.100.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "vite": "^8.0.12"
  }
}
```

### Step 3.6: Create frontend/vercel.json

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

### Step 3.7: frontend/.env.example

```
VITE_API_URL=http://localhost:3000
```

### Step 3.8: Push Frontend Code

```bash
cd genproject-frontend  # or your frontend directory
git add .
git commit -m "Initial frontend setup for Vercel"
git push origin main
```

---

## 🎬 PART 4: Deploy Frontend on Vercel

### Step 4.1: Deploy Frontend

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Paste frontend repo URL
5. Click **"Import"**

### Step 4.2: Configure Frontend Project

1. **Project Name:** `genproject-frontend`
2. **Framework Preset:** `Vite`
3. **Root Directory:** `.`
4. **Build Command:** `npm run build` (auto-detected)
5. **Output Directory:** `dist` (auto-detected)

### Step 4.3: Add Environment Variables

In Vercel dashboard for frontend:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://genproject-backend.vercel.app` |

*(Use your actual backend URL from Step 2.5)*

### Step 4.4: Deploy

Click **"Deploy"** and wait for build completion.

**After deployment:**
- Copy frontend URL: `https://genproject-frontend.vercel.app`

---

## 🔗 PART 5: Update CORS on Backend

Now that you have the frontend URL, update backend CORS:

1. Go to backend project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Update `CORS_ORIGIN`:

| Variable | Value |
|----------|-------|
| `CORS_ORIGIN` | `https://genproject-frontend.vercel.app` |

4. Click the three dots menu → **"Redeploy"**

---

## ✅ PART 6: Testing

### Test 1: Check Deployments
- ✅ Backend: `https://genproject-backend.vercel.app/api/auth/health` (or any API endpoint)
- ✅ Frontend: `https://genproject-frontend.vercel.app`

### Test 2: Check Frontend
1. Open frontend URL in browser
2. Should see login page
3. Open DevTools (F12) → Network tab
4. Register/Login
5. Check network calls go to backend
6. **No CORS errors** ✅

### Test 3: Check Database
1. Create an interview
2. Verify data appears in MongoDB Atlas

---

## 🐛 Troubleshooting

### "Cannot find module" Error
- Ensure `main` in package.json points to correct file
- Verify all imports in your code

### CORS Still Failing
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check CORS_ORIGIN in backend env vars exactly matches frontend URL

### 500 Error
- Check Vercel logs: Click deployment → View logs
- Check environment variables are set
- Check MongoDB connection string is valid

### Build Failing
- Check `npm run build` works locally
- Check all dependencies in package.json
- View Vercel build logs for specifics

---

## 📝 Local Development Setup

**Backend (.env.local):**
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/genproject
JWT_SECRET=local_dev_secret
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:3000
```

**Run locally:**
```bash
# Terminal 1
cd genproject-backend
npm install
npm run dev

# Terminal 2
cd genproject-frontend
npm install
npm run dev
```

---

## 🎯 Summary

| Component | Deployment Type | URL |
|-----------|-----------------|-----|
| Backend | Vercel Project 1 | https://genproject-backend.vercel.app |
| Frontend | Vercel Project 2 | https://genproject-frontend.vercel.app |
| Database | MongoDB Atlas | Cloud |

---

**This setup follows Vercel's official documentation and best practices for full-stack applications.**
