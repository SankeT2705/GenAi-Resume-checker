# Deployment Changes Summary

## ✅ Changes Made for Vercel Deployment

### Backend Changes

#### 1. **server/server.js** - Environment Variables for Port
**Before:**
```javascript
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
```

**After:**
```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
```

#### 2. **server/src/app.js** - Dynamic CORS Origin
**Before:**
```javascript
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
```

**After:**
```javascript
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"
app.use(cors({
    origin: corsOrigin,
    credentials:true
}))
```

#### 3. **server/package.json** - Added Production Script
**Before:**
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "npx nodemon server.js"
}
```

**After:**
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "npx nodemon server.js",
  "start": "node server.js"
},
"engines": {
  "node": "18.x"
}
```

### Frontend Changes

#### 1. **frontend/src/features/services/auth.api.js** - Dynamic API URL
**Before:**
```javascript
const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const api=axios.create({
    baseURL: API_URL,
    withCredentials:true
})
```

#### 2. **frontend/src/features/interview/services/interview.api.js** - Dynamic API URL
**Before:**
```javascript
const api =axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
})
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const api =axios.create({
    baseURL: API_URL,
    withCredentials:true,
})
```

### New Configuration Files

#### 3. **vercel.json** - Backend Deployment Config
```json
{
  "version": 2,
  "buildCommand": "npm install",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/server.js"
    }
  ]
}
```

#### 4. **.env.example** - Backend Environment Template
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

#### 5. **frontend/.env.example** - Frontend Environment Template
```
VITE_API_URL=http://localhost:3000
```

#### 6. **.gitignore** - Git Ignore File
- Excludes `.env` files
- Excludes `node_modules/`, `dist/`, `build/`
- Excludes IDE and OS files

---

## 🎯 Environment Variables Required for Vercel

### Backend Environment Variables
```
PORT=3000
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<strong-random-string-32-chars-minimum>
JWT_EXPIRE=7d
CORS_ORIGIN=<your-frontend-vercel-url>
GOOGLE_GEMINI_API_KEY=<your-api-key>
```

### Frontend Environment Variables
```
VITE_API_URL=<your-backend-vercel-url>
```

---

## 🔧 Local Development Setup

### First Time Setup:
```bash
# Backend
cd server
npm install
cp .env.example .env.local
# Edit .env.local with your local values
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables for Local Development:
**server/.env.local:**
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/genproject
JWT_SECRET=local_development_secret
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env.local:**
```
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Deployment Workflow

### Step-by-Step Deployment:

1. **Prepare Backend**
   ```bash
   cd server
   npm install
   vercel --prod
   ```
   Note: Backend URL (e.g., https://genproject-backend.vercel.app)

2. **Add Backend Environment Variables on Vercel Dashboard**
   - Set all backend env vars including CORS_ORIGIN with frontend URL (from next step)

3. **Prepare Frontend**
   ```bash
   cd frontend
   npm install
   vercel --prod
   ```
   Note: Frontend URL (e.g., https://genproject-frontend.vercel.app)

4. **Add Frontend Environment Variables on Vercel Dashboard**
   - Set VITE_API_URL to your backend URL

5. **Update Backend CORS**
   - Go back to backend project settings
   - Update CORS_ORIGIN to your frontend URL
   - Redeploy backend

---

## 🧪 Testing After Deployment

### Checklist:
- [ ] Frontend loads at https://genproject-frontend.vercel.app
- [ ] No CORS errors in browser console
- [ ] Registration works
- [ ] Login works
- [ ] JWT tokens are issued correctly
- [ ] Protected routes are accessible after login
- [ ] Interview creation works
- [ ] Interview data persists in MongoDB
- [ ] File uploads work (if applicable)
- [ ] AI service integration works

---

## 🔐 Security Reminders

1. **Never expose secrets:**
   - Don't commit `.env` files
   - Use Vercel Environment Variables
   - Rotate JWT_SECRET periodically

2. **HTTPS only:**
   - Vercel automatically provides HTTPS
   - All communication is encrypted

3. **MongoDB Security:**
   - Use strong database password
   - Whitelist IP addresses in MongoDB Atlas
   - Use connection pooling

4. **JWT Security:**
   - Use strong secret (minimum 32 characters)
   - Set appropriate expiration (recommend 7d for security)
   - Implement refresh token logic

---

## 📊 Deployment Architecture

```
┌─────────────────┐
│    Frontend     │
│ (Vercel - SSG)  │ https://genproject-frontend.vercel.app
└────────┬────────┘
         │ HTTP/CORS
         ↓
┌─────────────────────┐
│  Backend (Node.js)  │
│  (Vercel Function)  │ https://genproject-backend.vercel.app
└────────┬────────────┘
         │ TCP
         ↓
┌─────────────────┐
│ MongoDB Atlas   │
│   (Cloud DB)    │
└─────────────────┘
```

---

**All changes are backward compatible with local development!**
