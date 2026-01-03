const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Firebase Admin SDK for user management
let admin;
try {
  admin = require('firebase-admin');
  
  let serviceAccount;
  
  // Try environment variable first (for production on Render)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Using Firebase credentials from environment variable');
  } else {
    // Fall back to local file (for development)
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath);
      console.log('✅ Using Firebase credentials from local file');
    }
  }
  
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized');
  } else {
    console.warn('⚠️ No Firebase credentials found - user deletion will not work');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not available:', error.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8081',
    'https://savediety.netlify.app',
    'https://savedeities1.netlify.app',
    'https://savedieties2.netlify.app',
    'https://savedieties.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Serve static files from photos directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'photos'));
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const uniqueName = `${timestamp}-${nameWithoutExt}${extension}`;
    cb(null, uniqueName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WebP files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Court Cases Image Upload Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    endpoints: {
      upload: 'POST /api/court-cases/upload',
      photos: 'GET /photos/:filename',
      health: 'GET /health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Single image upload route (existing functionality)
app.post('/api/court-cases/upload', upload.single('photo'), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please select an image file.'
      });
    }

    // Generate public URL for the uploaded image
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const publicUrl = `${baseUrl}/photos/${req.file.filename}`;

    // Return success response
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: publicUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during file upload'
    });
  }
});

// Multiple images upload route
app.post('/api/court-cases/upload-multiple', upload.array('photos', 10), (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded. Please select image files.'
      });
    }

    // Generate public URLs for all uploaded images
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const uploadedImages = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `${baseUrl}/photos/${file.filename}`,
      uploadedAt: new Date().toISOString()
    }));

    // Return success response
    res.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length,
      message: `${uploadedImages.length} image(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during file upload'
    });
  }
});

// Delete user from Firebase Auth
app.delete('/api/users/:uid', async (req, res) => {
  try {
    if (!admin) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin SDK not configured'
      });
    }

    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'User UID is required'
      });
    }

    // Delete user from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    res.json({
      success: true,
      message: 'User deleted from Firebase Auth successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        error: 'User not found in Firebase Auth'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete user'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Court Cases Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Photos will be stored in: ${photosDir}`);
  console.log(`🖼️  Access photos at: http://localhost:${PORT}/photos/[filename]`);
});

module.exports = app;