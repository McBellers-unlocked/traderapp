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
import { signUp, supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.user) {
        // Create parent record
        const { error: parentError } = await supabase.from('parents').insert({
          user_id: data.user.id,
          email: email,
        });

        if (parentError) {
          console.error('Failed to create parent record:', parentError);
        }

        // Navigate to add child
        router.replace('/(auth)/add-child');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
          <Text className="text-3xl font-bold text-text">Create account</Text>
          <Text className="text-text-light mt-2">
            Set up your parent account to get started
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
              placeholder="Create a password"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text className="text-text-light text-sm mt-1">
              At least 6 characters
            </Text>
          </View>

          <View>
            <Text className="text-text font-medium mb-2">Confirm Password</Text>
            <TextInput
              className="bg-surface border border-gray-200 rounded-xl px-4 py-3 text-text"
              placeholder="Confirm your password"
              placeholderTextColor="#64748B"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            className={`bg-primary py-4 rounded-2xl items-center mt-6 ${
              isLoading ? 'opacity-50' : 'active:opacity-80'
            }`}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Text>
          </Pressable>

          {/* Terms */}
          <Text className="text-text-light text-center text-sm mt-4">
            By creating an account, you agree to our{' '}
            <Text className="text-primary">Terms of Service</Text> and{' '}
            <Text className="text-primary">Privacy Policy</Text>
          </Text>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 pb-8">
          <Text className="text-text-light">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-primary font-semibold">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
