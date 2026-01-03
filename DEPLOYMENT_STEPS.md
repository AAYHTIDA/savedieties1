# Complete Deployment Steps

## 🚀 For Full Production System:

### 1. Deploy Firebase Backend
```bash
# Login to Firebase
firebase login

# Initialize project (if not done)
firebase use diety-204b0

# Build functions
cd functions
npm run build
cd ..

# Deploy everything
firebase deploy
```

### 2. Update Environment Variables
After Firebase deployment, update your API URL:

**Local (.env.local):**
```
VITE_API_BASE_URL=https://us-central1-diety-204b0.cloudfunctions.net/api
```

**Netlify Environment Variables:**
Add this in Netlify dashboard:
```
VITE_API_BASE_URL=https://us-central1-diety-204b0.cloudfunctions.net/api
```

### 3. Create Admin User via API
```bash
curl -X POST https://us-central1-diety-204b0.cloudfunctions.net/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@courtcases.com", "password": "admin123"}'
```

### 4. Redeploy Frontend
```bash
# Commit changes
git add .
git commit -m "Update API URL for production"
git push origin main

# Netlify will auto-redeploy
```

## 🎯 What You Get:

### Without Redeploy (Current):
- ✅ View court cases (if you add some manually in Firestore)
- ✅ Firebase authentication
- ❌ No CRUD operations (no API backend)

### With Full Deployment:
- ✅ Complete CRUD system
- ✅ File upload to Firebase Storage
- ✅ Real-time data
- ✅ Production-ready backend
- ✅ Admin management