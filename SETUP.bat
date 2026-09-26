@echo off
REM ShopPOS Setup Script for Windows

echo.
echo 🚀 ShopPOS Setup Script
echo ========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please download and install from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✓ Dependencies installed
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Run: npm start
echo 2. Press 'a' for Android
echo 3. Install Expo Go from Google Play
echo 4. Scan the QR code with Expo Go
echo.
echo To build APK:
echo - Cloud build: eas build --platform android
echo - Local build: npx expo prebuild --clean ^&^& cd android ^&^& gradlew.bat assembleRelease
echo.
pause
