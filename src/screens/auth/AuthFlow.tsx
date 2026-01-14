import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

interface AuthFlowProps {
  onComplete: () => void;
}

export default function AuthFlow({ onComplete }: AuthFlowProps) {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <LoginScreen onSuccess={onComplete} onSwitchToSignup={() => setShowLogin(false)} />
  ) : (
    <SignupScreen onSuccess={onComplete} onSwitchToLogin={() => setShowLogin(true)} />
  );
}
