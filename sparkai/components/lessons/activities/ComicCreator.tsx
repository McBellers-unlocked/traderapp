import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface ComicCreatorProps {
  title: string;
  panels: number;
  canAddDialogue?: boolean;
  styleOptions: string[];
  canExport?: boolean;
  canShare?: boolean;
  onComplete?: () => void;
  onSave?: (comic: any) => void;
}

interface Panel {
  description: string;
  dialogue?: string;
  imageUrl?: string;
}

export function ComicCreator({
  title,
  panels: panelCount,
  canAddDialogue = true,
  styleOptions,
  canExport = true,
  canShare = true,
  onComplete,
  onSave,
}: ComicCreatorProps) {
  const [step, setStep] = useState<'style' | 'panels' | 'generating' | 'preview'>('style');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [comicTitle, setComicTitle] = useState('');
  const [panels, setPanels] = useState<Panel[]>(
    Array.from({ length: panelCount }, () => ({ description: '', dialogue: '' }))
  );
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPanels, setGeneratedPanels] = useState<Panel[]>([]);

  const updatePanel = (index: number, field: 'description' | 'dialogue', value: string) => {
    const newPanels = [...panels];
    newPanels[index] = { ...newPanels[index], [field]: value };
    setPanels(newPanels);
  };

  const canProceed = () => {
    return panels.every(p => p.description.trim().length > 0);
  };

  const generateComic = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      // Simulate AI generation for each panel
      const generated: Panel[] = [];
      for (let i = 0; i < panels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        generated.push({
          ...panels[i],
          imageUrl: `https://picsum.photos/seed/${selectedStyle}-${i}-${panels[i].description.slice(0, 10)}/300/300`,
        });
      }
      setGeneratedPanels(generated);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave?.({
      title: comicTitle,
      style: selectedStyle,
      panels: generatedPanels,
    });
  };

  const styleEmojis: Record<string, string> = {
    superhero: '🦸',
    manga: '🎌',
    cartoon: '🎨',
    'pixel art': '👾',
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">💥</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Choose Style */}
        {step === 'style' && (
          <View>
            <Text className="text-lg font-semibold text-slate-700 mb-3">
              Choose your comic style:
            </Text>

            <View className="gap-2 mb-4">
              {styleOptions.map((style) => (
                <Pressable
                  key={style}
                  onPress={() => setSelectedStyle(style)}
                  className={`p-4 rounded-xl border-2 flex-row items-center ${
                    selectedStyle === style
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className="text-2xl mr-3">{styleEmojis[style] || '🎨'}</Text>
                  <Text className={`font-medium capitalize text-lg ${
                    selectedStyle === style ? 'text-indigo-700' : 'text-slate-700'
                  }`}>
                    {style}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="bg-white rounded-xl p-4 mb-4">
              <Text className="font-medium text-slate-700 mb-2">Comic Title:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="My Awesome Comic"
                value={comicTitle}
                onChangeText={setComicTitle}
              />
            </View>

            <Button
              title="Next: Create Panels →"
              onPress={() => setStep('panels')}
              disabled={!selectedStyle || !comicTitle.trim()}
              size="lg"
            />
          </View>
        )}

        {/* Step 2: Create Panels */}
        {step === 'panels' && (
          <View>
            {/* Panel Progress */}
            <View className="flex-row justify-center gap-2 mb-4">
              {panels.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setCurrentPanel(index)}
                  className={`w-10 h-10 rounded-lg items-center justify-center ${
                    panels[index].description.trim()
                      ? 'bg-green-500'
                      : index === currentPanel
                      ? 'bg-indigo-500'
                      : 'bg-slate-200'
                  }`}
                >
                  <Text className={`font-bold ${
                    panels[index].description.trim() || index === currentPanel
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}>
                    {index + 1}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Current Panel Editor */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-indigo-100 rounded-lg items-center justify-center mr-3">
                  <Text className="text-indigo-600 font-bold">{currentPanel + 1}</Text>
                </View>
                <Text className="text-lg font-semibold text-slate-800">
                  Panel {currentPanel + 1} of {panelCount}
                </Text>
              </View>

              <Text className="font-medium text-slate-700 mb-2">What happens in this panel?</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 min-h-[80px]"
                placeholder="The hero jumps over a building..."
                value={panels[currentPanel].description}
                onChangeText={(val) => updatePanel(currentPanel, 'description', val)}
                multiline
                textAlignVertical="top"
              />

              {canAddDialogue && (
                <View className="mt-3">
                  <Text className="font-medium text-slate-700 mb-2">
                    Speech bubble (optional):
                  </Text>
                  <TextInput
                    className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                    placeholder="POW! Take that, villain!"
                    value={panels[currentPanel].dialogue}
                    onChangeText={(val) => updatePanel(currentPanel, 'dialogue', val)}
                  />
                </View>
              )}
            </View>

            {/* Navigation */}
            <View className="flex-row gap-3 mb-4">
              {currentPanel > 0 && (
                <Pressable
                  onPress={() => setCurrentPanel(currentPanel - 1)}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-medium">← Previous</Text>
                </Pressable>
              )}
              {currentPanel < panelCount - 1 ? (
                <Pressable
                  onPress={() => setCurrentPanel(currentPanel + 1)}
                  className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Next →</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={generateComic}
                  disabled={!canProceed()}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    canProceed() ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                >
                  <Text className={`font-bold ${canProceed() ? 'text-white' : 'text-slate-400'}`}>
                    Create Comic! ✨
                  </Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => setStep('style')}
              className="py-2"
            >
              <Text className="text-slate-500 text-center">← Back to style selection</Text>
            </Pressable>
          </View>
        )}

        {/* Step 3: Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Creating your comic...
            </Text>
            <Text className="text-slate-500 mt-2">
              Drawing panel {generatedPanels.length + 1} of {panelCount}
            </Text>
            <View className="flex-row gap-2 mt-4">
              {panels.map((_, i) => (
                <View
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < generatedPanels.length ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Preview */}
        {step === 'preview' && (
          <View>
            {/* Comic Title */}
            <View className="bg-yellow-400 rounded-t-2xl p-3 items-center">
              <Text className="text-2xl font-black text-slate-800 uppercase">
                {comicTitle}
              </Text>
              <Text className="text-slate-600 text-sm">Style: {selectedStyle}</Text>
            </View>

            {/* Panels Grid */}
            <View className="bg-white border-4 border-slate-800 rounded-b-2xl p-2">
              <View className="flex-row flex-wrap">
                {generatedPanels.map((panel, index) => (
                  <View key={index} className="w-1/2 p-1">
                    <View className="border-2 border-slate-800 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        source={{ uri: panel.imageUrl }}
                        className="w-full aspect-square"
                        resizeMode="cover"
                      />
                      {panel.dialogue && (
                        <View className="absolute top-2 left-2 right-2">
                          <View className="bg-white rounded-xl p-2 border-2 border-slate-800">
                            <Text className="text-slate-800 text-xs font-bold text-center">
                              {panel.dialogue}
                            </Text>
                          </View>
                        </View>
                      )}
                      <View className="absolute bottom-0 left-0 right-0 bg-slate-800/70 p-1">
                        <Text className="text-white text-xs text-center" numberOfLines={2}>
                          {panel.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mt-4">
              {canExport && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">💾 Save</Text>
                </Pressable>
              )}
              {canShare && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">📤 Share</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => {
                setStep('style');
                setPanels(Array.from({ length: panelCount }, () => ({ description: '', dialogue: '' })));
                setGeneratedPanels([]);
                setComicTitle('');
                setSelectedStyle('');
              }}
              className="mt-3 py-3"
            >
              <Text className="text-indigo-600 text-center font-medium">
                🎨 Create Another Comic
              </Text>
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
