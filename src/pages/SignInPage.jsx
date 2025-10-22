import { SignIn } from "@clerk/clerk-react";
import "../styles/clerk-custom.css";

const customAppearance = {
  elements: {
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      color: '#ffffff'
    },
    headerTitle: { color: '#ffffff' },
    headerSubtitle: { color: '#ffffff' },
    socialButtonsBlockButtonText: { color: '#ffffff' },
    footerActionText: { color: '#ffffff' },
    formFieldLabel: { color: '#ffffff' },
    formButtonPrimary: {
      backgroundColor: '#3b82f6',
      '&:hover': {
        backgroundColor: '#2563eb'
      }
    },
    identityPreview: { color: '#ffffff' },
    identityPreviewText: { color: '#ffffff' },
    formFieldInput: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      color: '#ffffff',
      borderRadius: '8px'
    },
    socialButtonsBlockButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.3)'
      }
    },
    footerActionLink: { 
      color: '#93c5fd',
      fontWeight: '600'
    },
    dividerLine: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    dividerText: { color: 'rgba(255, 255, 255, 0.8)' }
  }
};

export default function SignInPage() {
  return (
    <div className="clerk-auth-container">
      <SignIn 
        path="/sign-in" 
        routing="path" 
        signUpUrl="/sign-up" 
        appearance={customAppearance} 
      />
    </div>
  );
}
