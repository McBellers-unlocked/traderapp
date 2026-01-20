import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/lib/stores';

export default function Index() {
  const { isAuthenticated, isLoading, children, activeChild } = useAuthStore();

  // Show loading state
  if (isLoading) {
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
