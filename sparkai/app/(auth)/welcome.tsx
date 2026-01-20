import { View, Text, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-background">
      {/* Header with gradient */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        className="pt-20 pb-16 px-6 rounded-b-3xl"
      >
        <View className="items-center">
          {/* Mascot placeholder */}
          <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-4">
            <Text className="text-6xl">🤖</Text>
          </View>
          <Text className="text-3xl font-bold text-white text-center">
            SparkAI
          </Text>
          <Text className="text-white/80 text-center mt-2 text-lg">
            Learn AI the fun way!
          </Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Feature highlights */}
        <View className="space-y-4 mb-8">
          <FeatureItem
            emoji="🎮"
            title="Interactive Lessons"
            description="Learn through games and hands-on projects"
          />
          <FeatureItem
            emoji="🏆"
            title="Earn Achievements"
            description="Collect badges and track your progress"
          />
          <FeatureItem
            emoji="🧠"
            title="Understand AI"
            description="Discover how AI works in everyday life"
          />
        </View>
      </View>

      {/* Bottom buttons */}
      <View className="px-6 pb-10 space-y-3">
        <Link href="/(auth)/signup" asChild>
          <Pressable className="bg-primary py-4 rounded-2xl items-center active:opacity-80">
            <Text className="text-white font-semibold text-lg">
              Get Started
            </Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Pressable className="bg-surface border border-gray-200 py-4 rounded-2xl items-center active:opacity-80">
            <Text className="text-text font-semibold text-lg">
              I already have an account
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function FeatureItem({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center bg-surface p-4 rounded-xl">
      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
        <Text className="text-2xl">{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text font-semibold text-base">{title}</Text>
        <Text className="text-text-light text-sm">{description}</Text>
      </View>
    </View>
  );
}
