import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '@/lib/stores';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { isAuthenticated, isLoading, children, activeChild, setParent } = useAuthStore();
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);

  // Handle auth tokens from URL hash (email verification redirect)
  useEffect(() => {
    const handleHashTokens = async () => {
      if (Platform.OS !== 'web') {
        setIsProcessingAuth(false);
        return;
      }

      // Check if there's a hash with tokens
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        try {
          // Parse the hash to get tokens
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // Explicitly set the session with the tokens from the hash
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (session?.user && !error) {
              // Clear the hash from URL first
              window.history.replaceState(null, '', window.location.pathname);

              // Fetch or create parent record
              const { data: parentData } = await supabase
                .from('parents')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

              if (parentData) {
                setParent(parentData);
              }

              // Check if user has children
              const { data: childrenData } = await supabase
                .from('children')
                .select('id')
                .eq('parent_id', parentData?.id)
                .limit(1);

              // Redirect based on whether they have children
              if (childrenData && childrenData.length > 0) {
                router.replace('/(app)/(tabs)/learn');
              } else {
                router.replace('/(auth)/add-child');
              }
              return;
            }
          }
        } catch (err) {
          console.error('Error processing auth tokens:', err);
        }
      }

      // Check for error in hash (expired link, etc)
      if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1));
        const errorDesc = params.get('error_description');
        if (errorDesc) {
          alert(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
        }
        window.history.replaceState(null, '', window.location.pathname);
      }

      setIsProcessingAuth(false);
    };

    handleHashTokens();
  }, []);

  // Show loading state
  if (isLoading || isProcessingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-4 text-text-light">Loading...</Text>
      </View>
    );
  }

  // Not authenticated - go to auth
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Authenticated but no children - go to add child
  if (children.length === 0) {
    return <Redirect href="/(auth)/add-child" />;
  }

  // Authenticated with children - go to main app
  return <Redirect href="/(app)/(tabs)/learn" />;
}
