import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { debugSupabaseConfig, testAuth } from '../../lib/supabase-debug';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug Supabase configuration
    const config = debugSupabaseConfig();
    setDebugInfo(config);
    
    if (!config.clientReady) {
      setError('Supabase client not properly configured. Check environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('🚨 Login Error Details:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          setError(`Login failed: ${error.message}`);
        }
      }
    } catch (err) {
      console.error('🚨 Unexpected Login Error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black overflow-hidden scan-line flex items-center justify-center p-4">
      <div className="absolute inset-0 data-grid"></div>
      <div className="max-w-md w-full tech-card rounded-2xl shadow-xl p-8 glow-green">
        <div className="text-center mb-8">
          <img 
            src="/ENVAIRE LOGO.png" 
            alt="Envaire Logo" 
            className="w-24 h-24 object-contain mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-green-300 glow-green">Welcome Back</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm tech-border">
              <div className="font-medium mb-2">Authentication Error:</div>
              {error}
              
              {/* Debug information in development */}
              {import.meta.env.DEV && debugInfo && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer text-red-400">Debug Info (Dev Only)</summary>
                  <div className="mt-2 p-2 bg-red-950 rounded">
                    <div>URL Present: {debugInfo.hasUrl ? '✅' : '❌'}</div>
                    <div>Key Present: {debugInfo.hasKey ? '✅' : '❌'}</div>
                    <div>Client Ready: {debugInfo.clientReady ? '✅' : '❌'}</div>
                  </div>
                </details>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 tech-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-green-300 placeholder-green-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 tech-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-green-300 placeholder-green-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full tech-button py-3 px-4 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-white"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
        
        {/* Development helper */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg text-xs text-blue-300">
            <div className="font-medium mb-1">Development Tips:</div>
            <div>• Check Supabase Auth settings for email confirmation</div>
            <div>• Verify user exists in Authentication > Users</div>
            <div>• Check browser console for detailed error logs</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;