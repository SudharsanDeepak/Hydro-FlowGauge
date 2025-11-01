import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/App.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Detect if running in mobile app
const isMobileApp = window.location.protocol === 'capacitor:' || 
                    window.location.protocol === 'http:' && window.location.hostname === 'localhost';

// Get current origin for redirects
const getRedirectUrl = (path) => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // For mobile app, use relative paths
    if (isMobileApp || origin.includes('localhost')) {
      return path;
    }
    return `${origin}${path}`;
  }
  return path;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl={getRedirectUrl("/dashboard")}
      afterSignUpUrl={getRedirectUrl("/dashboard")}
      signInUrl={getRedirectUrl("/login")}
      signUpUrl={getRedirectUrl("/signup")}
      navigate={(to) => window.location.href = to}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
)