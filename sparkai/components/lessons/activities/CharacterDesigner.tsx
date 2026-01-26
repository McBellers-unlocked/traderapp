import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface CharacterDesignerProps {
  title: string;
  attributes: string[];
  poseOptions: string[];
  canCreateVariations?: boolean;
  canSaveToGallery?: boolean;
  onComplete?: () => void;
  onSave?: (character: any) => void;
}

interface CharacterData {
  name: string;
  appearance: string;
  personality: string;
  superpower: string;
  weakness: string;
  catchphrase: string;
}

export function CharacterDesigner({
  title,
  attributes,
  poseOptions,
  canCreateVariations = true,
  canSaveToGallery = true,
  onComplete,
  onSave,
}: CharacterDesignerProps) {
  const [step, setStep] = useState<'design' | 'generating' | 'preview'>('design');
  const [character, setCharacter] = useState<CharacterData>({
    name: '',
    appearance: '',
    personality: '',
    superpower: '',
    weakness: '',
    catchphrase: '',
  });
  const [currentAttribute, setCurrentAttribute] = useState(0);
  const [selectedPose, setSelectedPose] = useState('');
  const [characterImages, setCharacterImages] = useState<{ pose: string; url: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const attributeLabels: Record<string, { label: string; emoji: string; placeholder: string }> = {
    appearance: {
      label: 'What do they look like?',
      emoji: '👀',
      placeholder: 'Blue hair, green eyes, wears a cape...',
    },
    personality: {
      label: 'What\'s their personality?',
      emoji: '💭',
      placeholder: 'Brave, funny, a bit clumsy...',
    },
    superpower: {
      label: 'What\'s their special power?',
      emoji: '⚡',
      placeholder: 'Can fly, super strength, talks to animals...',
    },
    weakness: {
      label: 'What\'s their weakness?',
      emoji: '😰',
      placeholder: 'Scared of spiders, can\'t swim...',
    },
    catchphrase: {
      label: 'What do they always say?',
      emoji: '💬',
      placeholder: 'To infinity and beyond!',
    },
  };

  const updateCharacter = (field: keyof CharacterData, value: string) => {
    setCharacter({ ...character, [field]: value });
  };

  const generateCharacter = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      // Generate character in different poses
      const poses = canCreateVariations ? poseOptions : [poseOptions[0]];
      const images: { pose: string; url: string }[] = [];

      for (const pose of poses) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        images.push({
          pose,
          url: `https://picsum.photos/seed/${character.name}-${pose}/400/400`,
        });
      }

      setCharacterImages(images);
      setSelectedPose(poses[0]);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentAttribute = () => attributes[currentAttribute];

  const canProceed = () => {
    return character.name.trim() && attributes.every(attr => (character as any)[attr]?.trim());
  };

  const handleSave = () => {
    onSave?.({
      ...character,
      images: characterImages,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🦸</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Design Step */}
        {step === 'design' && (
          <View>
            {/* Name Input */}
            <View className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 mb-4">
              <Text className="text-white font-bold text-lg mb-2">👤 Character Name:</Text>
              <TextInput
                className="bg-white rounded-xl p-3 text-lg font-medium"
                placeholder="Enter a cool name..."
                value={character.name}
                onChangeText={(val) => updateCharacter('name', val)}
              />
            </View>

            {/* Attribute Progress */}
            <View className="flex-row justify-center gap-2 mb-4">
              {attributes.map((attr, index) => (
                <Pressable
                  key={attr}
                  onPress={() => setCurrentAttribute(index)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    (character as any)[attr]?.trim()
                      ? 'bg-green-500'
                      : index === currentAttribute
                      ? 'bg-indigo-500'
                      : 'bg-slate-200'
                  }`}
                >
                  <Text>{attributeLabels[attr]?.emoji || '❓'}</Text>
                </Pressable>
              ))}
            </View>

            {/* Current Attribute Editor */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-bold text-slate-800 mb-1">
                {attributeLabels[getCurrentAttribute()]?.emoji} {attributeLabels[getCurrentAttribute()]?.label}
              </Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[100px]"
                placeholder={attributeLabels[getCurrentAttribute()]?.placeholder}
                value={(character as any)[getCurrentAttribute()] || ''}
                onChangeText={(val) => updateCharacter(getCurrentAttribute() as keyof CharacterData, val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Navigation */}
            <View className="flex-row gap-3 mb-4">
              {currentAttribute > 0 && (
                <Pressable
                  onPress={() => setCurrentAttribute(currentAttribute - 1)}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-medium">← Previous</Text>
                </Pressable>
              )}

              {currentAttribute < attributes.length - 1 ? (
                <Pressable
                  onPress={() => setCurrentAttribute(currentAttribute + 1)}
                  className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Next →</Text>
                </Pressable>
              ) : (
                <View className="flex-1">
                  <Button
                    title="Create Character! ✨"
                    onPress={generateCharacter}
                    disabled={!canProceed()}
                    size="lg"
                  />
                </View>
              )}
            </View>

            {/* Character Preview Card */}
            {character.name && (
              <View className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-4 border-2 border-amber-300">
                <Text className="font-bold text-amber-800 mb-2">📋 Character Card Preview:</Text>
                <Text className="text-amber-900 font-bold text-lg">{character.name}</Text>
                {character.appearance && (
                  <Text className="text-amber-700 text-sm">👀 {character.appearance}</Text>
                )}
                {character.personality && (
                  <Text className="text-amber-700 text-sm">💭 {character.personality}</Text>
                )}
                {character.superpower && (
                  <Text className="text-amber-700 text-sm">⚡ {character.superpower}</Text>
                )}
                {character.weakness && (
                  <Text className="text-amber-700 text-sm">😰 {character.weakness}</Text>
                )}
                {character.catchphrase && (
                  <Text className="text-amber-700 text-sm italic">"{character.catchphrase}"</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Bringing {character.name} to life...
            </Text>
            <Text className="text-slate-500 mt-2">Creating character artwork!</Text>
          </View>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <View>
            {/* Character Card */}
            <View className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-1 mb-4 shadow-xl">
              <View className="bg-white rounded-xl overflow-hidden">
                {/* Main Image */}
                {characterImages.length > 0 && (
                  <Image
                    source={{ uri: characterImages.find(i => i.pose === selectedPose)?.url || characterImages[0].url }}
                    className="w-full h-64"
                    resizeMode="cover"
                  />
                )}

                {/* Character Info */}
                <View className="p-4">
                  <Text className="text-2xl font-bold text-slate-800 text-center">
                    {character.name}
                  </Text>

                  <View className="mt-3 gap-2">
                    <View className="flex-row items-start">
                      <Text className="mr-2">👀</Text>
                      <Text className="text-slate-600 flex-1">{character.appearance}</Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="mr-2">💭</Text>
                      <Text className="text-slate-600 flex-1">{character.personality}</Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="mr-2">⚡</Text>
                      <Text className="text-slate-600 flex-1">{character.superpower}</Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="mr-2">😰</Text>
                      <Text className="text-slate-600 flex-1">{character.weakness}</Text>
                    </View>
                  </View>

                  {character.catchphrase && (
                    <View className="mt-3 bg-amber-100 rounded-xl p-3">
                      <Text className="text-amber-800 font-medium text-center italic">
                        "{character.catchphrase}"
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Pose Variations */}
            {canCreateVariations && characterImages.length > 1 && (
              <View className="mb-4">
                <Text className="font-bold text-slate-800 mb-2">Different Poses:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {characterImages.map((img) => (
                      <Pressable
                        key={img.pose}
                        onPress={() => setSelectedPose(img.pose)}
                        className={`rounded-xl overflow-hidden border-2 ${
                          selectedPose === img.pose ? 'border-indigo-500' : 'border-slate-200'
                        }`}
                      >
                        <Image
                          source={{ uri: img.url }}
                          className="w-20 h-20"
                          resizeMode="cover"
                        />
                        <Text className="text-xs text-center py-1 bg-slate-100 capitalize">
                          {img.pose}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canSaveToGallery && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">💾 Save Character</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => {
                  setStep('design');
                  setCharacterImages([]);
                }}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">✏️ Edit</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setStep('design');
                setCharacter({
                  name: '',
                  appearance: '',
                  personality: '',
                  superpower: '',
                  weakness: '',
                  catchphrase: '',
                });
                setCharacterImages([]);
                setCurrentAttribute(0);
              }}
              className="py-2"
            >
              <Text className="text-slate-500 text-center">🦸 Create New Character</Text>
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
