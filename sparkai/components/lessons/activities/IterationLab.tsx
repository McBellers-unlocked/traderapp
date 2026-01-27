import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface IterationLabProps {
  title: string;
  projectTypes: string[];
  maxIterations?: number;
  showsVersionHistory?: boolean;
  onComplete?: () => void;
  onSave?: (project: any) => void;
}

interface Iteration {
  version: number;
  prompt: string;
  feedback: string;
  output: string;
  improvements: string[];
}

interface ProjectData {
  type: string;
  goal: string;
  iterations: Iteration[];
  currentPrompt: string;
}

export function IterationLab({
  title,
  projectTypes,
  maxIterations = 5,
  showsVersionHistory = true,
  onComplete,
  onSave,
}: IterationLabProps) {
  const [step, setStep] = useState<'intro' | 'type' | 'initial' | 'iterate' | 'history' | 'final'>('intro');
  const [project, setProject] = useState<ProjectData>({
    type: '',
    goal: '',
    iterations: [],
    currentPrompt: '',
  });
  const [feedback, setFeedback] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const projectInfo: Record<string, { emoji: string; desc: string; starterPrompt: string }> = {
    'story': {
      emoji: '📖',
      desc: 'Refine a story until it\'s perfect',
      starterPrompt: 'Write a short story about a kid who discovers they can talk to animals',
    },
    'art prompt': {
      emoji: '🎨',
      desc: 'Perfect an AI art description',
      starterPrompt: 'A magical forest with glowing mushrooms',
    },
    'explanation': {
      emoji: '💡',
      desc: 'Make an explanation clearer',
      starterPrompt: 'Explain how rainbows form',
    },
    'character': {
      emoji: '👤',
      desc: 'Develop a character in depth',
      starterPrompt: 'Create a young inventor character',
    },
    'poem': {
      emoji: '📝',
      desc: 'Polish a poem to perfection',
      starterPrompt: 'Write a poem about the ocean',
    },
  };

  const feedbackTypes = [
    { id: 'more_detail', label: 'Add more detail', emoji: '🔍' },
    { id: 'simpler', label: 'Make it simpler', emoji: '✨' },
    { id: 'more_fun', label: 'Make it more fun', emoji: '🎉' },
    { id: 'different_style', label: 'Try a different style', emoji: '🎨' },
    { id: 'longer', label: 'Make it longer', emoji: '📏' },
    { id: 'shorter', label: 'Make it shorter', emoji: '✂️' },
    { id: 'more_exciting', label: 'More exciting/dramatic', emoji: '⚡' },
    { id: 'custom', label: 'Custom feedback', emoji: '💬' },
  ];

  const generateOutput = async (prompt: string, version: number, previousOutput?: string, feedbackText?: string): Promise<string> => {
    // Generate contextual outputs based on project type and iteration
    const baseOutputs: Record<string, string[]> = {
      'story': [
        `Maya always thought the chirping outside her window was just noise. But on the morning of her 10th birthday, everything changed.

"Good morning, birthday girl!" said a cheerful voice.

Maya looked around. No one was there. Then she looked at the cardinal on her windowsill.

"Did you just... talk?" she whispered.

"Of course!" the bird chirped. "We've always talked. You're just finally listening!"

And that was the beginning of Maya's most extraordinary adventure.`,

        `Maya always thought the chirping outside her window was just noise. But on the morning of her 10th birthday, something magical awakened inside her.

"Good morning, birthday girl!" called a cheerful, melodic voice.

Maya's eyes flew open. Her room was empty, but sitting on her windowsill was a brilliant red cardinal, its head tilted curiously.

"Did you just... talk?" Maya whispered, her heart pounding.

"Of course I did, silly!" the bird chirped, ruffling its feathers proudly. "I'm Scarlet, and I've been waiting TEN WHOLE YEARS for you to hear me! Do you know how hard it is to have interesting things to say and no one listens?"

Maya couldn't help but giggle. A talking bird with attitude! Before she could respond, a squirrel popped up beside Scarlet.

"Is she finally awake? The whole forest has been buzzing about this!" the squirrel chattered excitedly.

Maya's birthday gift, she would soon discover, was the most extraordinary one of all—and it came with a responsibility she never expected.`,

        `On the morning of Maya's 10th birthday, the world revealed its biggest secret.

It started with a simple "Good morning, birthday girl!"

Maya's eyes snapped open. Her bedroom was quiet, except for the cardinal on her windowsill—a brilliant red bird that seemed to be WAITING for something.

"Did you just..." Maya started.

"Talk? Yes! Finally!" The cardinal hopped excitedly. "I'm Scarlet, and I've been practicing that greeting for a WEEK. The squirrels said I was being dramatic, but I said 'First impressions matter, Bernard!'"

A furry head popped up. "I stand by what I said," a gray squirrel muttered.

Maya burst out laughing. This was the strangest—and most AMAZING—birthday ever.

But her laughter faded when Scarlet's expression grew serious. "Maya, we didn't just come to say hello. The forest needs you. Something dark is coming, and you're the only human who can hear us, the only one who can help."

Maya looked at the worried faces of her new friends. She was only ten years old. But sometimes, she realized, the biggest adventures choose you—ready or not.

"Tell me everything," she said, climbing out of bed. "What do we need to do?"`,
      ],
      'art prompt': [
        `A magical forest with glowing mushrooms`,

        `A enchanted forest at twilight filled with bioluminescent mushrooms of various sizes. The mushrooms emit soft blue and purple light, illuminating the misty forest floor. Ancient twisted trees frame the scene, their bark covered in glowing moss. Fireflies dance through the air, creating trails of golden light. The atmosphere is peaceful and mysterious.`,

        `A breathtaking enchanted forest scene at the magical twilight hour, featuring an abundance of bioluminescent mushrooms ranging from tiny dots to massive toadstools the size of umbrellas. The mushrooms pulse with ethereal light in shades of sapphire blue, amethyst purple, and soft seafoam green, creating a rainbow of gentle illumination across the misty forest floor.

Ancient, wise trees with gnarled bark twist toward an indigo sky, their branches draped with luminescent moss that glows like captured starlight. A carpet of soft ferns and delicate flowers covers the ground, each petal catching and reflecting the mushroom light.

Hundreds of fireflies dance through the scene like living stars, their golden trails weaving between the trees. A gentle mist rolls through the forest, adding depth and mystery. In the distance, the silhouette of a deer stands alert, its eyes reflecting the magical glow.

Style: Studio Ghibli meets fantasy concept art, highly detailed, ethereal lighting, dreamlike atmosphere, 4K quality`,
      ],
      'explanation': [
        `Rainbows form when sunlight shines through water droplets in the air. The light bends and splits into different colors.`,

        `Rainbows are made when sunlight passes through tiny water droplets in the air (like after it rains).

Here's what happens:
1. Sunlight enters a water droplet
2. The light bends (this is called refraction)
3. The light bounces off the back of the droplet
4. The light bends again as it exits
5. Different colors bend at different angles, so they spread out!

That's why we see red at the top and violet at the bottom—each color bends a slightly different amount. You're basically seeing sunlight sorted by color!`,

        `🌈 **How Rainbows Form: A Magical Light Show!**

Imagine sunlight is like a team of superheroes, all running together. They look white, but secretly, they're made up of EVERY color!

**Step 1: The Splash!** ☔
When it rains (or there's mist), millions of tiny water droplets float in the air like invisible balloons.

**Step 2: The Sneak-In** 🔦
A beam of sunlight zooms into a water droplet. As it enters, it SLOWS DOWN and bends—kind of like how you slow down when running into a pool!

**Step 3: The Bounce!** 🏀
Inside the droplet, light hits the back wall and bounces, like a ball hitting a curved mirror.

**Step 4: The Great Escape** 🌟
When light exits the droplet, it bends AGAIN. But here's the magic: different colors bend different amounts!
- Red bends the least (lazy!)
- Violet bends the most (overachiever!)

**Step 5: The Rainbow!** 🌈
All these colors spread out in a beautiful arc. Each droplet sends one color to your eye, and MILLIONS of droplets create the full rainbow!

**Fun Facts:**
- Rainbows are actually full circles—we just see an arc because the ground is in the way!
- You'll never find the end of a rainbow—it moves with you!
- Double rainbows happen when light bounces TWICE inside the droplets!`,
      ],
      'character': [
        `Name: Finn
A young inventor who likes to build things.`,

        `**Name:** Finn Torres
**Age:** 11
**Appearance:** Messy brown hair always full of wood shavings, safety goggles pushed up on forehead, band-aids on fingers from various projects

**Personality:** Curious, determined, a bit scatterbrained. Gets so focused on inventions that he forgets to eat lunch. Talks to his creations like they're friends.

**Background:** Lives with his grandmother who runs a repair shop. Started inventing at age 6 when he fixed his broken toy robot with paperclips and gum.

**Current Project:** A mechanical bird that can deliver messages

**Favorite Saying:** "It's not broken, it just works differently than expected!"`,

        `# Finn Torres: The Backyard Inventor 🔧

## Basic Info
- **Full Name:** Finnegan "Finn" Torres
- **Age:** 11 years old
- **Birthday:** March 3rd (Pisces - the dreamer!)
- **Lives:** Above his grandmother's repair shop, "Abuela's Fix-It Palace"

## Appearance
Finn looks like his inventions exploded on him (because sometimes they do!):
- Messy brown hair that defies gravity, always decorated with wood shavings, wire bits, or the occasional gear
- Warm brown eyes behind smudged safety goggles (pushed up on his forehead 90% of the time)
- A collection of band-aids on his fingers—each one a badge of honor from a project
- Wears his dad's old work apron with pockets stuffed full of tools, nuts, bolts, and half-finished gadgets
- Paint-stained sneakers that light up (his own modification, naturally)

## Personality
**Strengths:**
- 🧠 Brilliant problem-solver ("Everything is just a puzzle waiting to be solved!")
- 💪 Incredibly persistent (failed 47 times on his flying machine—attempt 48 is coming!)
- 💛 Kind-hearted and always wants to help others with his inventions
- 🎨 Creative thinker who sees potential in "junk"

**Flaws:**
- 🌪️ Scatterbrained—forgets meals, homework, and sometimes his own name when focused
- 😬 His inventions don't always work as planned (the self-buttering toast machine was... messy)
- 📚 Struggles in regular school—his brain works differently than textbooks expect

## Backstory
Finn's dad was an inventor too, but he passed away when Finn was 6. His last gift to Finn was a broken toy robot. Young Finn spent weeks fixing it with paperclips, gum, and sheer determination—and when those robot eyes finally lit up, Finn knew he'd found his calling.

Now he lives with his Abuela Rosa, who runs the neighborhood repair shop. She's his biggest supporter, always saving "interesting junk" for his projects.

## Current Obsession
**Project 47-B: "Pip" the Messenger Bird**
A mechanical bird that can deliver messages across town! Current status: The wings work, the navigation works, but making them work TOGETHER is proving tricky...

## Favorite Things
- **Saying:** "It's not broken, it just works differently than expected!"
- **Food:** Abuela's empanadas (often eaten cold because he forgot about them while inventing)
- **Place:** His workshop in the garage, organized chaos style
- **Hero:** His dad, and also Nikola Tesla

## Secret Fear
That his inventions will never help anyone—that he's just making noise and messes instead of things that matter.

## Secret Strength
He doesn't know it yet, but his greatest invention won't be a machine—it'll be the friends he makes and the lives he touches along the way.`,
      ],
      'poem': [
        `The ocean is blue,
It has lots of fish too,
The waves go up and down,
Some fish are brown.`,

        `**Whispers of the Sea**

The ocean breathes in waves of blue,
A rhythm old yet always new.
It holds secrets deep below,
Stories only currents know.

Fish like rainbow ribbons glide,
Through the swaying kelp they hide.
Dolphins dance at break of day,
While silver moonbeams light their way.

The sea speaks soft to those who hear,
A voice of wonder, wild and clear.`,

        `**Song of the Infinite Sea** 🌊

The ocean is a living poem,
Written in waves upon the shore,
Each tide a verse, each foam a word,
In a story told forevermore.

She wears a gown of sapphire deep,
Embroidered with the sun's bright gold,
And when the storms come, wild and fierce,
She shows the strength that sailors hold.

*Beneath her surface, worlds exist—*
Cathedrals built of coral dreams,
Where fish like stained-glass windows swim
Through ancient underwater streams.

The whale sings ballads to the moon,
The dolphin laughs at dawn's first light,
The jellyfish waltz, ghostly pale,
Like lanterns floating through the night.

Oh, the sea! She calls to wanderers,
To dreamers standing on the sand,
She whispers tales of ships long lost
And treasures buried by her hand.

And when you press a shell to ear,
You'll hear her voice, both fierce and free—
The heartbeat of our ancient world:
*The endless, timeless, mighty sea.*

🐚 *Listen. Can you hear it too?*`,
      ],
    };

    const outputs = baseOutputs[project.type] || baseOutputs['story'];
    return outputs[Math.min(version, outputs.length - 1)];
  };

  const startProject = async () => {
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const output = await generateOutput(project.currentPrompt, 0);

      const firstIteration: Iteration = {
        version: 1,
        prompt: project.currentPrompt,
        feedback: 'Initial version',
        output,
        improvements: [],
      };

      setProject({
        ...project,
        iterations: [firstIteration],
      });
      setStep('iterate');
    } finally {
      setIsGenerating(false);
    }
  };

  const iterate = async () => {
    if (!feedback.trim()) return;

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const version = project.iterations.length + 1;
      const previousOutput = project.iterations[project.iterations.length - 1].output;
      const output = await generateOutput(project.currentPrompt, version - 1, previousOutput, feedback);

      const improvements = [
        feedback.includes('detail') ? 'Added more vivid descriptions' : null,
        feedback.includes('simpler') ? 'Simplified language and structure' : null,
        feedback.includes('fun') ? 'Added humor and playful elements' : null,
        feedback.includes('style') ? 'Changed the overall style and tone' : null,
        feedback.includes('longer') ? 'Expanded content and added new sections' : null,
        feedback.includes('shorter') ? 'Tightened prose and removed redundancy' : null,
        feedback.includes('exciting') ? 'Increased drama and tension' : null,
        'Incorporated your specific feedback',
      ].filter(Boolean) as string[];

      const newIteration: Iteration = {
        version,
        prompt: `${project.currentPrompt} [With feedback: ${feedback}]`,
        feedback,
        output,
        improvements,
      };

      setProject({
        ...project,
        iterations: [...project.iterations, newIteration],
      });
      setFeedback('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave?.(project);
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🔄</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <View className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 mb-4">
              <Text className="text-4xl text-center mb-3">🔄</Text>
              <Text className="text-white text-xl font-bold text-center mb-2">
                The Power of Iteration!
              </Text>
              <Text className="text-white/80 text-center">
                Great results come from refining, not from the first try!
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-bold text-slate-800 mb-3">What is Iteration?</Text>
              <Text className="text-slate-600 mb-4">
                Iteration means improving something step by step. Instead of expecting
                perfection on the first try, you:
              </Text>

              <View className="gap-3">
                <View className="flex-row items-center bg-orange-50 rounded-xl p-3">
                  <Text className="text-2xl mr-3">1️⃣</Text>
                  <Text className="text-orange-800 flex-1">Start with something basic</Text>
                </View>
                <View className="flex-row items-center bg-orange-50 rounded-xl p-3">
                  <Text className="text-2xl mr-3">2️⃣</Text>
                  <Text className="text-orange-800 flex-1">Look at what could be better</Text>
                </View>
                <View className="flex-row items-center bg-orange-50 rounded-xl p-3">
                  <Text className="text-2xl mr-3">3️⃣</Text>
                  <Text className="text-orange-800 flex-1">Ask AI to improve it</Text>
                </View>
                <View className="flex-row items-center bg-orange-50 rounded-xl p-3">
                  <Text className="text-2xl mr-3">4️⃣</Text>
                  <Text className="text-orange-800 flex-1">Repeat until it's amazing!</Text>
                </View>
              </View>
            </View>

            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <Text className="text-blue-800 font-bold mb-1">💡 Pro Secret:</Text>
              <Text className="text-blue-700 text-sm">
                Professional writers, artists, and coders ALL iterate. The first draft
                is never the final version. AI makes iteration super fast!
              </Text>
            </View>

            <Button
              title="Let's Iterate! 🔄"
              onPress={() => setStep('type')}
              size="lg"
            />
          </View>
        )}

        {/* Type Selection */}
        {step === 'type' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What will you iterate on?
            </Text>

            <View className="gap-3 mb-4">
              {projectTypes.map((type) => {
                const info = projectInfo[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setProject({
                        ...project,
                        type,
                        currentPrompt: info.starterPrompt,
                      });
                      setStep('initial');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200"
                  >
                    <View className="flex-row items-center">
                      <Text className="text-3xl mr-3">{info.emoji}</Text>
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 capitalize">{type}</Text>
                        <Text className="text-slate-500 text-sm">{info.desc}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={() => setStep('intro')} className="py-2">
              <Text className="text-indigo-600 text-center">← Back</Text>
            </Pressable>
          </View>
        )}

        {/* Initial Prompt */}
        {step === 'initial' && (
          <View>
            <View className="bg-orange-500 rounded-2xl p-4 mb-4">
              <Text className="text-3xl text-center mb-1">{projectInfo[project.type]?.emoji}</Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {project.type} Project
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Your starting prompt:</Text>
              <TextInput
                className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50 min-h-[100px]"
                placeholder="What do you want AI to create?"
                value={project.currentPrompt}
                onChangeText={(val) => setProject({ ...project, currentPrompt: val })}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="bg-amber-50 rounded-xl p-3 mb-4">
              <Text className="text-amber-700 text-sm">
                💡 <Text className="font-medium">Tip:</Text> Start simple! You'll make it better through iteration.
              </Text>
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
                  title="Generate V1! ✨"
                  onPress={startProject}
                  disabled={!project.currentPrompt.trim()}
                  loading={isGenerating}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Iteration View */}
        {step === 'iterate' && project.iterations.length > 0 && (
          <View>
            {/* Version Badge */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-orange-500 px-4 py-2 rounded-full">
                <Text className="text-white font-bold">
                  Version {project.iterations.length}
                </Text>
              </View>
              {showsVersionHistory && project.iterations.length > 1 && (
                <Pressable
                  onPress={() => setStep('history')}
                  className="bg-slate-200 px-4 py-2 rounded-full"
                >
                  <Text className="text-slate-700">📜 History</Text>
                </Pressable>
              )}
            </View>

            {/* Current Output */}
            <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
              <View className="bg-gradient-to-r from-orange-400 to-red-400 p-3">
                <Text className="text-white font-bold">
                  {projectInfo[project.type]?.emoji} Current Version
                </Text>
              </View>
              <View className="p-4">
                <Text className="text-slate-700 leading-6">
                  {project.iterations[project.iterations.length - 1].output}
                </Text>
              </View>
            </View>

            {/* Improvements Made */}
            {project.iterations.length > 1 && (
              <View className="bg-green-50 rounded-xl p-4 mb-4">
                <Text className="font-bold text-green-800 mb-2">✨ What Changed:</Text>
                {project.iterations[project.iterations.length - 1].improvements.map((imp, i) => (
                  <Text key={i} className="text-green-700 text-sm">• {imp}</Text>
                ))}
              </View>
            )}

            {/* Iteration Controls */}
            {project.iterations.length < maxIterations ? (
              <View>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <Text className="font-semibold text-slate-700 mb-3">
                    How should we improve it?
                  </Text>

                  {/* Quick Feedback Buttons */}
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {feedbackTypes.slice(0, 6).map((type) => (
                      <Pressable
                        key={type.id}
                        onPress={() => setFeedback(type.label)}
                        className={`flex-row items-center px-3 py-2 rounded-full border-2 ${
                          feedback === type.label
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Text className="mr-1">{type.emoji}</Text>
                        <Text className={`text-sm ${
                          feedback === type.label ? 'text-orange-700' : 'text-slate-600'
                        }`}>
                          {type.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Custom Feedback */}
                  <TextInput
                    className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                    placeholder="Or write your own feedback..."
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                  />

                  {/* Tips Toggle */}
                  <Pressable
                    onPress={() => setShowTips(!showTips)}
                    className="mt-3"
                  >
                    <Text className="text-orange-600 text-center text-sm">
                      💡 {showTips ? 'Hide' : 'Show'} feedback tips
                    </Text>
                  </Pressable>

                  {showTips && (
                    <View className="bg-amber-50 rounded-lg p-3 mt-2">
                      <Text className="text-amber-800 text-sm font-medium mb-1">Great feedback is specific:</Text>
                      <Text className="text-amber-700 text-xs">
                        ❌ "Make it better"{'\n'}
                        ✅ "Add more dialogue between Maya and the bird"{'\n'}
                        ✅ "Make the ending more surprising"{'\n'}
                        ✅ "Describe what the forest looks like"
                      </Text>
                    </View>
                  )}
                </View>

                <Button
                  title={`Iterate → V${project.iterations.length + 1}`}
                  onPress={iterate}
                  disabled={!feedback.trim()}
                  loading={isGenerating}
                  size="lg"
                />
              </View>
            ) : (
              <View className="bg-purple-50 rounded-xl p-4 mb-4">
                <Text className="text-purple-800 font-bold text-center">
                  🎉 Maximum iterations reached!
                </Text>
                <Text className="text-purple-700 text-center text-sm mt-1">
                  Look how much better it got from V1 to V{maxIterations}!
                </Text>
              </View>
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
                onPress={() => setStep('final')}
                className="flex-1 bg-purple-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">📊 See Progress</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* History View */}
        {step === 'history' && (
          <View>
            <View className="bg-slate-800 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                📜 Version History
              </Text>
            </View>

            {project.iterations.map((iter, i) => (
              <View key={i} className="mb-4">
                <Pressable
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <View className={`p-3 ${i === project.iterations.length - 1 ? 'bg-orange-500' : 'bg-slate-400'}`}>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white font-bold">Version {iter.version}</Text>
                      {i === project.iterations.length - 1 && (
                        <Text className="text-white text-xs bg-white/20 px-2 py-1 rounded">Current</Text>
                      )}
                    </View>
                    <Text className="text-white/80 text-xs mt-1">
                      Feedback: {iter.feedback}
                    </Text>
                  </View>
                  <View className="p-4">
                    <Text className="text-slate-600 text-sm" numberOfLines={4}>
                      {iter.output}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}

            <Button
              title="← Back to Editing"
              onPress={() => setStep('iterate')}
              size="lg"
            />
          </View>
        )}

        {/* Final Summary */}
        {step === 'final' && (
          <View>
            <View className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 mb-4 items-center">
              <Text className="text-4xl mb-2">🏆</Text>
              <Text className="text-white text-xl font-bold">
                {project.iterations.length} Iterations Complete!
              </Text>
            </View>

            {/* Before & After */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-bold text-slate-800 mb-3 text-center">
                📈 Your Progress
              </Text>

              <View className="flex-row gap-2">
                <View className="flex-1 bg-red-50 rounded-xl p-3">
                  <Text className="text-red-800 font-bold text-xs mb-1">V1 (Start)</Text>
                  <Text className="text-red-700 text-xs" numberOfLines={6}>
                    {project.iterations[0]?.output}
                  </Text>
                </View>
                <View className="flex-1 bg-green-50 rounded-xl p-3">
                  <Text className="text-green-800 font-bold text-xs mb-1">
                    V{project.iterations.length} (Final)
                  </Text>
                  <Text className="text-green-700 text-xs" numberOfLines={6}>
                    {project.iterations[project.iterations.length - 1]?.output}
                  </Text>
                </View>
              </View>
            </View>

            {/* All Feedback Given */}
            <View className="bg-indigo-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-indigo-800 mb-2">📝 Feedback You Gave:</Text>
              {project.iterations.slice(1).map((iter, i) => (
                <View key={i} className="flex-row items-start mb-2">
                  <Text className="text-indigo-600 mr-2">V{i + 2}:</Text>
                  <Text className="text-indigo-700 flex-1 text-sm">{iter.feedback}</Text>
                </View>
              ))}
            </View>

            {/* Key Learning */}
            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-2">🧠 What You Learned:</Text>
              <Text className="text-amber-700 text-sm">
                Each piece of feedback made the result better! This is the secret of
                working with AI - you're the creative director, guiding AI to create
                exactly what you want through iteration.
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={() => setStep('iterate')}
                className="flex-1 bg-orange-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">🔄 Keep Iterating</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save Final</Text>
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
