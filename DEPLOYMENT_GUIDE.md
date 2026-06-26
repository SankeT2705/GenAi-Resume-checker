# Vercel Deployment Guide - Genproject

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure you have completed these steps:

- [ ] Code changes implemented (environment variables in place)
- [ ] Git repository initialized and committed
- [ ] Vercel account created
- [ ] MongoDB Atlas database created
- [ ] Environment variables configured
- [ ] Local testing completed

---

## 🔧 STEP 1: Prepare Your Backend

### 1.1 Create `.env.local` in the server directory:

```bash
cd server
cat > .env.local << EOF
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/genproject
JWT_SECRET=your_production_secret_key_change_this_value
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-url.vercel.app
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
EOF
```

**⚠️ Important:**
- Never commit `.env.local` to GitHub
- Replace placeholder values with actual credentials
- For production JWT_SECRET, use a strong random string

### 1.2 Verify Backend Scripts in `server/package.json`:

```json
"scripts": {
  "dev": "npx nodemon server.js",
  "start": "node server.js"
}
```

✅ Already configured!

---

## 🎨 STEP 2: Prepare Your Frontend

### 2.1 Create `.env.local` in the frontend directory:

```bash
cd frontend
cat > .env.local << EOF
VITE_API_URL=https://your-backend-url.vercel.app
EOF
```

### 2.2 Verify Frontend Build Configuration

Check `frontend/package.json` scripts:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### 2.3 Build Frontend Locally (Test)

```bash
cd frontend
npm install
npm run build
```

Verify `dist/` folder is created successfully.

---

## 📚 STEP 3: Prepare Git Repository

### 3.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - ready for Vercel deployment"
git branch -M main
```

### 3.2 Create `.gitignore` ✅ (Already created)

Ensure `.gitignore` contains:
- `.env` and `.env.local`
- `node_modules/`
- `dist/`
- `build/`

---

## 🚀 STEP 4: Deploy Backend to Vercel

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 4.2 Deploy Backend via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from server directory
cd server
vercel --prod
```

**Configuration:**
- Project Name: `genproject-backend` (or your choice)
- Framework: `Other`
- Root Directory: `server`
- Build Command: `npm install`
- Output Directory: Leave blank

### 4.3 Add Environment Variables

After deployment, go to **Vercel Dashboard**:

1. Select your backend project
2. Go to **Settings → Environment Variables**
3. Add each variable:

```
PORT: 3000
NODE_ENV: production
MONGO_URI: mongodb+srv://username:password@cluster.mongodb.net/genproject
JWT_SECRET: your_production_secret_key_here
JWT_EXPIRE: 7d
GOOGLE_GEMINI_API_KEY: your_gemini_api_key
```

### 4.4 Get Backend URL

After deployment, Vercel provides a URL like:
```
https://genproject-backend.vercel.app
```

**Note this URL** - you'll need it for the frontend!

---

## 🎬 STEP 5: Deploy Frontend to Vercel

### 5.1 Update Frontend Environment Variables

Update `frontend/.env.production.local`:

```bash
cd frontend
cat > .env.production.local << EOF
VITE_API_URL=https://genproject-backend.vercel.app
EOF
```

Replace with your actual backend URL from Step 4.4

### 5.2 Deploy Frontend

```bash
cd frontend
vercel --prod
```

**Configuration:**
- Project Name: `genproject-frontend` (or your choice)
- Framework: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build` (automatic)
- Output Directory: `dist` (automatic)

### 5.3 Add Frontend Environment Variables

In **Vercel Dashboard** for frontend:

1. Settings → Environment Variables
2. Add:

```
VITE_API_URL=https://genproject-backend.vercel.app
```

### 5.4 Get Frontend URL

After deployment:
```
https://genproject-frontend.vercel.app
```

---

## 🔗 STEP 6: Update Backend CORS Settings

Now that you have both URLs, update the backend:

1. Go to **Backend Project → Settings → Environment Variables**
2. Update `CORS_ORIGIN`:

```
CORS_ORIGIN=https://genproject-frontend.vercel.app
```

3. Redeploy backend

---

## ✅ STEP 7: Final Testing

### 7.1 Test Frontend

```
https://genproject-frontend.vercel.app
```

- Can you see the login page?
- No CORS errors in browser console?

### 7.2 Test Authentication

1. Register new user
2. Login with credentials
3. Check browser DevTools → Network → verify API calls succeed
4. Check browser DevTools → Console → no errors

### 7.3 Test Interview Feature

1. Create an interview
2. Verify data is saved to MongoDB
3. Retrieve interview data

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:**
1. Check backend `CORS_ORIGIN` environment variable matches frontend URL
2. Redeploy backend after updating
3. Hard refresh frontend (Ctrl+Shift+R)

### Issue: API Endpoints Not Found

**Error:** `404 Not Found` on API calls

**Solution:**
1. Verify backend is running: Visit backend URL in browser
2. Check backend routes in `server/src/routes/`
3. Check API_URL in frontend environment variables

### Issue: Database Connection Failed

**Error:** `MongoError: connection refused`

**Solution:**
1. Verify `MONGO_URI` is correct
2. Check MongoDB Atlas IP whitelist includes Vercel IPs
3. In MongoDB Atlas: Network Access → Add IP Address → Allow 0.0.0.0/0 (for testing)

### Issue: Environment Variables Not Loaded

**Error:** `undefined` for process.env variables

**Solution:**
1. Ensure variables are added in Vercel Dashboard
2. Redeploy project (don't just rebuild)
3. For frontend: Use `import.meta.env.VITE_*` prefix

### Issue: Frontend Build Fails

**Error:** `Command 'npm run build' exited with code 1`

**Solution:**
1. Run locally: `npm run build` to see full error
2. Fix errors locally
3. Commit and push
4. Redeploy

---

## 📝 Production Best Practices

### Security

1. ✅ Never commit `.env` files
2. ✅ Use strong JWT_SECRET (32+ characters)
3. ✅ Enable HTTPS only (Vercel handles this)
4. ✅ Validate all API inputs
5. ✅ Use environment variables for all sensitive data

### Performance

1. Frontend: Already optimized with Vite
2. Backend: 
   - Use connection pooling for MongoDB
   - Add caching headers
   - Compress responses

### Monitoring

1. Add Vercel Analytics
2. Monitor error logs in Vercel Dashboard
3. Set up email alerts for deployment failures

---

## 🔄 Continuous Deployment

### Automatic Deployments

1. Push changes to GitHub `main` branch
2. Vercel automatically redeploys
3. View deployment status in Vercel Dashboard

### Manual Deployment

```bash
vercel --prod
```

---

## 📞 Quick Reference

| Component | URL | Environment Variable |
|-----------|-----|---------------------|
| Frontend | https://genproject-frontend.vercel.app | - |
| Backend | https://genproject-backend.vercel.app | VITE_API_URL |
| Database | MongoDB Atlas | MONGO_URI |

---

## ✨ After Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login successfully  
- [ ] Can create interview
- [ ] Can retrieve interview data
- [ ] No CORS errors in console
- [ ] No 404 errors for API calls
- [ ] MongoDB data persists
- [ ] Environment variables are set on Vercel

---

**Last Updated:** June 2026
**Status:** Ready for Production Deployment
