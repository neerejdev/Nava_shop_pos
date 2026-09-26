# Quick Start Guide - 5 Minutes to Running

## 🎯 The Fastest Way

### 1. Prerequisites (1 min)
Download and install Node.js from https://nodejs.org (v18 or higher)

### 2. Extract & Setup (2 min)
```bash
cd ShopPOS
npm install
```

### 3. Run on Your Phone (2 min)
```bash
npm start
```

When it says "Expo ready", options will appear. Choose:
- **Android Phone?** Press `a`
- Install Expo Go from Google Play Store
- Scan the QR code shown in terminal

### Done! 🎉
The app should appear on your phone in seconds.

---

## 🏗️ Build APK (30-60 minutes first time)

### Method 1: Cloud Build (Easiest, No Setup)
```bash
npm install -g eas-cli
eas login
eas build --platform android
```
- Email link will be sent with APK download
- Takes ~10 minutes
- Free account at expo.dev

### Method 2: Local Build (Requires Android Studio)
```bash
npm install expo-build-properties
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```
- APK at: `android/app/build/outputs/apk/release/app-release.apk`
- Takes 5-10 minutes after first setup

---

## 📱 Features Quick Tour

1. **Search** - Type product code or name
2. **Auto-Suggestion** - See up to 15 matching products
3. **Select** - Tap product to choose it
4. **Quantity** - Adjust with +/- buttons
5. **Add to Cart** - Auto-calculates subtotal
6. **Checkout** - Review order and confirm

---

## 🆘 Troubleshooting 60 Seconds

| Problem | Solution |
|---------|----------|
| App won't start | `npm start -- --clear` then try again |
| Can't find products | Check `products.json` exists in folder |
| Slow search | Normal for first load of 27K products |
| APK too big | 100-150MB is normal for React Native |
| Won't install on phone | Enable "Unknown Sources" in Settings > Security |

---

## 📋 What to Do Next

1. **Customize Colors** - Edit `#6200ee` in `App.js`
2. **Update Products** - Replace `products.json` with new data
3. **Share APK** - Build APK and distribute to team
4. **Add Features** - Modify `App.js` React component

---

See `README.md` for complete documentation!
