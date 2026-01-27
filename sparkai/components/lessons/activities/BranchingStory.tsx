import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface StoryNode {
  id: string;
  text: string;
  choices?: { text: string; nextId: string }[];
  isEnding?: boolean;
}

interface BranchingStoryProps {
  title: string;
  minBranches: number;
  canPlaythrough?: boolean;
  canShareLink?: boolean;
  onComplete?: () => void;
  onSave?: (story: StoryNode[]) => void;
}

export function BranchingStory({
  title,
  minBranches,
  canPlaythrough = true,
  canShareLink = true,
  onComplete,
  onSave,
}: BranchingStoryProps) {
  const [step, setStep] = useState<'setup' | 'building' | 'generating' | 'preview' | 'playing'>('setup');
  const [storyTitle, setStoryTitle] = useState('');
  const [mainCharacter, setMainCharacter] = useState('');
  const [startingScenario, setStartingScenario] = useState('');
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [choiceInputs, setChoiceInputs] = useState<{ [key: string]: string }>({});

  const generateInitialStory = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate initial branching story structure
      const generatedNodes: StoryNode[] = [
        {
          id: 'start',
          text: `${mainCharacter} found themselves in an unexpected situation: ${startingScenario}\n\nWhat should ${mainCharacter} do?`,
          choices: [
            { text: 'Investigate cautiously', nextId: 'path_a' },
            { text: 'Call for help', nextId: 'path_b' },
          ],
        },
        {
          id: 'path_a',
          text: `${mainCharacter} decided to investigate cautiously. Moving slowly, they discovered something surprising - a hidden passage! The passage seemed to lead somewhere interesting, but it was dark inside.`,
          choices: [
            { text: 'Enter the passage', nextId: 'path_a1' },
            { text: 'Look for a light source first', nextId: 'path_a2' },
          ],
        },
        {
          id: 'path_b',
          text: `${mainCharacter} called out for help. To their surprise, a friendly figure appeared! "Don't worry," they said with a smile. "I've been waiting for someone brave enough to come here."`,
          choices: [
            { text: 'Ask who they are', nextId: 'path_b1' },
            { text: 'Follow them quietly', nextId: 'path_b2' },
          ],
        },
        {
          id: 'path_a1',
          text: `Taking a deep breath, ${mainCharacter} entered the dark passage. After a few steps, the walls began to glow with a magical light! At the end of the passage was a treasure chest!\n\n✨ THE END - You found the hidden treasure! ✨`,
          isEnding: true,
        },
        {
          id: 'path_a2',
          text: `${mainCharacter} found a glowing crystal nearby and used it to light the way. With the light, they could see ancient writings on the walls - a secret message that would change everything!\n\n📜 THE END - You discovered the ancient secret! 📜`,
          isEnding: true,
        },
        {
          id: 'path_b1',
          text: `"I am the Guardian of this place," the figure explained. "Only those with a pure heart can see me. You have passed the test!" They handed ${mainCharacter} a golden key.\n\n🗝️ THE END - You earned the Guardian's trust! 🗝️`,
          isEnding: true,
        },
        {
          id: 'path_b2',
          text: `${mainCharacter} followed the mysterious figure through winding paths. They arrived at a beautiful hidden garden where magical creatures played! "This is your reward for being brave," the figure said.\n\n🌸 THE END - You found the secret garden! 🌸`,
          isEnding: true,
        },
      ];

      setNodes(generatedNodes);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentNode = () => nodes.find(n => n.id === currentNodeId);

  const handleChoice = (nextId: string) => {
    setCurrentNodeId(nextId);
  };

  const restartStory = () => {
    setCurrentNodeId('start');
  };

  const countBranches = () => {
    return nodes.filter(n => n.isEnding).length;
  };

  const countChoicePoints = () => {
    return nodes.filter(n => n.choices && n.choices.length > 0).length;
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🔀</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Setup */}
        {step === 'setup' && (
          <View>
            <Text className="text-slate-600 text-center mb-6">
              Create a story where readers make choices that change what happens!
            </Text>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Story Title:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                placeholder="The Mysterious Adventure"
                value={storyTitle}
                onChangeText={setStoryTitle}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Main Character:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                placeholder="Alex, Luna, Max..."
                value={mainCharacter}
                onChangeText={setMainCharacter}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Starting Scenario:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 min-h-[80px]"
                placeholder="They discovered a glowing door in their backyard..."
                value={startingScenario}
                onChangeText={setStartingScenario}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="bg-purple-50 rounded-xl p-4 mb-4">
              <Text className="text-purple-800 font-medium">💡 Tips for great branching stories:</Text>
              <Text className="text-purple-600 mt-2">
                • Give readers meaningful choices{'\n'}
                • Each path should be different{'\n'}
                • Create at least {minBranches} different endings
              </Text>
            </View>

            <Button
              title="Create My Story! ✨"
              onPress={generateInitialStory}
              disabled={!storyTitle.trim() || !mainCharacter.trim() || !startingScenario.trim()}
              size="lg"
            />
          </View>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Writing your adventure...
            </Text>
            <Text className="text-slate-500 mt-2">Creating multiple story paths!</Text>
          </View>
        )}

        {/* Preview/Edit Mode */}
        {step === 'preview' && (
          <View>
            {/* Story Stats */}
            <View className="bg-indigo-100 rounded-xl p-4 mb-4">
              <Text className="text-indigo-800 font-bold text-center text-lg">{storyTitle}</Text>
              <View className="flex-row justify-center gap-6 mt-2">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-indigo-600">{countChoicePoints()}</Text>
                  <Text className="text-indigo-600 text-sm">Choice Points</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-indigo-600">{countBranches()}</Text>
                  <Text className="text-indigo-600 text-sm">Endings</Text>
                </View>
              </View>
            </View>

            {/* Story Tree Visualization */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-bold text-slate-800 mb-3">Your Story Map:</Text>

              {nodes.map((node, index) => (
                <View key={node.id} className="mb-3">
                  <View className={`p-3 rounded-xl ${
                    node.isEnding ? 'bg-green-100 border-2 border-green-300' : 'bg-slate-100'
                  }`}>
                    <View className="flex-row items-center mb-1">
                      <Text className="font-bold text-slate-700">
                        {node.isEnding ? '🏁' : '📖'} {node.id === 'start' ? 'START' : node.id.replace('_', ' ').toUpperCase()}
                      </Text>
                      {node.isEnding && (
                        <View className="ml-2 bg-green-500 px-2 py-0.5 rounded-full">
                          <Text className="text-white text-xs font-bold">ENDING</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-slate-600 text-sm" numberOfLines={2}>
                      {node.text.substring(0, 80)}...
                    </Text>
                    {node.choices && (
                      <View className="flex-row gap-2 mt-2">
                        {node.choices.map((choice, i) => (
                          <View key={i} className="bg-indigo-100 px-2 py-1 rounded-full">
                            <Text className="text-indigo-700 text-xs">→ {choice.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canPlaythrough && (
                <Pressable
                  onPress={() => {
                    setCurrentNodeId('start');
                    setStep('playing');
                  }}
                  className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">▶️ Play Story</Text>
                </Pressable>
              )}
              {canShareLink && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">🔗 Share Link</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => {
                setStep('setup');
                setNodes([]);
              }}
              className="py-3"
            >
              <Text className="text-slate-500 text-center">← Start Over</Text>
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

        {/* Play Mode */}
        {step === 'playing' && (
          <View>
            {/* Story Header */}
            <View className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">{storyTitle}</Text>
              <Text className="text-white/80 text-center">Starring: {mainCharacter}</Text>
            </View>

            {/* Current Story Node */}
            {(() => {
              const node = getCurrentNode();
              if (!node) return null;

              return (
                <View>
                  <View className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-4">
                    <Text className="text-amber-900 text-lg leading-7">
                      {node.text}
                    </Text>
                  </View>

                  {/* Choices or Ending */}
                  {node.isEnding ? (
                    <View className="items-center py-4">
                      <Text className="text-4xl mb-3">🎉</Text>
                      <Text className="text-xl font-bold text-slate-800 mb-4">
                        Story Complete!
                      </Text>
                      <View className="flex-row gap-3">
                        <Pressable
                          onPress={restartStory}
                          className="bg-indigo-500 py-3 px-6 rounded-xl"
                        >
                          <Text className="text-white font-bold">🔄 Try Different Choices</Text>
                        </Pressable>
                      </View>
                      <Pressable
                        onPress={() => setStep('preview')}
                        className="mt-4"
                      >
                        <Text className="text-slate-500">← Back to Story Map</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View className="gap-3">
                      <Text className="font-semibold text-slate-700 text-center mb-2">
                        What do you choose?
                      </Text>
                      {node.choices?.map((choice, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleChoice(choice.nextId)}
                          className="bg-white border-2 border-indigo-300 p-4 rounded-xl"
                        >
                          <Text className="text-indigo-700 font-medium text-center">
                            {choice.text}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              );
            })()}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
