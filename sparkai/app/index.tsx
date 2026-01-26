import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '@/lib/stores';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

export default function Index() {
  const { isAuthenticated, isLoading, children, setParent } = useAuthStore();
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

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
              // Create parent record if needed
              try {
                const { data: existingParent } = await supabase
                  .from('parents')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .maybeSingle();

                if (!existingParent) {
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
                } else {
                  setParent(existingParent);
                }
              } catch (dbErr) {
                console.error('Database error:', dbErr);
              }

              // Show success page for email verification
              if (type === 'signup') {
                setEmailVerified(true);
                setIsProcessingAuth(false);
                return;
              }
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

  // Show email verified success page
  if (emailVerified) {
    return (
      <View className="flex-1 bg-slate-50">
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-16 pb-12 px-6"
        >
          <View className="items-center">
            {/* Checkmark icon */}
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text className="text-3xl font-bold text-white text-center mb-2">
              Email Verified!
            </Text>
            <Text className="text-white/90 text-lg text-center">
              Your account has been confirmed
            </Text>
          </View>
        </LinearGradient>

        <View className="flex-1 px-6 pt-8 items-center">
          <View className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-md">
            <Text className="text-xl font-bold text-slate-800 text-center mb-4">
              You can close this tab
            </Text>
            <Text className="text-slate-600 text-center text-base leading-relaxed">
              Go back to your original browser tab where you signed up to continue setting up your child's profile.
            </Text>
          </View>

          <View className="mt-6 bg-indigo-50 rounded-2xl p-4 w-full max-w-md">
            <Text className="text-indigo-800 text-center text-sm">
              If you closed the original tab, you can{' '}
              <Text
                className="font-semibold underline"
                onPress={() => window.location.href = '/add-child'}
              >
                continue here
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
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
