import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import Landing from './pages/LandingPro';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Mail from './pages/Mail';
import Header from './pages/Header';
import { setGetToken } from './services/api';
import './styles/App.css';

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
            <SignIn routing="path" path="/login" signUpUrl="/signup" afterSignInUrl="/dashboard" />
          </div>
        } />
        <Route path="/signup" element={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <SignUp routing="path" path="/signup" signInUrl="/login" afterSignUpUrl="/dashboard" />
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