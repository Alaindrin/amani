# Quick Fix for Vercel Deployment

## The Problem
Your frontend on Vercel is trying to call `localhost:3001` which doesn't exist in production.

## The Solution (3 Steps)

### 1. Deploy Your Backend Separately

**Choose one platform:**

#### Railway (Easiest)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Add environment variable: `MONGODB_URI` (your Atlas connection)
5. Copy your Railway URL (e.g., `https://abc123.up.railway.app`)

#### Render
1. Go to https://render.com  
2. New → Web Service → Connect repo
3. Start command: `npm run server`
4. Add environment variable: `MONGODB_URI`
5. Copy your Render URL (e.g., `https://abc123.onrender.com`)

### 2. Add Environment Variable to Vercel

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url-from-step-1.com/api`
   - **Environments:** Check all (Production, Preview, Development)
3. Save

### 3. Redeploy

```bash
git add .
git commit -m "fix: use environment variable for API URL"
git push
```

## That's It!

Wait for Vercel to redeploy (auto-triggers on push). The connection refused errors should be gone.

## How to Test

1. Open your Vercel site
2. Press F12 (DevTools) → Console tab
3. Should see no `localhost:3001` errors
4. Try submitting the contact form

## What We Changed

- ✅ `src/lib/api.ts` now uses `import.meta.env.VITE_API_URL` instead of hardcoded localhost
- ✅ Added `.env` file for local development
- ✅ Added vite proxy for local development
- ✅ Created deployment guides

## Need Help?

If you get stuck, share:
1. Your backend deployment URL
2. Screenshot of Vercel environment variables
3. Any new error messages in browser console