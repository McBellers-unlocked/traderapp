import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { signIn, signInWithGoogle, signInWithApple } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import Svg, { Path } from 'react-native-svg';

const SparkyImage = require('@/assets/images/sparky.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Oops!', error.message);
      } else {
        router.replace('/');
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Oops!', error.message);
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { error } = await signInWithApple();
      if (error) {
        Alert.alert('Oops!', error.message);
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-8 px-6 rounded-b-3xl"
        >
          {/* Back button */}
          <Link href="/(auth)/welcome" asChild>
            <Pressable className="flex-row items-center mb-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text className="text-white ml-2 text-base font-medium">Back</Text>
            </Pressable>
          </Link>

          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-2">
                Welcome back!
              </Text>
              <Text className="text-white/80 text-base">
                Sign in to continue your AI adventure
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

        {/* Form */}
        <View className="px-6 pt-8">
          <Input
            label="Email"
            placeholder="parent@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            icon={<EmailIcon />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            error={errors.password}
            icon={<LockIcon />}
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable className="mb-6">
              <Text className="text-indigo-600 font-semibold text-right">
                Forgot password?
              </Text>
            </Pressable>
          </Link>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="mx-4 text-slate-500 font-medium">or continue with</Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          {/* Social login buttons */}
          <View className="gap-3">
            <SocialAuthButton provider="google" onPress={handleGoogleLogin} />
            <SocialAuthButton provider="apple" onPress={handleAppleLogin} />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 pb-8">
          <Text className="text-slate-500">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="text-indigo-600 font-bold">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function EmailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
