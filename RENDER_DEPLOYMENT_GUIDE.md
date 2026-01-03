# Render Deployment Guide

## Backend Deployment (Already Done)
Your backend is deployed at: https://savedieties1.onrender.com

### Environment Variables to Set on Render Backend:
1. `BASE_URL=https://savedieties1.onrender.com`
2. `NODE_ENV=production`
3. `FRONTEND_URL=https://your-frontend-domain.com` (update when you deploy frontend)

## Frontend Deployment

### Option 1: Deploy Frontend to Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables:
   - `VITE_FIREBASE_API_KEY=AIzaSyCAbXN9unFCNvTO2HtxFdgZkTA9NMcjJUo`
   - `VITE_FIREBASE_AUTH_DOMAIN=diety-204b0.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID=diety-204b0`
   - `VITE_FIREBASE_STORAGE_BUCKET=diety-204b0.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID=1071397904810`
   - `VITE_FIREBASE_APP_ID=1:1071397904810:web:7c157fa97c81ba3f104bd3`
   - `VITE_BACKEND_URL=https://savedieties1.onrender.com`

### Option 2: Deploy Frontend to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard (same as above)

### Option 3: Deploy Frontend to Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard (same as above)

## After Frontend Deployment
1. Update the `FRONTEND_URL` environment variable in your Render backend service
2. The backend CORS is already configured to accept your frontend domain

## Testing the Connection
1. Visit your deployed frontend
2. Try uploading an image in the court cases section
3. The image should upload to your Render backend and be accessible via the backend URL

## Local Development
- Use `.env` file for local development
- Backend will run on `http://localhost:5000`
- Frontend will run on `http://localhost:5173`