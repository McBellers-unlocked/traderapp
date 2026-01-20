import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore, useProgressStore } from '@/lib/stores';
import { CURRICULUM, getModuleProgress } from '@/constants/curriculum';
import { moduleThemes } from '@/constants/theme';
import { AVATAR_OPTIONS } from '@/types';

export default function LearnScreen() {
  const { activeChild } = useAuthStore();
  const { streak, getCompletedLessons, fetchProgress } = useProgressStore();

  const completedLessons = getCompletedLessons();
  const avatar = AVATAR_OPTIONS.find((a) => a.id === activeChild?.avatar_id);

  useEffect(() => {
    if (activeChild) {
      fetchProgress(activeChild.id);
    }
  }, [activeChild, fetchProgress]);

  // Find the next lesson to continue
  const getNextLesson = () => {
    for (const module of CURRICULUM) {
      for (const lesson of module.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return { module, lesson };
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} className="pt-16 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/80">Welcome back,</Text>
            <Text className="text-2xl font-bold text-white">
              {activeChild?.display_name || 'Learner'}! {avatar?.emoji}
            </Text>
          </View>
          <View className="bg-white/20 rounded-2xl px-4 py-2 flex-row items-center">
            <Text className="text-2xl mr-2">🔥</Text>
            <Text className="text-white font-bold text-lg">
              {streak?.current_streak || 0}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Continue Learning Card */}
      {nextLesson && (
        <View className="px-6 -mt-4">
          <Pressable
            className="bg-surface rounded-2xl p-5 shadow-sm border border-gray-100 active:opacity-90"
            onPress={() => router.push(`/lesson/${nextLesson.lesson.id}`)}
          >
            <Text className="text-text-light text-sm mb-1">Continue Learning</Text>
            <Text className="text-xl font-bold text-text mb-2">
              {nextLesson.lesson.title}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">{nextLesson.lesson.icon}</Text>
              <Text className="text-text-light flex-1">
                {nextLesson.module.title}
              </Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-primary font-medium">
                  {nextLesson.lesson.duration_minutes} min
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* AI Fact of the Day */}
      <View className="px-6 mt-6">
        <View className="bg-warning/10 rounded-2xl p-4 flex-row items-center">
          <Text className="text-3xl mr-3">💡</Text>
          <View className="flex-1">
            <Text className="text-text font-semibold">AI Fact of the Day</Text>
            <Text className="text-text-light text-sm mt-1">
              Did you know? The first AI program was written in 1951!
            </Text>
          </View>
        </View>
      </View>

      {/* Modules */}
      <View className="px-6 mt-8 mb-8">
        <Text className="text-xl font-bold text-text mb-4">Learning Modules</Text>
        {CURRICULUM.map((module, index) => {
          const moduleNum = (index + 1).toString() as keyof typeof moduleThemes;
          const theme = moduleThemes[moduleNum];
          const progress = getModuleProgress(module.id, completedLessons);

          return (
            <Link
              key={module.id}
              href={`/(tabs)/learn/${module.id}`}
              asChild
            >
              <Pressable className="bg-surface rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center active:opacity-90">
                <View
                  style={{ backgroundColor: theme.color }}
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                >
                  <Text className="text-2xl">{theme.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold text-base">
                    {module.title}
                  </Text>
                  <Text className="text-text-light text-sm" numberOfLines={1}>
                    {module.description}
                  </Text>
                  {/* Progress bar */}
                  <View className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <View
                      style={{ width: `${progress}%`, backgroundColor: theme.color }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
                <Text className="text-text-light ml-2">{Math.round(progress)}%</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
