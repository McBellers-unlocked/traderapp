import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';

interface AIArtCreatorProps {
  title: string;
  starterPrompts: string[];
  canSave?: boolean;
  canShare?: boolean;
  onComplete?: () => void;
  onSave?: (imageUrl: string, prompt: string) => void;
}

export function AIArtCreator({
  title,
  starterPrompts,
  canSave = true,
  canShare = true,
  onComplete,
  onSave,
}: AIArtCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<{ url: string; prompt: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // TODO: Replace with actual AI image generation API call
      // For now, use a placeholder that shows the concept
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Placeholder image - in production, this would be the AI-generated image
      const placeholderImage = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/400`;
      setGeneratedImage(placeholderImage);
    } catch (err) {
      setError('Oops! Something went wrong. Try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStarterPrompt = (starterPrompt: string) => {
    setPrompt(starterPrompt);
  };

  const handleSave = () => {
    if (generatedImage && prompt) {
      setSavedImages([...savedImages, { url: generatedImage, prompt }]);
      onSave?.(generatedImage, prompt);
    }
  };

  const handleNewArt = () => {
    setGeneratedImage(null);
    setPrompt('');
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-2xl mb-2">🎨</Text>
          <Text className="text-xl font-bold text-slate-800 text-center">{title}</Text>
          <Text className="text-slate-500 text-center mt-1">
            Type what you want to see!
          </Text>
        </View>

        {/* Prompt Input */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <Text className="font-semibold text-slate-700 mb-2">Your idea:</Text>
          <TextInput
            className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 text-base min-h-[80px]"
            placeholder="A dragon eating pizza in space..."
            value={prompt}
            onChangeText={setPrompt}
            multiline
            textAlignVertical="top"
          />

          <Button
            title={isGenerating ? "Creating..." : "Create Art! ✨"}
            onPress={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            loading={isGenerating}
            size="lg"
            className="mt-3"
          />
        </View>

        {/* Starter Prompts */}
        {!generatedImage && (
          <View className="mb-4">
            <Text className="font-semibold text-slate-700 mb-2">Or try one of these:</Text>
            <View className="flex-row flex-wrap gap-2">
              {starterPrompts.map((starterPrompt, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleStarterPrompt(starterPrompt)}
                  className="bg-indigo-100 px-3 py-2 rounded-full"
                >
                  <Text className="text-indigo-700 text-sm">{starterPrompt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Loading State */}
        {isGenerating && (
          <View className="bg-indigo-50 rounded-2xl p-8 items-center mb-4">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-indigo-600 font-medium mt-4">
              AI is creating your art...
            </Text>
            <Text className="text-indigo-400 text-sm mt-1">
              This is so exciting! 🎉
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="bg-red-50 rounded-xl p-4 mb-4">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}

        {/* Generated Image */}
        {generatedImage && !isGenerating && (
          <View className="mb-4">
            <View className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <Image
                source={{ uri: generatedImage }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-slate-600 text-sm italic">"{prompt}"</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-4">
              {canSave && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">💾 Save to Gallery</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleNewArt}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">🎨 New Art</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Saved Gallery */}
        {savedImages.length > 0 && (
          <View className="mt-4">
            <Text className="font-bold text-slate-800 mb-3">Your Gallery ({savedImages.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {savedImages.map((img, index) => (
                  <View key={index} className="w-24">
                    <Image
                      source={{ uri: img.url }}
                      className="w-24 h-24 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Complete Button */}
        {savedImages.length > 0 && onComplete && (
          <View className="mt-6">
            <Button
              title="Done Creating! 🎉"
              onPress={onComplete}
              size="lg"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
