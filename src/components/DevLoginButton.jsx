import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { User, Zap } from 'lucide-react';

const DevLoginButton = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Disabled for production
  return null;

  const quickLogin = async (email) => {
    try {
      console.log('🧪 Quick login as:', email);
      const { data, error } = await signIn(email, 'any-password');
      
      if (!error && data) {
        console.log('🧪 Quick login successful, redirecting...');
        navigate('/dashboard');
      } else {
        console.error('🧪 Quick login failed:', error);
      }
    } catch (err) {
      console.error('🧪 Quick login error:', err);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4" />
        <span className="font-semibold text-sm">Dev Quick Login</span>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={() => quickLogin('student@localhost.dev')}
          variant="secondary"
          size="sm"
          className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <User className="h-3 w-3 mr-1" />
          Login as Student
        </Button>
        
        <Button
          onClick={() => quickLogin('researcher@localhost.dev')}
          variant="secondary"
          size="sm"
          className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <User className="h-3 w-3 mr-1" />
          Login as Researcher
        </Button>
        
        <Button
          onClick={() => quickLogin('professor@localhost.dev')}
          variant="secondary"
          size="sm"
          className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <User className="h-3 w-3 mr-1" />
          Login as Professor
        </Button>
      </div>
      
      <p className="text-xs text-green-100 mt-2 text-center">
        Skip login form
      </p>
    </div>
  );
};

export default DevLoginButton;
