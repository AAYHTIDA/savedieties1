# Deploy to Render

## Step-by-Step Deployment Guide

### Step 1: Prepare Your Repository
1. Make sure your `backend/` folder is in your GitHub repository
2. Commit and push all changes

### Step 2: Create Render Service
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `court-cases-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables
Go to Environment → Add Environment Variables:

```
PORT=10000
BASE_URL=https://your-backend-app.onrender.com
FRONTEND_URL=https://your-frontend-app.onrender.com
NODE_ENV=production
```

**Replace the URLs with your actual Render URLs:**
- `your-backend-app` = your backend service name on Render
- `your-frontend-app` = your frontend service name on Render

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://court-cases-backend.onrender.com`)

### Step 5: Update Frontend
Update your frontend code to use the deployed backend URL instead of `http://localhost:5000`:

In `src/lib/firebase.ts`, replace:
```javascript
const response = await fetch('http://localhost:5000/api/court-cases/upload', {
```

With:
```javascript
const response = await fetch('https://your-backend-app.onrender.com/api/court-cases/upload', {
```

### Step 6: Test
1. Test image upload functionality
2. Verify images are accessible via the public URLs
3. Check CORS is working between frontend and backend

## Important Notes

### File Storage Limitation
⚠️ **Render's free tier has ephemeral storage** - uploaded files will be deleted when the service restarts.

**For production, consider:**
1. **AWS S3** - Most popular choice
2. **Cloudinary** - Image-focused with transformations
3. **Google Cloud Storage** - Good integration with Firebase
4. **Render Persistent Disks** - Paid add-on for permanent storage

### Environment Variables Explained
- `PORT`: Render sets this automatically (usually 10000)
- `BASE_URL`: Your backend's public URL for generating image URLs
- `FRONTEND_URL`: Your frontend's URL for CORS configuration
- `NODE_ENV`: Set to 'production' for optimizations

### Troubleshooting
1. **CORS Errors**: Make sure `FRONTEND_URL` matches your frontend domain exactly
2. **Images Not Loading**: Verify `BASE_URL` is set correctly
3. **Service Won't Start**: Check logs in Render dashboard
4. **File Upload Fails**: Ensure the `photos` directory is created (it's handled automatically)

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- 750 hours/month free (about 31 days)
- Ephemeral storage (files deleted on restart)
- Slower cold starts

### Upgrading for Production
Consider upgrading to paid plans for:
- Always-on services
- Persistent storage
- Better performance
- Custom domains