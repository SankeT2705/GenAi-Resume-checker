# Vercel Deployment - Correct Steps (ONLY 10 minutes)

## ✅ You Will Deploy TWO SEPARATE VERCEL PROJECTS

**Project 1:** Backend API  
**Project 2:** Frontend Web App

---

## 🔧 STEP 1: Delete Old Config (Do This!)

Open terminal in your project:
```bash
rm vercel.json
git add -A
git commit -m "Remove old vercel config"
git push
```

---

## 📚 STEP 2: Backend Deployment via Vercel Website UI

### 2.1 Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**

### 2.2 Import Repository  
1. Click **"Import Git Repository"**
2. Find & select: **`GenAi-Resume-checker`**
3. Click **"Import"**

### 2.3 Configure Project
- **Project Name:** `genproject-backend`
- **Framework Preset:** `Other`
- **Root Directory:** `./server` ← **IMPORTANT: Select server folder**

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://username:password@cluster0.mongodb.net/genproject` |
| `JWT_SECRET` | `your_very_strong_secret_key_32_chars_minimum` |
| `JWT_EXPIRE` | `7d` |
| `GOOGLE_GEMINI_API_KEY` | `your_gemini_key` |
| `CORS_ORIGIN` | `http://localhost:5173` |

### 2.5 Click Deploy
Wait 2-3 minutes for build.

### ✅ After Deploy
- Copy your backend URL: `https://genproject-backend.vercel.app`
- **SAVE THIS URL** - you need it for frontend!

---

## 🎨 STEP 3: Frontend Deployment via Vercel Website UI

### 3.1 Go to Vercel Dashboard
1. Click **"Add New"** → **"Project"**

### 3.2 Import Same Repository
1. Click **"Import Git Repository"**
2. Find & select: **`GenAi-Resume-checker`** (same repo)
3. Click **"Import"**

### 3.3 Configure Project  
- **Project Name:** `genproject-frontend`
- **Framework Preset:** `Vite`
- **Root Directory:** `./frontend` ← **IMPORTANT: Select frontend folder**
- Build settings auto-detect correctly

### 3.4 Add Environment Variable
Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://genproject-backend.vercel.app` |

Use the backend URL from Step 2.5!

### 3.5 Click Deploy
Wait 2-3 minutes for build.

### ✅ After Deploy
- Copy your frontend URL: `https://genproject-frontend.vercel.app`

---

## 🔗 STEP 4: Update Backend CORS

Go back to backend project on Vercel:

1. Click the backend project name
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Find `CORS_ORIGIN` and update it:

| Key | Old Value | New Value |
|-----|-----------|-----------|
| `CORS_ORIGIN` | `http://localhost:5173` | `https://genproject-frontend.vercel.app` |

5. Save changes
6. Click **"Deployments"** tab
7. Click **"Redeploy"** on latest deployment

---

## ✅ TESTING

### Test 1: Frontend Loads
Open: `https://genproject-frontend.vercel.app`
- ✅ You should see login page
- ✅ No CORS errors in console (F12 → Console)

### Test 2: Try Login/Register
1. Register with test account
2. Open DevTools (F12) → Network tab
3. Submit login
4. Check network request goes to backend
5. Should succeed! ✅

### Test 3: Check Database
1. Login successfully
2. Create an interview (if applicable)
3. Check MongoDB Atlas - data should appear

---

## 🐛 If Backend Build Fails

### Error: "Cannot find server/package.json"
**Root Cause:** Vercel trying to find server folder incorrectly

**Fix:**
1. Go to backend project Settings
2. Check **Root Directory** is set to `./server`
3. Redeploy

### Error: "ENOENT: Cannot read package.json"
**Root Cause:** Wrong configuration

**Fix:**
1. Delete backend project from Vercel dashboard
2. Deploy again from Step 2, make sure Root Directory = `./server`

---

## 🐛 If Frontend Build Fails

### Error: "Cannot find frontend folder"
**Fix:**
1. Root Directory must be `./frontend`
2. Framework must be `Vite`

---

## 📋 Final Checklist

- [ ] Root `vercel.json` deleted
- [ ] Backend project deployed (URL saved)
- [ ] Backend environment variables set
- [ ] Frontend project deployed (URL saved)
- [ ] Frontend environment variables set
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed
- [ ] Frontend loads in browser
- [ ] Login works
- [ ] No CORS errors

---

## 🎯 Your Final URLs

| Item | URL |
|------|-----|
| Frontend | `https://genproject-frontend.vercel.app` |
| Backend API | `https://genproject-backend.vercel.app` |
| Database | MongoDB Atlas (your cluster) |

**Congratulations! Your app is live! 🚀**
