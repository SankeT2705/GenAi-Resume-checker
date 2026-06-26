# 🚀 Quick Deployment Checklist for Vercel

## Phase 1: Local Preparation ✅

### Code Updates (Already Done!)
- ✅ Environment variables implemented in backend
- ✅ Environment variables implemented in frontend  
- ✅ CORS origin made dynamic
- ✅ Port made configurable
- ✅ Production script added to package.json
- ✅ vercel.json created
- ✅ .gitignore created
- ✅ .env.example files created

### What You Need to Do:

**1. Update .env files locally (Do NOT commit these)**

Backend (.env.local in server folder):
```bash
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/genproject
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
GOOGLE_GEMINI_API_KEY=your_api_key
```

Frontend (.env.local in frontend folder):
```bash
VITE_API_URL=http://localhost:3000
```

**2. Test Locally**
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Test in browser: http://localhost:5173
```

---

## Phase 2: Git Preparation

**3. Commit Code Changes**
```bash
git add .
git commit -m "chore: prepare for Vercel deployment - environment variables"
git push origin main
```

---

## Phase 3: Backend Deployment

**4. Create/Login to Vercel Account**
- Go to https://vercel.com
- Sign up or login with GitHub

**5. Deploy Backend**
```bash
npm install -g vercel
cd server
vercel --prod
```

**When prompted:**
- Project Name: `genproject-backend`
- Framework: `Other`
- Root Directory: `server`

**6. Note Backend URL**
After deployment, you'll get a URL like:
```
https://genproject-backend.vercel.app
```
⚠️ **SAVE THIS URL** - You need it for frontend!

**7. Add Backend Environment Variables**

In Vercel Dashboard:
1. Select backend project
2. Settings → Environment Variables
3. Add these variables:

| Variable | Value |
|----------|-------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/genproject` |
| `JWT_SECRET` | `your_strong_secret_key_here` |
| `JWT_EXPIRE` | `7d` |
| `GOOGLE_GEMINI_API_KEY` | `your_api_key` |
| `CORS_ORIGIN` | *Leave blank for now* |

**8. Redeploy Backend**
- Click "Deployments" tab
- Click "Redeploy" on the latest deployment

✅ **Backend is now live!**

---

## Phase 4: Frontend Deployment

**9. Deploy Frontend**
```bash
cd frontend
vercel --prod
```

**When prompted:**
- Project Name: `genproject-frontend`
- Framework: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)

**10. Note Frontend URL**
After deployment:
```
https://genproject-frontend.vercel.app
```
⚠️ **SAVE THIS URL** - You need it for backend!

**11. Add Frontend Environment Variables**

In Vercel Dashboard for frontend project:
1. Settings → Environment Variables
2. Add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://genproject-backend.vercel.app` |

✅ **Frontend is now live!**

---

## Phase 5: Final Configuration

**12. Update Backend CORS Origin**

In Vercel Dashboard for backend project:
1. Settings → Environment Variables
2. Update `CORS_ORIGIN`:

| Variable | Value |
|----------|-------|
| `CORS_ORIGIN` | `https://genproject-frontend.vercel.app` |

**13. Redeploy Backend Again**
- Click "Deployments"
- Click "Redeploy" on latest deployment

---

## Phase 6: Testing ✅

**14. Test Frontend**
```
Open: https://genproject-frontend.vercel.app
```

**Checklist:**
- [ ] Page loads without errors
- [ ] No error messages in console (F12)
- [ ] Can see login/register forms
- [ ] No CORS errors

**15. Test Authentication**
- [ ] Register new account
- [ ] Login with credentials
- [ ] Token received from backend
- [ ] User info loaded
- [ ] Can navigate protected pages

**16. Test API Calls**
- [ ] Create interview (if applicable)
- [ ] Retrieve data from backend
- [ ] File uploads work (if applicable)

---

## 🐛 Troubleshooting Quick Fixes

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** 
1. Check backend `CORS_ORIGIN` matches frontend URL exactly
2. Redeploy backend
3. Hard refresh frontend (Ctrl+Shift+R)

### Cannot Reach Backend
```
Error: Failed to fetch from https://genproject-backend.vercel.app
```
**Fix:**
1. Check frontend `VITE_API_URL` is correct
2. Test backend URL in browser directly
3. Check backend env variables on Vercel

### Database Connection Error
```
Error: Cannot connect to MongoDB
```
**Fix:**
1. Verify `MONGO_URI` connection string is correct
2. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
3. Verify database exists

### Build Failed
```
Command 'npm run build' exited with code 1
```
**Fix:**
1. Run locally: `npm run build`
2. Fix errors
3. Commit and push
4. Redeploy

---

## 📞 Quick Reference URLs

| Item | URL |
|------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Backend Project | https://vercel.com/dashboard/projects/genproject-backend |
| Frontend Project | https://vercel.com/dashboard/projects/genproject-frontend |
| Live Frontend | https://genproject-frontend.vercel.app |
| Live Backend | https://genproject-backend.vercel.app |

---

## ✨ Post-Deployment Steps

After everything works:

1. **Monitor Logs**
   - Check Vercel dashboard for any errors
   - Monitor function duration

2. **Add Analytics** (Optional)
   - Enable Vercel Analytics for performance insights

3. **Set Up Alerts** (Optional)
   - Set email notifications for deployment failures

4. **Update Production URL in Docs**
   - Update README with live URLs
   - Share with team

5. **Enable Auto-Deploy** ✅
   - Already enabled! Push to main branch = auto deploy

---

## ✅ Final Verification

- [ ] Frontend accessible at https://genproject-frontend.vercel.app
- [ ] Backend accessible at https://genproject-backend.vercel.app
- [ ] Can register/login without CORS errors
- [ ] Database writes work
- [ ] Database reads work
- [ ] All API endpoints respond
- [ ] Protected routes work after authentication
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

---

**Congratulations! Your app is deployed to Vercel! 🎉**

---

**Estimated Time:** 20-30 minutes
**Difficulty Level:** Intermediate
**Support:** Check deployment logs in Vercel Dashboard
