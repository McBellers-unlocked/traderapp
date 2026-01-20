import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { resetPassword } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setIsSent(true);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <View className="flex-1 bg-background px-6 pt-16">
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 bg-success/20 rounded-full items-center justify-center mb-6">
            <Text className="text-4xl">✉️</Text>
          </View>
          <Text className="text-2xl font-bold text-text text-center mb-2">
            Check your email
          </Text>
          <Text className="text-text-light text-center mb-8">
            We sent a password reset link to{'\n'}
            <Text className="font-medium text-text">{email}</Text>
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable className="bg-primary py-4 px-8 rounded-2xl active:opacity-80">
              <Text className="text-white font-semibold text-lg">
                Back to Login
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View className="pt-16 pb-8 px-6">
        <Link href="/(auth)/login" asChild>
          <Pressable className="mb-6">
            <Text className="text-primary text-lg">← Back</Text>
          </Pressable>
        </Link>
        <Text className="text-3xl font-bold text-text">Forgot password?</Text>
        <Text className="text-text-light mt-2">
          No worries! Enter your email and we'll send you a reset link.
        </Text>
      </View>

      {/* Form */}
      <View className="px-6">
        <View className="mb-6">
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

        <Pressable
          className={`bg-primary py-4 rounded-2xl items-center ${
            isLoading ? 'opacity-50' : 'active:opacity-80'
          }`}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-lg">
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
