@echo off
echo Starting Court Cases System - Local Development
echo.

echo 1. Starting Firebase Emulators...
start "Firebase Emulators" cmd /k "firebase emulators:start"

echo 2. Waiting for emulators to start...
timeout /t 10

echo 3. Frontend is already running at http://localhost:8080/
echo 4. Firebase Emulator UI will be at http://localhost:4000/
echo.
echo System is ready! Press any key to continue...
pause