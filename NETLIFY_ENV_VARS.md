# Netlify Environment Variables

Add these environment variables in your Netlify dashboard:
Site Settings → Environment variables → Add variable

## Required Variables:

VITE_FIREBASE_API_KEY = AIzaSyCAbXN9unFCNvTO2HtxFdgZkTA9NMcjJUo
VITE_FIREBASE_AUTH_DOMAIN = diety-204b0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = diety-204b0
VITE_FIREBASE_STORAGE_BUCKET = diety-204b0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 1071397904810
VITE_FIREBASE_APP_ID = 1:1071397904810:web:7c157fa97c81ba3f104bd3

## For Production API (when you deploy Firebase Functions):
VITE_API_BASE_URL = https://us-central1-diety-204b0.cloudfunctions.net/api

## Steps:
1. Go to Netlify Dashboard
2. Select your site
3. Site settings → Environment variables
4. Click "Add variable" for each one above
5. Redeploy your site