import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface PosterDesignerProps {
  title: string;
  templates: string[];
  canAddText?: boolean;
  canChooseFonts?: boolean;
  canDownload?: boolean;
  canPrint?: boolean;
  onComplete?: () => void;
  onSave?: (poster: any) => void;
}

interface PosterData {
  template: string;
  headline: string;
  subtext: string;
  details: string;
  colorScheme: string;
  imagePrompt: string;
}

export function PosterDesigner({
  title,
  templates,
  canAddText = true,
  canChooseFonts = true,
  canDownload = true,
  canPrint = true,
  onComplete,
  onSave,
}: PosterDesignerProps) {
  const [step, setStep] = useState<'template' | 'content' | 'style' | 'generating' | 'preview'>('template');
  const [poster, setPoster] = useState<PosterData>({
    template: '',
    headline: '',
    subtext: '',
    details: '',
    colorScheme: 'vibrant',
    imagePrompt: '',
  });
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const templateInfo: Record<string, { emoji: string; example: string; fields: string[] }> = {
    party: {
      emoji: '🎉',
      example: 'Birthday party, celebration',
      fields: ['headline', 'subtext', 'details'],
    },
    event: {
      emoji: '📅',
      example: 'School fair, sports day',
      fields: ['headline', 'subtext', 'details'],
    },
    motivational: {
      emoji: '💪',
      example: 'Inspiring quote poster',
      fields: ['headline', 'subtext'],
    },
    'movie poster': {
      emoji: '🎬',
      example: 'For your own movie!',
      fields: ['headline', 'subtext', 'details'],
    },
    'wanted poster': {
      emoji: '🤠',
      example: 'Fun wanted poster',
      fields: ['headline', 'subtext', 'details'],
    },
  };

  const colorSchemes = [
    { id: 'vibrant', name: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
    { id: 'cool', name: 'Cool Blues', colors: ['#667EEA', '#764BA2', '#6B8DD6'] },
    { id: 'warm', name: 'Warm Sunset', colors: ['#F093FB', '#F5576C', '#F9A825'] },
    { id: 'nature', name: 'Nature', colors: ['#11998E', '#38EF7D', '#2E7D32'] },
    { id: 'neon', name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] },
  ];

  const updatePoster = (field: keyof PosterData, value: string) => {
    setPoster({ ...poster, [field]: value });
  };

  const generatePoster = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Placeholder poster generation
      const imageUrl = `https://picsum.photos/seed/${poster.template}-${poster.headline.slice(0, 10)}/600/800`;
      setPosterImage(imageUrl);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedFromContent = () => {
    return poster.headline.trim().length > 0;
  };

  const handleSave = () => {
    onSave?.({
      ...poster,
      imageUrl: posterImage,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🪧</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of poster do you want to make?
            </Text>

            <View className="gap-3">
              {templates.map((template) => (
                <Pressable
                  key={template}
                  onPress={() => {
                    updatePoster('template', template);
                    setStep('content');
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                >
                  <Text className="text-3xl mr-4">{templateInfo[template]?.emoji || '📄'}</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 capitalize text-lg">{template}</Text>
                    <Text className="text-slate-500 text-sm">{templateInfo[template]?.example}</Text>
                  </View>
                  <Text className="text-indigo-500">→</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Content */}
        {step === 'content' && (
          <View>
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">{templateInfo[poster.template]?.emoji}</Text>
              <Text className="text-lg font-bold text-slate-800 capitalize">{poster.template} Poster</Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Main Headline:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 text-lg font-bold"
                placeholder="Your big headline..."
                value={poster.headline}
                onChangeText={(val) => updatePoster('headline', val)}
              />
            </View>

            {canAddText && (
              <>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <Text className="font-semibold text-slate-700 mb-2">Subtext:</Text>
                  <TextInput
                    className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                    placeholder="Additional info or tagline..."
                    value={poster.subtext}
                    onChangeText={(val) => updatePoster('subtext', val)}
                  />
                </View>

                {templateInfo[poster.template]?.fields.includes('details') && (
                  <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <Text className="font-semibold text-slate-700 mb-2">Details:</Text>
                    <TextInput
                      className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                      placeholder="Date, time, location, etc..."
                      value={poster.details}
                      onChangeText={(val) => updatePoster('details', val)}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </>
            )}

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Background Image Idea:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="Describe what you want in the background..."
                value={poster.imagePrompt}
                onChangeText={(val) => updatePoster('imagePrompt', val)}
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('template')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <Pressable
                onPress={() => setStep('style')}
                disabled={!canProceedFromContent()}
                className={`flex-1 py-3 rounded-xl items-center ${
                  canProceedFromContent() ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
              >
                <Text className={`font-bold ${canProceedFromContent() ? 'text-white' : 'text-slate-400'}`}>
                  Next: Colors →
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Step 3: Style */}
        {step === 'style' && (
          <View>
            <Text className="text-lg font-bold text-slate-800 mb-4">Choose Your Colors:</Text>

            <View className="gap-3 mb-6">
              {colorSchemes.map((scheme) => (
                <Pressable
                  key={scheme.id}
                  onPress={() => updatePoster('colorScheme', scheme.id)}
                  className={`rounded-2xl p-4 border-2 ${
                    poster.colorScheme === scheme.id
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="flex-row gap-1 mr-3">
                      {scheme.colors.map((color, i) => (
                        <View
                          key={i}
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </View>
                    <Text className={`font-medium flex-1 ${
                      poster.colorScheme === scheme.id ? 'text-indigo-700' : 'text-slate-700'
                    }`}>
                      {scheme.name}
                    </Text>
                    {poster.colorScheme === scheme.id && (
                      <Text className="text-indigo-500">✓</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('content')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Create Poster! ✨"
                  onPress={generatePoster}
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
              Designing your poster...
            </Text>
            <Text className="text-slate-500 mt-2">Making it look amazing!</Text>
          </View>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <View>
            {/* Poster Preview */}
            <View className="items-center mb-4">
              <View
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ width: 280, height: 380 }}
              >
                {/* Background */}
                {posterImage && (
                  <Image
                    source={{ uri: posterImage }}
                    className="absolute inset-0 w-full h-full"
                    resizeMode="cover"
                  />
                )}

                {/* Overlay with text */}
                <View className="absolute inset-0 bg-black/40 p-6 justify-between">
                  {/* Top section */}
                  <View>
                    <Text className="text-white text-3xl font-black text-center mb-2">
                      {poster.headline}
                    </Text>
                    {poster.subtext && (
                      <Text className="text-white/90 text-lg text-center">
                        {poster.subtext}
                      </Text>
                    )}
                  </View>

                  {/* Bottom section */}
                  {poster.details && (
                    <View className="bg-white/20 rounded-xl p-3">
                      <Text className="text-white text-sm text-center">
                        {poster.details}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Success Message */}
            <View className="bg-green-50 rounded-xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-green-800 font-bold text-lg">Your poster is ready!</Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canDownload && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">📥 Download</Text>
                </Pressable>
              )}
              {canPrint && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">🖨️ Print</Text>
                </Pressable>
              )}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('content')}
                className="flex-1 bg-indigo-100 py-3 rounded-xl items-center"
              >
                <Text className="text-indigo-600 font-medium">✏️ Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setStep('template');
                  setPoster({
                    template: '',
                    headline: '',
                    subtext: '',
                    details: '',
                    colorScheme: 'vibrant',
                    imagePrompt: '',
                  });
                  setPosterImage(null);
                }}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">🆕 New Poster</Text>
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
        )}
      </View>
    </ScrollView>
  );
}
