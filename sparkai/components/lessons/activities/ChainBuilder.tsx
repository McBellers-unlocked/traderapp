import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface ChainBuilderProps {
  title: string;
  chainTypes: string[];
  maxSteps?: number;
  showsChainVisualization?: boolean;
  onComplete?: () => void;
  onSave?: (chain: any) => void;
}

interface ChainStep {
  id: number;
  prompt: string;
  output: string;
  status: 'pending' | 'running' | 'complete';
}

interface ChainData {
  type: string;
  goal: string;
  steps: ChainStep[];
}

export function ChainBuilder({
  title,
  chainTypes,
  maxSteps = 5,
  showsChainVisualization = true,
  onComplete,
  onSave,
}: ChainBuilderProps) {
  const [step, setStep] = useState<'intro' | 'type' | 'goal' | 'building' | 'running' | 'result'>('intro');
  const [chain, setChain] = useState<ChainData>({
    type: '',
    goal: '',
    steps: [],
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const chainInfo: Record<string, { emoji: string; desc: string; example: string; sampleSteps: string[] }> = {
    'story chain': {
      emoji: '📚',
      desc: 'Build a story piece by piece',
      example: 'Create a character → Describe their world → Start an adventure',
      sampleSteps: [
        'Create a main character with a name, personality, and special ability',
        'Describe the world they live in',
        'Introduce a problem or challenge',
        'Show how they begin to solve it',
        'Write an exciting climax',
      ],
    },
    'research chain': {
      emoji: '🔬',
      desc: 'Deep dive into a topic',
      example: 'Pick topic → Get overview → Find details → Summarize',
      sampleSteps: [
        'Give me a simple overview of the topic',
        'What are the most interesting facts?',
        'Explain how it works in detail',
        'What are some real-world examples?',
        'Summarize everything in a fun way',
      ],
    },
    'creative chain': {
      emoji: '🎨',
      desc: 'Build art step by step',
      example: 'Choose style → Pick subject → Add details → Refine',
      sampleSteps: [
        'Describe a cool art style to use',
        'Choose an interesting subject',
        'Add background and setting details',
        'Include special effects or mood',
        'Write the final detailed prompt',
      ],
    },
    'problem chain': {
      emoji: '🧩',
      desc: 'Solve problems systematically',
      example: 'Identify problem → Break it down → Find solutions → Test',
      sampleSteps: [
        'Clearly define what problem we need to solve',
        'Break the problem into smaller parts',
        'Brainstorm possible solutions for each part',
        'Evaluate which solution is best',
        'Create an action plan',
      ],
    },
    'learning chain': {
      emoji: '📖',
      desc: 'Master a new skill',
      example: 'What to learn → Basics → Practice → Apply',
      sampleSteps: [
        'What do I need to learn first (basics)?',
        'Explain the key concepts simply',
        'Give me practice exercises',
        'Show me common mistakes to avoid',
        'How can I use this in real life?',
      ],
    },
  };

  const addStep = () => {
    if (chain.steps.length < maxSteps) {
      const newStep: ChainStep = {
        id: Date.now(),
        prompt: '',
        output: '',
        status: 'pending',
      };
      setChain({ ...chain, steps: [...chain.steps, newStep] });
    }
  };

  const updateStepPrompt = (index: number, prompt: string) => {
    const newSteps = [...chain.steps];
    newSteps[index] = { ...newSteps[index], prompt };
    setChain({ ...chain, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = chain.steps.filter((_, i) => i !== index);
    setChain({ ...chain, steps: newSteps });
  };

  const useSampleSteps = () => {
    const sampleSteps = chainInfo[chain.type]?.sampleSteps || [];
    const newSteps: ChainStep[] = sampleSteps.map((prompt, i) => ({
      id: Date.now() + i,
      prompt,
      output: '',
      status: 'pending' as const,
    }));
    setChain({ ...chain, steps: newSteps });
  };

  const runChain = async () => {
    setStep('running');
    setIsRunning(true);
    setCurrentStepIndex(0);

    const newSteps = [...chain.steps];

    for (let i = 0; i < newSteps.length; i++) {
      setCurrentStepIndex(i);
      newSteps[i].status = 'running';
      setChain({ ...chain, steps: [...newSteps] });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock output based on the prompt
      const outputs = generateOutput(newSteps[i].prompt, i, chain.type, chain.goal);
      newSteps[i].output = outputs;
      newSteps[i].status = 'complete';
      setChain({ ...chain, steps: [...newSteps] });
    }

    setIsRunning(false);
    setStep('result');
  };

  const generateOutput = (prompt: string, index: number, type: string, goal: string): string => {
    // Generate contextual outputs based on chain type
    const outputs: Record<string, string[]> = {
      'story chain': [
        `Meet Luna, a curious 12-year-old inventor with the ability to talk to machines. She's brave, a little messy, and always has a screwdriver in her pocket. Her best friend is a robot she built from spare parts.`,
        `Luna lives in Neo City, a place where buildings touch the clouds and flying cars zip between them. Her workshop is in an old clock tower that overlooks the entire city. The air smells of oil and adventure.`,
        `One day, all the robots in Neo City suddenly stop working - including her best friend! Luna discovers a mysterious signal coming from beneath the city. She must find its source before the city falls apart.`,
        `Luna descends into the forgotten tunnels below Neo City, using her special ability to coax old machines back to life. She follows the signal deeper, discovering ancient technology from before the city was built.`,
        `In a vast underground chamber, Luna faces the source: an ancient AI that's scared and alone, accidentally jamming all signals. Instead of fighting, Luna befriends it, and together they restore the robots - creating a new era of harmony between old and new tech!`,
      ],
      'research chain': [
        `Great topic! Here's a quick overview: ${goal || 'This subject'} is fascinating because it connects to so many areas of our world. Scientists and experts have been studying it for years, and there's always something new to discover!`,
        `Amazing facts about this topic:\n• It affects millions of people/things worldwide\n• New discoveries are being made every year\n• It has surprising connections to everyday life\n• Experts are still learning new things about it`,
        `How it works: The basic principle is all about cause and effect. When one thing happens, it triggers a chain reaction of events. Think of it like dominoes falling - each piece affects the next one!`,
        `Real-world examples:\n1. You can see this in action when...\n2. Another example is how...\n3. In your daily life, this shows up when...`,
        `Summary: ${goal || 'This topic'} is super cool because it shows how connected everything is! The key things to remember are: it's everywhere around us, it follows predictable patterns, and understanding it helps us make better decisions. Keep exploring!`,
      ],
      'creative chain': [
        `Art Style: "Cosmic Watercolor" - Imagine soft, flowing colors that blend like nebulas in space, with sparkles of bright stars scattered throughout. Colors should feel dreamy and magical, like you're floating through a galaxy.`,
        `Subject: A friendly dragon librarian who wears tiny spectacles and has bookshelves built into their scales. They're reading a glowing book, and small fireflies made of words float around them.`,
        `Background: An ancient library carved into a mountain, with books floating on gentle magic currents. Moonlight streams through crystal windows, creating rainbow reflections on the stone floors. Cozy reading nooks are tucked into every corner.`,
        `Special Effects: Soft golden glow emanating from the dragon's book, word-fireflies leaving trails of stardust, gentle mist around the floor, and a sense of peaceful warmth despite the grand scale. The mood is "cozy wonder."`,
        `Final Prompt: "A gentle dragon librarian with tiny round spectacles and bookshelves in their scales, reading a glowing golden book in an ancient mountain library. Cosmic watercolor style with soft nebula colors, floating books on magic currents, moonlight through crystal windows creating rainbows, word-fireflies with stardust trails, cozy and wondrous atmosphere."`,
      ],
      'problem chain': [
        `Problem Definition: "${goal || 'The challenge we face'}" - This is important because it affects how things work and how people feel. The main issue is that something isn't working the way it should, and we need to figure out why and fix it.`,
        `Breaking it down:\n1. Part A: What's causing the initial issue?\n2. Part B: What happens as a result?\n3. Part C: What resources do we have?\n4. Part D: What constraints are we working with?\n\nBy separating these parts, the problem feels more manageable!`,
        `Possible Solutions:\n• Solution 1: Address the root cause directly\n• Solution 2: Work around the problem\n• Solution 3: Change what we're trying to achieve\n• Solution 4: Combine multiple approaches\n\nEach has pros and cons to consider!`,
        `Best Solution Analysis:\nLooking at our options, Solution 1 (addressing the root cause) combined with elements of Solution 4 seems most promising because:\n✓ It fixes the actual problem\n✓ It's sustainable long-term\n✓ It can be done with available resources`,
        `Action Plan:\n1. First, gather what we need (Day 1)\n2. Start with the smallest part (Day 2-3)\n3. Test if it's working (Day 4)\n4. Expand to other parts (Day 5-7)\n5. Review and adjust as needed\n\nRemember: It's okay to modify the plan as you learn more!`,
      ],
      'learning chain': [
        `Starting Point: To learn ${goal || 'this skill'}, begin with these fundamentals:\n1. Understanding WHY this matters\n2. Learning the basic vocabulary\n3. Seeing examples of it in action\n4. Trying simple exercises first\n\nDon't skip these basics - they're your foundation!`,
        `Key Concepts Explained Simply:\n🔑 Concept 1: Think of it like building with blocks - start at the bottom\n🔑 Concept 2: Everything connects to everything else\n🔑 Concept 3: Practice makes progress (not perfection!)\n🔑 Concept 4: Mistakes are just learning in disguise`,
        `Practice Exercises:\n✏️ Exercise 1: Try the simplest version for 5 minutes\n✏️ Exercise 2: Combine two things you learned\n✏️ Exercise 3: Teach what you learned to someone else\n✏️ Exercise 4: Find a real problem to solve with your new skill`,
        `Common Mistakes to Avoid:\n❌ Trying to learn everything at once\n❌ Not practicing regularly\n❌ Giving up when it gets hard\n❌ Comparing yourself to experts\n\n✅ Instead: Take it one step at a time, practice daily, celebrate small wins!`,
        `Real-Life Applications:\n🌟 You can use this when...\n🌟 This helps you in daily life by...\n🌟 Jobs that use this skill include...\n🌟 Fun ways to practice more include...\n\nRemember: Every expert was once a beginner. Keep going! 🚀`,
      ],
    };

    return outputs[type]?.[index] || `Output for step ${index + 1}: Processing "${prompt}" - Here's a helpful response that builds on what came before!`;
  };

  const handleSave = () => {
    onSave?.(chain);
  };

  const canRunChain = () => {
    return chain.steps.length >= 2 && chain.steps.every(s => s.prompt.trim());
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">⛓️</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <View className="bg-indigo-600 rounded-2xl p-6 mb-4">
              <Text className="text-4xl text-center mb-3">🔗</Text>
              <Text className="text-white text-xl font-bold text-center mb-2">
                What is Prompt Chaining?
              </Text>
              <Text className="text-indigo-200 text-center">
                Instead of asking AI one big question, you break it into steps.
                Each step builds on the last one!
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-bold text-slate-800 mb-3">Why Chain Prompts?</Text>

              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-3">🎯</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">Better Results</Text>
                  <Text className="text-slate-500 text-sm">Each step focuses on one thing</Text>
                </View>
              </View>

              <View className="flex-row items-start mb-3">
                <Text className="text-2xl mr-3">🧠</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">More Control</Text>
                  <Text className="text-slate-500 text-sm">You guide AI step by step</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Text className="text-2xl mr-3">✨</Text>
                <View className="flex-1">
                  <Text className="font-medium text-slate-700">Complex Tasks</Text>
                  <Text className="text-slate-500 text-sm">Tackle big projects in pieces</Text>
                </View>
              </View>
            </View>

            {showsChainVisualization && (
              <View className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-4 mb-4">
                <Text className="text-center text-slate-600 mb-3">Chain Example:</Text>
                <View className="flex-row items-center justify-center">
                  <View className="bg-indigo-500 px-3 py-2 rounded-lg">
                    <Text className="text-white text-xs">Step 1</Text>
                  </View>
                  <Text className="mx-2 text-indigo-400">→</Text>
                  <View className="bg-indigo-500 px-3 py-2 rounded-lg">
                    <Text className="text-white text-xs">Step 2</Text>
                  </View>
                  <Text className="mx-2 text-indigo-400">→</Text>
                  <View className="bg-indigo-500 px-3 py-2 rounded-lg">
                    <Text className="text-white text-xs">Step 3</Text>
                  </View>
                  <Text className="mx-2 text-indigo-400">→</Text>
                  <View className="bg-green-500 px-3 py-2 rounded-lg">
                    <Text className="text-white text-xs">Done!</Text>
                  </View>
                </View>
              </View>
            )}

            <Button
              title="Let's Build a Chain! 🔗"
              onPress={() => setStep('type')}
              size="lg"
            />
          </View>
        )}

        {/* Type Selection */}
        {step === 'type' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of chain will you build?
            </Text>

            <View className="gap-3">
              {chainTypes.map((type) => {
                const info = chainInfo[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setChain({ ...chain, type });
                      setStep('goal');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200"
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">{info?.emoji || '🔗'}</Text>
                      <Text className="font-bold text-slate-800 capitalize text-lg">{type}</Text>
                    </View>
                    <Text className="text-slate-600 mb-2">{info?.desc}</Text>
                    <Text className="text-slate-400 text-sm italic">{info?.example}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setStep('intro')}
              className="mt-4 py-2"
            >
              <Text className="text-indigo-600 text-center">← Back</Text>
            </Pressable>
          </View>
        )}

        {/* Goal Setting */}
        {step === 'goal' && (
          <View>
            <View className="bg-indigo-500 rounded-2xl p-4 mb-4">
              <Text className="text-3xl text-center mb-1">{chainInfo[chain.type]?.emoji}</Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {chain.type}
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                What's your goal for this chain?
              </Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[100px]"
                placeholder="I want to create/learn/explore..."
                value={chain.goal}
                onChangeText={(val) => setChain({ ...chain, goal: val })}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('type')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Build Chain →"
                  onPress={() => setStep('building')}
                  disabled={!chain.goal.trim()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Building Chain */}
        {step === 'building' && (
          <View>
            <View className="bg-purple-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                🔗 Build Your Chain
              </Text>
              <Text className="text-purple-200 text-center mt-1">
                Add steps that build on each other
              </Text>
            </View>

            {/* Goal Reminder */}
            <View className="bg-purple-50 rounded-xl p-3 mb-4">
              <Text className="text-purple-800 text-sm">
                <Text className="font-bold">Goal:</Text> {chain.goal}
              </Text>
            </View>

            {/* Sample Steps Button */}
            {chain.steps.length === 0 && (
              <Pressable
                onPress={useSampleSteps}
                className="bg-indigo-100 rounded-xl p-4 mb-4 items-center"
              >
                <Text className="text-indigo-700 font-medium">
                  ✨ Use Sample Steps to Get Started
                </Text>
              </Pressable>
            )}

            {/* Chain Steps */}
            {chain.steps.map((s, index) => (
              <View key={s.id} className="mb-3">
                {index > 0 && (
                  <View className="items-center my-2">
                    <Text className="text-purple-400">↓</Text>
                  </View>
                )}
                <View className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white font-bold">{index + 1}</Text>
                      </View>
                      <Text className="font-medium text-slate-700">Step {index + 1}</Text>
                    </View>
                    <Pressable onPress={() => removeStep(index)}>
                      <Text className="text-red-500">✕</Text>
                    </Pressable>
                  </View>
                  <TextInput
                    className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50"
                    placeholder="What should AI do in this step?"
                    value={s.prompt}
                    onChangeText={(val) => updateStepPrompt(index, val)}
                    multiline
                  />
                </View>
              </View>
            ))}

            {/* Add Step Button */}
            {chain.steps.length < maxSteps && (
              <Pressable
                onPress={addStep}
                className="border-2 border-dashed border-purple-300 rounded-xl p-4 items-center mb-4"
              >
                <Text className="text-purple-600 font-medium">+ Add Step</Text>
              </Pressable>
            )}

            <View className="bg-amber-50 rounded-xl p-3 mb-4">
              <Text className="text-amber-700 text-sm">
                💡 <Text className="font-medium">Tip:</Text> Each step should use or build on what the previous step created!
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('goal')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Run Chain! ▶️"
                  onPress={runChain}
                  disabled={!canRunChain()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Running Chain */}
        {step === 'running' && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4 items-center">
              <ActivityIndicator size="large" color="white" />
              <Text className="text-white text-xl font-bold mt-3">
                Running Chain...
              </Text>
              <Text className="text-green-100 mt-1">
                Step {currentStepIndex + 1} of {chain.steps.length}
              </Text>
            </View>

            {/* Visual Chain Progress */}
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              {chain.steps.map((s, index) => (
                <View key={s.id} className="mb-4 last:mb-0">
                  <View className="flex-row items-center mb-2">
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                      s.status === 'complete' ? 'bg-green-500' :
                      s.status === 'running' ? 'bg-yellow-500' :
                      'bg-slate-200'
                    }`}>
                      {s.status === 'complete' ? (
                        <Text className="text-white">✓</Text>
                      ) : s.status === 'running' ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-slate-500">{index + 1}</Text>
                      )}
                    </View>
                    <Text className={`flex-1 ${
                      s.status === 'complete' ? 'text-green-700' :
                      s.status === 'running' ? 'text-yellow-700' :
                      'text-slate-400'
                    }`}>
                      {s.prompt.slice(0, 40)}...
                    </Text>
                  </View>
                  {s.status !== 'pending' && index < chain.steps.length - 1 && (
                    <View className="ml-4 pl-3 border-l-2 border-green-300">
                      <Text className="text-green-600 text-sm">↓ Output passed to next step</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        {step === 'result' && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-white text-xl font-bold">Chain Complete!</Text>
            </View>

            {/* Explanation Toggle */}
            <Pressable
              onPress={() => setShowExplanation(!showExplanation)}
              className="bg-indigo-100 rounded-xl p-3 mb-4"
            >
              <Text className="text-indigo-700 text-center font-medium">
                🧠 {showExplanation ? 'Hide' : 'Show'} How It Worked
              </Text>
            </Pressable>

            {showExplanation && (
              <View className="bg-indigo-50 rounded-xl p-4 mb-4">
                <Text className="text-indigo-800 font-bold mb-2">Chain Power!</Text>
                <Text className="text-indigo-700 text-sm mb-2">
                  See how each step built on the previous one? That's the magic of chaining!
                </Text>
                <Text className="text-indigo-600 text-sm">
                  • Step 1 created the foundation
                  {'\n'}• Each following step used that foundation
                  {'\n'}• The final result is better than asking everything at once!
                </Text>
              </View>
            )}

            {/* Chain Results */}
            {chain.steps.map((s, index) => (
              <View key={s.id} className="mb-4">
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <View className="bg-purple-500 px-4 py-2 flex-row items-center">
                    <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-2">
                      <Text className="text-purple-500 font-bold text-sm">{index + 1}</Text>
                    </View>
                    <Text className="text-white font-medium flex-1" numberOfLines={1}>
                      {s.prompt}
                    </Text>
                  </View>
                  <View className="p-4">
                    <Text className="text-slate-700">{s.output}</Text>
                  </View>
                </View>
                {index < chain.steps.length - 1 && (
                  <View className="items-center my-2">
                    <Text className="text-green-500 text-lg">↓</Text>
                  </View>
                )}
              </View>
            ))}

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save Chain</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setChain({ type: '', goal: '', steps: [] });
                  setStep('type');
                }}
                className="flex-1 bg-purple-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">🔗 New Chain</Text>
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
      </View>
    </ScrollView>
  );
}
