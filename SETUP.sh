#!/bin/bash

# ShopPOS Setup Script
# This script automates the initial setup

echo "🚀 ShopPOS Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please download and install from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✓ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm start"
echo "2. Press 'a' for Android"
echo "3. Install Expo Go from Google Play"
echo "4. Scan the QR code with Expo Go"
echo ""
echo "To build APK:"
echo "- Cloud build: eas build --platform android"
echo "- Local build: npx expo prebuild --clean && cd android && ./gradlew assembleRelease"
