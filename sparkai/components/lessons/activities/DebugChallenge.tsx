import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface Challenge {
  broken: string;
  skill: string;
}

interface DebugChallengeProps {
  title: string;
  challenges: Challenge[];
  showsFixProcess?: boolean;
  onComplete?: () => void;
}

interface BugScenario {
  title: string;
  brokenCode: string;
  brokenBehavior: string;
  hint: string;
  fixedCode: string;
  explanation: string;
}

export function DebugChallenge({
  title,
  challenges,
  showsFixProcess = true,
  onComplete,
}: DebugChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [step, setStep] = useState<'problem' | 'describe' | 'fixing' | 'fixed' | 'complete'>('problem');
  const [description, setDescription] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([]);

  const bugScenarios: BugScenario[] = [
    {
      title: 'Button Does Nothing',
      brokenCode: `<button onclick="sayHello">
  Click Me!
</button>

function sayHello() {
  alert("Hello!");
}`,
      brokenBehavior: 'When I click the button, nothing happens. I expected it to show "Hello!"',
      hint: 'Look closely at the onclick - is the function being called correctly?',
      fixedCode: `<button onclick="sayHello()">
  Click Me!
</button>

function sayHello() {
  alert("Hello!");
}`,
      explanation: 'The function needed parentheses () to actually be called! "sayHello" is just a reference, but "sayHello()" actually runs the function.',
    },
    {
      title: 'Colors Are Wrong',
      brokenCode: `.button {
  background-color: #FF0000;
  color: #FF0000;
}`,
      brokenBehavior: "The button text is invisible! I want a red button with white text, but I can't see the text at all.",
      hint: 'Both the background AND the text are the same color...',
      fixedCode: `.button {
  background-color: #FF0000;
  color: #FFFFFF;
}`,
      explanation: 'The text color was set to the same red as the background (#FF0000), making it invisible. Changed it to white (#FFFFFF) so it shows up!',
    },
    {
      title: 'Game Too Fast',
      brokenCode: `function gameLoop() {
  moveEnemy();
  checkCollision();
  updateScore();

  setTimeout(gameLoop, 10);
}`,
      brokenBehavior: "The game is running way too fast! Enemies zoom across the screen in a blur. I want it to be playable.",
      hint: 'setTimeout takes a delay in milliseconds. 10ms = 0.01 seconds. Is that enough time?',
      fixedCode: `function gameLoop() {
  moveEnemy();
  checkCollision();
  updateScore();

  setTimeout(gameLoop, 100);
}`,
      explanation: 'The game was updating every 10 milliseconds (100 times per second)! Changed it to 100ms (10 times per second) for a more playable speed.',
    },
  ];

  const scenario = bugScenarios[currentChallenge];
  const challenge = challenges[currentChallenge];

  const handleDescribe = async () => {
    if (!description.trim()) return;

    setStep('fixing');
    setIsFixing(true);

    // Simulate AI analyzing and fixing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsFixing(false);
    setStep('fixed');
  };

  const handleNext = () => {
    if (!solvedChallenges.includes(currentChallenge)) {
      setSolvedChallenges([...solvedChallenges, currentChallenge]);
    }

    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setStep('problem');
      setDescription('');
      setShowHint(false);
    } else {
      setStep('complete');
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🔧</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        {step !== 'complete' && (
          <View className="flex-row justify-center gap-2 mb-4">
            {challenges.map((_, index) => (
              <View
                key={index}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  solvedChallenges.includes(index)
                    ? 'bg-green-500'
                    : index === currentChallenge
                    ? 'bg-indigo-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  solvedChallenges.includes(index) || index === currentChallenge
                    ? 'text-white'
                    : 'text-slate-500'
                }`}>
                  {solvedChallenges.includes(index) ? '✓' : index + 1}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Problem State */}
        {step === 'problem' && (
          <View>
            <View className="bg-red-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-sm font-medium">BUG #{currentChallenge + 1}</Text>
              <Text className="text-white text-xl font-bold mt-1">{scenario.title}</Text>
              <Text className="text-white/80 mt-1">Skill: {challenge.skill}</Text>
            </View>

            {/* Broken Code */}
            <View className="bg-slate-900 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-red-400 font-medium">Broken Code</Text>
              </View>
              <Text className="text-slate-300 font-mono text-sm">{scenario.brokenCode}</Text>
            </View>

            {/* Bug Report */}
            <View className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-2">🐛 Bug Report:</Text>
              <Text className="text-amber-700">{scenario.brokenBehavior}</Text>
            </View>

            <Button
              title="I'll Try to Fix It! 🔧"
              onPress={() => setStep('describe')}
              size="lg"
            />
          </View>
        )}

        {/* Describe State */}
        {step === 'describe' && (
          <View>
            <View className="bg-indigo-600 rounded-2xl p-4 mb-4">
              <Text className="text-white text-lg font-bold">Describe the Problem to AI</Text>
              <Text className="text-indigo-200 mt-1">
                The better you explain it, the better AI can help fix it!
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                Tell AI what's wrong and how to fix it:
              </Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[120px]"
                placeholder="The button doesn't work because..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />

              <Pressable
                onPress={() => setShowHint(true)}
                className="mt-3"
              >
                <Text className="text-amber-600 text-center">💡 Need a hint?</Text>
              </Pressable>

              {showHint && (
                <View className="bg-amber-50 rounded-xl p-3 mt-3">
                  <Text className="text-amber-800">{scenario.hint}</Text>
                </View>
              )}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('problem')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Send to AI 🤖"
                  onPress={handleDescribe}
                  disabled={!description.trim()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Fixing State */}
        {step === 'fixing' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              AI is analyzing the bug...
            </Text>
            <Text className="text-slate-500 mt-2">Finding the fix!</Text>
          </View>
        )}

        {/* Fixed State */}
        {step === 'fixed' && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-white text-xl font-bold">Bug Fixed!</Text>
            </View>

            {/* Your Description */}
            <View className="bg-indigo-50 rounded-xl p-4 mb-4">
              <Text className="font-semibold text-indigo-800 mb-1">Your Description:</Text>
              <Text className="text-indigo-700 italic">"{description}"</Text>
            </View>

            {showsFixProcess && (
              <>
                {/* Fixed Code */}
                <View className="bg-slate-900 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <Text className="text-green-400 font-medium">Fixed Code</Text>
                  </View>
                  <Text className="text-slate-300 font-mono text-sm">{scenario.fixedCode}</Text>
                </View>

                {/* Explanation */}
                <View className="bg-blue-50 rounded-xl p-4 mb-4">
                  <Text className="font-semibold text-blue-800 mb-2">🧠 What AI Did:</Text>
                  <Text className="text-blue-700">{scenario.explanation}</Text>
                </View>
              </>
            )}

            {/* Skill Badge */}
            <View className="bg-amber-100 rounded-xl p-4 mb-4 items-center">
              <Text className="text-2xl mb-1">🏅</Text>
              <Text className="text-amber-800 font-bold">Skill Unlocked:</Text>
              <Text className="text-amber-700">{challenge.skill}</Text>
            </View>

            <Button
              title={currentChallenge < challenges.length - 1 ? "Next Bug →" : "Finish! 🎉"}
              onPress={handleNext}
              size="lg"
            />
          </View>
        )}

        {/* Complete State */}
        {step === 'complete' && (
          <View className="items-center py-8">
            <Text className="text-6xl mb-4">🏆</Text>
            <Text className="text-2xl font-bold text-slate-800 mb-2">Bug Hunter Complete!</Text>
            <Text className="text-slate-600 text-center mb-6">
              You fixed {solvedChallenges.length} bugs and learned how to describe problems to AI!
            </Text>

            <View className="bg-green-50 rounded-2xl p-4 w-full mb-6">
              <Text className="font-bold text-green-800 mb-3 text-center">Skills Mastered:</Text>
              {challenges.map((c, i) => (
                <View key={i} className="flex-row items-center mb-2">
                  <Text className="text-green-500 mr-2">✅</Text>
                  <Text className="text-green-700">{c.skill}</Text>
                </View>
              ))}
            </View>

            <View className="bg-indigo-50 rounded-2xl p-4 w-full mb-6">
              <Text className="font-bold text-indigo-800 mb-2">🧠 Key Lesson:</Text>
              <Text className="text-indigo-700">
                The better you describe a problem, the better AI can help fix it!
                Always include: what's happening, what you expected, and any error messages.
              </Text>
            </View>

            {onComplete && (
              <Button
                title="Done! 🎉"
                onPress={onComplete}
                size="lg"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
