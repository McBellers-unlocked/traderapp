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
import { signUp, supabase, signInWithGoogle, signInWithApple } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { trackSignUp } from '@/lib/tracking';
import Svg, { Path, Circle } from 'react-native-svg';

const SparkyImage = require('@/assets/images/sparky.png');

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'At least 6 characters';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        Alert.alert('Oops!', error.message);
        return;
      }

      if (data.user) {
        // Create parent record
        const { data: parentData, error: parentError } = await supabase
          .from('parents')
          .insert({
            user_id: data.user.id,
            email: email,
          })
          .select()
          .single();

        if (parentError) {
          console.error('Failed to create parent record:', parentError);
        } else if (parentData) {
          // Update the auth store with the new parent
          useAuthStore.getState().setParent(parentData);
        }

        // Track successful signup
        trackSignUp('email');

        // Navigate to verify email screen (user must confirm before adding child)
        router.replace('/(auth)/verify-email');
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Oops!', error.message);
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
  };

  const handleAppleSignup = async () => {
    try {
      const { error } = await signInWithApple();
      if (error) {
        Alert.alert('Oops!', error.message);
      }
    } catch (err) {
      Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#EF4444', width: '33%' };
    if (password.length < 10) return { label: 'Good', color: '#F59E0B', width: '66%' };
    return { label: 'Strong', color: '#10B981', width: '100%' };
  };

  const strength = getPasswordStrength();

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
          colors={['#8B5CF6', '#A855F7']}
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

          {/* Step indicator */}
          <StepIndicator currentStep={1} totalSteps={2} />

          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-2">
                Join SparkAI!
              </Text>
              <Text className="text-white/80 text-base">
                Create your parent account to get started
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
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            error={errors.password}
            helperText={password.length === 0 ? "At least 8 characters recommended" : undefined}
            icon={<LockIcon />}
          />

          {/* Password strength indicator */}
          {password.length > 0 && (
            <View className="mb-4 -mt-2">
              <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <View
                  style={{
                    width: strength.width,
                    backgroundColor: strength.color,
                    height: '100%',
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text style={{ color: strength.color }} className="text-xs mt-1 font-medium">
                {strength.label}
              </Text>
            </View>
          )}

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            secureTextEntry
            error={errors.confirmPassword}
            icon={<LockIcon />}
            rightIcon={
              confirmPassword && password === confirmPassword ? (
                <CheckIcon />
              ) : null
            }
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            size="lg"
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="mx-4 text-slate-500 font-medium">or sign up with</Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          {/* Social signup buttons */}
          <View className="gap-3">
            <SocialAuthButton provider="google" onPress={handleGoogleSignup} />
            <SocialAuthButton provider="apple" onPress={handleAppleSignup} />
          </View>

          {/* Terms */}
          <Text className="text-slate-500 text-center text-sm mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Text className="text-indigo-600 font-semibold">Terms of Service</Text> and{' '}
            <Text className="text-indigo-600 font-semibold">Privacy Policy</Text>
          </Text>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-6 pb-8">
          <Text className="text-slate-500">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-indigo-600 font-bold">Sign in</Text>
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

function CheckIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#10B981" />
      <Path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
