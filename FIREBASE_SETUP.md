# Firebase Setup Instructions

## Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Create a Firebase project at https://console.firebase.google.com

## Setup Steps

### 1. Initialize Firebase Project
```bash
firebase login
firebase init
```

Select:
- Functions (TypeScript)
- Firestore
- Storage
- Hosting

### 2. Configure Firebase Project
Update `src/lib/firebase.ts` with your Firebase config from the Firebase Console.

### 3. Install Dependencies
```bash
# Install frontend dependencies (if not already done)
npm install firebase

# Install function dependencies
cd functions
npm install
cd ..
```

### 4. Create Admin User
After deployment, create an admin user by calling:
```bash
curl -X POST https://your-region-your-project.cloudfunctions.net/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@courtcases.com", "password": "your-secure-password"}'
```

### 5. Deploy to Firebase
```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy everything
firebase deploy
```

### 6. Update API Base URL
Update the `API_BASE_URL` in `src/lib/api.ts` with your actual Firebase Functions URL.

## Local Development

### 1. Start Firebase Emulators
```bash
firebase emulators:start
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

## Security Rules

The project includes:
- **Firestore Rules**: Public read access for court cases, admin write access
- **Storage Rules**: Public read access for PDFs, admin write access

## Environment Variables

Create a `.env.local` file in the root directory:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## Features Included

### Backend (Firebase Functions)
- ✅ CRUD operations for court cases
- ✅ File upload handling (PDFs to Firebase Storage)
- ✅ Authentication with Firebase Auth
- ✅ Admin role management
- ✅ Pagination and filtering
- ✅ Search functionality

### Database Schema (Firestore)
```typescript
interface CourtCase {
  id: string;
  caseTitle: string;
  caseNumber: string; // Unique
  description?: string;
  dateFiled: string;
  status: string; // Active, Closed, Pending, etc.
  courtName?: string;
  judgeName?: string;
  plaintiff?: string;
  defendant?: string;
  caseType?: string;
  priority: string; // High, Medium, Low
  pdfFileUrl?: string;
  pdfFileName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### API Endpoints
- `GET /api/court-cases` - List all court cases (with pagination/filtering)
- `GET /api/court-cases/:id` - Get single court case
- `POST /api/court-cases` - Create new court case (admin only)
- `PUT /api/court-cases/:id` - Update court case (admin only)
- `DELETE /api/court-cases/:id` - Delete court case (admin only)
- `POST /api/auth/create-admin` - Create admin user
- `GET /api/auth/verify` - Verify authentication token

Ready for frontend development!