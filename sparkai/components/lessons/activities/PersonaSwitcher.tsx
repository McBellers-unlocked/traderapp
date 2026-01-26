import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface PersonaSwitcherProps {
  title: string;
  personas: string[];
  canCreateCustom?: boolean;
  showsComparison?: boolean;
  onComplete?: () => void;
}

interface Persona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  personality: string;
  speakingStyle: string;
  expertise: string[];
}

interface ConversationMessage {
  persona: string;
  message: string;
  emoji: string;
}

export function PersonaSwitcher({
  title,
  personas: personaTypes,
  canCreateCustom = true,
  showsComparison = true,
  onComplete,
}: PersonaSwitcherProps) {
  const [step, setStep] = useState<'intro' | 'select' | 'custom' | 'chat' | 'compare' | 'complete'>('intro');
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [customPersona, setCustomPersona] = useState<Partial<Persona>>({});
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);

  const builtInPersonas: Record<string, Persona> = {
    'teacher': {
      id: 'teacher',
      name: 'Professor Wisdom',
      emoji: '👩‍🏫',
      description: 'Patient educator who breaks things down',
      personality: 'Patient, encouraging, clear',
      speakingStyle: 'Uses examples and asks guiding questions',
      expertise: ['Explaining concepts', 'Breaking down problems', 'Encouraging learning'],
    },
    'friend': {
      id: 'friend',
      name: 'Buddy Bot',
      emoji: '🤗',
      description: 'Casual and fun helper',
      personality: 'Friendly, enthusiastic, supportive',
      speakingStyle: 'Uses casual language, emojis, and humor',
      expertise: ['Making things fun', 'Being supportive', 'Creative ideas'],
    },
    'scientist': {
      id: 'scientist',
      name: 'Dr. Discovery',
      emoji: '🔬',
      description: 'Curious explorer of facts',
      personality: 'Curious, precise, analytical',
      speakingStyle: 'Uses data, experiments, and "what if" questions',
      expertise: ['Research', 'Experiments', 'Finding evidence'],
    },
    'storyteller': {
      id: 'storyteller',
      name: 'The Narrator',
      emoji: '📚',
      description: 'Creative weaver of tales',
      personality: 'Imaginative, dramatic, engaging',
      speakingStyle: 'Uses vivid descriptions and narrative elements',
      expertise: ['Stories', 'Creative writing', 'Making things memorable'],
    },
    'coach': {
      id: 'coach',
      name: 'Coach Champion',
      emoji: '🏆',
      description: 'Motivating guide to success',
      personality: 'Motivating, practical, goal-focused',
      speakingStyle: 'Uses action words and step-by-step plans',
      expertise: ['Setting goals', 'Making plans', 'Staying motivated'],
    },
    'artist': {
      id: 'artist',
      name: 'Creative Spark',
      emoji: '🎨',
      description: 'Imaginative visual thinker',
      personality: 'Creative, expressive, visual',
      speakingStyle: 'Thinks in colors, shapes, and imagery',
      expertise: ['Art', 'Design', 'Visual thinking'],
    },
  };

  const sampleQuestions = [
    "Why is the sky blue?",
    "How can I be better at math?",
    "What should I do when I'm bored?",
    "How do computers work?",
    "Why is it important to be kind?",
  ];

  const togglePersona = (id: string) => {
    if (selectedPersonas.includes(id)) {
      setSelectedPersonas(selectedPersonas.filter(p => p !== id));
    } else if (selectedPersonas.length < 3) {
      setSelectedPersonas([...selectedPersonas, id]);
    }
  };

  const generateResponse = (persona: Persona, question: string): string => {
    const responses: Record<string, Record<string, string>> = {
      'teacher': {
        default: `Great question! 📚 Let me break this down for you step by step.\n\nFirst, let's understand the basics: ${question.toLowerCase().includes('why') ? "The 'why' behind things helps us understand the world better." : "This is actually connected to some really interesting concepts!"}\n\nThink of it like this... [uses a relatable example]\n\nDoes that make sense? What part would you like me to explain more?`,
        sky: `Wonderful question! 📚 The sky appears blue because of something called "Rayleigh scattering."\n\nLet me explain with a simple example: Imagine sunlight is like a rainbow of colors traveling together. When it hits tiny particles in our atmosphere, the blue light bounces around more than other colors (because blue has shorter waves).\n\nIt's like throwing a small bouncy ball vs a beach ball in a room full of pillows - the small one bounces more!\n\nWould you like to learn about why sunsets are orange and red?`,
        math: `I believe in you! 📚 Getting better at math is totally achievable. Here's my teacher's approach:\n\n1. **Practice a little every day** - 15 minutes beats 2 hours once a week\n2. **Understand, don't memorize** - Ask "why does this work?"\n3. **Make mistakes proudly** - They're how we learn!\n4. **Connect it to real life** - Math is everywhere!\n\nWhat specific area of math feels tricky right now?`,
      },
      'friend': {
        default: `Ooh, good one! 🤗✨\n\nOkay so basically... ${question.toLowerCase().includes('why') ? "the reason is actually pretty cool when you think about it!" : "this is one of those things that's actually super interesting!"}\n\nI love thinking about stuff like this! It's like when you realize something ordinary is actually amazing.\n\nWhat made you curious about this? I wanna know! 😄`,
        sky: `OMG great question! 🤗💙\n\nOkay so the sky is blue because... *drumroll* ...the sun's light is actually ALL the colors mixed together (wild, right?!), and when it hits our air, the blue part bounces around the most!\n\nIt's like if you threw a bunch of different balls at a trampoline park - the bounciest ones would be everywhere! Blue light = super bouncy! 🎉\n\nIsn't that cool?! What's YOUR favorite sky color? I love sunset pink! 🌅`,
        math: `Hey, I totally get it! 🤗 Math can feel tricky sometimes!\n\nHere's what helped me:\n- **Games!** There are SO many fun math games\n- **Don't stress about speed** - Understanding > Fast\n- **Study buddies!** Everything's better with friends\n- **Celebrate small wins!** 🎉\n\nYou've totally got this! What part of math do you want to tackle first? I'll cheer you on! 📣`,
      },
      'scientist': {
        default: `Fascinating inquiry! 🔬 Let me approach this systematically.\n\n**Hypothesis:** ${question}\n\n**Observable evidence:** We can examine this through careful observation and analysis.\n\n**Key findings:** The scientific consensus shows some interesting patterns here.\n\n**Further investigation:** What variables do you think we should test next?`,
        sky: `Excellent scientific question! 🔬\n\n**The phenomenon:** Blue sky color\n**The cause:** Rayleigh scattering\n\n**The science:** Solar radiation contains all wavelengths. When photons enter Earth's atmosphere, shorter wavelengths (blue, ~450nm) scatter more efficiently than longer wavelengths (red, ~700nm) due to interaction with nitrogen and oxygen molecules.\n\n**Fun experiment:** On Mars, the sky appears reddish-pink! Different atmosphere, different scattering.\n\nShall we explore the wavelength spectrum further?`,
        math: `Let's approach this empirically! 🔬\n\n**Research shows** that mathematical ability improves through:\n1. **Spaced repetition** - Practice over time, not all at once\n2. **Active problem-solving** - Not just reading, but doing\n3. **Error analysis** - Study your mistakes scientifically\n4. **Growth mindset** - Your brain literally grows new connections!\n\n**Data point:** Studies show 20 minutes of daily practice is optimal.\n\nWhat mathematical domain shall we investigate first?`,
      },
      'storyteller': {
        default: `*Ah, gather 'round, young seeker of knowledge...* 📚✨\n\nYour question reminds me of an ancient tale... Long ago, someone just like you wondered the very same thing.\n\nAnd what they discovered changed everything they thought they knew...\n\n*leans in closer*\n\nWould you like to hear how this story unfolds? 🌟`,
        sky: `*Once upon a time, in the vast kingdom of the Atmosphere...* 📚✨\n\nThe Sun King sent his children - the Light Rays - on a journey to Earth. They traveled as a rainbow family: Red, Orange, Yellow, Green, Blue, and Violet.\n\nBut young Blue was the most energetic, bouncing and dancing through the air particles like a pinball! While his siblings traveled straight, Blue scattered across the entire sky, painting it his favorite color.\n\nAnd that, dear friend, is why when you look up, you see Blue's magnificent dance! 💙\n\n*The End... or is it?* 🌅`,
        math: `*Ah, the Quest for Mathematical Mastery!* 📚⚔️\n\nEvery great hero faces challenges. Math is your dragon to befriend, not slay!\n\nLegend speaks of the Five Keys:\n🗝️ **Practice** - Train daily like a knight\n🗝️ **Patience** - Rome wasn't built in a day\n🗝️ **Puzzles** - Make it a game!\n🗝️ **Partners** - Find fellow adventurers\n🗝️ **Perseverance** - Heroes don't give up!\n\nYour mathematical adventure awaits! What chapter shall we begin? 📖`,
      },
      'coach': {
        default: `Let's GO! 🏆 Great question, champion!\n\nHere's the game plan:\n1. ✅ Understand what you're working with\n2. ✅ Break it into smaller plays\n3. ✅ Execute one step at a time\n4. ✅ CELEBRATE your progress!\n\nYou've got what it takes! What's your first move?`,
        sky: `GREAT curiosity, champ! 🏆\n\nHere's the play-by-play on the blue sky:\n\n📋 **The Game:** Sunlight vs. Atmosphere\n⚡ **The Play:** Light hits air, blue light bounces everywhere\n🎯 **The Result:** BLUE SKY FOR THE WIN!\n\nIt's called Rayleigh scattering - science doing its thing!\n\nNow YOU know something most people don't think about! Knowledge is POWER! 💪\n\nWhat else do you want to learn today, champ?`,
        math: `ALRIGHT, let's get you to math SUCCESS! 🏆\n\n**Your Training Program:**\n\n📅 **Daily Practice:** 15-20 minutes, no excuses!\n🎯 **Focus Areas:** Identify what trips you up\n📊 **Track Progress:** Celebrate every improvement!\n💪 **Mindset:** "I can't do this YET" - add that YET!\n\n**Weekly Goals:**\n- Week 1: Build the habit\n- Week 2: Tackle weak spots\n- Week 3: Level up difficulty\n- Week 4: VICTORY LAP! 🎉\n\nI believe in you! Now let's CRUSH IT! What area of math are we conquering first?`,
      },
      'artist': {
        default: `Ooh, what a colorful question! 🎨\n\n*imagines it visually*\n\nI see this like a painting... layers of meaning, different perspectives, beautiful complexity!\n\nEvery question is a blank canvas waiting for us to add color and life to it.\n\nWhat colors does this question make YOU think of? 🌈`,
        sky: `OH, the sky! My favorite canvas! 🎨💙\n\n*paints the picture*\n\nImagine the sun as a master artist with a palette of ALL colors. When the sun paints toward Earth, the sky is like a cosmic spray-painting session!\n\nBlue paint sprays EVERYWHERE because it's made of tiny drops (short wavelengths), while red and orange are bigger drops that fall straight down.\n\nSo the whole sky becomes a blue masterpiece! 🖼️\n\n*chef's kiss*\n\nAnd at sunset? The artist uses ALL the warm colors! 🌅`,
        math: `Let's make math BEAUTIFUL! 🎨\n\n*grabs creative supplies*\n\nDid you know math IS art? Look at:\n- 🌀 Spirals in nature (Fibonacci!)\n- 🔷 Geometric patterns\n- 🎵 Music is math you can hear!\n- 🏛️ Architecture is math you can live in!\n\n**Creative math tips:**\n- Draw your problems\n- Use colors for different operations\n- Find patterns - they're everywhere!\n- Make it visual!\n\nMath is the universe's art language! What pattern do you want to explore? ✨`,
      },
    };

    // Check for keywords in question
    let questionType = 'default';
    if (question.toLowerCase().includes('sky') || question.toLowerCase().includes('blue')) {
      questionType = 'sky';
    } else if (question.toLowerCase().includes('math') || question.toLowerCase().includes('better at')) {
      questionType = 'math';
    }

    return responses[persona.id]?.[questionType] || responses[persona.id]?.['default'] ||
      `${persona.emoji} As ${persona.name}, I'd say: ${persona.speakingStyle}. ${question}? That's a great topic to explore with a ${persona.personality.toLowerCase()} approach!`;
  };

  const askQuestion = async () => {
    if (!userQuestion.trim() || selectedPersonas.length === 0) return;

    setIsThinking(true);
    setConversation([]);

    for (let i = 0; i < selectedPersonas.length; i++) {
      setCurrentPersonaIndex(i);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const persona = builtInPersonas[selectedPersonas[i]] || {
        id: 'custom',
        name: customPersona.name || 'Custom',
        emoji: customPersona.emoji || '🤖',
        description: customPersona.description || '',
        personality: customPersona.personality || 'Helpful',
        speakingStyle: customPersona.speakingStyle || 'Clear and friendly',
        expertise: [],
      };

      const response = generateResponse(persona, userQuestion);
      setConversation(prev => [...prev, {
        persona: persona.name,
        message: response,
        emoji: persona.emoji,
      }]);
    }

    setIsThinking(false);
    if (showsComparison && selectedPersonas.length > 1) {
      setStep('compare');
    }
  };

  const resetForNewQuestion = () => {
    setUserQuestion('');
    setConversation([]);
    setStep('chat');
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎭</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <View className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 mb-4">
              <Text className="text-4xl text-center mb-3">🎭</Text>
              <Text className="text-white text-xl font-bold text-center mb-2">
                AI Personas: Same Question, Different Answers!
              </Text>
              <Text className="text-white/80 text-center">
                Did you know you can ask AI to answer as different characters?
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-bold text-slate-800 mb-3">Why Use Personas?</Text>

              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-3">🎯</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">Get Different Perspectives</Text>
                  <Text className="text-slate-500 text-sm">See topics from many angles</Text>
                </View>
              </View>

              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-3">🎨</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">Match Your Learning Style</Text>
                  <Text className="text-slate-500 text-sm">Fun? Serious? Creative? You choose!</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Text className="text-2xl mr-3">✨</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">Make It More Engaging</Text>
                  <Text className="text-slate-500 text-sm">Learning is better with personality!</Text>
                </View>
              </View>
            </View>

            <Button
              title="Meet the Personas! 🎭"
              onPress={() => setStep('select')}
              size="lg"
            />
          </View>
        )}

        {/* Select Personas */}
        {step === 'select' && (
          <View>
            <View className="bg-purple-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                Choose Your Personas
              </Text>
              <Text className="text-purple-200 text-center mt-1">
                Select up to 3 to compare answers
              </Text>
            </View>

            <View className="gap-3 mb-4">
              {personaTypes.map((type) => {
                const persona = builtInPersonas[type];
                const isSelected = selectedPersonas.includes(type);
                return (
                  <Pressable
                    key={type}
                    onPress={() => togglePersona(type)}
                    className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${
                      isSelected ? 'border-purple-500 bg-purple-50' : 'border-slate-200'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-3xl mr-3">{persona.emoji}</Text>
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800">{persona.name}</Text>
                        <Text className="text-slate-500 text-sm">{persona.description}</Text>
                        <Text className="text-purple-600 text-xs mt-1">
                          Style: {persona.speakingStyle}
                        </Text>
                      </View>
                      {isSelected && (
                        <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center">
                          <Text className="text-white text-sm">✓</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {canCreateCustom && (
              <Pressable
                onPress={() => setStep('custom')}
                className="border-2 border-dashed border-purple-300 rounded-xl p-4 items-center mb-4"
              >
                <Text className="text-purple-600 font-medium">+ Create Custom Persona</Text>
              </Pressable>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('intro')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title={`Chat with ${selectedPersonas.length} Persona${selectedPersonas.length !== 1 ? 's' : ''}`}
                  onPress={() => setStep('chat')}
                  disabled={selectedPersonas.length === 0}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Custom Persona */}
        {step === 'custom' && (
          <View>
            <View className="bg-pink-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                🎨 Create Your Persona
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Persona Name:</Text>
              <TextInput
                className="border-2 border-pink-200 rounded-xl p-3 bg-pink-50"
                placeholder="e.g., Captain Adventure"
                value={customPersona.name || ''}
                onChangeText={(val) => setCustomPersona({ ...customPersona, name: val })}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Emoji:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 text-2xl text-center"
                placeholder="🦸"
                value={customPersona.emoji || ''}
                onChangeText={(val) => setCustomPersona({ ...customPersona, emoji: val })}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Personality:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="e.g., Brave, funny, encouraging"
                value={customPersona.personality || ''}
                onChangeText={(val) => setCustomPersona({ ...customPersona, personality: val })}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Speaking Style:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="e.g., Uses adventure metaphors and exciting language"
                value={customPersona.speakingStyle || ''}
                onChangeText={(val) => setCustomPersona({ ...customPersona, speakingStyle: val })}
                multiline
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
                  title="Add Persona ✨"
                  onPress={() => {
                    if (customPersona.name) {
                      setSelectedPersonas([...selectedPersonas, 'custom']);
                      setStep('select');
                    }
                  }}
                  disabled={!customPersona.name?.trim()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Chat */}
        {step === 'chat' && (
          <View>
            {/* Selected Personas */}
            <View className="flex-row justify-center gap-2 mb-4">
              {selectedPersonas.map((id) => {
                const persona = builtInPersonas[id] || customPersona;
                return (
                  <View
                    key={id}
                    className="bg-purple-100 px-3 py-2 rounded-full flex-row items-center"
                  >
                    <Text className="mr-1">{persona.emoji}</Text>
                    <Text className="text-purple-700 text-sm">{persona.name}</Text>
                  </View>
                );
              })}
            </View>

            {/* Question Input */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Ask a question:</Text>
              <TextInput
                className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50 min-h-[100px]"
                placeholder="Type your question here..."
                value={userQuestion}
                onChangeText={setUserQuestion}
                multiline
                textAlignVertical="top"
              />

              {/* Sample Questions */}
              <Text className="text-slate-500 text-sm mt-3 mb-2">Or try a sample:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {sampleQuestions.map((q, i) => (
                    <Pressable
                      key={i}
                      onPress={() => setUserQuestion(q)}
                      className="bg-slate-100 px-3 py-2 rounded-full"
                    >
                      <Text className="text-slate-600 text-sm">{q}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <Button
              title={isThinking ? "Thinking..." : "Ask All Personas! 🎭"}
              onPress={askQuestion}
              disabled={!userQuestion.trim() || isThinking}
              loading={isThinking}
              size="lg"
            />

            {/* Thinking Animation */}
            {isThinking && (
              <View className="bg-purple-50 rounded-xl p-4 mt-4 items-center">
                <ActivityIndicator color="#8B5CF6" />
                <Text className="text-purple-700 mt-2">
                  {builtInPersonas[selectedPersonas[currentPersonaIndex]]?.emoji}{' '}
                  {builtInPersonas[selectedPersonas[currentPersonaIndex]]?.name} is thinking...
                </Text>
              </View>
            )}

            {/* Responses */}
            {conversation.length > 0 && (
              <View className="mt-4 gap-4">
                {conversation.map((msg, i) => (
                  <View key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <View className="bg-purple-500 px-4 py-2 flex-row items-center">
                      <Text className="text-xl mr-2">{msg.emoji}</Text>
                      <Text className="text-white font-medium">{msg.persona}</Text>
                    </View>
                    <View className="p-4">
                      <Text className="text-slate-700 leading-6">{msg.message}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            {conversation.length > 0 && !isThinking && (
              <View className="flex-row gap-3 mt-4">
                <Pressable
                  onPress={resetForNewQuestion}
                  className="flex-1 bg-purple-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">New Question 💬</Text>
                </Pressable>
                <Pressable
                  onPress={() => setStep('select')}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-bold">Change Personas 🎭</Text>
                </Pressable>
              </View>
            )}

            {/* Back Button */}
            <Pressable
              onPress={() => setStep('select')}
              className="mt-4 py-2"
            >
              <Text className="text-indigo-600 text-center">← Choose Different Personas</Text>
            </Pressable>
          </View>
        )}

        {/* Compare */}
        {step === 'compare' && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🔍</Text>
              <Text className="text-white text-xl font-bold">Compare the Answers!</Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4">
              <Text className="font-bold text-slate-800 mb-2">Your Question:</Text>
              <Text className="text-slate-600 italic">"{userQuestion}"</Text>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-2">🧠 What to Notice:</Text>
              <Text className="text-amber-700 text-sm">
                • How is the tone different?{'\n'}
                • What examples does each use?{'\n'}
                • Which style helps you understand best?{'\n'}
                • How does personality change the answer?
              </Text>
            </View>

            {/* Side by Side Comparison */}
            {conversation.map((msg, i) => (
              <View key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                <View className="bg-purple-500 px-4 py-2 flex-row items-center">
                  <Text className="text-xl mr-2">{msg.emoji}</Text>
                  <Text className="text-white font-medium">{msg.persona}</Text>
                </View>
                <View className="p-4">
                  <Text className="text-slate-700 leading-6">{msg.message}</Text>
                </View>
              </View>
            ))}

            <View className="bg-indigo-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-indigo-800 mb-2">✨ Key Insight:</Text>
              <Text className="text-indigo-700">
                The same question got {conversation.length} different answers! Each persona
                brought their own style and perspective. This is why choosing the right
                AI persona matters - pick one that matches how YOU learn best!
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={resetForNewQuestion}
                className="flex-1 bg-purple-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">Try Another Question</Text>
              </Pressable>
              <Pressable
                onPress={() => setStep('select')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-bold">New Personas</Text>
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
