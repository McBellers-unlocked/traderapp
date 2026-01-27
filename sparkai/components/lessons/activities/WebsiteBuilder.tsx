import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface WebsiteBuilderProps {
  title: string;
  templates: string[];
  showsCode?: boolean;
  canEditCode?: boolean;
  canPublish?: boolean;
  canShareLink?: boolean;
  onComplete?: () => void;
  onSave?: (website: any) => void;
}

interface WebsiteData {
  template: string;
  siteName: string;
  headline: string;
  description: string;
  sections: string[];
  colorTheme: string;
}

export function WebsiteBuilder({
  title,
  templates,
  showsCode = true,
  canEditCode = true,
  canPublish = true,
  canShareLink = true,
  onComplete,
  onSave,
}: WebsiteBuilderProps) {
  const [step, setStep] = useState<'template' | 'content' | 'generating' | 'preview'>('template');
  const [website, setWebsite] = useState<WebsiteData>({
    template: '',
    siteName: '',
    headline: '',
    description: '',
    sections: [],
    colorTheme: 'blue',
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);

  const templateInfo: Record<string, { emoji: string; desc: string; sections: string[] }> = {
    'about me': {
      emoji: '👤',
      desc: 'Share who you are!',
      sections: ['About', 'Hobbies', 'Contact'],
    },
    'fan page': {
      emoji: '⭐',
      desc: 'Celebrate your favorite thing!',
      sections: ['Why I Love It', 'Fun Facts', 'Gallery'],
    },
    'pet profile': {
      emoji: '🐾',
      desc: 'A page for your pet!',
      sections: ['Meet My Pet', 'Favorites', 'Photos'],
    },
    'recipe site': {
      emoji: '🍳',
      desc: 'Share your recipes!',
      sections: ['Ingredients', 'Instructions', 'Tips'],
    },
    'portfolio': {
      emoji: '📁',
      desc: 'Show off your work!',
      sections: ['My Projects', 'Skills', 'Contact'],
    },
  };

  const colorThemes = [
    { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#60A5FA' },
    { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#A78BFA' },
    { id: 'green', name: 'Forest Green', primary: '#10B981', secondary: '#34D399' },
    { id: 'pink', name: 'Sunset Pink', primary: '#EC4899', secondary: '#F472B6' },
    { id: 'orange', name: 'Bright Orange', primary: '#F59E0B', secondary: '#FBBF24' },
  ];

  const updateWebsite = (field: keyof WebsiteData, value: any) => {
    setWebsite({ ...website, [field]: value });
  };

  const generateWebsite = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const theme = colorThemes.find(t => t.id === website.colorTheme) || colorThemes[0];
      const sections = templateInfo[website.template]?.sections || [];

      // Generate HTML code
      const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.siteName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}22);
      min-height: 100vh;
    }
    .header {
      background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
      color: white;
      padding: 60px 20px;
      text-align: center;
    }
    .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .header p { font-size: 1.2rem; opacity: 0.9; }
    .section {
      max-width: 800px;
      margin: 30px auto;
      padding: 30px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .section h2 {
      color: ${theme.primary};
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    .section p { color: #555; line-height: 1.6; }
    .footer {
      text-align: center;
      padding: 30px;
      color: #666;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>${website.headline}</h1>
    <p>${website.description}</p>
  </header>

  ${sections.map(section => `
  <section class="section">
    <h2>${section}</h2>
    <p>This is where your ${section.toLowerCase()} content goes. Edit this to add your own text!</p>
  </section>`).join('')}

  <footer class="footer">
    <p>Made with ❤️ by ${website.siteName} | Built with AI</p>
  </footer>
</body>
</html>`;

      setGeneratedCode(code);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    return website.siteName.trim() && website.headline.trim() && website.description.trim();
  };

  const handleSave = () => {
    onSave?.({
      ...website,
      code: generatedCode,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🌐</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Template */}
        {step === 'template' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of website do you want to build?
            </Text>

            <View className="gap-3">
              {templates.map((template) => (
                <Pressable
                  key={template}
                  onPress={() => {
                    updateWebsite('template', template);
                    setStep('content');
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                >
                  <Text className="text-3xl mr-4">{templateInfo[template]?.emoji || '📄'}</Text>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 capitalize text-lg">{template}</Text>
                    <Text className="text-slate-500 text-sm">{templateInfo[template]?.desc}</Text>
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
              <Text className="text-2xl mr-2">{templateInfo[website.template]?.emoji}</Text>
              <Text className="text-lg font-bold text-slate-800 capitalize">{website.template}</Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Website Name:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                placeholder="My Awesome Site"
                value={website.siteName}
                onChangeText={(val) => updateWebsite('siteName', val)}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Main Headline:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="Welcome to My World!"
                value={website.headline}
                onChangeText={(val) => updateWebsite('headline', val)}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Short Description:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                placeholder="Tell visitors what your site is about..."
                value={website.description}
                onChangeText={(val) => updateWebsite('description', val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Color Theme */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Color Theme:</Text>
              <View className="flex-row flex-wrap gap-2">
                {colorThemes.map((theme) => (
                  <Pressable
                    key={theme.id}
                    onPress={() => updateWebsite('colorTheme', theme.id)}
                    className={`flex-row items-center px-3 py-2 rounded-full border-2 ${
                      website.colorTheme === theme.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <View
                      className="w-5 h-5 rounded-full mr-2"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <Text className={`text-sm ${
                      website.colorTheme === theme.id ? 'text-indigo-700' : 'text-slate-600'
                    }`}>
                      {theme.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('template')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Build Website! 🚀"
                  onPress={generateWebsite}
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
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Building your website...
            </Text>
            <Text className="text-slate-500 mt-2">Writing HTML & CSS code!</Text>
          </View>
        )}

        {/* Preview */}
        {step === 'preview' && (
          <View>
            {/* Toggle View */}
            <View className="flex-row bg-slate-200 rounded-xl p-1 mb-4">
              <Pressable
                onPress={() => setShowCodeView(false)}
                className={`flex-1 py-2 rounded-lg ${!showCodeView ? 'bg-white' : ''}`}
              >
                <Text className={`text-center font-medium ${!showCodeView ? 'text-indigo-600' : 'text-slate-500'}`}>
                  👀 Preview
                </Text>
              </Pressable>
              {showsCode && (
                <Pressable
                  onPress={() => setShowCodeView(true)}
                  className={`flex-1 py-2 rounded-lg ${showCodeView ? 'bg-white' : ''}`}
                >
                  <Text className={`text-center font-medium ${showCodeView ? 'text-indigo-600' : 'text-slate-500'}`}>
                    💻 Code
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Website Preview */}
            {!showCodeView ? (
              <View className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                {/* Simulated Browser */}
                <View className="bg-slate-200 p-2 flex-row items-center">
                  <View className="flex-row gap-1 mr-3">
                    <View className="w-3 h-3 rounded-full bg-red-400" />
                    <View className="w-3 h-3 rounded-full bg-yellow-400" />
                    <View className="w-3 h-3 rounded-full bg-green-400" />
                  </View>
                  <View className="flex-1 bg-white rounded px-2 py-1">
                    <Text className="text-xs text-slate-500">mysite.sparkids.ai/{website.siteName.toLowerCase().replace(/\s+/g, '-')}</Text>
                  </View>
                </View>

                {/* Site Content */}
                <View
                  className="p-6"
                  style={{
                    backgroundColor: colorThemes.find(t => t.id === website.colorTheme)?.primary + '15',
                  }}
                >
                  <View
                    className="rounded-xl p-6 mb-4"
                    style={{
                      backgroundColor: colorThemes.find(t => t.id === website.colorTheme)?.primary,
                    }}
                  >
                    <Text className="text-white text-xl font-bold text-center">
                      {website.headline}
                    </Text>
                    <Text className="text-white/80 text-center mt-2">
                      {website.description}
                    </Text>
                  </View>

                  {templateInfo[website.template]?.sections.map((section, i) => (
                    <View key={i} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                      <Text
                        className="font-bold mb-2"
                        style={{ color: colorThemes.find(t => t.id === website.colorTheme)?.primary }}
                      >
                        {section}
                      </Text>
                      <Text className="text-slate-500 text-sm">
                        Your content goes here...
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              /* Code View */
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
              <Text className="text-green-800 font-bold text-lg">Your website is ready!</Text>
              <Text className="text-green-600 text-sm text-center mt-1">
                You just wrote real HTML & CSS code with AI!
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              {canPublish && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">🌐 Publish</Text>
                </Pressable>
              )}
              {canShareLink && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">🔗 Share Link</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => setStep('content')}
              className="py-3"
            >
              <Text className="text-indigo-600 text-center font-medium">✏️ Edit Website</Text>
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
