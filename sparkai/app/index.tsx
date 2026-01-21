import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '@/lib/stores';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { isAuthenticated, isLoading, children, setParent } = useAuthStore();
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Handle auth tokens from URL hash (email verification redirect)
  useEffect(() => {
    const handleHashTokens = async () => {
      if (Platform.OS !== 'web') {
        setIsProcessingAuth(false);
        return;
      }

      const hash = window.location.hash;

      // Check for error in hash first (expired link, etc)
      if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1));
        const errorDesc = params.get('error_description');
        if (errorDesc) {
          alert(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
        }
        window.history.replaceState(null, '', window.location.pathname);
        setIsProcessingAuth(false);
        return;
      }

      // Check if there's a hash with tokens
      if (hash && hash.includes('access_token')) {
        // Clear the hash from URL immediately
        window.history.replaceState(null, '', window.location.pathname);

        try {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          console.log('Processing auth tokens, type:', type);

          if (accessToken && refreshToken) {
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Error setting session:', error);
              setIsProcessingAuth(false);
              return;
            }

            console.log('Session set successfully:', !!session?.user);

            if (session?.user) {
              // For new signups, create parent and go to add-child
              if (type === 'signup') {
                // Check if parent already exists (use maybeSingle to avoid error)
                const { data: existingParent } = await supabase
                  .from('parents')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .maybeSingle();

                console.log('Existing parent:', !!existingParent);

                if (!existingParent) {
                  const { data: newParent, error: insertError } = await supabase
                    .from('parents')
                    .insert({
                      user_id: session.user.id,
                      email: session.user.email,
                    })
                    .select()
                    .single();

                  if (insertError) {
                    console.error('Error creating parent:', insertError);
                  } else if (newParent) {
                    console.log('Created new parent');
                    setParent(newParent);
                  }
                } else {
                  setParent(existingParent);
                }

                // Set redirect and stop processing
                console.log('Redirecting to add-child');
                setRedirectTo('/(auth)/add-child');
                setIsProcessingAuth(false);
                return;
              }

              // For other types (recovery, login, etc.), check if user has children
              const { data: parentData } = await supabase
                .from('parents')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();

              if (parentData) {
                setParent(parentData);

                const { data: childrenData } = await supabase
                  .from('children')
                  .select('id')
                  .eq('parent_id', parentData.id)
                  .limit(1);

                if (childrenData && childrenData.length > 0) {
                  setRedirectTo('/(tabs)/learn');
                } else {
                  setRedirectTo('/(auth)/add-child');
                }
              } else {
                setRedirectTo('/(auth)/add-child');
              }

              setIsProcessingAuth(false);
              return;
            }
          }
        } catch (err) {
          console.error('Error processing auth tokens:', err);
        }
      }

      setIsProcessingAuth(false);
    };

    handleHashTokens();
  }, []);

  // Handle redirect after auth processing - use Redirect component
  // This takes priority over loading state
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  // Show loading state while processing auth or initializing
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
  return <Redirect href="/(tabs)/learn" />;
}
