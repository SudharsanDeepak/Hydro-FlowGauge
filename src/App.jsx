import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import Landing from './pages/LandingPro';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Mail from './pages/Mail';
import Header from './pages/Header';
import { setGetToken } from './services/api';
import './styles/App.css';

// OAuth callback handler
function OAuthCallback() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  
  React.useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Successfully signed in via OAuth, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Failed, go back to login
        navigate('/login', { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div>Processing sign in...</div>
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/login" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <SignIn 
              fallbackRedirectUrl="/dashboard"
              signUpFallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
            />
          </div>
        } />
        <Route path="/signup" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <SignUp 
              fallbackRedirectUrl="/dashboard"
              signInFallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
            />
          </div>
        } />
        
        {/* OAuth callback routes */}
        <Route path="/signup/sso-callback" element={<OAuthCallback />} />
        <Route path="/login/sso-callback" element={<OAuthCallback />} />
        <Route path="/sso-callback" element={<OAuthCallback />} />
        
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