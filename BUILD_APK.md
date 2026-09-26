# How to Build and Install APK

Follow these step-by-step instructions to create an installable APK file for Android.

## 🚀 Quickest Way: Using Expo (Recommended)

### Step 1: Prerequisites
- Install Node.js from https://nodejs.org (v18+)
- Install Expo CLI: Open terminal and run:
  ```
  npm install -g eas-cli expo-cli
  ```

### Step 2: Setup
```bash
cd ShopPOS
npm install
```

### Step 3: Build APK
```bash
eas build --platform android
```

Follow the prompts:
- Create a free account at https://expo.dev (if you don't have one)
- Choose "Generic" when asked about app type
- The build will start in the cloud
- Check your email for the APK download link when complete

### Step 4: Install on Android
1. Download the APK from the link sent to your email
2. Transfer to your Android phone
3. Enable "Unknown Sources" in Settings > Security
4. Tap the APK file to install

---

## Alternative: Local Build (Faster, No Cloud)

### Prerequisites
- Download Android Studio from https://developer.android.com/studio
- Install it with default settings
- Use Node.js v18 or higher

### Step-by-Step

1. **Open Terminal/Command Prompt**

2. **Navigate to app folder:**
   ```bash
   cd ShopPOS
   ```

3. **Install dependencies:**
   ```bash
   npm install
   npm install expo-build-properties
   ```

4. **Create native Android project:**
   ```bash
   npx expo prebuild --clean
   ```
   (This creates the `android/` folder)

5. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   (On Windows: use `gradlew.bat assembleRelease`)

6. **Wait for build** (this takes 5-10 minutes)

7. **Find your APK:**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`
   - Size: ~100-150 MB

### Step 8: Install on Phone

#### Via USB Cable:
```bash
./gradlew installRelease
```

#### Via File Transfer:
1. Copy `app-release.apk` to your Android phone
2. Open file manager on phone
3. Tap the APK file
4. Tap "Install"

#### Via Android Studio:
1. Open Android Studio
2. Go to Build > Generate Signed Bundle/APK
3. Select APK option
4. Deploy to connected device

---

## Troubleshooting Build Issues

### Issue: "gradle not found"
**Solution:** Make sure you're in the correct directory:
```bash
cd ShopPOS
```

### Issue: "Java version mismatch"
**Solution:** Install Java 11 or higher from oracle.com/java

### Issue: Build hangs
**Solution:** 
- First time builds are slow (10+ minutes)
- Check internet connection
- Try: `./gradlew clean` then rebuild

### Issue: "Out of memory"
**Solution:** 
```bash
export GRADLE_OPTS="-Xmx2048m"
./gradlew assembleRelease
```

### Issue: APK is too large
**Solution:** This is normal for React Native apps (100-150MB)

---

## After Building

### Share APK with Team
1. Upload to Google Drive or similar
2. Share the download link
3. Team members can install directly

### Update Products in Future
1. Replace `products.json` with new file
2. Rebuild APK with steps above
3. Re-distribute new APK

### Customize App
Before building, you can customize:
- Colors in `App.js` (search for `#6200ee`)
- App name in `app.json` (modify "name" field)
- App icon in `app.json`

---

## Testing Before Install

### Quick Test (No APK needed):
```bash
cd ShopPOS
npm start
```

Then either:
- **On Computer:** Press `w` for web preview
- **On Phone:** Install Expo Go from Play Store and scan QR code

### Full Test (APK):
1. Install on actual Android phone
2. Test search with different queries
3. Add items to cart
4. Test checkout

---

## Success! 🎉

Your APK is ready to install. The app:
- ✅ Works offline (no internet needed)
- ✅ Searches 27,000+ products instantly
- ✅ Stores cart in device memory
- ✅ Has beautiful Material Design UI

Enjoy using ShopPOS for your shop!
