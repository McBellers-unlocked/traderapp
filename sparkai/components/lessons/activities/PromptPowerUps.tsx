import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';

interface PowerUp {
  name: string;
  example: string;
}

interface PromptPowerUpsProps {
  title: string;
  powerUps: PowerUp[];
  practiceMode?: boolean;
  onComplete?: () => void;
}

export function PromptPowerUps({
  title,
  powerUps,
  practiceMode = true,
  onComplete,
}: PromptPowerUpsProps) {
  const [currentPowerUp, setCurrentPowerUp] = useState(0);
  const [practicePrompt, setPracticePrompt] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [completedPowerUps, setCompletedPowerUps] = useState<number[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  const powerUp = powerUps[currentPowerUp];
  const [before, after] = powerUp.example.split(' → ');

  const handleTryIt = () => {
    setIsPracticing(true);
    setShowExample(false);
    setPracticePrompt('');
  };

  const handleShowExample = () => {
    setShowExample(true);
  };

  const handleComplete = () => {
    if (!completedPowerUps.includes(currentPowerUp)) {
      setCompletedPowerUps([...completedPowerUps, currentPowerUp]);
    }
    setIsPracticing(false);
    setShowExample(false);
    setPracticePrompt('');
  };

  const handleNext = () => {
    if (currentPowerUp < powerUps.length - 1) {
      setCurrentPowerUp(currentPowerUp + 1);
      setIsPracticing(false);
      setShowExample(false);
      setPracticePrompt('');
    }
  };

  const handlePrevious = () => {
    if (currentPowerUp > 0) {
      setCurrentPowerUp(currentPowerUp - 1);
      setIsPracticing(false);
      setShowExample(false);
      setPracticePrompt('');
    }
  };

  const allComplete = completedPowerUps.length === powerUps.length;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-3xl mb-2">✨</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
          <Text className="text-slate-500 text-center mt-1">
            Learn the secrets to amazing AI results!
          </Text>
        </View>

        {/* Progress */}
        <View className="flex-row justify-center mb-6 gap-2">
          {powerUps.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setCurrentPowerUp(index);
                setIsPracticing(false);
                setShowExample(false);
              }}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                completedPowerUps.includes(index)
                  ? 'bg-green-500'
                  : index === currentPowerUp
                  ? 'bg-indigo-500'
                  : 'bg-slate-200'
              }`}
            >
              <Text className={`font-bold ${
                completedPowerUps.includes(index) || index === currentPowerUp
                  ? 'text-white'
                  : 'text-slate-500'
              }`}>
                {completedPowerUps.includes(index) ? '✓' : index + 1}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Power-Up Card */}
        <View className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">⚡</Text>
            <Text className="text-white text-xl font-bold">
              Power-Up #{currentPowerUp + 1}: {powerUp.name}
            </Text>
          </View>
        </View>

        {/* Example Section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <Text className="font-semibold text-slate-700 mb-3">See the difference:</Text>

          {/* Before */}
          <View className="bg-red-50 rounded-xl p-4 mb-3">
            <View className="flex-row items-center mb-2">
              <Text className="text-red-500 mr-2">❌</Text>
              <Text className="text-red-700 font-medium">Basic prompt:</Text>
            </View>
            <Text className="text-red-800 italic">"{before}"</Text>
          </View>

          {/* Arrow */}
          <View className="items-center my-2">
            <Text className="text-2xl">⬇️</Text>
            <Text className="text-indigo-600 font-bold text-sm">Use {powerUp.name}!</Text>
          </View>

          {/* After */}
          <View className="bg-green-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-green-500 mr-2">✅</Text>
              <Text className="text-green-700 font-medium">Power-Up prompt:</Text>
            </View>
            <Text className="text-green-800 italic">"{after}"</Text>
          </View>
        </View>

        {/* Practice Mode */}
        {practiceMode && (
          <View className="bg-indigo-50 rounded-2xl p-4 mb-4">
            {!isPracticing ? (
              <View>
                <Text className="font-semibold text-indigo-800 mb-2">Ready to try?</Text>
                <Text className="text-indigo-600 mb-3">
                  Practice using "{powerUp.name}" in your own prompt!
                </Text>
                <Button title="Let's Practice! 🚀" onPress={handleTryIt} />
              </View>
            ) : (
              <View>
                <Text className="font-semibold text-indigo-800 mb-2">Your turn!</Text>
                <Text className="text-indigo-600 mb-3">
                  Start with a basic prompt, then make it better using "{powerUp.name}":
                </Text>

                <TextInput
                  className="border-2 border-indigo-300 rounded-xl p-4 bg-white mb-3 min-h-[80px]"
                  placeholder={`Try using ${powerUp.name.toLowerCase()}...`}
                  value={practicePrompt}
                  onChangeText={setPracticePrompt}
                  multiline
                  textAlignVertical="top"
                />

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={handleShowExample}
                    className="flex-1 bg-white py-3 rounded-xl items-center border-2 border-indigo-300"
                  >
                    <Text className="text-indigo-600 font-medium">💡 Hint</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleComplete}
                    className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                    disabled={!practicePrompt.trim()}
                  >
                    <Text className="text-white font-bold">✅ Done</Text>
                  </Pressable>
                </View>

                {showExample && (
                  <View className="bg-amber-100 rounded-xl p-3 mt-3">
                    <Text className="text-amber-800 text-sm">
                      💡 Example: "{after}"
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Navigation */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={handlePrevious}
            disabled={currentPowerUp === 0}
            className={`flex-1 py-3 rounded-xl items-center ${
              currentPowerUp === 0 ? 'bg-slate-100' : 'bg-slate-200'
            }`}
          >
            <Text className={`font-medium ${
              currentPowerUp === 0 ? 'text-slate-400' : 'text-slate-700'
            }`}>
              ← Previous
            </Text>
          </Pressable>

          {currentPowerUp < powerUps.length - 1 ? (
            <Pressable
              onPress={handleNext}
              className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Next →</Text>
            </Pressable>
          ) : (
            onComplete && (
              <Pressable
                onPress={onComplete}
                className={`flex-1 py-3 rounded-xl items-center ${
                  allComplete ? 'bg-green-500' : 'bg-indigo-500'
                }`}
              >
                <Text className="text-white font-bold">
                  {allComplete ? 'All Done! 🎉' : 'Finish'}
                </Text>
              </Pressable>
            )
          )}
        </View>

        {/* Completion Status */}
        {completedPowerUps.length > 0 && (
          <View className="mt-4 bg-green-50 rounded-xl p-3">
            <Text className="text-green-700 text-center">
              ✅ {completedPowerUps.length}/{powerUps.length} Power-Ups mastered!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
