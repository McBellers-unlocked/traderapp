import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores';

/**
 * Auth callback page - handles redirects from email verification links
 * Supabase redirects here after email confirmation with tokens in the URL hash
 */
export default function AuthCallbackScreen() {
  const { setParent } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase puts tokens there)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/(auth)/login');
          return;
        }

        if (session?.user) {
          // Check if email is confirmed
          if (session.user.email_confirmed_at) {
            // Fetch or create parent record
            const { data: parentData } = await supabase
              .from('parents')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (parentData) {
              setParent(parentData);

              // Check if user already has children
              const { data: children } = await supabase
                .from('children')
                .select('id')
                .eq('parent_id', parentData.id)
                .limit(1);

              if (children && children.length > 0) {
                // User already has children, go to main app
                router.replace('/(tabs)/learn');
              } else {
                // No children yet, go to add-child
                router.replace('/(auth)/add-child');
              }
            } else {
              // No parent record, create one and go to add-child
              const { data: newParent } = await supabase
                .from('parents')
                .insert({
                  user_id: session.user.id,
                  email: session.user.email,
                })
                .select()
                .single();

              if (newParent) {
                setParent(newParent);
              }
              router.replace('/(auth)/add-child');
            }
          } else {
            // Email not confirmed yet, go to verify page
            router.replace('/(auth)/verify-email');
          }
        } else {
          // No session, go to login
          router.replace('/(auth)/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/(auth)/login');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center">
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text className="text-slate-600 mt-4 text-base">
        Verifying your account...
      </Text>
    </View>
  );
}
