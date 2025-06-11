import React, { useState } from 'react';
import { X, User, CreditCard, Zap } from 'lucide-react';

const DevModeNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Only show in development mode
  if (import.meta.env.VITE_APP_ENV !== 'development' || !isVisible) {
    return null;
  }

  const testUsers = [
    { email: 'student@localhost.dev', role: 'Student', tier: 'Free' },
    { email: 'researcher@localhost.dev', role: 'Researcher', tier: 'Advanced AI' },
    { email: 'professor@localhost.dev', role: 'Professor', tier: 'Ultra Intelligent' },
    { email: 'admin@localhost.dev', role: 'Admin', tier: 'PhD Level' }
  ];

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg border border-blue-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Development Mode</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-blue-100 mb-3">
          🧪 Mock mode active - no real services needed!
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3" />
            <span className="font-medium">Test Users:</span>
          </div>

          <div className="space-y-1">
            {testUsers.map((user, index) => (
              <div key={index} className="text-xs bg-white/10 rounded px-2 py-1 break-words">
                <div className="font-mono text-blue-100 text-xs break-all">{user.email}</div>
                <div className="text-blue-200 text-xs">{user.role} • {user.tier}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs mt-3">
            <CreditCard className="h-3 w-3" />
            <span className="font-medium">Test Cards:</span>
          </div>

          <div className="text-xs bg-white/10 rounded px-2 py-1">
            <div className="font-mono text-blue-100 text-xs">4242 4242 4242 4242</div>
            <div className="text-blue-200 text-xs">Success • Any CVV/Date</div>
          </div>

          <div className="text-xs bg-white/10 rounded px-2 py-1">
            <div className="font-mono text-blue-100 text-xs">4000 0000 0000 0002</div>
            <div className="text-blue-200 text-xs">Declined • Test errors</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-400/30">
          <p className="text-xs text-blue-100">
            Password: <span className="font-mono text-xs">any password</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevModeNotice;
