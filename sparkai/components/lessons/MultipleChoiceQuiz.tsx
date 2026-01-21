import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  feedbackIfSelected?: string;
}

interface Question {
  id: string;
  questionText: string;
  questionImage?: string;
  answers: Answer[];
  explanation: string;
  hint?: string;
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  questionResults: {
    questionId: string;
    selectedAnswerId: string;
    wasCorrect: boolean;
  }[];
}

interface MultipleChoiceQuizProps {
  questions: Question[];
  showProgressBar?: boolean;
  shuffleAnswers?: boolean;
  passingScore?: number;
  onComplete: (results: QuizResult) => void;
}

export function MultipleChoiceQuiz({
  questions,
  showProgressBar = true,
  shuffleAnswers = true,
  passingScore = 60,
  onComplete,
}: MultipleChoiceQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<QuizResult['questionResults']>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answers = shuffleAnswers
    ? [...currentQuestion.answers].sort(() => Math.random() - 0.5)
    : currentQuestion.answers;

  const handleSelectAnswer = (answerId: string) => {
    if (showResult) return;

    setSelectedAnswer(answerId);
    setShowResult(true);
    setShowHint(false);

    const answer = currentQuestion.answers.find((a) => a.id === answerId);
    const wasCorrect = answer?.isCorrect ?? false;

    setResults((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswerId: answerId,
        wasCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      // Quiz complete
      const correct = results.filter((r) => r.wasCorrect).length +
        (currentQuestion.answers.find((a) => a.id === selectedAnswer)?.isCorrect ? 1 : 0);
      const total = questions.length;
      const score = Math.round((correct / total) * 100);

      setIsComplete(true);
      onComplete({
        score,
        correct,
        total,
        passed: score >= passingScore,
        questionResults: results,
      });
    }
  };

  const selectedAnswerObj = currentQuestion.answers.find(
    (a) => a.id === selectedAnswer
  );
  const correctAnswer = currentQuestion.answers.find((a) => a.isCorrect);

  if (isComplete) {
    const correct = results.filter((r) => r.wasCorrect).length;
    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= passingScore;

    return (
      <View className="flex-1 bg-slate-50 p-6">
        <View className="flex-1 items-center justify-center">
          {/* Score circle */}
          <View
            className={`w-32 h-32 rounded-full items-center justify-center mb-6 ${
              passed ? 'bg-green-100' : 'bg-amber-100'
            }`}
          >
            <Text
              className={`text-4xl font-bold ${
                passed ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {score}%
            </Text>
          </View>

          <Text className="text-2xl font-bold text-slate-800 mb-2">
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </Text>
          <Text className="text-slate-600 text-center mb-6">
            You got {correct} out of {total} questions correct.
          </Text>

          {/* Result breakdown */}
          <View className="w-full bg-white rounded-xl p-4">
            {results.map((result, index) => (
              <View
                key={result.questionId}
                className="flex-row items-center py-2 border-b border-slate-100 last:border-0"
              >
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                    result.wasCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {result.wasCorrect ? (
                    <SmallCheckIcon />
                  ) : (
                    <SmallXIcon />
                  )}
                </View>
                <Text className="text-slate-700 flex-1">
                  Question {index + 1}
                </Text>
                <Text
                  className={result.wasCorrect ? 'text-green-600' : 'text-red-600'}
                >
                  {result.wasCorrect ? 'Correct' : 'Incorrect'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Progress bar */}
      {showProgressBar && (
        <View className="px-6 pt-4">
          <View className="flex-row items-center mb-2">
            {questions.map((_, index) => (
              <View
                key={index}
                className={`flex-1 h-2 rounded-full mx-0.5 ${
                  index < currentIndex
                    ? 'bg-green-500'
                    : index === currentIndex
                    ? 'bg-indigo-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </View>
          <Text className="text-slate-500 text-sm">
            Question {currentIndex + 1} of {questions.length}
          </Text>
        </View>
      )}

      {/* Question */}
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-slate-800 leading-relaxed">
          {currentQuestion.questionText}
        </Text>
      </View>

      {/* Answers */}
      <View className="px-6 gap-3">
        {answers.map((answer, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedAnswer === answer.id;
          const isCorrectAnswer = answer.isCorrect;
          const showCorrectHighlight = showResult && isCorrectAnswer;
          const showIncorrectHighlight = showResult && isSelected && !isCorrectAnswer;

          return (
            <Pressable
              key={answer.id}
              onPress={() => handleSelectAnswer(answer.id)}
              disabled={showResult}
              className={`rounded-xl p-4 border-2 ${
                showCorrectHighlight
                  ? 'bg-green-50 border-green-500'
                  : showIncorrectHighlight
                  ? 'bg-red-50 border-red-500'
                  : isSelected
                  ? 'bg-indigo-50 border-indigo-500'
                  : 'bg-white border-slate-200'
              }`}
              style={{
                shadowColor: isSelected ? '#6366F1' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.15 : 0.05,
                shadowRadius: 4,
                elevation: isSelected ? 4 : 2,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    showCorrectHighlight
                      ? 'bg-green-500'
                      : showIncorrectHighlight
                      ? 'bg-red-500'
                      : isSelected
                      ? 'bg-indigo-500'
                      : 'bg-slate-100'
                  }`}
                >
                  {showCorrectHighlight ? (
                    <SmallCheckIcon color="white" />
                  ) : showIncorrectHighlight ? (
                    <SmallXIcon color="white" />
                  ) : (
                    <Text
                      className={`font-bold ${
                        isSelected ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {letter}
                    </Text>
                  )}
                </View>
                <Text
                  className={`flex-1 ${
                    showCorrectHighlight
                      ? 'text-green-800 font-semibold'
                      : showIncorrectHighlight
                      ? 'text-red-800'
                      : 'text-slate-700'
                  }`}
                >
                  {answer.text}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Hint button */}
      {currentQuestion.hint && !showResult && (
        <View className="px-6 mt-4">
          <Pressable
            onPress={() => setShowHint(true)}
            className="flex-row items-center justify-center py-2"
          >
            <Text className="text-2xl mr-2">💡</Text>
            <Text className="text-indigo-600 font-medium">Need a hint?</Text>
          </Pressable>
          {showHint && (
            <View className="bg-amber-50 rounded-xl p-4 mt-2 border border-amber-200">
              <Text className="text-amber-800">{currentQuestion.hint}</Text>
            </View>
          )}
        </View>
      )}

      {/* Explanation (after answer) */}
      {showResult && (
        <View className="px-6 mt-6">
          <View
            className={`rounded-xl p-4 ${
              selectedAnswerObj?.isCorrect ? 'bg-green-50' : 'bg-blue-50'
            }`}
          >
            <Text
              className={`font-bold mb-2 ${
                selectedAnswerObj?.isCorrect ? 'text-green-700' : 'text-blue-700'
              }`}
            >
              {selectedAnswerObj?.isCorrect ? '✓ Correct!' : 'Explanation'}
            </Text>
            <Text
              className={
                selectedAnswerObj?.isCorrect ? 'text-green-700' : 'text-blue-700'
              }
            >
              {selectedAnswerObj?.feedbackIfSelected || currentQuestion.explanation}
            </Text>
          </View>

          {/* Next button */}
          <Pressable
            onPress={handleNext}
            className="bg-indigo-600 rounded-xl py-4 mt-4 items-center"
            style={{
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text className="text-white font-bold text-lg">
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Text>
          </Pressable>
        </View>
      )}

      <View className="h-8" />
    </ScrollView>
  );
}

function SmallCheckIcon({ color = '#10B981' }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SmallXIcon({ color = '#EF4444' }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
