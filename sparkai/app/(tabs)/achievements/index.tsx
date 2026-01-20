import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuthStore, useProgressStore } from '@/lib/stores';
import { CURRICULUM } from '@/constants/curriculum';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = {
  // Streak achievements
  streak_3: { title: '3-Day Streak', emoji: '🔥', description: 'Learn for 3 days in a row' },
  streak_7: { title: 'Week Warrior', emoji: '⚡', description: 'Learn for 7 days in a row' },
  streak_30: { title: 'Monthly Master', emoji: '🌟', description: 'Learn for 30 days in a row' },
  // Module achievements
  module_1_complete: { title: 'AI Explorer', emoji: '🌍', description: 'Complete Module 1' },
  module_2_complete: { title: 'Learning Machine', emoji: '🧠', description: 'Complete Module 2' },
  module_3_complete: { title: 'Prompt Pro', emoji: '💬', description: 'Complete Module 3' },
  module_4_complete: { title: 'Critical Thinker', emoji: '🔍', description: 'Complete Module 4' },
  module_5_complete: { title: 'AI Citizen', emoji: '🛡️', description: 'Complete Module 5' },
  // Special achievements
  first_project: { title: 'Creator', emoji: '🎨', description: 'Complete your first project' },
  perfect_quiz: { title: 'Perfect Score', emoji: '💯', description: 'Get 100% on a quiz' },
  all_complete: { title: 'AI Graduate', emoji: '🎓', description: 'Complete all lessons' },
};

type AchievementType = keyof typeof ACHIEVEMENT_DEFINITIONS;

export default function AchievementsScreen() {
  const { activeChild } = useAuthStore();
  const { achievements, streak, getCompletedLessons, fetchProgress } = useProgressStore();

  const completedLessons = getCompletedLessons();
  const totalLessons = CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0);

  useEffect(() => {
    if (activeChild) {
      fetchProgress(activeChild.id);
    }
  }, [activeChild, fetchProgress]);

  const earnedAchievementTypes = achievements.map((a) => a.achievement_type);

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-surface border-b border-gray-100">
        <Text className="text-2xl font-bold text-text">Achievements</Text>
        <Text className="text-text-light mt-1">
          {achievements.length} of {Object.keys(ACHIEVEMENT_DEFINITIONS).length} badges earned
        </Text>
      </View>

      {/* Stats cards */}
      <View className="flex-row px-6 pt-6 gap-3">
        <View className="flex-1 bg-surface rounded-2xl p-4 border border-gray-100">
          <Text className="text-3xl mb-1">🔥</Text>
          <Text className="text-2xl font-bold text-text">
            {streak?.current_streak || 0}
          </Text>
          <Text className="text-text-light text-sm">Day Streak</Text>
        </View>
        <View className="flex-1 bg-surface rounded-2xl p-4 border border-gray-100">
          <Text className="text-3xl mb-1">📚</Text>
          <Text className="text-2xl font-bold text-text">
            {completedLessons.length}
          </Text>
          <Text className="text-text-light text-sm">Lessons Done</Text>
        </View>
        <View className="flex-1 bg-surface rounded-2xl p-4 border border-gray-100">
          <Text className="text-3xl mb-1">⭐</Text>
          <Text className="text-2xl font-bold text-text">
            {streak?.longest_streak || 0}
          </Text>
          <Text className="text-text-light text-sm">Best Streak</Text>
        </View>
      </View>

      {/* Progress to completion */}
      <View className="mx-6 mt-6 bg-surface rounded-2xl p-4 border border-gray-100">
        <View className="flex-row justify-between mb-2">
          <Text className="text-text font-semibold">Overall Progress</Text>
          <Text className="text-primary font-bold">
            {Math.round((completedLessons.length / totalLessons) * 100)}%
          </Text>
        </View>
        <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <View
            style={{ width: `${(completedLessons.length / totalLessons) * 100}%` }}
            className="h-full bg-primary rounded-full"
          />
        </View>
        <Text className="text-text-light text-sm mt-2">
          {completedLessons.length} of {totalLessons} lessons completed
        </Text>
      </View>

      {/* Badges grid */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-text mb-4">Badges</Text>
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(ACHIEVEMENT_DEFINITIONS).map(([type, def]) => {
            const isEarned = earnedAchievementTypes.includes(type);
            return (
              <View
                key={type}
                className={`w-[48%] bg-surface rounded-2xl p-4 mb-3 border items-center ${
                  isEarned ? 'border-warning' : 'border-gray-100'
                }`}
              >
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                    isEarned ? 'bg-warning/20' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-3xl ${isEarned ? '' : 'opacity-30'}`}>
                    {def.emoji}
                  </Text>
                </View>
                <Text
                  className={`font-semibold text-center ${
                    isEarned ? 'text-text' : 'text-text-light'
                  }`}
                >
                  {def.title}
                </Text>
                <Text className="text-text-light text-xs text-center mt-1">
                  {def.description}
                </Text>
                {isEarned && (
                  <View className="bg-warning/20 px-2 py-1 rounded-full mt-2">
                    <Text className="text-warning text-xs font-medium">Earned!</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
