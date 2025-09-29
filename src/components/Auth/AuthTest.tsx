import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AuthTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');

    try {
      // Test 1: Check if Supabase is configured
      if (!supabase) {
        setTestResult('❌ Supabase client not initialized. Check environment variables.');
        return;
      }

      // Test 2: Try to get session (should work even without login)
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setTestResult(`❌ Session error: ${sessionError.message}`);
        return;
      }

      // Test 3: Try to get user (should return null if not logged in)
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setTestResult(`❌ User error: ${userError.message}`);
        return;
      }

      setTestResult(`✅ Supabase connection working! Current user: ${user.user ? user.user.email : 'Not logged in'}`);

    } catch (error) {
      setTestResult(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setTestResult(`❌ Sign up failed: ${error.message}`);
      } else {
        setTestResult(`✅ Sign up successful! User: ${data.user?.email}, Needs confirmation: ${!data.user?.email_confirmed_at}`);
      }
    } catch (error) {
      setTestResult(`❌ Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-white font-bold mb-2">Auth Debug (Dev Only)</h3>
      <div className="space-y-2">
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Test Connection
        </button>
        <button
          onClick={testSignUp}
          disabled={loading}
          className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          Test Sign Up
        </button>
      </div>
      {testResult && (
        <div className="mt-2 p-2 bg-gray-700 rounded text-xs text-white whitespace-pre-wrap">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default AuthTest;