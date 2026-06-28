# 🚀 AI Resume & Interview Preparation Analyzer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://gen-ai-resume-checker-frontend.vercel.app/login)
[![Backend API](https://img.shields.io/badge/Backend%20API-Vercel-blue?style=for-the-badge&logo=vercel)](https://gen-ai-resume-backend.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

An intelligent, full-stack AI platform designed to analyze candidate resumes against job descriptions. Powered by **Google Gemini AI**, the application extracts resume data, calculates profile match scores, detects critical skill gaps, and generates tailored technical and behavioral interview questions alongside a day-by-day preparation roadmap.

---

## 🌐 Live Application URLs

- 🔗 **Frontend Web Application**: [https://gen-ai-resume-checker-frontend.vercel.app/login](https://gen-ai-resume-checker-frontend.vercel.app/login)
- ⚙️ **Backend API Service**: [https://gen-ai-resume-backend.vercel.app/](https://gen-ai-resume-backend.vercel.app/)

---

## ✨ Key Features

- **📄 PDF Resume Parsing**: Automatically extracts clean text from uploaded candidate resumes.
- **🎯 Profile Match Scoring**: Calculates an instant 0–100% compatibility score against specific job descriptions.
- **💡 Targeted Technical & Behavioral Questions**: Generates expected questions, interviewer intentions, and model answers customized to the role.
- **📊 Skill Gap Severity Analysis**: Highlights missing competencies categorized by severity (`Low`, `Medium`, `High`).
- **📅 Personal Day-Wise Preparation Roadmap**: Delivers a structured daily action plan to bridge skill gaps before interview day.
- **🔐 Dual-Layer Authentication**: Secure access using JWT with HTTP-Only cookies and Authorization Bearer header fallbacks.
- **🕒 Historical Report Archive**: Saves past analyses so users can track their preparation progress over time.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router 7
- **Styling**: Sass / Vanilla CSS
- **HTTP Client**: Axios (with custom auth interceptors)
- **Deployment**: Vercel Single Page Application (SPA)

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express 5
- **Database**: MongoDB Atlas (Mongoose ODM)
- **AI Engine**: Google GenAI SDK (`@google/genai` with `gemini-2.5-flash`)
- **PDF Extraction**: `pdf-parse` (Lightweight pure JS edition)
- **Validation**: Zod & Zod-to-JSON-Schema
- **Deployment**: Vercel Serverless Functions

---

## 🏗️ Project Architecture

```text
Genproject/
├── frontend/                     # React 19 + Vite Web Client
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/            # Login, Register, Auth Context & Hooks
│   │   │   └── interview/       # Dashboard, Report Generator & Analytics UI
│   │   ├── App.jsx              # Application Core
│   │   └── app.routes.jsx       # Client Route Configuration
│   ├── vercel.json              # SPA Rewrites Rule
│   └── package.json
│
└── server/                       # Node.js + Express 5 Serverless API
    ├── api/                     # Vercel Serverless Entrypoint (index.js)
    ├── src/
    │   ├── config/              # MongoDB Connection Caching
    │   ├── controller/          # Auth & Interview Business Logic
    │   ├── middlewares/         # JWT Verification & Multer File Processing
    │   ├── models/              # Mongoose Data Schemas
    │   ├── routes/              # Express API Routes
    │   ├── services/            # Gemini AI Integration & JSON Schema Prompting
    │   └── app.js               # Express App & CORS Middleware
    ├── vercel.json              # Serverless Function Builder Config
    └── package.json
```

---

## 🔌 API Reference

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `GET` | `/api/auth/logout` | Public | Clear session token & blacklist token |
| `GET` | `/api/auth/get-me` | Private | Fetch active user profile |

### 🎯 Interview Analysis Routes (`/api/interview`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/` | Private | Upload resume PDF + details to generate AI report |
| `GET` | `/api/interview/` | Private | Fetch all historical reports for logged-in user |
| `GET` | `/api/interview/report/:id` | Private | Fetch specific interview report by ID |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB Instance (Local or MongoDB Atlas)
- Google Gemini API Key ([Get Key Here](https://aistudio.google.com/))

### 1. Clone Repository
```bash
git clone https://github.com/SankeT2705/GenAi-Resume-checker.git
cd Genproject
```

### 2. Configure Backend Environment
Create a `.env` file inside the `server/` directory:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Run backend locally:
```bash
cd server
npm install
npm run dev
```

### 3. Configure Frontend Environment
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:3000
```

Run frontend locally:
```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ☁️ Free Cloud Deployment (Vercel)

Both frontend and backend are deployed completely **free of cost** on Vercel:

1. **Database**: MongoDB Atlas M0 Shared Cluster (Free 512MB).
2. **Backend**: Deployed on Vercel as a Serverless Express function using `@vercel/node`.
3. **Frontend**: Deployed on Vercel as a Vite React SPA with wildcard rewrites.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Developed with ❤️ for job seekers and software engineers worldwide.
