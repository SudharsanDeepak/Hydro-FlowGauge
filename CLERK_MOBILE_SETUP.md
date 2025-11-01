# Clerk Authentication for Mobile App

## 🔐 Clerk Mobile Configuration

Your Clerk authentication will work in the mobile app, but you need to ensure proper configuration.

## ✅ Current Setup

Your web app already uses Clerk with:
- `@clerk/clerk-react` package ✅
- `VITE_CLERK_PUBLISHABLE_KEY` in `.env` ✅
- `<ClerkProvider>` wrapping your app ✅

## 📱 Mobile Considerations

### 1. Domain Configuration

In your **Clerk Dashboard** (https://dashboard.clerk.com):

1. Go to **Settings** → **Domains**
2. Add your production domain if not already added
3. For mobile development, Clerk automatically handles localhost

### 2. OAuth & Social Login

If you're using social logins (Google, Facebook, etc.):

#### For Development:
- Clerk handles OAuth redirects automatically
- Works in both web and mobile

#### For Production:
1. In Clerk Dashboard → **User & Authentication** → **Social Connections**
2. For each provider, you may need to:
   - Add mobile-specific OAuth redirect URLs
   - Configure deep linking (optional)

### 3. Deep Linking (Optional)

To handle authentication redirects in your mobile app:

#### Add Intent Filter to AndroidManifest.xml

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="your-domain.com"
          android:pathPrefix="/" />
</intent-filter>
```

#### Update Capacitor Config

Add to `capacitor.config.json`:
```json
{
  "plugins": {
    "App": {
      "launchUrl": "https://your-domain.com",
      "androidScheme": "https"
    }
  }
}
```

## 🔧 Environment Variables

Ensure your `.env` file has:

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  # or pk_test_xxxxx for dev

# Backend API (if using separate backend)
VITE_API_URL=https://your-backend.onrender.com/api
```

**Important**: 
- Use `pk_test_` for development
- Use `pk_live_` for production
- Never commit your `.env` file to git

## 🧪 Testing Clerk in Mobile

### Test Authentication Flow

1. **Sign Up**
   ```bash
   npm run cap:run:android
   ```
   - Open the app
   - Try signing up with email
   - Verify email works
   - Check if user is created in Clerk Dashboard

2. **Sign In**
   - Sign in with created account
   - Verify session persists
   - Check if protected routes work

3. **Sign Out**
   - Sign out from the app
   - Verify redirect works
   - Try accessing protected routes

4. **Session Persistence**
   - Sign in
   - Close app completely
   - Reopen app
   - Should still be signed in

### Check Clerk Console

In Android Studio → **Logcat**:
```bash
# Filter for Clerk logs
clerk
```

Look for:
- ✅ Clerk initialized
- ✅ Session loaded
- ✅ User authenticated
- ❌ Any error messages

## 🚨 Common Issues

### Issue 1: "Clerk not loaded"
**Cause**: Clerk publishable key not found

**Solution**:
```bash
# 1. Check .env file exists and has key
cat .env | grep CLERK

# 2. Rebuild with environment variables
npm run build
npx cap sync

# 3. Rebuild APK in Android Studio
```

### Issue 2: OAuth redirects not working
**Cause**: Deep linking not configured

**Solutions**:
1. Use email/password authentication (works by default)
2. Configure deep linking (see above)
3. Use Clerk's hosted pages

### Issue 3: Session not persisting
**Cause**: Storage issues in WebView

**Solution**: Clerk handles this automatically via cookies. If issues persist:
- Check if cookies are enabled in WebView
- Verify `androidScheme: "https"` in config

### Issue 4: CORS errors
**Cause**: Backend rejecting requests from mobile

**Solution**: Update backend CORS to allow:
```javascript
// In your backend
const cors = require('cors');
app.use(cors({
  origin: ['https://your-domain.com', 'capacitor://localhost'],
  credentials: true
}));
```

## 🔐 Security Best Practices

### 1. Protect Your Keys
```bash
# ✅ Good - in .env file (gitignored)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

# ❌ Bad - hardcoded in code
const PUBLISHABLE_KEY = 'pk_live_xxxxx';  // Never do this!
```

### 2. Use Environment-Specific Keys
```env
# Development (.env.development)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Production (.env.production)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 3. Validate on Backend
Never trust the client:
```javascript
// In your backend
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

app.get('/api/protected', 
  ClerkExpressRequireAuth(),
  (req, res) => {
    // req.auth contains validated user info
    res.json({ user: req.auth.userId });
  }
);
```

## 📱 Mobile-Specific Features

### Get User Info in Mobile
```javascript
import { useUser } from '@clerk/clerk-react';

function UserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return (
    <div>
      <img src={user.imageUrl} alt="Profile" />
      <p>{user.fullName}</p>
      <p>{user.primaryEmailAddress.emailAddress}</p>
    </div>
  );
}
```

### Protect Routes in Mobile
```javascript
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        {/* Your protected content */}
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

### Custom Sign In/Up (Mobile Optimized)
```javascript
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useState } from 'react';

function MobileAuth() {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Navigate to dashboard
      }
    } catch (err) {
      console.error('Error:', err);
      // Show mobile-friendly error
    }
  };

  return (
    <form onSubmit={handleSignIn} className="mobile-auth-form">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mobile-input"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mobile-input"
      />
      <button type="submit" className="mobile-button">
        Sign In
      </button>
    </form>
  );
}
```

## 🎨 Mobile UI Components

Clerk provides pre-built components that work great on mobile:

```javascript
import { 
  SignIn, 
  SignUp, 
  UserProfile, 
  UserButton 
} from '@clerk/clerk-react';

// Full-screen sign in (mobile-friendly)
<SignIn 
  routing="path" 
  path="/sign-in"
  appearance={{
    elements: {
      rootBox: "mobile-auth-container",
      card: "mobile-auth-card"
    }
  }}
/>

// Mobile-optimized user button
<UserButton 
  afterSignOutUrl="/welcome"
  appearance={{
    elements: {
      avatarBox: "w-12 h-12"  // Larger for touch
    }
  }}
/>
```

## 📊 Monitoring & Analytics

### Track Auth Events
```javascript
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

function AuthTracker() {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      // Log to analytics
      console.log('User signed in:', userId);
      // Send to your analytics service
      analytics.track('User Signed In', { userId });
    }
  }, [isSignedIn, userId]);

  return null;
}
```

## 🧪 Testing Checklist

- [ ] Sign up works on mobile
- [ ] Email verification works
- [ ] Sign in works on mobile
- [ ] Sign out works on mobile
- [ ] Session persists after app restart
- [ ] Protected routes are blocked when not signed in
- [ ] User data displays correctly
- [ ] Password reset works
- [ ] Social logins work (if enabled)
- [ ] Multi-factor auth works (if enabled)
- [ ] Profile updates sync
- [ ] Performance is acceptable

## 📚 Resources

- **Clerk React Docs**: https://clerk.com/docs/quickstarts/react
- **Clerk Mobile Best Practices**: https://clerk.com/docs/guides
- **Capacitor + Auth**: https://capacitorjs.com/docs/guides/authentication
- **Clerk Community**: https://clerk.com/discord

## 🆘 Getting Help

### Clerk Support
- Discord: https://clerk.com/discord
- Email: support@clerk.com
- Docs: https://clerk.com/docs

### Debug Info to Provide
When asking for help, include:
1. Clerk package version: Check `package.json`
2. Capacitor version: Check `package.json`
3. Android version: API level
4. Error messages: From Logcat
5. Steps to reproduce

## 🎯 Quick Commands

```bash
# Check Clerk is installed
npm list @clerk/clerk-react

# Update Clerk
npm update @clerk/clerk-react

# Test on device
npm run cap:run:android

# View auth logs
adb logcat | grep -i "clerk"

# Clear app data (reset auth)
adb shell pm clear com.hydroflow.app
```

---

**Your mobile app now has secure authentication powered by Clerk! 🔐**

The same auth system works on both web and mobile seamlessly.
