import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore, useProgressStore } from '@/lib/stores';
import { AVATAR_OPTIONS } from '@/types';

export default function ProfileScreen() {
  const { activeChild, children, parent, isParentMode, toggleParentMode, signOut, setActiveChild } =
    useAuthStore();
  const { clearProgress } = useProgressStore();

  const avatar = AVATAR_OPTIONS.find((a) => a.id === activeChild?.avatar_id);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clearProgress();
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handleSwitchChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      setActiveChild(child);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-surface border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mr-4">
            <Text className="text-5xl">{avatar?.emoji || '🤖'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text">
              {activeChild?.display_name || 'Learner'}
            </Text>
            {activeChild?.age && (
              <Text className="text-text-light">Age {activeChild.age}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Switch child (if multiple) */}
      {children.length > 1 && (
        <View className="px-6 pt-6">
          <Text className="text-lg font-bold text-text mb-3">Switch Learner</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {children.map((child) => {
              const childAvatar = AVATAR_OPTIONS.find((a) => a.id === child.avatar_id);
              const isActive = child.id === activeChild?.id;
              return (
                <Pressable
                  key={child.id}
                  className={`items-center mr-4 p-3 rounded-2xl ${
                    isActive ? 'bg-primary/10' : 'bg-surface'
                  }`}
                  onPress={() => handleSwitchChild(child.id)}
                >
                  <View
                    className={`w-14 h-14 rounded-full items-center justify-center ${
                      isActive ? 'bg-primary/20' : 'bg-gray-100'
                    }`}
                  >
                    <Text className="text-2xl">{childAvatar?.emoji || '🤖'}</Text>
                  </View>
                  <Text
                    className={`mt-2 ${
                      isActive ? 'text-primary font-semibold' : 'text-text-light'
                    }`}
                  >
                    {child.display_name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Menu items */}
      <View className="px-6 pt-6">
        <Text className="text-lg font-bold text-text mb-3">Settings</Text>

        <MenuItem
          icon="👨‍👩‍👧"
          title="Parent Dashboard"
          subtitle="View detailed progress and settings"
          onPress={toggleParentMode}
        />

        <MenuItem
          icon="➕"
          title="Add Child"
          subtitle="Create another learner profile"
          onPress={() => router.push('/(auth)/add-child')}
        />

        <MenuItem
          icon="🔔"
          title="Notifications"
          subtitle="Manage learning reminders"
          onPress={() => {}}
        />

        <MenuItem
          icon="🎨"
          title="Edit Profile"
          subtitle="Change avatar and name"
          onPress={() => {}}
        />

        <MenuItem
          icon="💳"
          title="Subscription"
          subtitle={parent?.subscription_status === 'free' ? 'Free plan' : 'Premium'}
          onPress={() => {}}
        />

        <MenuItem
          icon="❓"
          title="Help & Support"
          subtitle="FAQs and contact us"
          onPress={() => {}}
        />

        <MenuItem
          icon="📄"
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={() => {}}
        />
      </View>

      {/* Sign out */}
      <View className="px-6 py-6">
        <Pressable
          className="bg-error/10 py-4 rounded-2xl items-center active:opacity-80"
          onPress={handleSignOut}
        >
          <Text className="text-error font-semibold">Sign Out</Text>
        </Pressable>
      </View>

      {/* Version */}
      <View className="items-center pb-8">
        <Text className="text-text-light text-sm">SparkAI v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="bg-surface rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center active:opacity-90"
      onPress={onPress}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text font-semibold">{title}</Text>
        <Text className="text-text-light text-sm">{subtitle}</Text>
      </View>
      <Text className="text-text-light">→</Text>
    </Pressable>
  );
}
