import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import Landing from './pages/LandingPro';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Mail from './pages/Mail';
import Header from './pages/Header';
import { setGetToken } from './services/api';
import './styles/App.css';

// Check if running in Capacitor
const isCapacitor = window.Capacitor !== undefined;

// Configure StatusBar for mobile app
if (isCapacitor && window.Capacitor?.Plugins?.StatusBar) {
  const { StatusBar } = window.Capacitor.Plugins;
  
  // Set status bar style and ensure it doesn't overlay content
  StatusBar.setStyle({ style: 'Dark' }).catch(err => console.log('StatusBar style error:', err));
  StatusBar.setBackgroundColor({ color: '#1e3a8a' }).catch(err => console.log('StatusBar color error:', err));
  StatusBar.setOverlaysWebView({ overlay: false }).catch(err => console.log('StatusBar overlay error:', err));
  
  console.log('✅ StatusBar configured - content will not overlap');
}

// Deep Link Handler for OAuth
if (isCapacitor && window.Capacitor?.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('appUrlOpen', (event) => {
    console.log('📱 Deep link received:', event.url);
    
    try {
      // Parse the URL
      let targetPath = '/sso-callback';
      
      // Handle different URL formats
      if (event.url.includes('sso-callback')) {
        // Extract query parameters if any
        const urlObj = new URL(event.url);
        const search = urlObj.search || '';
        targetPath = '/sso-callback' + search;
      }
      
      console.log('📍 Navigating to:', targetPath);
      
      // Navigate after a short delay to ensure app is ready
      setTimeout(() => {
        window.location.href = targetPath;
      }, 500);
    } catch (error) {
      console.error('❌ Error processing deep link:', error);
    }
  });
}

// OAuth callback handler
function OAuthCallback() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [attempts, setAttempts] = React.useState(0);
  
  React.useEffect(() => {
    console.log('🔄 OAuthCallback - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'attempts:', attempts);
    
    if (!isLoaded) {
      console.log('⏳ Waiting for Clerk to load...');
      return;
    }
    
    // Check if signed in
    if (isSignedIn) {
      console.log('✅ OAuth successful! User is signed in');
      
      // Get token to ensure session is fully established
      if (getToken) {
        getToken().then(token => {
          console.log('✅ Token retrieved, navigating to dashboard');
          setGetToken(getToken);
          // Small delay then navigate
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        }).catch(err => {
          console.error('❌ Error getting token:', err);
          navigate('/dashboard', { replace: true });
        });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }
    
    // Not signed in yet, retry up to 10 times (5 seconds total)
    if (attempts < 10) {
      console.log(`⏳ Not signed in yet, retrying... (attempt ${attempts + 1}/10)`);
      const timer = setTimeout(() => {
        setAttempts(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // After 10 attempts (5 seconds), redirect to login
      console.log('❌ OAuth timeout - redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, attempts, getToken]);
  
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem'}}>
      <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Processing sign in...</div>
      <div style={{fontSize: '0.9rem', color: '#666'}}>
        {attempts > 0 ? `Establishing connection... (${attempts}/10)` : 'Please wait while we complete your authentication'}
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoaded) {
      setHasCheckedAuth(true);
      if (getToken) {
        setGetToken(getToken);
      }
    }
  }, [isLoaded, getToken]);
  
  if (!isLoaded || !hasCheckedAuth) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}

// Component to handle hash-based OAuth callbacks
function HashRedirectHandler() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (hash && hash.includes('/sso-callback')) {
      console.log('📍 Detected hash-based OAuth callback:', hash);
      // Remove the hash and navigate to the path
      const path = hash.substring(1); // Remove the # symbol
      window.location.hash = ''; // Clear the hash
      navigate(path, { replace: true });
    }
  }, [navigate]);
  
  return null;
}

export default function App() {
  return (
    <Router>
      <HashRedirectHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* OAuth callback routes - Must be before auth routes */}
        <Route path="/sso-callback" element={<OAuthCallback />} />
        <Route path="/signup/sso-callback" element={<OAuthCallback />} />
        <Route path="/login/sso-callback" element={<OAuthCallback />} />
        
        <Route path="/login" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <SignIn 
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          </div>
        } />
        <Route path="/signup" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <SignUp 
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          </div>
        } />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/mail" element={<Mail />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}