import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { Button } from '@/components/ui/Button';

interface AnimationStudioProps {
  title: string;
  starterProjects: string[];
  canPreview?: boolean;
  canExportGif?: boolean;
  showsCode?: boolean;
  onComplete?: () => void;
  onSave?: (animation: any) => void;
}

interface AnimationConfig {
  type: string;
  customDescription: string;
  speed: 'slow' | 'medium' | 'fast';
  color: string;
}

export function AnimationStudio({
  title,
  starterProjects,
  canPreview = true,
  canExportGif = true,
  showsCode = true,
  onComplete,
  onSave,
}: AnimationStudioProps) {
  const [step, setStep] = useState<'select' | 'customize' | 'generating' | 'preview'>('select');
  const [config, setConfig] = useState<AnimationConfig>({
    type: '',
    customDescription: '',
    speed: 'medium',
    color: '#6366F1',
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const projectInfo: Record<string, { emoji: string; desc: string }> = {
    'bouncing ball': { emoji: '⚽', desc: 'A ball that bounces up and down' },
    'solar system': { emoji: '🪐', desc: 'Planets orbiting the sun' },
    'fish tank': { emoji: '🐠', desc: 'Fish swimming in a tank' },
    'fireworks': { emoji: '🎆', desc: 'Colorful fireworks display' },
  };

  const colors = [
    { id: '#6366F1', name: 'Purple' },
    { id: '#EF4444', name: 'Red' },
    { id: '#10B981', name: 'Green' },
    { id: '#F59E0B', name: 'Orange' },
    { id: '#3B82F6', name: 'Blue' },
    { id: '#EC4899', name: 'Pink' },
  ];

  const speeds = [
    { id: 'slow', name: 'Slow', duration: 2000 },
    { id: 'medium', name: 'Medium', duration: 1000 },
    { id: 'fast', name: 'Fast', duration: 500 },
  ];

  useEffect(() => {
    if (step === 'preview') {
      startAnimation();
    }
  }, [step, config]);

  const startAnimation = () => {
    const duration = speeds.find(s => s.id === config.speed)?.duration || 1000;

    // Bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -50,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation (for solar system)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration * 4,
        useNativeDriver: true,
      })
    ).start();

    // Scale animation (for fireworks)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const generateAnimation = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const speed = speeds.find(s => s.id === config.speed)?.duration || 1000;

      // Generate CSS animation code
      const code = `/* ${config.type.toUpperCase()} Animation */
/* Made with AI Animation Studio */

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

.animated-object {
  width: 60px;
  height: 60px;
  background: ${config.color};
  border-radius: ${config.type === 'bouncing ball' ? '50%' : '10px'};
  animation: ${config.type === 'bouncing ball' ? 'bounce' : config.type === 'solar system' ? 'rotate' : 'pulse'} ${speed}ms ease-in-out infinite;
}

/* HTML Structure */
<div class="animation-container">
  <div class="animated-object"></div>
</div>

/* Speed: ${config.speed} (${speed}ms) */
/* Color: ${config.color} */`;

      setGeneratedCode(code);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderAnimation = () => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    switch (config.type) {
      case 'bouncing ball':
        return (
          <View className="items-center justify-center h-48">
            <Animated.View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: config.color,
                transform: [{ translateY: bounceAnim }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            />
            <View className="absolute bottom-4 w-16 h-2 bg-slate-300 rounded-full opacity-50" />
          </View>
        );

      case 'solar system':
        return (
          <View className="items-center justify-center h-48">
            {/* Sun */}
            <View
              className="absolute w-12 h-12 rounded-full"
              style={{ backgroundColor: '#FCD34D' }}
            />
            {/* Planet orbit */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                transform: [{ rotate: spin }],
              }}
            >
              <View
                className="absolute w-6 h-6 rounded-full"
                style={{
                  backgroundColor: config.color,
                  top: 0,
                  left: '50%',
                  marginLeft: -12,
                }}
              />
            </Animated.View>
          </View>
        );

      case 'fish tank':
        return (
          <View className="h-48 bg-blue-200 rounded-xl overflow-hidden items-center justify-center">
            <Animated.Text
              className="text-4xl"
              style={{ transform: [{ translateX: bounceAnim }] }}
            >
              🐠
            </Animated.Text>
            <View className="absolute bottom-0 left-0 right-0 h-6 bg-amber-200" />
            <Text className="absolute bottom-2 text-xl">🌿</Text>
          </View>
        );

      case 'fireworks':
        return (
          <View className="h-48 bg-slate-900 rounded-xl items-center justify-center">
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text className="text-5xl">✨</Text>
            </Animated.View>
            <Animated.View
              className="absolute"
              style={{
                top: 40,
                left: 60,
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim.interpolate({
                  inputRange: [0.5, 1, 1.5],
                  outputRange: [0, 1, 0],
                }),
              }}
            >
              <Text className="text-3xl">🎆</Text>
            </Animated.View>
          </View>
        );

      default:
        return (
          <View className="h-48 items-center justify-center">
            <Animated.View
              style={{
                width: 50,
                height: 50,
                backgroundColor: config.color,
                borderRadius: 8,
                transform: [{ translateY: bounceAnim }],
              }}
            />
          </View>
        );
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎬</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Select Project */}
        {step === 'select' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What animation do you want to create?
            </Text>

            <View className="gap-3 mb-4">
              {starterProjects.map((project) => (
                <Pressable
                  key={project}
                  onPress={() => {
                    setConfig({ ...config, type: project });
                    setStep('customize');
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                >
                  <Text className="text-3xl mr-4">{projectInfo[project]?.emoji || '🎨'}</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 capitalize text-lg">{project}</Text>
                    <Text className="text-slate-500 text-sm">{projectInfo[project]?.desc}</Text>
                  </View>
                  <Text className="text-indigo-500">→</Text>
                </Pressable>
              ))}
            </View>

            <View className="bg-amber-50 rounded-xl p-4">
              <Text className="text-amber-800 text-sm">
                💡 Start with a template, then customize it to make it your own!
              </Text>
            </View>
          </View>
        )}

        {/* Step 2: Customize */}
        {step === 'customize' && (
          <View>
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">{projectInfo[config.type]?.emoji}</Text>
              <Text className="text-lg font-bold text-slate-800 capitalize">{config.type}</Text>
            </View>

            {/* Speed */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Animation Speed:</Text>
              <View className="flex-row gap-2">
                {speeds.map((speed) => (
                  <Pressable
                    key={speed.id}
                    onPress={() => setConfig({ ...config, speed: speed.id as any })}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      config.speed === speed.id
                        ? 'bg-indigo-500'
                        : 'bg-slate-100'
                    }`}
                  >
                    <Text className={`font-medium ${
                      config.speed === speed.id ? 'text-white' : 'text-slate-600'
                    }`}>
                      {speed.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Color */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Main Color:</Text>
              <View className="flex-row flex-wrap gap-3">
                {colors.map((color) => (
                  <Pressable
                    key={color.id}
                    onPress={() => setConfig({ ...config, color: color.id })}
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      config.color === color.id ? 'border-4 border-slate-800' : ''
                    }`}
                    style={{ backgroundColor: color.id }}
                  >
                    {config.color === color.id && (
                      <Text className="text-white font-bold">✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Custom Description */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Add Details (optional):</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="Make it extra bouncy..."
                value={config.customDescription}
                onChangeText={(val) => setConfig({ ...config, customDescription: val })}
              />
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
                  title="Create Animation! ✨"
                  onPress={generateAnimation}
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
              Creating your animation...
            </Text>
            <Text className="text-slate-500 mt-2">Writing CSS animation code!</Text>
          </View>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <View>
            {/* Toggle */}
            <View className="flex-row bg-slate-200 rounded-xl p-1 mb-4">
              <Pressable
                onPress={() => setShowCode(false)}
                className={`flex-1 py-2 rounded-lg ${!showCode ? 'bg-white' : ''}`}
              >
                <Text className={`text-center font-medium ${!showCode ? 'text-indigo-600' : 'text-slate-500'}`}>
                  ▶️ Animation
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

            {/* Animation Preview */}
            {!showCode ? (
              <View className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
                <View className="bg-slate-100 p-2 flex-row items-center">
                  <Text className="text-slate-600 font-medium flex-1 text-center capitalize">
                    {config.type} Animation
                  </Text>
                </View>
                {renderAnimation()}
              </View>
            ) : (
              <View className="bg-slate-900 rounded-2xl p-4 mb-4">
                <ScrollView horizontal>
                  <Text className="text-green-400 font-mono text-xs">
                    {generatedCode}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* Success */}
            <View className="bg-green-50 rounded-xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-green-800 font-bold text-lg">Your animation is alive!</Text>
              <Text className="text-green-600 text-sm text-center mt-1">
                You created real CSS animation code!
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canExportGif && (
                <Pressable
                  onPress={() => onSave?.({ ...config, code: generatedCode })}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">📥 Export GIF</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setStep('customize')}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">✏️ Edit</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setStep('select');
                setConfig({
                  type: '',
                  customDescription: '',
                  speed: 'medium',
                  color: '#6366F1',
                });
              }}
              className="py-3"
            >
              <Text className="text-slate-500 text-center">🎬 Create New Animation</Text>
            </Pressable>

            {onComplete && (
              <Button
                title="Done! 🎉"
                onPress={onComplete}
                size="lg"
                className="mt-4"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
