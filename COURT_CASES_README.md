# Court Cases Management System

A complete CRUD system for managing court cases with Firebase backend and React frontend.

## 🚀 Features

### Frontend Features ✅
- **Modern UI**: Clean, responsive design with shadcn/ui components
- **Court Cases List**: Grid view with detailed case cards
- **Advanced Filtering**: Search by title/number/description, filter by status
- **Sorting Options**: Sort by date, title, status, priority
- **Pagination**: Configurable items per page with navigation
- **PDF Viewer**: Download and view court documents
- **Admin Authentication**: Secure login for case management
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend Features ✅
- **Firebase Functions**: Serverless API endpoints
- **Firestore Database**: NoSQL document storage
- **Firebase Storage**: PDF file uploads with public URLs
- **Firebase Auth**: Admin authentication system
- **CRUD Operations**: Create, Read, Update, Delete court cases
- **File Upload**: PDF document handling with validation
- **Security Rules**: Public read, admin write access
- **Pagination**: Server-side pagination support
- **Search & Filter**: Query optimization with indexes

## 📋 Court Case Schema

```typescript
interface CourtCase {
  id: string;
  caseTitle: string;
  caseNumber: string; // Unique identifier
  description?: string;
  dateFiled: string;
  status: string; // Active, Pending, Closed, Dismissed, Settled
  courtName?: string;
  judgeName?: string;
  plaintiff?: string;
  defendant?: string;
  caseType?: string; // Civil, Criminal, Family, etc.
  priority: string; // High, Medium, Low
  pdfFileUrl?: string; // Firebase Storage URL
  pdfFileName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🛠️ Setup Instructions

### 1. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

Select:
- ✅ Functions (TypeScript)
- ✅ Firestore
- ✅ Storage  
- ✅ Hosting

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd functions
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Update with your Firebase config
# Get config from Firebase Console > Project Settings
```

### 4. Deploy Firebase Backend
```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy to Firebase
firebase deploy
```

### 5. Create Admin User
```bash
# After deployment, create admin user
curl -X POST https://your-region-your-project.cloudfunctions.net/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@courtcases.com", "password": "your-secure-password"}'
```

### 6. Start Development
```bash
# Start Firebase emulators (for local development)
firebase emulators:start

# Start frontend (in another terminal)
npm run dev
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/create-admin` - Create admin user
- `GET /api/auth/verify` - Verify authentication token

### Court Cases
- `GET /api/court-cases` - List court cases (with pagination/filtering)
- `GET /api/court-cases/:id` - Get single court case
- `POST /api/court-cases` - Create court case (admin only)
- `PUT /api/court-cases/:id` - Update court case (admin only)
- `DELETE /api/court-cases/:id` - Delete court case (admin only)

### Query Parameters (GET /api/court-cases)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for title/number/description
- `status` - Filter by status (Active, Pending, Closed, etc.)
- `sortBy` - Sort field (createdAt, dateFiled, caseTitle, etc.)
- `sortOrder` - Sort direction (asc, desc)

## 🎨 UI Components

### Pages
- **CourtCases** - Main court cases management page
- **Index** - Homepage with court cases overview section

### Components
- **CourtCaseCard** - Individual case display card
- **CourtCaseForm** - Create/edit case form with file upload
- **CourtCaseFilters** - Search and filter controls
- **CourtCasesPagination** - Pagination navigation
- **LoginForm** - Admin authentication form

### Features
- **Drag & Drop Upload** - PDF file upload with validation
- **Real-time Validation** - Form validation with error messages
- **Loading States** - Skeleton loading and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/error feedback

## 🔒 Security

### Firestore Rules
```javascript
// Public read access, admin write access
match /courtCases/{document} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}
```

### Storage Rules
```javascript
// Public read access for PDFs, admin write access
match /court-cases/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}
```

### File Upload Validation
- ✅ PDF files only
- ✅ 10MB size limit
- ✅ Unique filename generation
- ✅ Automatic cleanup on update/delete

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop**: Full-featured interface
- **Touch Friendly**: Large touch targets
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Backend (Firebase Functions)
```bash
# Deploy functions
firebase deploy --only functions

# Deploy database rules
firebase deploy --only firestore:rules

# Deploy storage rules
firebase deploy --only storage
```

## 📊 Performance

- **Lazy Loading**: Components loaded on demand
- **Pagination**: Server-side pagination for large datasets
- **Caching**: React Query for API response caching
- **Optimized Images**: Responsive image loading
- **Bundle Splitting**: Code splitting for faster loads

## 🔧 Development

### Local Development
```bash
# Start Firebase emulators
firebase emulators:start

# Start frontend dev server
npm run dev

# Access at http://localhost:5173
```

### Testing
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📈 Future Enhancements

- [ ] Advanced search with filters
- [ ] Case timeline and history
- [ ] Document versioning
- [ ] Email notifications
- [ ] Bulk operations
- [ ] Export to PDF/Excel
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Check environment variables in `.env.local`
   - Verify Firebase project settings

2. **Authentication Issues**
   - Ensure admin user is created
   - Check Firebase Auth configuration

3. **File Upload Errors**
   - Verify Storage rules are deployed
   - Check file size and type restrictions

4. **API Connection Issues**
   - Verify Functions are deployed
   - Check CORS configuration

### Support
For issues and questions, check the Firebase documentation or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, Firebase, and shadcn/ui**