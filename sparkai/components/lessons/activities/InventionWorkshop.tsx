import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface InventionWorkshopProps {
  title: string;
  steps: string[];
  canCreateBlueprint?: boolean;
  canCreateCommercial?: boolean;
  onComplete?: () => void;
  onSave?: (invention: any) => void;
}

interface InventionData {
  problem: string;
  solution: string;
  features: string[];
  name: string;
  tagline: string;
  description: string;
}

export function InventionWorkshop({
  title,
  steps,
  canCreateBlueprint = true,
  canCreateCommercial = true,
  onComplete,
  onSave,
}: InventionWorkshopProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [invention, setInvention] = useState<InventionData>({
    problem: '',
    solution: '',
    features: ['', '', ''],
    name: '',
    tagline: '',
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprintImage, setBlueprintImage] = useState<string | null>(null);
  const [commercialScript, setCommercialScript] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const stepInfo: Record<string, { label: string; emoji: string; description: string }> = {
    'identify problem': {
      label: 'What Problem Will You Solve?',
      emoji: '🤔',
      description: 'Every great invention starts with a problem. What annoys you or could be better?',
    },
    'brainstorm solutions': {
      label: 'How Could You Fix It?',
      emoji: '💡',
      description: 'Think of creative ways to solve your problem. Be as wild as you want!',
    },
    'design invention': {
      label: 'Key Features',
      emoji: '⚙️',
      description: 'What are the 3 most important things your invention does?',
    },
    'name it': {
      label: 'Name Your Invention!',
      emoji: '✨',
      description: 'Give your invention an awesome name and catchy tagline!',
    },
    'create ad': {
      label: 'Describe Your Invention',
      emoji: '📺',
      description: 'Write a description that makes people want your invention!',
    },
  };

  const updateInvention = (field: keyof InventionData, value: string | string[]) => {
    setInvention({ ...invention, [field]: value });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...invention.features];
    newFeatures[index] = value;
    updateInvention('features', newFeatures);
  };

  const generateBlueprint = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBlueprintImage(`https://picsum.photos/seed/${invention.name}-blueprint/600/400`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCommercial = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCommercialScript(`
🎬 "${invention.name}" Commercial Script

[SCENE: Someone struggling with ${invention.problem}]

NARRATOR: "Are you tired of ${invention.problem}?"

[SCENE: Product reveal with dramatic music]

NARRATOR: "Introducing... ${invention.name}!"

[SCENE: Demonstration of features]

NARRATOR: "With ${invention.name}, you can:
✨ ${invention.features[0]}
✨ ${invention.features[1]}
✨ ${invention.features[2]}"

[SCENE: Happy customer]

CUSTOMER: "I can't believe I ever lived without ${invention.name}!"

NARRATOR: "${invention.tagline}"

[SCENE: Logo and call to action]

NARRATOR: "Get YOUR ${invention.name} today!"

🎬 THE END
      `);
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    switch (step) {
      case 'identify problem':
        return invention.problem.trim().length > 10;
      case 'brainstorm solutions':
        return invention.solution.trim().length > 10;
      case 'design invention':
        return invention.features.filter(f => f.trim()).length >= 2;
      case 'name it':
        return invention.name.trim() && invention.tagline.trim();
      case 'create ad':
        return invention.description.trim().length > 20;
      default:
        return true;
    }
  };

  const handleSave = () => {
    onSave?.({
      ...invention,
      blueprintImage,
      commercialScript,
    });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const info = stepInfo[step];

    return (
      <View>
        <View className="bg-indigo-600 rounded-2xl p-4 mb-4">
          <Text className="text-3xl text-center mb-2">{info.emoji}</Text>
          <Text className="text-white text-xl font-bold text-center">{info.label}</Text>
          <Text className="text-indigo-200 text-center mt-1">{info.description}</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 shadow-sm">
          {step === 'identify problem' && (
            <View>
              <Text className="font-semibold text-slate-700 mb-2">The problem I want to solve:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[100px]"
                placeholder="I wish there was a better way to..."
                value={invention.problem}
                onChangeText={(val) => updateInvention('problem', val)}
                multiline
                textAlignVertical="top"
              />
              <View className="bg-amber-50 rounded-xl p-3 mt-3">
                <Text className="text-amber-700 text-sm">
                  💡 Tips: Think about everyday annoyances, things that take too long, or problems you've noticed at school or home!
                </Text>
              </View>
            </View>
          )}

          {step === 'brainstorm solutions' && (
            <View>
              <View className="bg-slate-100 rounded-xl p-3 mb-3">
                <Text className="text-slate-600 text-sm">Your problem:</Text>
                <Text className="text-slate-800 font-medium">{invention.problem}</Text>
              </View>
              <Text className="font-semibold text-slate-700 mb-2">My solution:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[100px]"
                placeholder="I would create a device/app/tool that..."
                value={invention.solution}
                onChangeText={(val) => updateInvention('solution', val)}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          {step === 'design invention' && (
            <View>
              <Text className="font-semibold text-slate-700 mb-3">
                My invention's top 3 features:
              </Text>
              {invention.features.map((feature, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row items-center mb-1">
                    <View className="w-6 h-6 bg-indigo-500 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-xs font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-slate-600">Feature {index + 1}:</Text>
                  </View>
                  <TextInput
                    className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                    placeholder={`It can ${index === 0 ? 'fly' : index === 1 ? 'transform' : 'glow in the dark'}...`}
                    value={feature}
                    onChangeText={(val) => updateFeature(index, val)}
                  />
                </View>
              ))}
            </View>
          )}

          {step === 'name it' && (
            <View>
              <Text className="font-semibold text-slate-700 mb-2">Invention Name:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 text-lg font-bold"
                placeholder="The Super-Amazing-Inator!"
                value={invention.name}
                onChangeText={(val) => updateInvention('name', val)}
              />

              <Text className="font-semibold text-slate-700 mb-2 mt-4">Catchy Tagline:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="It slices, it dices, it..."
                value={invention.tagline}
                onChangeText={(val) => updateInvention('tagline', val)}
              />
            </View>
          )}

          {step === 'create ad' && (
            <View>
              <Text className="font-semibold text-slate-700 mb-2">Describe {invention.name}:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[120px]"
                placeholder="Tell everyone why they need your invention..."
                value={invention.description}
                onChangeText={(val) => updateInvention('description', val)}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  // Final Preview
  if (showPreview) {
    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Invention Card */}
          <View className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-1 mb-4">
            <View className="bg-white rounded-xl p-4">
              <View className="items-center mb-4">
                <Text className="text-4xl">🎉</Text>
                <Text className="text-2xl font-black text-slate-800 mt-2">{invention.name}</Text>
                <Text className="text-lg text-indigo-600 italic">"{invention.tagline}"</Text>
              </View>

              {blueprintImage && (
                <Image
                  source={{ uri: blueprintImage }}
                  className="w-full h-48 rounded-xl mb-4"
                  resizeMode="cover"
                />
              )}

              <View className="bg-slate-100 rounded-xl p-4 mb-4">
                <Text className="font-bold text-slate-800 mb-2">The Problem:</Text>
                <Text className="text-slate-600">{invention.problem}</Text>
              </View>

              <View className="bg-green-100 rounded-xl p-4 mb-4">
                <Text className="font-bold text-green-800 mb-2">The Solution:</Text>
                <Text className="text-green-700">{invention.solution}</Text>
              </View>

              <View className="bg-indigo-100 rounded-xl p-4">
                <Text className="font-bold text-indigo-800 mb-2">Key Features:</Text>
                {invention.features.filter(f => f.trim()).map((feature, i) => (
                  <Text key={i} className="text-indigo-700">✨ {feature}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Commercial Script */}
          {commercialScript && (
            <View className="bg-slate-800 rounded-2xl p-4 mb-4">
              <Text className="text-white font-bold mb-2">📺 Your Commercial Script:</Text>
              <Text className="text-slate-300 text-sm font-mono">{commercialScript}</Text>
            </View>
          )}

          {/* Generate Buttons */}
          {!blueprintImage && canCreateBlueprint && (
            <Button
              title={isGenerating ? "Designing..." : "Generate Blueprint 📐"}
              onPress={generateBlueprint}
              loading={isGenerating}
              className="mb-3"
            />
          )}

          {!commercialScript && canCreateCommercial && blueprintImage && (
            <Button
              title={isGenerating ? "Writing..." : "Generate Commercial Script 📺"}
              onPress={generateCommercial}
              loading={isGenerating}
              className="mb-3"
            />
          )}

          {/* Actions */}
          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-green-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">💾 Save</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowPreview(false);
                setCurrentStep(0);
              }}
              className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">✏️ Edit</Text>
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
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">💡</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        <View className="flex-row justify-center gap-2 mb-4">
          {steps.map((step, index) => (
            <View
              key={step}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-indigo-500'
                  : 'bg-slate-200'
              }`}
            >
              <Text className={`text-xs font-bold ${
                index <= currentStep ? 'text-white' : 'text-slate-500'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </Text>
            </View>
          ))}
        </View>

        {/* Current Step */}
        {renderStepContent()}

        {/* Navigation */}
        <View className="flex-row gap-3 mt-4">
          {currentStep > 0 && (
            <Pressable
              onPress={() => setCurrentStep(currentStep - 1)}
              className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
            >
              <Text className="text-slate-700 font-medium">← Back</Text>
            </Pressable>
          )}

          {currentStep < steps.length - 1 ? (
            <Pressable
              onPress={() => canProceed() && setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl items-center ${
                canProceed() ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <Text className={`font-bold ${canProceed() ? 'text-white' : 'text-slate-400'}`}>
                Next →
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => canProceed() && setShowPreview(true)}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl items-center ${
                canProceed() ? 'bg-green-500' : 'bg-slate-200'
              }`}
            >
              <Text className={`font-bold ${canProceed() ? 'text-white' : 'text-slate-400'}`}>
                See My Invention! 🎉
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
