import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getLessonById } from '@/constants/curriculum';
import { getLessonContent } from '@/constants/lessonContent';
import { moduleThemes } from '@/constants/theme';
import { useAuthStore, useProgressStore } from '@/lib/stores';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';

export default function LessonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  const { activeChild } = useAuthStore();
  const { updateLessonProgress, completeLessonWithDetails } = useProgressStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const lessonData = getLessonById(id || '');
  const detailedContent = id ? getLessonContent(id) : undefined;

  // Debug log
  console.log('Lesson ID:', id, 'Has detailed content:', !!detailedContent);

  useEffect(() => {
    // Mark lesson as in progress when starting
    if (activeChild && lessonData) {
      updateLessonProgress(
        activeChild.id,
        lessonData.lesson.id,
        lessonData.module.id,
        { status: 'in_progress' }
      );
    }
  }, [activeChild, lessonData]);

  if (!lessonData) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text">Lesson not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-primary">Go back</Text>
        </Pressable>
      </View>
    );
  }

  // If we have detailed lesson content, use the new LessonPlayer
  if (detailedContent) {
    return (
      <LessonPlayer
        lesson={detailedContent}
        onComplete={() => router.back()}
      />
    );
  }

  // Fallback to the basic rendering for lessons without detailed content
  const { module, lesson } = lessonData;
  const moduleIndex = parseInt(module.id.split('-')[1]) as 1 | 2 | 3 | 4 | 5;
  const theme = moduleThemes[moduleIndex.toString() as keyof typeof moduleThemes];

  const totalSteps = lesson.content.length;
  const currentContent = lesson.content[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Lesson complete
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!activeChild) {
      // Demo mode - just go back
      router.back();
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // Calculate quiz score if there was a quiz
    let score = 100; // Default score if no quiz
    const quizContent = lesson.content.find((c) => c.type === 'quiz');
    if (quizContent && quizContent.type === 'quiz') {
      const quiz = quizContent.data as { questions: Array<{ id: string; correctIndex: number }> };
      const correctAnswers = quiz.questions.filter(
        (q) => quizAnswers[q.id] === q.correctIndex
      ).length;
      score = Math.round((correctAnswers / quiz.questions.length) * 100);
    }

    await completeLessonWithDetails(activeChild.id, lesson.id, module.id, score, timeSpent);

    Alert.alert(
      'Great job! 🎉',
      `You completed "${lesson.title}" with a score of ${score}%!`,
      [
        {
          text: 'Continue',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const renderContent = () => {
    switch (currentContent.type) {
      case 'text':
        const textData = currentContent.data as { title?: string; body: string };
        return (
          <View className="px-6 py-8">
            {textData.title && (
              <Text className="text-2xl font-bold text-text mb-4">
                {textData.title}
              </Text>
            )}
            <Text className="text-text text-lg leading-7">{textData.body}</Text>
          </View>
        );

      case 'interactive':
        const interactiveData = currentContent.data as { component: string; props: Record<string, unknown> };
        return (
          <View className="px-6 py-8">
            <View className="bg-surface rounded-2xl p-6 border border-gray-100">
              <Text className="text-xl font-bold text-text mb-4">
                {(interactiveData.props.title as string) || 'Interactive Activity'}
              </Text>
              <View className="bg-gray-100 rounded-xl p-8 items-center">
                <Text className="text-4xl mb-4">🎮</Text>
                <Text className="text-text-light text-center">
                  Interactive component: {interactiveData.component}
                </Text>
                <Text className="text-text-light text-center text-sm mt-2">
                  (Full implementation coming soon!)
                </Text>
              </View>
            </View>
          </View>
        );

      case 'quiz':
        const quizData = currentContent.data as {
          questions: Array<{
            id: string;
            question: string;
            options: string[];
            correctIndex: number;
            explanation?: string;
          }>;
        };
        return (
          <View className="px-6 py-8">
            <Text className="text-xl font-bold text-text mb-6">Quiz Time! 📝</Text>
            {quizData.questions.map((q, qIndex) => (
              <View key={q.id} className="mb-6">
                <Text className="text-text font-semibold mb-3">
                  {qIndex + 1}. {q.question}
                </Text>
                {q.options.map((option, oIndex) => {
                  const isSelected = quizAnswers[q.id] === oIndex;
                  const isCorrect = oIndex === q.correctIndex;
                  const showResult = quizAnswers[q.id] !== undefined;

                  return (
                    <Pressable
                      key={oIndex}
                      className={`p-4 rounded-xl mb-2 border ${
                        showResult
                          ? isCorrect
                            ? 'bg-success/20 border-success'
                            : isSelected
                            ? 'bg-error/20 border-error'
                            : 'bg-surface border-gray-200'
                          : isSelected
                          ? 'bg-primary/20 border-primary'
                          : 'bg-surface border-gray-200'
                      }`}
                      onPress={() => handleQuizAnswer(q.id, oIndex)}
                      disabled={showResult}
                    >
                      <Text
                        className={`${
                          showResult && isCorrect
                            ? 'text-success'
                            : showResult && isSelected
                            ? 'text-error'
                            : 'text-text'
                        }`}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
                {quizAnswers[q.id] !== undefined && q.explanation && (
                  <View className="bg-primary/10 p-3 rounded-xl mt-2">
                    <Text className="text-primary text-sm">{q.explanation}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      default:
        return (
          <View className="px-6 py-8">
            <Text className="text-text">Unknown content type</Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={theme.gradient as [string, string]}
        className="pt-14 pb-4 px-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-white/80 text-lg">✕ Close</Text>
          </Pressable>
          <View className="flex-row items-center">
            <Text className="text-white/80 mr-2">
              {currentStep + 1}/{totalSteps}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-white/20 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress}%` }}
            className="h-full bg-white rounded-full"
          />
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-3xl mr-3">{lesson.icon}</Text>
          <View>
            <Text className="text-white/80 text-sm">{module.title}</Text>
            <Text className="text-white font-bold text-lg">{lesson.title}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView className="flex-1">{renderContent()}</ScrollView>

      {/* Navigation */}
      <View className="px-6 py-4 bg-surface border-t border-gray-100 flex-row">
        <Pressable
          className={`flex-1 py-4 rounded-xl items-center mr-2 ${
            currentStep === 0 ? 'bg-gray-100' : 'bg-gray-200 active:opacity-80'
          }`}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <Text
            className={`font-semibold ${
              currentStep === 0 ? 'text-text-light' : 'text-text'
            }`}
          >
            Previous
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 py-4 rounded-xl items-center ml-2 bg-primary active:opacity-80"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold">
            {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
