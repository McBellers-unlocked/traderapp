import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getModuleById } from '@/constants/curriculum';
import { moduleThemes } from '@/constants/theme';
import { useProgressStore } from '@/lib/stores';

export default function ModuleScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { getCompletedLessons, getProgressForLesson } = useProgressStore();

  const module = getModuleById(moduleId);
  const completedLessons = getCompletedLessons();

  if (!module) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text">Module not found</Text>
      </View>
    );
  }

  const moduleIndex = parseInt(moduleId.split('-')[1]) as 1 | 2 | 3 | 4 | 5;
  const theme = moduleThemes[moduleIndex.toString() as keyof typeof moduleThemes];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={theme.gradient as [string, string]}
        className="pt-16 pb-8 px-6"
      >
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-white/80 text-lg">← Back</Text>
        </Pressable>
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mr-4">
            <Text className="text-4xl">{theme.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white/80">Module {moduleIndex}</Text>
            <Text className="text-2xl font-bold text-white">{module.title}</Text>
          </View>
        </View>
        <Text className="text-white/80 mt-4">{module.description}</Text>
      </LinearGradient>

      {/* Lessons list */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-text mb-4">
          Lessons ({module.lessons.length})
        </Text>

        {module.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const progress = getProgressForLesson(lesson.id);
          const isInProgress = progress?.status === 'in_progress';

          return (
            <Pressable
              key={lesson.id}
              className="bg-surface rounded-2xl p-4 mb-3 border border-gray-100 active:opacity-90"
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <View className="flex-row items-center">
                {/* Lesson number/status indicator */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    isCompleted
                      ? 'bg-success'
                      : isInProgress
                      ? 'bg-warning'
                      : 'bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <Text className="text-white font-bold">✓</Text>
                  ) : (
                    <Text
                      className={`font-bold ${
                        isInProgress ? 'text-white' : 'text-text-light'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>

                {/* Lesson info */}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-lg mr-2">{lesson.icon}</Text>
                    <Text className="text-text font-semibold flex-1">
                      {lesson.title}
                    </Text>
                  </View>
                  <Text className="text-text-light text-sm mt-1">
                    {lesson.description}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-gray-100 px-2 py-1 rounded-full mr-2">
                      <Text className="text-text-light text-xs">
                        {lesson.duration_minutes} min
                      </Text>
                    </View>
                    <View className="bg-gray-100 px-2 py-1 rounded-full">
                      <Text className="text-text-light text-xs capitalize">
                        {lesson.type}
                      </Text>
                    </View>
                    {progress?.score && (
                      <View className="bg-success/20 px-2 py-1 rounded-full ml-2">
                        <Text className="text-success text-xs font-medium">
                          {progress.score}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Arrow */}
                <Text className="text-text-light text-xl">→</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
