import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface CapstoneProjectProps {
  title: string;
  projectOptions: string[];
  showsSkillsUsed?: boolean;
  canShare?: boolean;
  onComplete?: () => void;
  onSave?: (project: any) => void;
}

interface ProjectPhase {
  id: string;
  name: string;
  emoji: string;
  skill: string;
  description: string;
  complete: boolean;
  output?: string;
}

interface CapstoneData {
  projectType: string;
  title: string;
  description: string;
  phases: ProjectPhase[];
  reflection: string;
}

export function CapstoneProject({
  title,
  projectOptions,
  showsSkillsUsed = true,
  canShare = true,
  onComplete,
  onSave,
}: CapstoneProjectProps) {
  const [step, setStep] = useState<'intro' | 'select' | 'plan' | 'build' | 'reflect' | 'showcase'>('intro');
  const [project, setProject] = useState<CapstoneData>({
    projectType: '',
    title: '',
    description: '',
    phases: [],
    reflection: '',
  });
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseInput, setPhaseInput] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const projectInfo: Record<string, { emoji: string; desc: string; phases: Omit<ProjectPhase, 'complete' | 'output'>[] }> = {
    'dream app': {
      emoji: '📱',
      desc: 'Design your dream app from idea to mockup!',
      phases: [
        { id: 'idea', name: 'Brainstorm Ideas', emoji: '💡', skill: 'Creative Prompting', description: 'Use AI to brainstorm app ideas and pick your favorite' },
        { id: 'features', name: 'Plan Features', emoji: '📋', skill: 'Prompt Chaining', description: 'Chain prompts to design all your app features' },
        { id: 'design', name: 'Design Screens', emoji: '🎨', skill: 'Art Generation', description: 'Create visual designs for your app screens' },
        { id: 'pitch', name: 'Create Pitch', emoji: '🎤', skill: 'Iteration', description: 'Iterate on a pitch that explains your app to others' },
      ],
    },
    'mini business': {
      emoji: '💼',
      desc: 'Plan a creative business from scratch!',
      phases: [
        { id: 'concept', name: 'Business Concept', emoji: '🌟', skill: 'Persona Prompting', description: 'Use different AI personas to explore business ideas' },
        { id: 'branding', name: 'Create Branding', emoji: '🎨', skill: 'Art Generation', description: 'Design a logo and brand colors' },
        { id: 'website', name: 'Plan Website', emoji: '🌐', skill: 'Prompt Chaining', description: 'Chain prompts to plan your whole website' },
        { id: 'marketing', name: 'Marketing Plan', emoji: '📣', skill: 'Iteration', description: 'Iterate on your marketing messages' },
      ],
    },
    'interactive story': {
      emoji: '📚',
      desc: 'Create an amazing choose-your-own-adventure!',
      phases: [
        { id: 'world', name: 'Build the World', emoji: '🌍', skill: 'Creative Prompting', description: 'Use AI to create your story world' },
        { id: 'characters', name: 'Create Characters', emoji: '👥', skill: 'Persona Prompting', description: 'Design unique characters with AI personas' },
        { id: 'branches', name: 'Plot Branches', emoji: '🔀', skill: 'Prompt Chaining', description: 'Chain prompts to create story branches' },
        { id: 'polish', name: 'Polish Writing', emoji: '✨', skill: 'Iteration', description: 'Iterate to make your story shine' },
      ],
    },
    'educational game': {
      emoji: '🎮',
      desc: 'Design a game that teaches something!',
      phases: [
        { id: 'topic', name: 'Choose Topic', emoji: '📖', skill: 'Research Prompting', description: 'Use AI to explore educational topics' },
        { id: 'mechanics', name: 'Game Mechanics', emoji: '⚙️', skill: 'Creative Prompting', description: 'Design how your game works' },
        { id: 'content', name: 'Create Content', emoji: '📝', skill: 'Prompt Chaining', description: 'Chain prompts to create questions and levels' },
        { id: 'visual', name: 'Visual Design', emoji: '🎨', skill: 'Art Generation', description: 'Design your game visuals' },
      ],
    },
    'community helper': {
      emoji: '🤝',
      desc: 'Plan a project to help your community!',
      phases: [
        { id: 'problem', name: 'Find a Problem', emoji: '🔍', skill: 'Research Prompting', description: 'Use AI to identify community needs' },
        { id: 'solution', name: 'Design Solution', emoji: '💡', skill: 'Creative Prompting', description: 'Brainstorm creative solutions with AI' },
        { id: 'plan', name: 'Action Plan', emoji: '📋', skill: 'Prompt Chaining', description: 'Chain prompts to create your full plan' },
        { id: 'present', name: 'Create Presentation', emoji: '🎤', skill: 'Iteration', description: 'Iterate on your presentation' },
      ],
    },
  };

  const skillsLearned = [
    { name: 'Creative Prompting', emoji: '💡', desc: 'Crafting prompts that spark creativity' },
    { name: 'Prompt Chaining', emoji: '🔗', desc: 'Building complex results step by step' },
    { name: 'Persona Prompting', emoji: '🎭', desc: 'Getting different perspectives from AI' },
    { name: 'Iteration', emoji: '🔄', desc: 'Refining until it\'s perfect' },
    { name: 'Art Generation', emoji: '🎨', desc: 'Creating visuals with AI' },
    { name: 'Research Prompting', emoji: '🔬', desc: 'Learning and exploring topics' },
  ];

  const initializeProject = (type: string) => {
    const info = projectInfo[type];
    const phases: ProjectPhase[] = info.phases.map(p => ({
      ...p,
      complete: false,
    }));

    setProject({
      ...project,
      projectType: type,
      phases,
    });
    setStep('plan');
  };

  const generatePhaseOutput = async (phase: ProjectPhase, input: string): Promise<string> => {
    // Simulate AI work
    await new Promise(resolve => setTimeout(resolve, 2000));

    const outputs: Record<string, Record<string, string>> = {
      'dream app': {
        idea: `🌟 **App Concept: "${project.title || 'Your Amazing App'}"**\n\n${input}\n\n**AI Enhancement:**\nThis is a fantastic idea! Here are some thoughts:\n• Target audience: Kids aged 8-14 who love creativity\n• Core value: Makes ${input.toLowerCase().includes('learn') ? 'learning' : 'creating'} fun and accessible\n• Unique angle: Nothing quite like this exists yet!\n\n**Next steps:** Let's plan out the key features!`,
        features: `📋 **Feature Plan for ${project.title || 'Your App'}**\n\nBased on your input: "${input}"\n\n**Core Features:**\n1. 🎯 Main Feature - ${input.split(' ').slice(0, 3).join(' ')}\n2. 👤 User Profiles - Personalized experience\n3. 🏆 Progress Tracking - Gamified achievements\n4. 🎨 Creative Tools - Easy-to-use creation suite\n5. 🤝 Sharing - Show off creations to friends\n\n**Nice-to-Have:**\n• Daily challenges\n• Collaboration mode\n• AI assistant helper`,
        design: `🎨 **Design Concept**\n\n"${input}"\n\n**Visual Style:**\n• Color palette: Bright, friendly, energetic\n• Typography: Playful but readable\n• Icons: Rounded, fun, kid-friendly\n\n**Screen Layouts:**\n1. 🏠 Home - Big, colorful tiles for main features\n2. ✨ Create - Clean workspace with floating tools\n3. 🏆 Progress - Gamified dashboard with badges\n4. 👤 Profile - Avatar customization & achievements\n\n**Design Tip:** Keep buttons big and colorful for easy tapping!`,
        pitch: `🎤 **Your App Pitch**\n\n"${input}"\n\n---\n\n**[REFINED PITCH]**\n\n🚀 **Introducing ${project.title || 'Your Amazing App'}!**\n\nEver wished ${project.description || 'there was an easier way'}? We did too!\n\n**The Problem:** Kids want to be creative but need fun, safe tools.\n\n**Our Solution:** ${project.title || 'This app'} makes it easy and FUN to create amazing things!\n\n**Why It's Special:**\n✨ Kid-designed, kid-approved\n✨ Learn while you create\n✨ Share with friends safely\n\n**Our Vision:** A world where every kid can bring their imagination to life!\n\n*Ready to change the world, one creation at a time?*`,
      },
      'mini business': {
        concept: `💼 **Business Concept**\n\n"${input}"\n\n**Business Idea:**\nName: ${project.title || 'Your Business'}\nType: Creative services for kids\n\n**Value Proposition:**\nWe help ${input.toLowerCase().includes('kids') || input.toLowerCase().includes('children') ? 'kids' : 'people'} by ${project.description || 'providing amazing value'}!\n\n**Target Market:**\n• Primary: Kids aged 8-14\n• Secondary: Parents looking for creative activities\n\n**Revenue Ideas:**\n• Subscription boxes\n• Digital products\n• Workshops`,
        branding: `🎨 **Brand Identity**\n\n"${input}"\n\n**Logo Concept:**\n${project.title || 'Your Business'} - Fun, memorable, unique!\n\n**Color Palette:**\n• Primary: Bright ${input.toLowerCase().includes('calm') ? 'blue' : 'orange'} (energy!)\n• Secondary: ${input.toLowerCase().includes('nature') ? 'Green' : 'Purple'} (creativity!)\n• Accent: Gold (achievement!)\n\n**Brand Voice:**\n• Friendly and encouraging\n• Fun but trustworthy\n• Empowering for kids\n\n**Tagline Ideas:**\n• "Create. Dream. Achieve!"\n• "Where Ideas Come to Life"\n• "Made BY Kids, FOR Kids"`,
        website: `🌐 **Website Plan**\n\n"${input}"\n\n**Pages:**\n1. 🏠 **Home**\n   - Hero section with fun animation\n   - "What We Do" quick intro\n   - Featured creations\n\n2. 📦 **Products/Services**\n   - Clear, visual product cards\n   - Easy-to-understand pricing\n   - "Start Creating" CTA\n\n3. 👋 **About Us**\n   - Our story\n   - The team\n   - Our mission\n\n4. 📧 **Contact**\n   - Simple form\n   - FAQ section\n   - Social links\n\n**Key Feature:** Showcase gallery of customer creations!`,
        marketing: `📣 **Marketing Plan**\n\n"${input}"\n\n**Polished Message:**\n"${project.title || 'We'} believe every kid is creative - we just give them the tools to prove it!"\n\n**Marketing Channels:**\n1. 📱 Social Media\n   - Fun, shareable content\n   - User creations spotlight\n   - Behind-the-scenes\n\n2. 🎬 Video Content\n   - Tutorial videos\n   - Customer stories\n   - Live streams\n\n3. 🤝 Partnerships\n   - Schools\n   - Libraries\n   - Kid influencers\n\n**First Campaign:**\n"Show Us What You Made!" - Share contest with prizes`,
      },
      'interactive story': {
        world: `🌍 **Story World**\n\n"${input}"\n\n**World Description:**\n${project.title || 'Your world'} is a place where ${project.description || 'amazing things happen'}.\n\n**Setting Details:**\n• Time: A magical era where ${input.toLowerCase().includes('future') ? 'technology and magic coexist' : 'imagination shapes reality'}\n• Location: ${input.toLowerCase().includes('underwater') ? 'An underwater kingdom' : input.toLowerCase().includes('space') ? 'A starship academy' : 'A hidden realm'}\n• Rules: In this world, ${input.toLowerCase().includes('power') ? 'everyone has a unique power' : 'anything imagined can become real'}\n\n**Unique Element:**\nWhat makes this world special is that ${input.split(' ').slice(-5).join(' ')}...\n\n**Atmosphere:**\nThe feeling is ${input.toLowerCase().includes('dark') ? 'mysterious and exciting' : 'warm, adventurous, and full of wonder'}`,
        characters: `👥 **Characters**\n\n"${input}"\n\n**Main Character:**\nName: [Reader chooses!]\nAge: 12\nTrait: ${input.toLowerCase().includes('brave') ? 'Courageous' : 'Curious'} and kind\nSecret: Has a hidden ${input.toLowerCase().includes('power') ? 'power' : 'talent'} they don't know about yet\n\n**Best Friend:**\nName: River\nPersonality: Loyal, funny, sometimes nervous\nRole: Provides comic relief and emotional support\n\n**Mentor:**\nName: The Keeper\nPersonality: Wise, mysterious, knows more than they say\nRole: Guides the hero when needed\n\n**Antagonist:**\nName: The Shadow\nMotivation: ${input.toLowerCase().includes('evil') ? 'Power' : 'Thinks they\'re doing the right thing'}\nComplexity: Not purely evil - has understandable reasons`,
        branches: `🔀 **Story Branches**\n\n"${input}"\n\n**Chapter 1: The Discovery**\n→ Path A: Investigate alone (leads to early revelation)\n→ Path B: Get friends involved (builds team)\n\n**Chapter 2: First Challenge**\n→ Path A: Face it head-on (action sequence)\n→ Path B: Find another way (puzzle sequence)\n\n**Chapter 3: The Truth**\n→ Path A: Trust the mentor (easier but less reward)\n→ Path B: Question everything (harder but more discovery)\n\n**Chapter 4: Final Choice**\n→ Path A: Heroic sacrifice\n→ Path B: Clever solution\n→ Path C: Unexpected alliance\n\n**Endings:** 5 possible endings based on choices!\n• Golden: Best outcome, all objectives achieved\n• Happy: Good ending, some mysteries remain\n• Bittersweet: Victory with cost\n• Mysterious: Sets up sequel\n• Twist: Everything changes!`,
        polish: `✨ **Polished Writing**\n\n"${input}"\n\n---\n\n**[POLISHED OPENING]**\n\nThe day everything changed started like any other.\n\nSunlight streamed through your window, dust motes dancing in the golden beams. Outside, birds sang their morning songs, completely unaware that in just a few hours, nothing would ever be the same.\n\nYou stretched, yawned, and that's when you noticed it - a faint shimmer in the corner of your room, like heat rising from summer pavement, but shaped like... a doorway?\n\n*This is where your adventure begins. But the question is: what will YOU do?*\n\n**→ Approach the shimmer carefully**\n**→ Call for someone else**\n**→ Pretend you didn't see it**\n\n---\n\nThe writing now has:\n✅ Sensory details\n✅ Building tension\n✅ Reader engagement\n✅ Clear choices`,
      },
      'educational game': {
        topic: `📖 **Educational Topic**\n\n"${input}"\n\n**Topic: ${project.title || 'Your Educational Topic'}**\n\n**Why This Topic:**\n${project.description || 'This is important for kids to learn'} because:\n• It connects to everyday life\n• It builds critical thinking\n• It's actually fascinating when presented right!\n\n**Key Learning Goals:**\n1. Understand the basics\n2. Apply knowledge to real situations\n3. Think critically about the topic\n4. Have FUN while learning!\n\n**Fun Angle:**\nWe'll make it engaging by ${input.toLowerCase().includes('story') ? 'weaving it into an adventure' : 'turning concepts into challenges'}!`,
        mechanics: `⚙️ **Game Mechanics**\n\n"${input}"\n\n**Core Gameplay Loop:**\n1. 📚 Learn - Brief, fun concept introduction\n2. 🎯 Challenge - Apply what you learned\n3. ⭐ Reward - Earn points, badges, progress\n4. 🔄 Repeat - New concept, harder challenges\n\n**Game Elements:**\n• **Lives/Hearts:** ${input.toLowerCase().includes('forgiving') ? '5 lives, slow regeneration' : '3 lives, earn more through streaks'}\n• **Progression:** ${input.toLowerCase().includes('level') ? 'Level-based with boss challenges' : 'Open world exploration'}\n• **Multiplayer:** ${input.toLowerCase().includes('compete') ? 'Head-to-head battles' : 'Cooperative challenges'}\n\n**Unique Mechanic:**\n"${input.split(' ').slice(0, 4).join(' ')}" - This makes our game special!\n\n**Difficulty Curve:**\nStarts easy, gradually increases, always feels achievable!`,
        content: `📝 **Game Content**\n\n"${input}"\n\n**Level 1: Introduction**\nQuestions: 5 easy ones to build confidence\nConcept: Basic understanding\nReward: "First Steps" badge\n\n**Level 2: Building Blocks**\nQuestions: 8 medium difficulty\nConcept: Connecting ideas\nReward: "Quick Learner" badge\n\n**Level 3: Application**\nQuestions: 10 with scenarios\nConcept: Real-world use\nReward: "Problem Solver" badge\n\n**Level 4: Challenge Zone**\nQuestions: 12 tricky ones\nConcept: Deep understanding\nReward: "Expert" badge\n\n**Boss Level:**\n"The Ultimate Test" - Combines everything!\nReward: "Master" badge + unlock bonus content\n\n**Sample Question:**\n"${input.includes('?') ? input : 'Based on what you learned, what would happen if...?'}"`,
        visual: `🎨 **Visual Design**\n\n"${input}"\n\n**Art Style:**\n${input.toLowerCase().includes('realistic') ? 'Semi-realistic with cartoon touches' : 'Colorful cartoon style, friendly and inviting'}\n\n**Character Design:**\n• Guide Character: Friendly, animated mascot\n• Player Avatar: Customizable, expressive\n• NPCs: Diverse, relatable characters\n\n**Environment:**\n• Background: ${input.toLowerCase().includes('nature') ? 'Nature-themed world' : 'Colorful learning spaces'}\n• Effects: Celebration particles, progress animations\n• UI: Big buttons, clear icons, readable text\n\n**Key Screens:**\n1. 🏠 Main Menu - Inviting, easy to navigate\n2. 📚 Lesson - Clean, focused, distraction-free\n3. 🎯 Challenge - Exciting, game-like atmosphere\n4. 🏆 Results - Celebratory, encouraging\n\n**Animation:**\n• Smooth transitions\n• Fun micro-interactions\n• Rewarding feedback animations`,
      },
      'community helper': {
        problem: `🔍 **Community Problem**\n\n"${input}"\n\n**Problem Identified:**\n${project.title || 'The Challenge'}: ${project.description || input}\n\n**Research Findings:**\n• Who is affected: ${input.toLowerCase().includes('kids') ? 'Children in the community' : 'Many community members'}\n• How many: Potentially dozens to hundreds\n• Current solutions: ${input.toLowerCase().includes('none') ? 'Very limited options exist' : 'Some efforts, but more help needed'}\n\n**Why It Matters:**\n"${input}" - This affects real people every day!\n\n**Voices from the Community:**\n• "I wish someone would help with this..."\n• "It's been a problem for too long..."\n• "If only there was a way..."\n\n**Your Mission:**\nBe the change you want to see! 💪`,
        solution: `💡 **Solution Design**\n\n"${input}"\n\n**Our Solution: ${project.title || 'The Helper Project'}**\n\n**How It Works:**\n${input}\n\n**Key Components:**\n1. 🎯 **Core Action:** Direct help to those in need\n2. 🤝 **Community Involvement:** Everyone can participate\n3. 📈 **Measurable Impact:** We'll track our success\n4. ♻️ **Sustainability:** Built to last\n\n**What Makes It Special:**\n• Kid-led initiative\n• Simple to participate\n• Real, visible impact\n• Fun to be part of!\n\n**Resources Needed:**\n• Volunteers: 5-10 to start\n• Supplies: Basic materials\n• Support: Adult supervision\n• Time: 2-4 hours per week\n\n**Expected Impact:**\nHelp ${input.toLowerCase().includes('hundred') ? 'hundreds' : 'dozens'} of people in our first month!`,
        plan: `📋 **Action Plan**\n\n"${input}"\n\n**PHASE 1: Preparation (Week 1)**\n☐ Recruit 5 volunteers\n☐ Get adult sponsor\n☐ Gather initial supplies\n☐ Create sign-up system\n\n**PHASE 2: Launch (Week 2)**\n☐ Host kick-off meeting\n☐ Assign roles\n☐ Complete first action\n☐ Document with photos\n\n**PHASE 3: Grow (Weeks 3-4)**\n☐ Expand volunteer base\n☐ Increase scope\n☐ Share success stories\n☐ Adjust based on feedback\n\n**PHASE 4: Sustain (Ongoing)**\n☐ Weekly activities\n☐ Monthly celebrations\n☐ Quarterly goals\n☐ Annual review\n\n**Key Milestones:**\n🏁 Week 1: Team assembled\n🏁 Week 2: First impact made\n🏁 Month 1: 50+ people helped\n🏁 Month 3: Self-sustaining program`,
        present: `🎤 **Presentation**\n\n"${input}"\n\n---\n\n**[YOUR POLISHED PRESENTATION]**\n\n# ${project.title || 'Our Community Project'} 🌟\n\n## The Problem 😔\nIn our community, ${project.description || 'people need help'}.\n\n## Our Solution 💡\nWe're going to ${input.split(' ').slice(0, 8).join(' ')}!\n\n## How YOU Can Help 🤝\n1. Volunteer your time\n2. Spread the word\n3. Donate supplies\n4. Just show up!\n\n## Our Goal 🎯\nHelp [number] people by [date]!\n\n## Why It Matters ❤️\n"When we help others, we help ourselves."\n\nEvery small action creates ripples of change.\n\n## Join Us! 🚀\nTogether, we can make our community better!\n\n*Questions?*\n\n---\n\n✨ Presentation ready for your class, family, or community meeting!`,
      },
    };

    return outputs[project.projectType]?.[phase.id] || `Great work on this phase! Here's what AI created based on your input:\n\n"${input}"\n\n✨ This builds perfectly on what you've done so far!`;
  };

  const completePhase = async () => {
    if (!phaseInput.trim()) return;

    setIsWorking(true);

    try {
      const phase = project.phases[currentPhase];
      const output = await generatePhaseOutput(phase, phaseInput);

      const updatedPhases = [...project.phases];
      updatedPhases[currentPhase] = {
        ...phase,
        complete: true,
        output,
      };

      setProject({ ...project, phases: updatedPhases });
      setPhaseInput('');

      if (currentPhase < project.phases.length - 1) {
        setCurrentPhase(currentPhase + 1);
      } else {
        setStep('reflect');
      }
    } finally {
      setIsWorking(false);
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
          <Text className="text-3xl mb-2">🏆</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Intro */}
        {step === 'intro' && (
          <View>
            <View className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 mb-4">
              <Text className="text-4xl text-center mb-3">🎓</Text>
              <Text className="text-white text-xl font-bold text-center mb-2">
                Capstone Project Time!
              </Text>
              <Text className="text-white/90 text-center">
                You've learned SO much! Now let's put it ALL together.
              </Text>
            </View>

            {showsSkillsUsed && (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                <Text className="font-bold text-slate-800 mb-3">🛠️ Skills You'll Use:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {skillsLearned.map((skill, i) => (
                    <View
                      key={i}
                      className="flex-row items-center bg-indigo-50 px-3 py-2 rounded-full"
                    >
                      <Text className="mr-1">{skill.emoji}</Text>
                      <Text className="text-indigo-700 text-sm">{skill.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="bg-purple-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-purple-800 mb-2">🌟 What You'll Create:</Text>
              <Text className="text-purple-700">
                A complete project that uses everything you've learned about prompting AI.
                You'll brainstorm, design, iterate, and polish until you have something
                amazing to share!
              </Text>
            </View>

            <Button
              title="Choose Your Project! 🚀"
              onPress={() => setStep('select')}
              size="lg"
            />
          </View>
        )}

        {/* Project Selection */}
        {step === 'select' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              Which project excites you most?
            </Text>

            <View className="gap-3 mb-4">
              {projectOptions.map((type) => {
                const info = projectInfo[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => initializeProject(type)}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200"
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">{info.emoji}</Text>
                      <View className="flex-1">
                        <Text className="font-bold text-slate-800 capitalize">{type}</Text>
                        <Text className="text-slate-500 text-sm">{info.desc}</Text>
                      </View>
                    </View>
                    <View className="flex-row flex-wrap gap-1 mt-2">
                      {info.phases.map((phase, i) => (
                        <View key={i} className="bg-slate-100 px-2 py-1 rounded">
                          <Text className="text-slate-600 text-xs">{phase.emoji} {phase.name}</Text>
                        </View>
                      ))}
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

        {/* Project Planning */}
        {step === 'plan' && (
          <View>
            <View className="bg-indigo-500 rounded-2xl p-4 mb-4">
              <Text className="text-3xl text-center mb-1">{projectInfo[project.projectType]?.emoji}</Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {project.projectType}
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Project Title:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 text-lg"
                placeholder="Give your project an awesome name!"
                value={project.title}
                onChangeText={(val) => setProject({ ...project, title: val })}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">What's it about?</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                placeholder="Describe your project idea..."
                value={project.description}
                onChangeText={(val) => setProject({ ...project, description: val })}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Phase Preview */}
            <View className="bg-slate-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-slate-800 mb-2">📍 Your Journey:</Text>
              {project.phases.map((phase, i) => (
                <View key={i} className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-indigo-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold text-sm">{i + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-medium">{phase.emoji} {phase.name}</Text>
                    <Text className="text-slate-500 text-xs">Skill: {phase.skill}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="Start Building! 🔨"
              onPress={() => setStep('build')}
              disabled={!project.title.trim() || !project.description.trim()}
              size="lg"
            />
          </View>
        )}

        {/* Building Phases */}
        {step === 'build' && (
          <View>
            {/* Progress */}
            <View className="flex-row justify-center gap-2 mb-4">
              {project.phases.map((phase, i) => (
                <View
                  key={i}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    phase.complete
                      ? 'bg-green-500'
                      : i === currentPhase
                      ? 'bg-indigo-500'
                      : 'bg-slate-200'
                  }`}
                >
                  {phase.complete ? (
                    <Text className="text-white">✓</Text>
                  ) : (
                    <Text className={i <= currentPhase ? 'text-white' : 'text-slate-500'}>
                      {phase.emoji}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Current Phase */}
            <View className="bg-indigo-600 rounded-2xl p-4 mb-4">
              <Text className="text-white/80 text-sm">
                Phase {currentPhase + 1} of {project.phases.length}
              </Text>
              <Text className="text-white text-xl font-bold">
                {project.phases[currentPhase].emoji} {project.phases[currentPhase].name}
              </Text>
              <Text className="text-indigo-200 mt-1">
                {project.phases[currentPhase].description}
              </Text>
              <View className="bg-white/20 px-3 py-1 rounded-full mt-2 self-start">
                <Text className="text-white text-xs">
                  Using: {project.phases[currentPhase].skill}
                </Text>
              </View>
            </View>

            {/* Previous Phase Output */}
            {currentPhase > 0 && project.phases[currentPhase - 1].output && (
              <View className="bg-green-50 rounded-xl p-4 mb-4">
                <Text className="font-bold text-green-800 mb-2">
                  ✅ From Previous Phase:
                </Text>
                <Text className="text-green-700 text-sm" numberOfLines={4}>
                  {project.phases[currentPhase - 1].output}
                </Text>
              </View>
            )}

            {/* Input */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Your Input:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[120px]"
                placeholder={`What do you want AI to help with for "${project.phases[currentPhase].name}"?`}
                value={phaseInput}
                onChangeText={setPhaseInput}
                multiline
                textAlignVertical="top"
              />
            </View>

            <Button
              title={isWorking ? "Working..." : `Complete Phase ${currentPhase + 1} →`}
              onPress={completePhase}
              disabled={!phaseInput.trim() || isWorking}
              loading={isWorking}
              size="lg"
            />

            {/* Phase Output Preview */}
            {project.phases[currentPhase].output && (
              <View className="bg-slate-800 rounded-xl p-4 mt-4">
                <Text className="text-green-400 font-bold mb-2">✨ Phase Complete:</Text>
                <Text className="text-slate-300 text-sm">
                  {project.phases[currentPhase].output}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Reflection */}
        {step === 'reflect' && (
          <View>
            <View className="bg-purple-500 rounded-2xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-white text-xl font-bold">All Phases Complete!</Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                🪞 Reflect on Your Journey:
              </Text>
              <TextInput
                className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50 min-h-[120px]"
                placeholder="What did you learn? What was challenging? What are you proud of?"
                value={project.reflection}
                onChangeText={(val) => setProject({ ...project, reflection: val })}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-2">💡 Reflection Prompts:</Text>
              <Text className="text-amber-700 text-sm">
                • Which AI skill did you use most?{'\n'}
                • What surprised you about working with AI?{'\n'}
                • How could you use these skills in real life?{'\n'}
                • What would you do differently next time?
              </Text>
            </View>

            <Button
              title="See My Showcase! 🌟"
              onPress={() => setStep('showcase')}
              disabled={!project.reflection.trim()}
              size="lg"
            />
          </View>
        )}

        {/* Showcase */}
        {step === 'showcase' && (
          <View>
            <View className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-1 mb-4">
              <View className="bg-white rounded-xl p-4">
                <View className="items-center mb-4">
                  <Text className="text-5xl">🏆</Text>
                  <Text className="text-2xl font-black text-slate-800 mt-2">
                    {project.title}
                  </Text>
                  <Text className="text-slate-600 italic">{project.description}</Text>
                </View>

                {/* Skills Used */}
                <View className="bg-indigo-50 rounded-xl p-4 mb-4">
                  <Text className="font-bold text-indigo-800 mb-2">🛠️ Skills Mastered:</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {project.phases.map((phase, i) => (
                      <View key={i} className="bg-white px-3 py-1 rounded-full border border-indigo-200">
                        <Text className="text-indigo-700 text-sm">{phase.skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Phase Outputs */}
                {project.phases.map((phase, i) => (
                  <View key={i} className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-2">
                        <Text className="text-white">{phase.emoji}</Text>
                      </View>
                      <Text className="font-bold text-slate-800">{phase.name}</Text>
                    </View>
                    <View className="bg-slate-50 rounded-xl p-3 ml-10">
                      <Text className="text-slate-600 text-sm" numberOfLines={6}>
                        {phase.output}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Reflection */}
                <View className="bg-purple-50 rounded-xl p-4">
                  <Text className="font-bold text-purple-800 mb-2">🪞 My Reflection:</Text>
                  <Text className="text-purple-700 italic">"{project.reflection}"</Text>
                </View>
              </View>
            </View>

            {/* Certificate */}
            <View className="bg-gradient-to-br from-yellow-200 to-amber-200 rounded-2xl p-6 mb-4 items-center border-4 border-yellow-400">
              <Text className="text-3xl">🎓</Text>
              <Text className="text-lg font-bold text-amber-800 mt-2">Certificate of Completion</Text>
              <Text className="text-amber-700 text-center mt-2">
                This certifies that YOU have successfully completed the
              </Text>
              <Text className="text-xl font-black text-amber-900 mt-1">
                AI Superpowers Capstone Project
              </Text>
              <Text className="text-amber-700 text-center mt-2 text-sm">
                Demonstrating mastery in Creative Prompting, Iteration, Personas, and more!
              </Text>
              <Text className="text-2xl mt-3">⭐⭐⭐</Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save Project</Text>
              </Pressable>
              {canShare && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">📤 Share</Text>
                </Pressable>
              )}
            </View>

            {onComplete && (
              <Button
                title="Complete Course! 🎉"
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
