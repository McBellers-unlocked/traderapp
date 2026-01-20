import { Module } from '@/types';

export const CURRICULUM: Module[] = [
  {
    id: 'module-1',
    title: 'AI All Around Us',
    description: 'Discover where AI lives in your everyday world',
    color: '#3B82F6',
    icon: '🌍',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'What is AI?',
        description: 'Learn what artificial intelligence really means',
        duration_minutes: 10,
        icon: '🤔',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Welcome to AI!',
              body: "AI stands for Artificial Intelligence. It's like teaching a computer to think and learn, kind of like how you learn new things at school!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'SortingGame',
              props: {
                title: 'AI or Not AI?',
                instructions: 'Drag each item to the correct category',
                categories: ['Uses AI', 'Does Not Use AI'],
                items: [
                  { text: 'Netflix recommending shows', category: 0 },
                  { text: 'A regular light switch', category: 1 },
                  { text: 'Siri answering questions', category: 0 },
                  { text: 'A paper book', category: 1 },
                  { text: 'Video game characters', category: 0 },
                  { text: 'A bicycle', category: 1 },
                ],
              },
            },
          },
          {
            type: 'quiz',
            data: {
              questions: [
                {
                  id: 'q1',
                  question: 'What does AI stand for?',
                  options: ['Automatic Internet', 'Artificial Intelligence', 'Amazing Invention', 'Apple iPhone'],
                  correctIndex: 1,
                  explanation: 'AI stands for Artificial Intelligence - computers that can learn and make decisions!',
                },
                {
                  id: 'q2',
                  question: 'Which of these uses AI?',
                  options: ['A pencil', 'A voice assistant like Alexa', 'A regular clock', 'A paper map'],
                  correctIndex: 1,
                  explanation: 'Voice assistants use AI to understand what you say and respond!',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'AI vs Humans',
        description: 'Compare what AI and humans do best',
        duration_minutes: 12,
        icon: '⚖️',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'AI and Humans are Different',
              body: "AI is really good at some things, and humans are really good at other things. Let's explore what each does best!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ComparisonBuilder',
              props: {
                title: 'Build a Comparison Chart',
                aiStrengths: ['Doing math really fast', 'Never getting tired', 'Remembering lots of data'],
                humanStrengths: ['Being creative', 'Understanding feelings', 'Making new friends'],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'AI Detectives',
        description: 'Find AI in your own home!',
        duration_minutes: 15,
        icon: '🔍',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Become an AI Detective!',
              body: "Your mission: find 5 things in your home that use AI. Take photos and explain what the AI does. Let's go exploring!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ScavengerHunt',
              props: {
                title: 'AI Scavenger Hunt',
                targetCount: 5,
                hints: [
                  'Check devices that respond to your voice',
                  'Look at apps that recommend things to you',
                  'Find gadgets that recognize faces',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-2',
    title: 'How AI Learns',
    description: 'Understand how computers learn from examples',
    color: '#8B5CF6',
    icon: '🧠',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Learning from Examples',
        description: 'See how AI learns patterns like you do',
        duration_minutes: 12,
        icon: '📚',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'AI Learns Like You!',
              body: "When you learned to recognize a cat, you saw lots of cats first. AI learns the same way - by looking at many examples!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'DrawingTrainer',
              props: {
                title: 'Teach AI Your Drawings',
                instructions: 'Draw 5 examples of each shape to train the AI',
                shapes: ['circle', 'square', 'triangle'],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'Good Data vs Bad Data',
        description: 'Learn why the examples matter',
        duration_minutes: 10,
        icon: '📊',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Garbage In, Garbage Out!',
              body: "If you teach AI with wrong examples, it learns wrong things. That's why good data is super important!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'DataFixer',
              props: {
                title: 'Fix the Training Data',
                scenario: 'The AI thinks all fruits are apples! Can you fix the training data?',
              },
            },
          },
        ],
      },
      {
        id: 'lesson-2-3',
        title: 'Train Your Own AI',
        description: 'Build a simple image classifier',
        duration_minutes: 20,
        icon: '🎓',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Build Your Own AI!',
              body: "Now it's your turn! You'll train an AI to recognize three different hand gestures. The more examples you give it, the better it gets!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ImageClassifier',
              props: {
                title: 'Gesture Recognizer',
                categories: ['Thumbs Up', 'Peace Sign', 'Wave'],
                minExamplesPerCategory: 5,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Talking to AI',
    description: 'Master the art of prompting',
    color: '#EC4899',
    icon: '💬',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Giving Clear Instructions',
        description: 'Learn why specific prompts work better',
        duration_minutes: 10,
        icon: '📝',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Be Specific!',
              body: "When you talk to AI, being specific helps a lot. \"Draw a dog\" is okay, but \"Draw a happy golden retriever playing in a park\" is much better!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PromptLab',
              props: {
                title: 'Prompt Comparison',
                scenarios: [
                  {
                    vague: 'Tell me about animals',
                    specific: 'Tell me 3 fun facts about dolphins for a kid',
                  },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'The Prompt Game',
        description: 'Challenge yourself to write better prompts',
        duration_minutes: 15,
        icon: '🎮',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: "Let's Play!",
              body: "In this game, you'll try to get the AI to create exactly what you want. The fewer tries it takes, the more points you get!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PromptGame',
              props: {
                title: 'Prompt Challenge',
                challenges: [
                  { target: 'A blue cat wearing a hat', maxTries: 5 },
                  { target: 'A robot reading a book', maxTries: 5 },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-3-3',
        title: 'AI Art Studio',
        description: 'Create your own AI art gallery',
        duration_minutes: 20,
        icon: '🎨',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Your Art Gallery',
              body: "Time to be an artist! You'll create 3 pieces of AI art using prompts. Think about style, colors, and details!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ArtStudio',
              props: {
                title: 'Create Your Gallery',
                artPiecesRequired: 3,
                styleOptions: ['cartoon', 'realistic', 'watercolor', 'pixel art'],
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-4',
    title: 'AI Makes Mistakes',
    description: 'Think critically about AI outputs',
    color: '#F59E0B',
    icon: '🔍',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Oops! AI Got it Wrong',
        description: 'See funny and serious AI mistakes',
        duration_minutes: 10,
        icon: '😅',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: "AI Isn't Perfect!",
              body: "AI can make mistakes, some funny and some serious. It might say things that aren't true or get confused. That's why we always need to check!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'MistakeSpotter',
              props: {
                title: 'Spot the Mistake',
                examples: [
                  { aiOutput: 'Penguins can fly really fast', hasError: true },
                  { aiOutput: 'The Earth orbits the Sun', hasError: false },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-4-2',
        title: 'Is This Real?',
        description: 'Learn to spot AI-generated content',
        duration_minutes: 12,
        icon: '🤔',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Real or AI?',
              body: "AI can create images and text that look real but aren't. Let's learn some tricks to tell the difference!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'RealOrFake',
              props: {
                title: 'Fake or Real?',
                rounds: 10,
                categories: ['images', 'text'],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-4-3',
        title: 'AI Fairness Detective',
        description: 'Explore AI bias and fairness',
        duration_minutes: 15,
        icon: '⚖️',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Is AI Fair?',
              body: "Sometimes AI can be unfair without meaning to be. Let's explore why this happens and what we can do about it.",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'FairnessStory',
              props: {
                title: 'Fairness Detective',
                scenarios: ['hiring', 'games', 'recommendations'],
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-5',
    title: 'Using AI Responsibly',
    description: 'Become a responsible AI citizen',
    color: '#10B981',
    icon: '🛡️',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'When to Use AI',
        description: 'Learn the right times to use AI help',
        duration_minutes: 10,
        icon: '🎯',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'AI is a Tool',
              body: "AI is like a super helpful tool, but just like any tool, there are good times and not-so-good times to use it. Let's learn when!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ScenarioSorter',
              props: {
                title: 'Good Use or Not?',
                scenarios: [
                  { text: 'Using AI to brainstorm ideas', isGoodUse: true },
                  { text: 'Having AI write your whole homework', isGoodUse: false },
                  { text: 'Using AI to help explain a hard topic', isGoodUse: true },
                  { text: 'Copying AI answers without thinking', isGoodUse: false },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-5-2',
        title: 'AI and Your Privacy',
        description: 'Keep your information safe',
        duration_minutes: 10,
        icon: '🔒',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Protect Your Info!',
              body: "Some things are okay to share with AI, but some things should stay private. Let's learn the difference!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PrivacyGame',
              props: {
                title: 'Safe to Share?',
                items: [
                  { text: 'Your favorite color', isSafe: true },
                  { text: 'Your home address', isSafe: false },
                  { text: 'Your favorite book', isSafe: true },
                  { text: 'Your password', isSafe: false },
                  { text: 'A question about homework', isSafe: true },
                  { text: "Your parent's credit card", isSafe: false },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'lesson-5-3',
        title: 'My AI Promise',
        description: 'Create your personal AI pledge',
        duration_minutes: 15,
        icon: '📜',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Make a Promise!',
              body: "You've learned so much about AI! Now it's time to make a promise about how you'll use AI responsibly. This is YOUR commitment!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PledgeBuilder',
              props: {
                title: 'My AI Promise',
                categories: ['learning', 'privacy', 'honesty', 'kindness'],
              },
            },
          },
        ],
      },
    ],
  },
];

// Helper functions
export const getModuleById = (id: string): Module | undefined => {
  return CURRICULUM.find((module) => module.id === id);
};

export const getLessonById = (lessonId: string): { module: Module; lesson: typeof CURRICULUM[0]['lessons'][0] } | undefined => {
  for (const module of CURRICULUM) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { module, lesson };
    }
  }
  return undefined;
};

export const getTotalLessons = (): number => {
  return CURRICULUM.reduce((total, module) => total + module.lessons.length, 0);
};

export const getModuleProgress = (moduleId: string, completedLessons: string[]): number => {
  const module = getModuleById(moduleId);
  if (!module) return 0;

  const completed = module.lessons.filter((l) => completedLessons.includes(l.id)).length;
  return (completed / module.lessons.length) * 100;
};
