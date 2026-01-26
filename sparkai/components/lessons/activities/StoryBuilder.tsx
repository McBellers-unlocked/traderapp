import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface StoryBuilderProps {
  title: string;
  characterOptions: string[];
  settingOptions: string[];
  problemOptions: string[];
  canContinue?: boolean;
  canSave?: boolean;
  onComplete?: () => void;
  onSave?: (story: string) => void;
}

type StoryStep = 'character' | 'setting' | 'problem' | 'generating' | 'story' | 'continue';

export function StoryBuilder({
  title,
  characterOptions,
  settingOptions,
  problemOptions,
  canContinue = true,
  canSave = true,
  onComplete,
  onSave,
}: StoryBuilderProps) {
  const [step, setStep] = useState<StoryStep>('character');
  const [character, setCharacter] = useState('');
  const [customCharacter, setCustomCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [customSetting, setCustomSetting] = useState('');
  const [problem, setProblem] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const [story, setStory] = useState('');
  const [continuePrompt, setContinuePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStory = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      // TODO: Replace with actual AI story generation
      await new Promise(resolve => setTimeout(resolve, 2500));

      const selectedChar = character === 'custom' ? customCharacter : character;
      const selectedSetting = setting === 'custom' ? customSetting : setting;
      const selectedProblem = problem === 'custom' ? customProblem : problem;

      // Placeholder story - in production, this would be AI-generated
      const generatedStory = `Once upon a time, ${selectedChar.toLowerCase()} lived in ${selectedSetting.toLowerCase()}.

One sunny morning, something unusual happened - ${selectedProblem.toLowerCase()}!

"Oh no!" ${selectedChar.split(' ').pop()} exclaimed. "I need to figure this out!"

With courage in their heart, our hero set off on an adventure. Along the way, they met new friends who offered to help.

"Don't worry," said a wise owl. "Together, we can solve any problem!"

And so, the adventure began...

🌟 TO BE CONTINUED... 🌟

What happens next? You decide!`;

      setStory(generatedStory);
      setStep('story');
    } catch (err) {
      console.error('Story generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueStory = async () => {
    if (!continuePrompt.trim()) return;

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Placeholder continuation
      const continuation = `\n\n${continuePrompt}

The adventure continued with even more excitement! Our hero discovered that ${continuePrompt.toLowerCase().includes('friend') ? 'friendship was the real treasure all along' : 'bravery comes in many forms'}.

With each step forward, they grew stronger and wiser. The journey was far from over, but they knew they could handle whatever came next!

✨ THE ADVENTURE CONTINUES... ✨`;

      setStory(prev => prev.replace('🌟 TO BE CONTINUED... 🌟\n\nWhat happens next? You decide!', '') + continuation);
      setContinuePrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave?.(story);
  };

  const renderOptionButton = (
    option: string,
    selected: string,
    onSelect: (val: string) => void,
    index: number
  ) => (
    <Pressable
      key={index}
      onPress={() => onSelect(option)}
      className={`p-4 rounded-xl mb-2 border-2 ${
        selected === option
          ? 'bg-indigo-100 border-indigo-500'
          : 'bg-white border-slate-200'
      }`}
    >
      <Text className={`font-medium ${selected === option ? 'text-indigo-700' : 'text-slate-700'}`}>
        {option}
      </Text>
    </Pressable>
  );

  const renderStep = () => {
    switch (step) {
      case 'character':
        return (
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-2">Who's your hero? 🦸</Text>
            <Text className="text-slate-500 mb-4">Pick a character for your adventure!</Text>

            {characterOptions.map((opt, i) => renderOptionButton(opt, character, setCharacter, i))}

            <Pressable
              onPress={() => setCharacter('custom')}
              className={`p-4 rounded-xl mb-2 border-2 ${
                character === 'custom' ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`font-medium ${character === 'custom' ? 'text-indigo-700' : 'text-slate-700'}`}>
                ✏️ My own idea...
              </Text>
            </Pressable>

            {character === 'custom' && (
              <TextInput
                className="border-2 border-indigo-300 rounded-xl p-3 bg-white mt-2"
                placeholder="Describe your character..."
                value={customCharacter}
                onChangeText={setCustomCharacter}
              />
            )}

            <Button
              title="Next: Pick a Place →"
              onPress={() => setStep('setting')}
              disabled={!character || (character === 'custom' && !customCharacter.trim())}
              size="lg"
              className="mt-4"
            />
          </View>
        );

      case 'setting':
        return (
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-2">Where does it happen? 🗺️</Text>
            <Text className="text-slate-500 mb-4">Choose your adventure's world!</Text>

            {settingOptions.map((opt, i) => renderOptionButton(opt, setting, setSetting, i))}

            <Pressable
              onPress={() => setSetting('custom')}
              className={`p-4 rounded-xl mb-2 border-2 ${
                setting === 'custom' ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`font-medium ${setting === 'custom' ? 'text-indigo-700' : 'text-slate-700'}`}>
                ✏️ My own place...
              </Text>
            </Pressable>

            {setting === 'custom' && (
              <TextInput
                className="border-2 border-indigo-300 rounded-xl p-3 bg-white mt-2"
                placeholder="Describe the place..."
                value={customSetting}
                onChangeText={setCustomSetting}
              />
            )}

            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => setStep('character')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Next →"
                  onPress={() => setStep('problem')}
                  disabled={!setting || (setting === 'custom' && !customSetting.trim())}
                  size="lg"
                />
              </View>
            </View>
          </View>
        );

      case 'problem':
        return (
          <View>
            <Text className="text-xl font-bold text-slate-800 mb-2">What's the challenge? 🎯</Text>
            <Text className="text-slate-500 mb-4">Every hero needs a challenge!</Text>

            {problemOptions.map((opt, i) => renderOptionButton(opt, problem, setProblem, i))}

            <Pressable
              onPress={() => setProblem('custom')}
              className={`p-4 rounded-xl mb-2 border-2 ${
                problem === 'custom' ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`font-medium ${problem === 'custom' ? 'text-indigo-700' : 'text-slate-700'}`}>
                ✏️ My own challenge...
              </Text>
            </Pressable>

            {problem === 'custom' && (
              <TextInput
                className="border-2 border-indigo-300 rounded-xl p-3 bg-white mt-2"
                placeholder="Describe the challenge..."
                value={customProblem}
                onChangeText={setCustomProblem}
              />
            )}

            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => setStep('setting')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Create Story! ✨"
                  onPress={generateStory}
                  disabled={!problem || (problem === 'custom' && !customProblem.trim())}
                  size="lg"
                />
              </View>
            </View>
          </View>
        );

      case 'generating':
        return (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">Writing your story...</Text>
            <Text className="text-slate-500 mt-2">This is going to be good! 📖</Text>
          </View>
        );

      case 'story':
        return (
          <View>
            <View className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-4">
              <Text className="text-amber-900 text-base leading-7 font-serif">
                {story}
              </Text>
            </View>

            {canContinue && (
              <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <Text className="font-semibold text-slate-700 mb-2">What happens next?</Text>
                <TextInput
                  className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                  placeholder="The hero finds a magic key..."
                  value={continuePrompt}
                  onChangeText={setContinuePrompt}
                  multiline
                />
                <Button
                  title={isGenerating ? "Writing..." : "Continue Story →"}
                  onPress={handleContinueStory}
                  disabled={!continuePrompt.trim() || isGenerating}
                  loading={isGenerating}
                  className="mt-3"
                />
              </View>
            )}

            <View className="flex-row gap-3">
              {canSave && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">💾 Save Story</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => {
                  setStep('character');
                  setCharacter('');
                  setSetting('');
                  setProblem('');
                  setStory('');
                }}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">📖 New Story</Text>
              </Pressable>
            </View>

            {onComplete && (
              <Button
                title="Done! 🎉"
                onPress={onComplete}
                size="lg"
                className="mt-4"
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case 'character': return 1;
      case 'setting': return 2;
      case 'problem': return 3;
      default: return 3;
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Progress indicator */}
        {['character', 'setting', 'problem'].includes(step) && (
          <View className="flex-row justify-center mb-6 gap-2">
            {[1, 2, 3].map((num) => (
              <View
                key={num}
                className={`w-3 h-3 rounded-full ${
                  num <= getStepNumber() ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </View>
        )}

        {renderStep()}
      </View>
    </ScrollView>
  );
}
