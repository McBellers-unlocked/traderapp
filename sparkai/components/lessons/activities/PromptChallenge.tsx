import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface Challenge {
  goal: string;
  hints: string[];
}

interface PromptChallengeProps {
  title: string;
  challenges: Challenge[];
  onComplete?: () => void;
}

export function PromptChallenge({
  title,
  challenges,
  onComplete,
}: PromptChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const challenge = challenges[currentChallenge];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setAttempts(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate AI response based on the prompt
      // In production, this would call the actual AI API
      let response = '';
      const goal = challenge.goal.toLowerCase();

      if (goal.includes('10 words') && goal.includes('rainbow')) {
        if (prompt.toLowerCase().includes('exactly 10') || prompt.toLowerCase().includes('10 words')) {
          response = "A rainbow is nature's colorful arch painting the sky beautifully.";
        } else {
          response = "Rainbows are beautiful natural phenomena that occur when sunlight is refracted through water droplets in the atmosphere, creating a spectacular display of colors across the sky.";
        }
      } else if (goal.includes('haiku') && goal.includes('pizza')) {
        if (prompt.toLowerCase().includes('haiku')) {
          response = "Cheesy golden disc\nTomato sauce and toppings\nDelicious pizza";
        } else {
          response = "Pizza is a wonderful food! The cheese stretches when you take a bite, and the sauce is tangy and sweet.";
        }
      } else if (goal.includes('gravity') && goal.includes("5")) {
        if (prompt.toLowerCase().includes('5 year') || prompt.toLowerCase().includes('simple') || prompt.toLowerCase().includes('kid')) {
          response = "Gravity is like an invisible magnet in the Earth that pulls everything down! That's why when you drop a ball, it falls to the ground. The Earth is like a big hugger that wants to hold onto everything!";
        } else {
          response = "Gravity is a fundamental force of nature that causes objects with mass to be attracted to one another. This phenomenon is described by Newton's law of universal gravitation.";
        }
      } else {
        response = "Here's my response based on your prompt! Try being more specific to get exactly what you want.";
      }

      setAiResponse(response);

    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    // Calculate score based on attempts (fewer attempts = higher score)
    const score = Math.max(100 - (attempts - 1) * 20, 20);
    setScores([...scores, score]);
    setChallengeComplete(true);
  };

  const handleTryAgain = () => {
    setAiResponse(null);
    setPrompt('');
  };

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setPrompt('');
      setAttempts(0);
      setShowHint(false);
      setCurrentHint(0);
      setAiResponse(null);
      setChallengeComplete(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (currentHint < challenge.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const getTotalScore = () => scores.reduce((a, b) => a + b, 0);
  const allComplete = scores.length === challenges.length;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎯</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        <View className="flex-row justify-center mb-4 gap-2">
          {challenges.map((_, index) => (
            <View
              key={index}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                index < scores.length
                  ? 'bg-green-500'
                  : index === currentChallenge
                  ? 'bg-indigo-500'
                  : 'bg-slate-200'
              }`}
            >
              <Text className={`font-bold text-sm ${
                index <= currentChallenge || index < scores.length ? 'text-white' : 'text-slate-500'
              }`}>
                {index < scores.length ? '✓' : index + 1}
              </Text>
            </View>
          ))}
        </View>

        {/* Score Display */}
        {scores.length > 0 && (
          <View className="bg-amber-100 rounded-xl p-3 mb-4 items-center">
            <Text className="text-amber-800 font-bold">⭐ Score: {getTotalScore()} points</Text>
          </View>
        )}

        {/* Challenge Card */}
        <View className="bg-indigo-600 rounded-2xl p-5 mb-4">
          <Text className="text-white text-sm font-medium mb-1">
            Challenge {currentChallenge + 1} of {challenges.length}
          </Text>
          <Text className="text-white text-lg font-bold">
            🎯 {challenge.goal}
          </Text>
          <Text className="text-indigo-200 text-sm mt-2">
            Attempts: {attempts} | Fewer attempts = More points!
          </Text>
        </View>

        {/* Completed State */}
        {challengeComplete ? (
          <View className="bg-green-50 rounded-2xl p-6 mb-4 items-center">
            <Text className="text-4xl mb-2">🎉</Text>
            <Text className="text-green-800 font-bold text-xl mb-1">Challenge Complete!</Text>
            <Text className="text-green-600 mb-4">
              You scored {scores[scores.length - 1]} points in {attempts} {attempts === 1 ? 'try' : 'tries'}!
            </Text>

            {currentChallenge < challenges.length - 1 ? (
              <Button title="Next Challenge →" onPress={handleNextChallenge} />
            ) : (
              <View className="items-center">
                <Text className="text-2xl mb-2">🏆</Text>
                <Text className="text-green-800 font-bold text-lg">All Challenges Complete!</Text>
                <Text className="text-green-600 mb-4">Total Score: {getTotalScore()} points</Text>
                {onComplete && <Button title="Finish! 🎉" onPress={onComplete} />}
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Prompt Input */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Your prompt:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[100px]"
                placeholder="Type your prompt here..."
                value={prompt}
                onChangeText={setPrompt}
                multiline
                textAlignVertical="top"
                editable={!isLoading && !aiResponse}
              />

              {!aiResponse && (
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    onPress={handleShowHint}
                    className="flex-1 bg-amber-100 py-3 rounded-xl items-center"
                  >
                    <Text className="text-amber-700 font-medium">💡 Hint</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!prompt.trim() || isLoading}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      prompt.trim() && !isLoading ? 'bg-indigo-500' : 'bg-slate-200'
                    }`}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className={`font-bold ${prompt.trim() ? 'text-white' : 'text-slate-400'}`}>
                        Try It! 🚀
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}
            </View>

            {/* Hint Display */}
            {showHint && (
              <View className="bg-amber-50 rounded-xl p-4 mb-4">
                <Text className="text-amber-800 font-medium mb-1">💡 Hint:</Text>
                <Text className="text-amber-700">
                  {challenge.hints.slice(0, currentHint + 1).join('\n• ')}
                </Text>
              </View>
            )}

            {/* AI Response */}
            {aiResponse && (
              <View className="bg-slate-100 rounded-2xl p-4 mb-4">
                <Text className="font-semibold text-slate-700 mb-2">AI's Response:</Text>
                <View className="bg-white rounded-xl p-4">
                  <Text className="text-slate-800">{aiResponse}</Text>
                </View>

                <View className="mt-4">
                  <Text className="text-slate-600 mb-3 text-center">
                    Did the AI do exactly what you wanted?
                  </Text>
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={handleTryAgain}
                      className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                    >
                      <Text className="text-slate-700 font-medium">🔄 Try Again</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSuccess}
                      className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                    >
                      <Text className="text-white font-bold">✅ Nailed It!</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
