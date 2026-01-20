import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mascot } from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { SortingGame } from '@/components/lessons/SortingGame';
import { MultipleChoiceQuiz } from '@/components/lessons/MultipleChoiceQuiz';
import { ContentCard } from '@/components/lessons/ContentCard';
import { useProgressStore } from '@/lib/stores';
import {
  LessonContent,
  LessonScreen,
  ContentScreenData,
  QuizScreenData,
  SortingScreenData,
  ScavengerScreenData,
  ReflectionScreenData,
  CelebrationScreenData,
  DiscussionScreenData,
} from '@/constants/lessonContent';
import Svg, { Path } from 'react-native-svg';

interface LessonPlayerProps {
  lesson: LessonContent;
  onComplete: () => void;
}

export function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [screenCompleted, setScreenCompleted] = useState(false);
  const [scavengerFindings, setScavengerFindings] = useState<Record<string, string>>({});
  const [reflectionText, setReflectionText] = useState('');
  const { completeLesson, addXp } = useProgressStore();

  const currentScreen = lesson.screens[currentScreenIndex];
  const isLastScreen = currentScreenIndex === lesson.screens.length - 1;
  const progress = ((currentScreenIndex + 1) / lesson.screens.length) * 100;

  const handleNext = useCallback(() => {
    if (isLastScreen) {
      // Complete the lesson
      completeLesson(lesson.id);
      addXp(lesson.xpReward);
      onComplete();
    } else {
      setCurrentScreenIndex(prev => prev + 1);
      setScreenCompleted(false);
    }
  }, [isLastScreen, lesson.id, lesson.xpReward, completeLesson, addXp, onComplete]);

  const handleScreenComplete = useCallback(() => {
    setScreenCompleted(true);
  }, []);

  const handleClose = () => {
    router.back();
  };

  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'content':
        return (
          <ContentScreen
            data={currentScreen.data as ContentScreenData}
            mascotExpression={currentScreen.mascotExpression}
            onContinue={handleNext}
          />
        );

      case 'quiz':
        return (
          <QuizScreen
            data={currentScreen.data as QuizScreenData}
            onComplete={handleScreenComplete}
            onContinue={handleNext}
            completed={screenCompleted}
          />
        );

      case 'sorting':
        return (
          <SortingScreen
            data={currentScreen.data as SortingScreenData}
            onComplete={handleScreenComplete}
            onContinue={handleNext}
            completed={screenCompleted}
          />
        );

      case 'scavenger':
        return (
          <ScavengerScreen
            data={currentScreen.data as ScavengerScreenData}
            findings={scavengerFindings}
            onUpdateFindings={setScavengerFindings}
            onComplete={handleScreenComplete}
            onContinue={handleNext}
            completed={screenCompleted}
          />
        );

      case 'reflection':
        return (
          <ReflectionScreen
            data={currentScreen.data as ReflectionScreenData}
            text={reflectionText}
            onTextChange={setReflectionText}
            onContinue={handleNext}
          />
        );

      case 'celebration':
        return (
          <CelebrationScreen
            data={currentScreen.data as CelebrationScreenData}
            onContinue={handleNext}
            isLastScreen={isLastScreen}
          />
        );

      case 'discussion':
        return (
          <DiscussionScreen
            data={currentScreen.data as DiscussionScreenData}
            onContinue={handleNext}
            isLastScreen={isLastScreen}
          />
        );

      default:
        return (
          <View className="flex-1 items-center justify-center">
            <Text>Unknown screen type</Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        className="pt-12 pb-4 px-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <Pressable onPress={handleClose} className="p-2 -ml-2">
            <CloseIcon />
          </Pressable>
          <Text className="text-white font-semibold flex-1 text-center">
            {lesson.title}
          </Text>
          <View className="w-8" />
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-white/30 rounded-full overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-white/70 text-xs text-center mt-1">
          {currentScreenIndex + 1} / {lesson.screens.length}
        </Text>
      </LinearGradient>

      {/* Screen content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {renderScreen()}
      </ScrollView>
    </View>
  );
}

// Content Screen Component
function ContentScreen({
  data,
  mascotExpression,
  onContinue,
}: {
  data: ContentScreenData;
  mascotExpression?: string;
  onContinue: () => void;
}) {
  // Map mascot expressions to valid Mascot component expressions
  const getExpression = (): 'happy' | 'thinking' | 'excited' | 'waving' => {
    switch (mascotExpression) {
      case 'excited': return 'excited';
      case 'thinking': return 'thinking';
      case 'explaining': return 'thinking'; // Map explaining to thinking
      case 'happy': return 'happy';
      default: return 'happy'; // Default to happy
    }
  };

  return (
    <View className="flex-1 p-6">
      {data.mascotMessage ? (
        <View className="mb-6">
          <View className="items-center mb-4">
            <Mascot size="md" expression={getExpression()} />
          </View>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-slate-700 text-base leading-relaxed">
              {data.mascotMessage}
            </Text>
          </View>
        </View>
      ) : (
        <>
          {data.title && (
            <Text className="text-2xl font-bold text-slate-800 mb-4">
              {data.title}
            </Text>
          )}
          {data.body && (
            <Text className="text-slate-600 text-base leading-relaxed mb-4">
              {data.body}
            </Text>
          )}
        </>
      )}

      {data.bulletPoints && (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {data.bulletPoints.map((point, index) => (
            <View key={index} className="flex-row items-start mb-3">
              <Text className="text-indigo-500 mr-3 text-lg">•</Text>
              <Text className="text-slate-700 text-base leading-relaxed flex-1">
                {renderBoldText(point)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Visual section for animations/grids */}
      {data.visual && (
        <View className="mb-4">
          {data.visual.type === 'animation' && (
            <View className="bg-indigo-50 rounded-xl p-4 flex-row justify-center items-center">
              {(data.visual.data as { steps: { icon: string; label: string }[] }).steps.map((step, i, arr) => (
                <View key={i} className="items-center mx-2">
                  <Text className="text-3xl mb-1">{step.icon}</Text>
                  <Text className="text-xs text-indigo-600">{step.label}</Text>
                  {i < arr.length - 1 && <Text className="text-indigo-400 text-xl mx-2">→</Text>}
                </View>
              ))}
            </View>
          )}
          {data.visual.type === 'grid' && (
            <View className="bg-slate-100 rounded-xl p-4">
              <View className="flex-row flex-wrap justify-center mb-3">
                {(data.visual.data as { images: string[]; result: string }).images.map((img, i) => (
                  <Text key={i} className="text-3xl m-1">{img}</Text>
                ))}
              </View>
              <View className="flex-row items-center justify-center">
                <Text className="text-slate-400 text-xl mr-2">→</Text>
                <View className="bg-green-100 px-4 py-2 rounded-full">
                  <Text className="text-green-700 font-bold">
                    {(data.visual.data as { result: string }).result}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {data.tip && (
        <View className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 mb-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <Text className="text-amber-900 text-base font-semibold flex-1">
              {renderBoldText(data.tip)}
            </Text>
          </View>
        </View>
      )}

      <View className="mt-auto pt-4">
        <Button
          title={data.buttonText || 'Continue'}
          onPress={onContinue}
          size="lg"
        />
      </View>
    </View>
  );
}

// Helper to render bold text (text between **)
function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <Text key={i} className="font-bold text-slate-800">{part}</Text>;
    }
    return part;
  });
}

// Quiz Screen Component
function QuizScreen({
  data,
  onComplete,
  onContinue,
  completed,
}: {
  data: QuizScreenData;
  onComplete: () => void;
  onContinue: () => void;
  completed: boolean;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = data.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    if (currentQuestion.options[index].isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
      onComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (quizComplete) {
    return (
      <View className="flex-1 p-6">
        <View className="items-center mb-6">
          <Mascot size="md" expression="happy" />
        </View>
        <View className="bg-white rounded-2xl p-6 shadow-sm items-center">
          <Text className="text-2xl mb-2">🎉</Text>
          <Text className="text-xl font-bold text-slate-800 mb-2">Quiz Complete!</Text>
          <Text className="text-slate-600 text-center">
            You got {correctCount} out of {data.questions.length} correct!
          </Text>
        </View>
        <View className="mt-auto pt-4">
          <Button title="Continue" onPress={onContinue} size="lg" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      {data.title && (
        <Text className="text-xl font-bold text-slate-800 mb-2">{data.title}</Text>
      )}
      {data.intro && !showFeedback && (
        <Text className="text-slate-600 mb-4">{data.intro}</Text>
      )}

      <Text className="text-sm text-slate-500 mb-2">
        Question {currentQuestionIndex + 1} of {data.questions.length}
      </Text>

      <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <Text className="text-lg font-semibold text-slate-800">
          {currentQuestion.question}
        </Text>
      </View>

      <View className="gap-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = option.isCorrect;
          const showCorrectness = showFeedback && isSelected;
          const showCorrectAnswer = showFeedback && isCorrect && !isSelected;
          const letters = ['A', 'B', 'C', 'D'];

          return (
            <Pressable
              key={index}
              onPress={() => handleSelectAnswer(index)}
              className={`p-4 rounded-xl border-2 flex-row items-start ${
                showCorrectness
                  ? isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                  : showCorrectAnswer
                  ? 'bg-green-50 border-green-400'
                  : isSelected
                  ? 'bg-indigo-50 border-indigo-500'
                  : 'bg-white border-slate-200'
              }`}
              disabled={showFeedback}
            >
              {/* Letter prefix circle */}
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  showCorrectness
                    ? isCorrect
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : showCorrectAnswer
                    ? 'bg-green-500'
                    : isSelected
                    ? 'bg-indigo-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`font-bold ${
                    showCorrectness || showCorrectAnswer || isSelected
                      ? 'text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {letters[index]}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className={`font-medium ${
                    showCorrectness
                      ? isCorrect
                        ? 'text-green-700'
                        : 'text-red-700'
                      : showCorrectAnswer
                      ? 'text-green-700'
                      : 'text-slate-700'
                  }`}
                >
                  {option.text}
                </Text>
                {showFeedback && isSelected && (
                  <View className="flex-row items-center mt-2">
                    <Text className="mr-2">{isCorrect ? '✅' : '❌'}</Text>
                    <Text
                      className={`text-sm flex-1 ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {option.feedback}
                    </Text>
                  </View>
                )}
                {showCorrectAnswer && (
                  <View className="flex-row items-center mt-2">
                    <Text className="mr-2">✅</Text>
                    <Text className="text-sm text-green-600 flex-1">
                      This was the correct answer!
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {showFeedback && (
        <View className="mt-auto pt-4">
          <Button
            title={isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            onPress={handleNextQuestion}
            size="lg"
          />
        </View>
      )}
    </View>
  );
}

// Sorting Screen Component
function SortingScreen({
  data,
  onComplete,
  onContinue,
  completed,
}: {
  data: SortingScreenData;
  onComplete: () => void;
  onContinue: () => void;
  completed: boolean;
}) {
  const handleGameComplete = (results: { correct: number; total: number }) => {
    onComplete();
  };

  return (
    <View className="flex-1 p-4">
      <SortingGame
        title={data.title}
        instructions={data.instructions}
        categories={data.categories.map(c => ({ id: c.id, label: c.label, color: c.color }))}
        items={data.items.map(item => ({
          id: item.id,
          content: item.content,
          correctCategory: item.correctCategory,
          explanation: item.explanation,
        }))}
        onComplete={handleGameComplete}
      />
      {completed && (
        <View className="mt-4">
          <Button title="Continue" onPress={onContinue} size="lg" />
        </View>
      )}
    </View>
  );
}

// Scavenger Hunt Screen Component
function ScavengerScreen({
  data,
  findings,
  onUpdateFindings,
  onComplete,
  onContinue,
  completed,
}: {
  data: ScavengerScreenData;
  findings: Record<string, string>;
  onUpdateFindings: (findings: Record<string, string>) => void;
  onComplete: () => void;
  onContinue: () => void;
  completed: boolean;
}) {
  const foundCount = Object.values(findings).filter(f => f.trim().length > 0).length;
  const canComplete = foundCount >= data.minItemsToComplete;

  const handleInputChange = (itemId: string, value: string) => {
    onUpdateFindings({ ...findings, [itemId]: value });
  };

  const handleComplete = () => {
    if (canComplete) {
      onComplete();
    }
  };

  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold text-slate-800 mb-2">{data.title}</Text>
      <Text className="text-slate-600 mb-4">{data.instructions}</Text>

      <View className="bg-indigo-50 rounded-xl p-3 mb-4">
        <Text className="text-indigo-700 font-medium text-center">
          Found: {foundCount} / {data.minItemsToComplete} required
        </Text>
      </View>

      <View className="gap-4">
        {data.items.map((item) => (
          <View key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="font-semibold text-slate-800 mb-1">{item.prompt}</Text>
            <Text className="text-slate-500 text-sm mb-2">💡 {item.hint}</Text>
            <TextInput
              className="border border-slate-200 rounded-lg p-3 bg-slate-50"
              placeholder="What did you find?"
              value={findings[item.id] || ''}
              onChangeText={(value) => handleInputChange(item.id, value)}
              multiline
            />
          </View>
        ))}
      </View>

      <View className="mt-6">
        {completed ? (
          <Button title="Continue" onPress={onContinue} size="lg" />
        ) : (
          <Button
            title={canComplete ? 'Complete Hunt!' : `Find ${data.minItemsToComplete - foundCount} more`}
            onPress={handleComplete}
            disabled={!canComplete}
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

// Reflection Screen Component
function ReflectionScreen({
  data,
  text,
  onTextChange,
  onContinue,
}: {
  data: ReflectionScreenData;
  text: string;
  onTextChange: (text: string) => void;
  onContinue: () => void;
}) {
  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold text-slate-800 mb-2">{data.title}</Text>
      {data.mascotMessage && (
        <View className="items-center mb-4">
          <Mascot size="sm" expression="thinking" />
          <Text className="text-slate-600 text-center mt-2">{data.mascotMessage}</Text>
        </View>
      )}
      <Text className="text-slate-700 font-medium mb-3">{data.prompt}</Text>
      <TextInput
        className="border border-slate-200 rounded-xl p-4 bg-white min-h-[120px]"
        placeholder={data.placeholder || 'Share your thoughts...'}
        value={text}
        onChangeText={onTextChange}
        multiline
        textAlignVertical="top"
      />
      <View className="mt-auto pt-4">
        <Button title="Continue" onPress={onContinue} size="lg" />
      </View>
    </View>
  );
}

// Celebration Screen Component
function CelebrationScreen({
  data,
  onContinue,
  isLastScreen,
}: {
  data: CelebrationScreenData;
  onContinue: () => void;
  isLastScreen: boolean;
}) {
  return (
    <View className="flex-1 p-6 items-center">
      <View className="items-center mb-6">
        <Text className="text-5xl mb-4">🎉</Text>
        <Mascot size="lg" expression="excited" />
      </View>

      <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
        {data.title}
      </Text>
      <Text className="text-slate-600 text-center mb-4">{data.message}</Text>

      {data.achievements && (
        <View className="bg-white rounded-2xl p-4 w-full shadow-sm mb-4">
          {data.achievements.map((achievement, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-green-500 mr-2">✅</Text>
              <Text className="text-slate-700 flex-1">{achievement}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row gap-4 mb-6">
        {data.xpEarned && (
          <View className="bg-amber-100 rounded-xl px-4 py-2">
            <Text className="text-amber-700 font-bold">⭐ {data.xpEarned} XP</Text>
          </View>
        )}
        {data.badgeEarned && (
          <View className="bg-indigo-100 rounded-xl px-4 py-2">
            <Text className="text-indigo-700 font-bold">🏆 {data.badgeEarned}</Text>
          </View>
        )}
      </View>

      <View className="mt-auto w-full">
        <Button
          title={isLastScreen ? 'Finish Lesson' : 'Continue'}
          onPress={onContinue}
          size="lg"
        />
      </View>
    </View>
  );
}

// Discussion Screen Component
function DiscussionScreen({
  data,
  onContinue,
  isLastScreen,
}: {
  data: DiscussionScreenData;
  onContinue: () => void;
  isLastScreen: boolean;
}) {
  return (
    <View className="flex-1 p-6">
      <View className="items-center mb-4">
        <Text className="text-4xl mb-2">💬</Text>
      </View>

      <Text className="text-xl font-bold text-slate-800 text-center mb-2">
        {data.title}
      </Text>
      {data.intro && (
        <Text className="text-slate-600 text-center mb-4">{data.intro}</Text>
      )}

      <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <Text className="font-semibold text-slate-700 mb-3">🗣️ Ask a grown-up:</Text>
        {data.questions.map((question, index) => (
          <View key={index} className="flex-row mb-2">
            <Text className="text-slate-600">• {question}</Text>
          </View>
        ))}
      </View>

      {data.thinkAbout && (
        <View className="bg-indigo-50 rounded-2xl p-4">
          <Text className="font-semibold text-indigo-700 mb-1">💭 Think about:</Text>
          <Text className="text-indigo-600">{data.thinkAbout}</Text>
        </View>
      )}

      <View className="mt-auto pt-4">
        <Button
          title={isLastScreen ? 'Finish Lesson' : 'Continue'}
          onPress={onContinue}
          size="lg"
        />
      </View>
    </View>
  );
}

// Close Icon
function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
