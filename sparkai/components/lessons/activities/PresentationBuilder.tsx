import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface PresentationBuilderProps {
  title: string;
  topics: string[];
  canAddImages?: boolean;
  canGenerateScript?: boolean;
  onComplete?: () => void;
  onSave?: (presentation: any) => void;
}

interface Slide {
  title: string;
  content: string;
  notes: string;
  emoji: string;
}

interface PresentationData {
  topic: string;
  title: string;
  audience: string;
  purpose: string;
  keyPoints: string[];
  slides: Slide[];
}

export function PresentationBuilder({
  title,
  topics,
  canAddImages = true,
  canGenerateScript = true,
  onComplete,
  onSave,
}: PresentationBuilderProps) {
  const [step, setStep] = useState<'topic' | 'details' | 'keypoints' | 'generating' | 'slides' | 'practice'>('topic');
  const [presentation, setPresentation] = useState<PresentationData>({
    topic: '',
    title: '',
    audience: '',
    purpose: '',
    keyPoints: ['', '', ''],
    slides: [],
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  const topicInfo: Record<string, { emoji: string; desc: string; examples: string[] }> = {
    'school project': {
      emoji: '📚',
      desc: 'Academic presentations',
      examples: ['Science fair', 'Book report', 'History project'],
    },
    'how-to guide': {
      emoji: '📋',
      desc: 'Teach others something',
      examples: ['How to draw', 'How to code', 'How to cook'],
    },
    'persuasive': {
      emoji: '💪',
      desc: 'Convince your audience',
      examples: ['Why we need recess', 'Best pet ever', 'Save the planet'],
    },
    'show and tell': {
      emoji: '🎁',
      desc: 'Share something special',
      examples: ['My hobby', 'My collection', 'My adventure'],
    },
    'fun facts': {
      emoji: '🤯',
      desc: 'Interesting discoveries',
      examples: ['Amazing animals', 'Space facts', 'World records'],
    },
  };

  const audienceOptions = [
    { id: 'classmates', label: 'My Classmates', emoji: '👥' },
    { id: 'teachers', label: 'Teachers', emoji: '👩‍🏫' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'anyone', label: 'Anyone', emoji: '🌍' },
  ];

  const updatePresentation = (field: keyof PresentationData, value: any) => {
    setPresentation({ ...presentation, [field]: value });
  };

  const updateKeyPoint = (index: number, value: string) => {
    const newPoints = [...presentation.keyPoints];
    newPoints[index] = value;
    updatePresentation('keyPoints', newPoints);
  };

  const generateSlides = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const keyPoints = presentation.keyPoints.filter(p => p.trim());
      const emojis = ['🎯', '📌', '💡', '⭐', '🔑', '✨', '🎨', '🚀'];

      const slides: Slide[] = [
        {
          title: presentation.title,
          content: `Welcome to my presentation!\n\nToday I'll share: ${presentation.purpose}`,
          notes: `Start with energy! Make eye contact. Take a deep breath before you begin.`,
          emoji: '👋',
        },
        {
          title: 'What We\'ll Learn',
          content: keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'),
          notes: `Give a quick overview. This helps your audience know what to expect.`,
          emoji: '📋',
        },
        ...keyPoints.map((point, i) => ({
          title: point,
          content: `Here's what's important about ${point.toLowerCase()}:\n\n• Main idea goes here\n• Supporting detail\n• Example or story`,
          notes: `Explain this point clearly. Use an example to help people understand. Don't rush!`,
          emoji: emojis[i % emojis.length],
        })),
        {
          title: 'Key Takeaways',
          content: `Remember these things:\n\n${keyPoints.map((p, i) => `✅ ${p}`).join('\n')}`,
          notes: `Summarize the main points. Repeat the most important ideas.`,
          emoji: '🧠',
        },
        {
          title: 'Questions?',
          content: `Thank you for listening!\n\nAny questions? 🙋‍♂️\n\n(I'd love to hear your thoughts!)`,
          notes: `End confidently! Say "Thank you" and ask for questions. It's okay if you don't know an answer - say "Great question, I'll find out!"`,
          emoji: '❓',
        },
      ];

      updatePresentation('slides', slides);
      setStep('slides');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    if (step === 'details') {
      return presentation.title.trim() && presentation.audience && presentation.purpose.trim();
    }
    if (step === 'keypoints') {
      return presentation.keyPoints.filter(p => p.trim()).length >= 2;
    }
    return true;
  };

  const handleSave = () => {
    onSave?.(presentation);
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎤</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        {!['slides', 'generating', 'practice'].includes(step) && (
          <View className="flex-row justify-center gap-2 mb-4">
            {['topic', 'details', 'keypoints'].map((s, index) => (
              <View
                key={s}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  step === s
                    ? 'bg-purple-500'
                    : ['topic', 'details', 'keypoints'].indexOf(step) > index
                    ? 'bg-green-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  ['topic', 'details', 'keypoints'].indexOf(step) >= index ? 'text-white' : 'text-slate-500'
                }`}>
                  {['topic', 'details', 'keypoints'].indexOf(step) > index ? '✓' : index + 1}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Step 1: Topic */}
        {step === 'topic' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of presentation are you making?
            </Text>

            <View className="gap-3">
              {topics.map((topic) => {
                const info = topicInfo[topic];
                return (
                  <Pressable
                    key={topic}
                    onPress={() => {
                      updatePresentation('topic', topic);
                      setStep('details');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                  >
                    <Text className="text-3xl mr-4">{info?.emoji || '📊'}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 capitalize text-lg">{topic}</Text>
                      <Text className="text-slate-500 text-sm">{info?.desc}</Text>
                      <Text className="text-slate-400 text-xs mt-1">
                        e.g., {info?.examples.join(', ')}
                      </Text>
                    </View>
                    <Text className="text-purple-500">→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <View>
            <View className="bg-purple-500 rounded-2xl p-4 mb-4">
              <Text className="text-3xl text-center mb-1">
                {topicInfo[presentation.topic]?.emoji}
              </Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {presentation.topic}
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Presentation Title:</Text>
              <TextInput
                className="border-2 border-purple-200 rounded-xl p-3 bg-purple-50 text-lg"
                placeholder="My Amazing Presentation"
                value={presentation.title}
                onChangeText={(val) => updatePresentation('title', val)}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Who's your audience?</Text>
              <View className="flex-row flex-wrap gap-2">
                {audienceOptions.map((opt) => (
                  <Pressable
                    key={opt.id}
                    onPress={() => updatePresentation('audience', opt.id)}
                    className={`flex-row items-center px-4 py-2 rounded-full border-2 ${
                      presentation.audience === opt.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <Text className="mr-2">{opt.emoji}</Text>
                    <Text className={presentation.audience === opt.id ? 'text-purple-700' : 'text-slate-600'}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">What's the purpose?</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                placeholder="I want my audience to learn about..."
                value={presentation.purpose}
                onChangeText={(val) => updatePresentation('purpose', val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('topic')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Add Key Points →"
                  onPress={() => setStep('keypoints')}
                  disabled={!canProceed()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Key Points */}
        {step === 'keypoints' && (
          <View>
            <View className="bg-blue-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                📌 Your Key Points
              </Text>
              <Text className="text-blue-100 text-center mt-1">
                What are the main things you want to share?
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              {presentation.keyPoints.map((point, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row items-center mb-1">
                    <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-2">
                      <Text className="text-white font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-slate-600">Key Point {index + 1}:</Text>
                  </View>
                  <TextInput
                    className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                    placeholder={`Main idea ${index + 1}...`}
                    value={point}
                    onChangeText={(val) => updateKeyPoint(index, val)}
                  />
                </View>
              ))}

              <Pressable
                onPress={() => updatePresentation('keyPoints', [...presentation.keyPoints, ''])}
                className="flex-row items-center justify-center py-3 border-2 border-dashed border-blue-300 rounded-xl"
              >
                <Text className="text-blue-600 font-medium">+ Add Another Point</Text>
              </Pressable>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-1">💡 Pro Tip:</Text>
              <Text className="text-amber-700 text-sm">
                The best presentations have 3-5 main points. More than that is hard for
                people to remember!
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('details')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Create Slides! 🎨"
                  onPress={generateSlides}
                  disabled={!canProceed()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="text-xl font-bold text-purple-600 mt-6">
              Creating your slides...
            </Text>
            <Text className="text-slate-500 mt-2">Adding speaker notes & tips!</Text>
          </View>
        )}

        {/* Slides View */}
        {step === 'slides' && presentation.slides.length > 0 && (
          <View>
            {/* Slide Counter */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-600">
                Slide {currentSlide + 1} of {presentation.slides.length}
              </Text>
              <Pressable
                onPress={() => setShowNotes(!showNotes)}
                className={`px-3 py-1 rounded-full ${showNotes ? 'bg-amber-100' : 'bg-slate-100'}`}
              >
                <Text className={showNotes ? 'text-amber-700' : 'text-slate-600'}>
                  📝 Notes {showNotes ? 'ON' : 'OFF'}
                </Text>
              </Pressable>
            </View>

            {/* Current Slide */}
            <View className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <View className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <Text className="text-3xl text-center mb-2">
                  {presentation.slides[currentSlide].emoji}
                </Text>
                <Text className="text-white text-xl font-bold text-center">
                  {presentation.slides[currentSlide].title}
                </Text>
              </View>
              <View className="p-6 min-h-[200px]">
                <Text className="text-slate-700 text-lg leading-7">
                  {presentation.slides[currentSlide].content}
                </Text>
              </View>
            </View>

            {/* Speaker Notes */}
            {showNotes && canGenerateScript && (
              <View className="bg-amber-50 rounded-xl p-4 mb-4 border-2 border-amber-200">
                <Text className="font-bold text-amber-800 mb-2">📝 Speaker Notes:</Text>
                <Text className="text-amber-700">
                  {presentation.slides[currentSlide].notes}
                </Text>
              </View>
            )}

            {/* Slide Navigation */}
            <View className="flex-row gap-2 mb-4">
              {presentation.slides.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  className={`flex-1 h-2 rounded-full ${
                    index === currentSlide ? 'bg-purple-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </View>

            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className={`flex-1 py-3 rounded-xl items-center ${
                  currentSlide === 0 ? 'bg-slate-100' : 'bg-slate-200'
                }`}
              >
                <Text className={currentSlide === 0 ? 'text-slate-400' : 'text-slate-700'}>
                  ← Previous
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setCurrentSlide(Math.min(presentation.slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === presentation.slides.length - 1}
                className={`flex-1 py-3 rounded-xl items-center ${
                  currentSlide === presentation.slides.length - 1 ? 'bg-slate-100' : 'bg-purple-500'
                }`}
              >
                <Text className={currentSlide === presentation.slides.length - 1 ? 'text-slate-400' : 'text-white font-medium'}>
                  Next →
                </Text>
              </Pressable>
            </View>

            {/* Practice Mode Button */}
            <Pressable
              onPress={() => {
                setPracticeMode(true);
                setCurrentSlide(0);
                setStep('practice');
              }}
              className="bg-green-500 py-4 rounded-xl items-center mb-3"
            >
              <Text className="text-white font-bold text-lg">🎤 Practice Presenting</Text>
            </Pressable>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setStep('keypoints')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-bold">✏️ Edit</Text>
              </Pressable>
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

        {/* Practice Mode */}
        {step === 'practice' && presentation.slides.length > 0 && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                🎤 Practice Mode
              </Text>
              <Text className="text-green-100 text-center">
                Read through your presentation out loud!
              </Text>
            </View>

            {/* Big Slide View */}
            <View className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <View className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                <Text className="text-4xl text-center mb-2">
                  {presentation.slides[currentSlide].emoji}
                </Text>
                <Text className="text-white text-2xl font-bold text-center">
                  {presentation.slides[currentSlide].title}
                </Text>
              </View>
              <View className="p-8 min-h-[250px]">
                <Text className="text-slate-700 text-xl leading-8">
                  {presentation.slides[currentSlide].content}
                </Text>
              </View>
            </View>

            {/* Practice Tips */}
            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-2">💡 Remember:</Text>
              <Text className="text-amber-700">{presentation.slides[currentSlide].notes}</Text>
            </View>

            {/* Navigation */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className={`flex-1 py-4 rounded-xl items-center ${
                  currentSlide === 0 ? 'bg-slate-100' : 'bg-slate-200'
                }`}
              >
                <Text className={`text-lg ${currentSlide === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
                  ← Back
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (currentSlide === presentation.slides.length - 1) {
                    setStep('slides');
                    setPracticeMode(false);
                  } else {
                    setCurrentSlide(currentSlide + 1);
                  }
                }}
                className="flex-1 py-4 rounded-xl items-center bg-green-500"
              >
                <Text className="text-white font-bold text-lg">
                  {currentSlide === presentation.slides.length - 1 ? '🎉 Finish!' : 'Next →'}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setStep('slides');
                setPracticeMode(false);
              }}
              className="py-3"
            >
              <Text className="text-slate-600 text-center">Exit Practice Mode</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
