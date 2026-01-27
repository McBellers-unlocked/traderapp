import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Button } from '@/components/ui/Button';

interface GameBuilderProps {
  title: string;
  gameTypes: string[];
  canCustomize?: boolean;
  canPlaytest?: boolean;
  canShare?: boolean;
  showsCode?: boolean;
  onComplete?: () => void;
  onSave?: (game: any) => void;
}

interface GameConfig {
  type: string;
  gameName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  customization: string;
}

export function GameBuilder({
  title,
  gameTypes,
  canCustomize = true,
  canPlaytest = true,
  canShare = true,
  showsCode = true,
  onComplete,
  onSave,
}: GameBuilderProps) {
  const [step, setStep] = useState<'select' | 'customize' | 'generating' | 'preview' | 'playing'>('select');
  const [config, setConfig] = useState<GameConfig>({
    type: '',
    gameName: '',
    difficulty: 'medium',
    theme: 'space',
    customization: '',
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Game state for playable demo
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState(0);

  const fallingItemY = useRef(new Animated.Value(-50)).current;
  const playerX = useRef(new Animated.Value(Dimensions.get('window').width / 2 - 25)).current;

  const gameInfo: Record<string, { emoji: string; desc: string }> = {
    'catch the falling items': { emoji: '🧺', desc: 'Catch items before they hit the ground' },
    'maze runner': { emoji: '🏃', desc: 'Navigate through a maze' },
    'quiz game': { emoji: '🧠', desc: 'Answer questions to score points' },
    'clicker game': { emoji: '👆', desc: 'Click as fast as you can' },
    'simple platformer': { emoji: '🎮', desc: 'Jump between platforms' },
  };

  const themes = [
    { id: 'space', name: 'Space', emoji: '🚀' },
    { id: 'underwater', name: 'Underwater', emoji: '🐠' },
    { id: 'candy', name: 'Candy Land', emoji: '🍬' },
    { id: 'jungle', name: 'Jungle', emoji: '🌴' },
    { id: 'robot', name: 'Robot', emoji: '🤖' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', speed: 3000 },
    { id: 'medium', name: 'Medium', speed: 2000 },
    { id: 'hard', name: 'Hard', speed: 1000 },
  ];

  const generateGame = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const code = `// ${config.gameName} - ${config.type}
// Made with AI Game Builder

const gameConfig = {
  name: "${config.gameName}",
  type: "${config.type}",
  theme: "${config.theme}",
  difficulty: "${config.difficulty}",
};

// Game Variables
let score = 0;
let gameOver = false;
let playerPosition = { x: 200, y: 400 };

// Initialize Game
function initGame() {
  score = 0;
  gameOver = false;
  console.log("🎮 Game Started: " + gameConfig.name);
  gameLoop();
}

// Main Game Loop
function gameLoop() {
  if (gameOver) return;

  updateGame();
  renderGame();

  requestAnimationFrame(gameLoop);
}

// Update Game State
function updateGame() {
  // ${config.type === 'catch the falling items' ? 'Move falling items down' :
      config.type === 'clicker game' ? 'Check click targets' :
      config.type === 'quiz game' ? 'Check answer timer' :
      'Update player position'}
}

// Render Game
function renderGame() {
  // Draw background (${config.theme} theme)
  // Draw player
  // Draw score: ${score}
}

// Handle Input
document.addEventListener('${config.type === 'clicker game' ? 'click' : 'keydown'}', (e) => {
  // Handle player input
});

// Score System
function addScore(points) {
  score += points;
  console.log("Score: " + score);
}

// Game Over
function endGame() {
  gameOver = true;
  console.log("Game Over! Final Score: " + score);
}

// Start the game!
initGame();`;

      setGeneratedCode(code);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setClickCount(0);
    setQuizQuestion(0);
    setStep('playing');

    if (config.type === 'catch the falling items') {
      animateFallingItem();
    }
  };

  const animateFallingItem = () => {
    fallingItemY.setValue(-50);
    const speed = difficulties.find(d => d.id === config.difficulty)?.speed || 2000;

    Animated.timing(fallingItemY, {
      toValue: 250,
      duration: speed,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !gameOver) {
        // Item missed
        setGameOver(true);
      }
    });
  };

  const catchItem = () => {
    setScore(s => s + 10);
    animateFallingItem();
  };

  const handleClick = () => {
    if (config.type === 'clicker game') {
      setClickCount(c => c + 1);
      setScore(s => s + 1);
    }
  };

  const quizQuestions = [
    { q: 'What color is the sky?', a: 'Blue', options: ['Red', 'Blue', 'Green'] },
    { q: 'How many legs does a dog have?', a: '4', options: ['2', '4', '6'] },
    { q: 'What do bees make?', a: 'Honey', options: ['Milk', 'Honey', 'Bread'] },
  ];

  const answerQuestion = (answer: string) => {
    if (answer === quizQuestions[quizQuestion].a) {
      setScore(s => s + 10);
    }
    if (quizQuestion < quizQuestions.length - 1) {
      setQuizQuestion(q => q + 1);
    } else {
      setGameOver(true);
    }
  };

  const renderGame = () => {
    const themeColors: Record<string, { bg: string; accent: string }> = {
      space: { bg: '#1E1B4B', accent: '#A78BFA' },
      underwater: { bg: '#164E63', accent: '#22D3EE' },
      candy: { bg: '#FDF2F8', accent: '#EC4899' },
      jungle: { bg: '#14532D', accent: '#4ADE80' },
      robot: { bg: '#374151', accent: '#60A5FA' },
    };

    const colors = themeColors[config.theme] || themeColors.space;

    if (config.type === 'catch the falling items') {
      return (
        <View className="h-72 rounded-xl overflow-hidden" style={{ backgroundColor: colors.bg }}>
          <View className="absolute top-2 right-2 bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-bold">Score: {score}</Text>
          </View>

          {/* Falling Item */}
          <Animated.View
            style={{
              position: 'absolute',
              left: '45%',
              transform: [{ translateY: fallingItemY }],
            }}
          >
            <Text className="text-3xl">
              {config.theme === 'space' ? '⭐' : config.theme === 'underwater' ? '🐠' : '🍎'}
            </Text>
          </Animated.View>

          {/* Basket */}
          <Pressable
            onPress={catchItem}
            className="absolute bottom-4 left-1/2 -ml-10 w-20 h-12 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="text-2xl">🧺</Text>
          </Pressable>

          <Text className="text-white/60 text-center text-xs absolute bottom-1 w-full">
            Tap the basket when the item is near!
          </Text>
        </View>
      );
    }

    if (config.type === 'clicker game') {
      return (
        <View className="h-72 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bg }}>
          <View className="absolute top-2 right-2 bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-bold">Clicks: {score}</Text>
          </View>

          <Pressable
            onPress={handleClick}
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="text-5xl">👆</Text>
          </Pressable>

          <Text className="text-white mt-4">Tap as fast as you can!</Text>
        </View>
      );
    }

    if (config.type === 'quiz game') {
      const q = quizQuestions[quizQuestion];
      return (
        <View className="h-72 rounded-xl p-4" style={{ backgroundColor: colors.bg }}>
          <View className="flex-row justify-between mb-4">
            <Text className="text-white font-bold">Q{quizQuestion + 1}/{quizQuestions.length}</Text>
            <Text className="text-white font-bold">Score: {score}</Text>
          </View>

          <View className="bg-white/20 rounded-xl p-4 mb-4">
            <Text className="text-white text-lg font-bold text-center">{q.q}</Text>
          </View>

          <View className="gap-2">
            {q.options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => answerQuestion(opt)}
                className="py-3 rounded-xl items-center"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="text-white font-bold">{opt}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    // Default game view
    return (
      <View className="h-72 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <Text className="text-white text-lg">🎮 Game Preview</Text>
        <Text className="text-white/60 mt-2">Coming soon!</Text>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎮</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Select Game Type */}
        {step === 'select' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of game do you want to build?
            </Text>

            <View className="gap-3">
              {gameTypes.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setConfig({ ...config, type });
                    setStep('customize');
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                >
                  <Text className="text-3xl mr-4">{gameInfo[type]?.emoji || '🎮'}</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 capitalize text-lg">{type}</Text>
                    <Text className="text-slate-500 text-sm">{gameInfo[type]?.desc}</Text>
                  </View>
                  <Text className="text-indigo-500">→</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Customize */}
        {step === 'customize' && (
          <View>
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">{gameInfo[config.type]?.emoji}</Text>
              <Text className="text-lg font-bold text-slate-800 capitalize">{config.type}</Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Game Name:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                placeholder="My Awesome Game"
                value={config.gameName}
                onChangeText={(val) => setConfig({ ...config, gameName: val })}
              />
            </View>

            {/* Theme */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Theme:</Text>
              <View className="flex-row flex-wrap gap-2">
                {themes.map((theme) => (
                  <Pressable
                    key={theme.id}
                    onPress={() => setConfig({ ...config, theme: theme.id })}
                    className={`flex-row items-center px-4 py-2 rounded-full border-2 ${
                      config.theme === theme.id
                        ? 'bg-indigo-100 border-indigo-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className="mr-1">{theme.emoji}</Text>
                    <Text className={`${config.theme === theme.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                      {theme.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Difficulty */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Difficulty:</Text>
              <View className="flex-row gap-2">
                {difficulties.map((diff) => (
                  <Pressable
                    key={diff.id}
                    onPress={() => setConfig({ ...config, difficulty: diff.id as any })}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      config.difficulty === diff.id
                        ? 'bg-indigo-500'
                        : 'bg-slate-100'
                    }`}
                  >
                    <Text className={`font-medium ${
                      config.difficulty === diff.id ? 'text-white' : 'text-slate-600'
                    }`}>
                      {diff.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('select')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Build Game! 🚀"
                  onPress={generateGame}
                  disabled={!config.gameName.trim()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Building your game...
            </Text>
            <Text className="text-slate-500 mt-2">Writing JavaScript code!</Text>
          </View>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <View>
            {/* Game Card */}
            <View className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-4 mb-4">
              <Text className="text-white text-2xl font-bold text-center">{config.gameName}</Text>
              <Text className="text-white/70 text-center capitalize">{config.type}</Text>
            </View>

            {/* Toggle */}
            <View className="flex-row bg-slate-200 rounded-xl p-1 mb-4">
              <Pressable
                onPress={() => setShowCode(false)}
                className={`flex-1 py-2 rounded-lg ${!showCode ? 'bg-white' : ''}`}
              >
                <Text className={`text-center font-medium ${!showCode ? 'text-indigo-600' : 'text-slate-500'}`}>
                  🎮 Preview
                </Text>
              </Pressable>
              {showsCode && (
                <Pressable
                  onPress={() => setShowCode(true)}
                  className={`flex-1 py-2 rounded-lg ${showCode ? 'bg-white' : ''}`}
                >
                  <Text className={`text-center font-medium ${showCode ? 'text-indigo-600' : 'text-slate-500'}`}>
                    💻 Code
                  </Text>
                </Pressable>
              )}
            </View>

            {!showCode ? (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 items-center">
                <Text className="text-6xl mb-4">{gameInfo[config.type]?.emoji}</Text>
                <Text className="text-slate-800 font-bold text-lg">{config.gameName}</Text>
                <Text className="text-slate-500 capitalize mb-4">
                  {config.theme} theme • {config.difficulty} mode
                </Text>

                {canPlaytest && (
                  <Button title="▶️ Play Now!" onPress={startGame} />
                )}
              </View>
            ) : (
              <View className="bg-slate-900 rounded-2xl p-4 mb-4">
                <ScrollView horizontal>
                  <Text className="text-green-400 font-mono text-xs">{generatedCode}</Text>
                </ScrollView>
              </View>
            )}

            {/* Success */}
            <View className="bg-green-50 rounded-xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-green-800 font-bold text-lg">Your game is ready!</Text>
              <Text className="text-green-600 text-sm text-center mt-1">
                You just built a real game with JavaScript!
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canShare && (
                <Pressable
                  onPress={() => onSave?.({ ...config, code: generatedCode })}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">🔗 Share</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setStep('customize')}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">✏️ Edit</Text>
              </Pressable>
            </View>

            {onComplete && (
              <Button title="Done! 🎉" onPress={onComplete} size="lg" className="mt-4" />
            )}
          </View>
        )}

        {/* Playing */}
        {step === 'playing' && (
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-slate-800">{config.gameName}</Text>
              <Pressable
                onPress={() => setStep('preview')}
                className="bg-slate-200 px-3 py-1 rounded-full"
              >
                <Text className="text-slate-600">✕ Close</Text>
              </Pressable>
            </View>

            {!gameOver ? (
              renderGame()
            ) : (
              <View className="h-72 rounded-xl items-center justify-center bg-slate-800">
                <Text className="text-4xl mb-4">🏆</Text>
                <Text className="text-white text-2xl font-bold">Game Over!</Text>
                <Text className="text-white/70 text-lg mt-2">Final Score: {score}</Text>
                <Pressable
                  onPress={startGame}
                  className="mt-6 bg-indigo-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold">Play Again</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
