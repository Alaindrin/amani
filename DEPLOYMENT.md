# Deployment Guide

This guide explains how to deploy your portfolio application to production.

## Architecture Overview

Your application consists of two parts:
1. **Frontend (React + Vite)** - Deployed on Vercel
2. **Backend (Express API)** - Needs to be deployed separately

## Step 1: Deploy the Backend

Your Express backend needs to be deployed on a platform that supports Node.js servers. Recommended options:

### Option A: Railway (Recommended - Easy & Free Tier)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect it's a Node.js app
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `PORT` - Railway will set this automatically, or use 3001
   - `NODE_ENV` - Set to `production`
6. Deploy command should be: `npm run server`
7. After deployment, copy your Railway app URL (e.g., `https://your-app.up.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. New → Web Service
3. Connect your GitHub repository
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
   - **Environment Variables:**
     - `MONGODB_URI` - Your MongoDB Atlas connection string
     - `NODE_ENV` - `production`
5. After deployment, copy your Render app URL (e.g., `https://your-app.onrender.com`)

### Option C: Vercel Serverless Functions

If you want to keep everything on Vercel, you'll need to convert your Express routes to serverless functions. This is more complex - let me know if you want help with this.

## Step 2: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api` (use your Railway/Render URL from Step 1)
   - **Environment:** Production, Preview, Development (check all)
5. Click "Save"

## Step 3: Redeploy Frontend

After adding the environment variable:

```bash
git add .
git commit -m "fix: configure API URL for production"
git push
```

Vercel will automatically redeploy with the new environment variable.

## Step 4: Verify Everything Works

1. Visit your Vercel URL
2. Open browser DevTools → Console
3. You should NO longer see `ERR_CONNECTION_REFUSED` errors
4. Test the contact form and quotation requests

## Environment Variables Summary

### Frontend (.env for local development)
```
VITE_API_URL=http://localhost:3001/api
```

### Frontend (Vercel production)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env for local development)
```
MONGODB_URI=mongodb+srv://...your-atlas-connection-string...
PORT=3001
NODE_ENV=development
```

### Backend (Railway/Render production)
```
MONGODB_URI=mongodb+srv://...your-atlas-connection-string...
NODE_ENV=production
```

## Local Development

For local development, the setup works as before:

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client

# Or both together
npm run dev
```

The frontend will proxy `/api` requests to `http://localhost:3001` during development.

## Troubleshooting

### Still seeing localhost errors?

1. Check Vercel environment variable is set correctly
2. Make sure you redeployed after adding the variable
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Backend not responding?

1. Check backend logs in Railway/Render dashboard
2. Verify MongoDB Atlas connection string is correct
3. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or your backend's IP

### CORS errors?

Your backend already has CORS enabled. If you still see CORS errors, ensure your backend is accessible and the URL is correct.

## Production Checklist

- ✅ Backend deployed to Railway/Render/etc.
- ✅ `VITE_API_URL` environment variable set in Vercel
- ✅ MongoDB Atlas connection string configured
- ✅ MongoDB Atlas allows connections from backend IP
- ✅ Frontend redeployed after environment variable change
- ✅ No localhost references in code
- ✅ Contact form and quotations working