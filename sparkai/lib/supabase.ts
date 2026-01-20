import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Social auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'sparkai://auth/callback',
    },
  });
  return { data, error };
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'sparkai://auth/callback',
    },
  });
  return { data, error };
};

// Password reset
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'sparkai://auth/reset-password',
  });
  return { data, error };
};

// Database helper types for TypeScript
export type Tables = {
  profiles: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    parent_email: string | null;
    created_at: string;
  };
  parents: {
    id: string;
    user_id: string;
    email: string;
    subscription_status: string;
    subscription_expires_at: string | null;
    created_at: string;
  };
  children: {
    id: string;
    parent_id: string;
    display_name: string;
    avatar_id: string | null;
    age: number | null;
    created_at: string;
  };
  lesson_progress: {
    id: string;
    child_id: string;
    lesson_id: string;
    module_id: string;
    status: string;
    score: number | null;
    time_spent_seconds: number;
    completed_at: string | null;
    created_at: string;
  };
  achievements: {
    id: string;
    child_id: string;
    achievement_type: string;
    earned_at: string;
  };
  streaks: {
    id: string;
    child_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    updated_at: string;
  };
  projects: {
    id: string;
    child_id: string;
    project_type: string;
    title: string | null;
    data: Record<string, unknown>;
    created_at: string;
  };
};
