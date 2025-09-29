// Temporary debug file to check Supabase configuration
import { supabase } from './supabase';

export const debugSupabaseConfig = () => {
  console.log('🔍 Supabase Configuration Debug:');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '[PRESENT]' : '[MISSING]');
  console.log('Supabase Client:', supabase ? 'Initialized' : 'Not Initialized');
  
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error('❌ VITE_SUPABASE_URL is missing');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is missing');
  }
  
  return {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    clientReady: !!supabase
  };
};

// Test authentication
export const testAuth = async (email: string, password: string) => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return { error: 'Supabase not configured' };
  }
  
  console.log('🔐 Testing authentication for:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Auth result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Auth exception:', err);
    return { error: err };
  }
};