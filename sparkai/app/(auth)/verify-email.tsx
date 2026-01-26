import { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Svg, { Path } from 'react-native-svg';

const getAuthRedirectUrl = () => {
  if (Platform.OS === 'web') {
    return 'https://www.spark-kids.ai';
  }
  return 'sparkai://auth/callback';
};

const SparkyImage = require('@/assets/images/sparky.png');

export default function VerifyEmailScreen() {
  const [isChecking, setIsChecking] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get current user email
    const getEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    getEmail();

    // Listen for auth state changes (when email is confirmed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          // Email confirmed, proceed to add-child
          router.replace('/(auth)/add-child');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email_confirmed_at) {
        router.replace('/(auth)/add-child');
      } else {
        // Refresh the session to check for updates
        await supabase.auth.refreshSession();
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();

        if (refreshedUser?.email_confirmed_at) {
          router.replace('/(auth)/add-child');
        } else {
          alert('Email not verified yet. Please check your inbox and click the confirmation link.');
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
        },
      });

      if (error) {
        alert('Failed to resend email. Please try again.');
        console.error('Resend error:', error);
      } else {
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      alert('Failed to resend email. Please try again.');
      console.error('Resend exception:', error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 px-6 rounded-b-3xl"
      >
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">
              Check Your Email
            </Text>
            <Text className="text-white/80 text-base">
              We sent a confirmation link to verify your account
            </Text>
          </View>
          <View className="ml-4">
            <Image
              source={SparkyImage}
              style={{ width: 70, height: 70 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1 px-6 pt-8">
        {/* Email icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center mb-4">
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="#7C3AED"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M22 6l-10 7L2 6"
                stroke="#7C3AED"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Text className="text-xl font-bold text-slate-800 text-center mb-2">
            Verify your email address
          </Text>

          {email && (
            <Text className="text-slate-600 text-center mb-4">
              We sent a confirmation email to:{'\n'}
              <Text className="font-semibold text-indigo-600">{email}</Text>
            </Text>
          )}

          <Text className="text-slate-500 text-center text-sm px-4">
            Click the link in the email to verify your account and continue setting up your child's profile.
          </Text>
        </View>

        {/* Instructions */}
        <View className="bg-amber-50 rounded-2xl p-4 mb-6">
          <Text className="text-amber-800 font-semibold mb-2">
            Didn't receive the email?
          </Text>
          <Text className="text-amber-700 text-sm">
            • Check your spam or junk folder{'\n'}
            • Make sure the email address is correct{'\n'}
            • Wait a few minutes and try again
          </Text>
        </View>

        {/* Actions */}
        <Button
          title={isChecking ? "Checking..." : "I've Verified My Email"}
          onPress={handleCheckVerification}
          loading={isChecking}
          size="lg"
        />

        <Pressable onPress={handleResendEmail} className="mt-4">
          <Text className="text-indigo-600 font-semibold text-center">
            Resend verification email
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          className="mt-6"
        >
          <Text className="text-slate-500 text-center">
            Already verified? <Text className="text-indigo-600 font-semibold">Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
