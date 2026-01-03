# Court Cases Backend Server

A Node.js + Express backend server for handling image uploads for the Court Cases section.

## Features

- **Image Upload**: Handle single image uploads via POST request
- **File Validation**: Only allows JPG, JPEG, PNG, and WebP files
- **File Size Limit**: Maximum 5MB per image
- **Unique Filenames**: Generates unique filenames using timestamps
- **Static File Serving**: Serves uploaded images via public URLs
- **Error Handling**: Comprehensive error handling for various scenarios
- **CORS Enabled**: Cross-origin requests allowed for frontend integration

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Upload Image
- **URL**: `POST /api/court-cases/upload`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `photo`
- **Allowed Types**: JPG, JPEG, PNG, WebP
- **Max Size**: 5MB

**Success Response:**
```json
{
  "success": true,
  "filename": "1703123456789-temple-image.jpg",
  "originalName": "temple-image.jpg",
  "size": 1234567,
  "mimetype": "image/jpeg",
  "url": "http://localhost:5000/photos/1703123456789-temple-image.jpg",
  "message": "Image uploaded successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "No file uploaded. Please select an image file."
}
```

### Access Images
- **URL**: `GET /photos/:filename`
- **Example**: `http://localhost:5000/photos/1703123456789-temple-image.jpg`

## File Storage

- **Directory**: `backend/photos/`
- **Naming**: `{timestamp}-{original-name}.{extension}`
- **Example**: `1703123456789-temple-image.jpg`

## Error Handling

The server handles various error scenarios:

- **No file uploaded**: Returns 400 with appropriate message
- **Invalid file type**: Returns 400 for non-image files
- **File too large**: Returns 400 for files over 5MB
- **Server errors**: Returns 500 for internal errors

## Integration with Frontend

To use this backend with your React frontend, update your image upload logic to:

1. Send POST requests to `http://localhost:5000/api/court-cases/upload`
2. Use FormData with field name `photo`
3. Handle the returned URL for displaying images

Example frontend code:
```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await fetch('http://localhost:5000/api/court-cases/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.url; // Use this URL to display the image
};
```

## Security Notes

- File type validation prevents non-image uploads
- File size limits prevent large file attacks
- Unique filenames prevent file conflicts
- CORS is enabled for development (configure for production)

## Production Deployment

For production deployment:

1. Set appropriate CORS origins
2. Use environment variables for configuration
3. Consider using cloud storage (AWS S3, etc.) instead of local storage
4. Add authentication/authorization as needed
5. Use HTTPS for secure file transfers