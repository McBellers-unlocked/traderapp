import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { signIn, signInWithGoogle, signInWithApple } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { error } = await signInWithApple();
      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="pt-16 pb-8 px-6">
          <Link href="/(auth)/welcome" asChild>
            <Pressable className="mb-6">
              <Text className="text-primary text-lg">← Back</Text>
            </Pressable>
          </Link>
          <Text className="text-3xl font-bold text-text">Welcome back!</Text>
          <Text className="text-text-light mt-2">
            Sign in to continue learning
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-4">
          <View>
            <Text className="text-text font-medium mb-2">Email</Text>
            <TextInput
              className="bg-surface border border-gray-200 rounded-xl px-4 py-3 text-text"
              placeholder="parent@example.com"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="text-text font-medium mb-2">Password</Text>
            <TextInput
              className="bg-surface border border-gray-200 rounded-xl px-4 py-3 text-text"
              placeholder="Enter your password"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text className="text-primary text-right">Forgot password?</Text>
            </Pressable>
          </Link>

          <Pressable
            className={`bg-primary py-4 rounded-2xl items-center mt-4 ${
              isLoading ? 'opacity-50' : 'active:opacity-80'
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-text-light">or continue with</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social login buttons */}
          <View className="flex-row space-x-4">
            <Pressable
              className="flex-1 bg-surface border border-gray-200 py-4 rounded-xl items-center flex-row justify-center active:opacity-80"
              onPress={handleGoogleLogin}
            >
              <Text className="text-2xl mr-2">🔵</Text>
              <Text className="text-text font-medium">Google</Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-surface border border-gray-200 py-4 rounded-xl items-center flex-row justify-center active:opacity-80"
              onPress={handleAppleLogin}
            >
              <Text className="text-2xl mr-2">🍎</Text>
              <Text className="text-text font-medium">Apple</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 pb-8">
          <Text className="text-text-light">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="text-primary font-semibold">Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
