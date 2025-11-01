# Android APK Build Guide for Hydro-Flow Monitor

This guide will help you build and deploy your Hydro-Flow web application as an Android APK.

## ✅ Prerequisites

Before building the APK, ensure you have:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Set `JAVA_HOME` environment variable

2. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API Level 33 or higher)
   - Install Android Build Tools

3. **Node.js and npm** (Already installed)

## 📱 What Was Done

### 1. Capacitor Setup
- ✅ Installed Capacitor core, CLI, and Android packages
- ✅ Initialized Capacitor with app configuration
- ✅ Added Android platform to the project
- ✅ Configured app ID: `com.hydroflow.app`

### 2. Configuration Updates
- ✅ Updated `capacitor.config.json` with proper settings
- ✅ Added network permissions to `AndroidManifest.xml`
- ✅ Enabled cleartext traffic for backend API communication
- ✅ Added mobile-specific npm scripts

### 3. Package Scripts Added
```json
"cap:sync": "npm run build && npx cap sync",
"cap:open:android": "npx cap open android",
"cap:run:android": "npm run cap:sync && npx cap run android",
"cap:build:android": "npm run build && npx cap sync android && npx cap copy android"
```

## 🔧 Environment Setup

### Step 1: Install Android Studio
1. Download and install Android Studio
2. Open Android Studio
3. Go to **Tools > SDK Manager**
4. Install:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools 33.x.x (or latest)
   - Android SDK Command-line Tools

### Step 2: Set Environment Variables (Windows)
Add these to your System Environment Variables:

```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

## 🏗️ Building the APK

### Method 1: Using Android Studio (Recommended)

1. **Sync your web assets with Android:**
   ```bash
   npm run cap:sync
   ```

2. **Open Android Studio:**
   ```bash
   npm run cap:open:android
   ```
   Or manually: `npx cap open android`

3. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Click **Build > Generate Signed Bundle / APK**
   - Select **APK**
   - Click **Next**

4. **Create a new keystore (first time only):**
   - Click **Create new...**
   - Choose a location and name for your keystore file
   - Set a password (remember this!)
   - Fill in certificate details
   - Click **OK**

5. **Build the APK:**
   - Select your keystore
   - Enter passwords
   - Choose **release** build variant
   - Click **Finish**

6. **Find your APK:**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Using Command Line

1. **Navigate to android folder:**
   ```bash
   cd android
   ```

2. **Build debug APK (for testing):**
   ```bash
   ./gradlew assembleDebug
   ```
   APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Build release APK:**
   ```bash
   ./gradlew assembleRelease
   ```
   APK location: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔐 Signing the APK (Production)

For production/Play Store release, you need a signed APK:

### Create Keystore (One-time setup)
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing
1. Create `android/key.properties`:
```properties
storeFile=my-release-key.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

2. Update `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Build signed APK:
```bash
cd android
./gradlew assembleRelease
```

## 🚀 Testing the APK

### On Physical Device
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run: `npm run cap:run:android`
   Or: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

### On Emulator
1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Create a new virtual device
4. Start the emulator
5. Run: `npm run cap:run:android`

## 📲 Installing the APK

### Manual Installation
1. Copy the APK file to your Android device
2. Open the file with a file manager
3. Tap **Install** (you may need to enable "Install from unknown sources")

### Via ADB
```bash
adb install path/to/app-debug.apk
```

## 🔄 Updating Your App

When you make changes to your web app:

1. **Rebuild the web assets:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Rebuild APK in Android Studio or:**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## 🌐 Backend Configuration

Your app will continue to use your **deployed Render backend**. Make sure:

1. **Backend URL is correct** in your React app's API configuration
2. **CORS is configured** to allow requests from the mobile app
3. **Environment variables** are properly set in your `.env` file:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

## 🎨 Customizing Your App

### App Icon
1. Create app icons (512x512, 192x192, etc.)
2. Place in `android/app/src/main/res/mipmap-*/`
3. Update references in `AndroidManifest.xml`

### Splash Screen
Update in `capacitor.config.json`:
```json
"plugins": {
  "SplashScreen": {
    "launchShowDuration": 2000,
    "backgroundColor": "#1e3a8a",
    "showSpinner": true
  }
}
```

### App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Hydro-Flow Monitor</string>
```

## 📦 Publishing to Google Play Store

1. **Prepare your app:**
   - Create app icon and screenshots
   - Write app description
   - Set up privacy policy URL

2. **Create Play Console account:**
   - https://play.google.com/console
   - Pay one-time $25 registration fee

3. **Upload APK:**
   - Create new app in Play Console
   - Upload your signed release APK
   - Fill in store listing details
   - Submit for review

## 🐛 Troubleshooting

### Build Errors
- **Gradle sync failed**: Check Android SDK installation
- **Java not found**: Verify JAVA_HOME is set correctly
- **SDK not found**: Verify ANDROID_HOME path

### Runtime Errors
- **White screen**: Check browser console in Android Studio Logcat
- **API not working**: Verify CORS settings and backend URL
- **Clerk auth issues**: Ensure Clerk domain is configured for mobile

### Network Issues
- Ensure `android:usesCleartextTraffic="true"` is in AndroidManifest.xml
- Check internet permissions are granted
- Verify backend URL is accessible

## 📞 Support Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer Guide**: https://developer.android.com/guide
- **Clerk Mobile Docs**: https://clerk.com/docs/quickstarts/react-native

## ✨ Quick Commands Reference

```bash
# Sync web changes with mobile
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Run on device/emulator
npm run cap:run:android

# Build and sync
npm run cap:build:android

# Check connected devices
adb devices

# View logs
adb logcat

# Uninstall app
adb uninstall com.hydroflow.app
```

## 🎉 Success Checklist

- [ ] Android Studio installed
- [ ] JDK installed and JAVA_HOME set
- [ ] Android SDK installed
- [ ] Environment variables configured
- [ ] Web app builds successfully
- [ ] Android project opens in Android Studio
- [ ] APK builds without errors
- [ ] App installs on device
- [ ] App connects to backend
- [ ] Clerk authentication works
- [ ] All features working on mobile

---

**Your web app is now a mobile app! 🎊**

The same codebase runs on web and mobile, using your existing Render backend.
