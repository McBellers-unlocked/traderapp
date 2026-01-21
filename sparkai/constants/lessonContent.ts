// Detailed lesson content for each lesson screen
// This contains the full content for each screen in a lesson

export interface LessonScreen {
  id: string;
  type: 'content' | 'quiz' | 'sorting' | 'scavenger' | 'reflection' | 'celebration' | 'discussion';
  mascotExpression?: 'default' | 'happy' | 'excited' | 'thinking' | 'explaining';
  data: ContentScreenData | QuizScreenData | SortingScreenData | ScavengerScreenData | ReflectionScreenData | CelebrationScreenData | DiscussionScreenData;
}

export interface ContentScreenData {
  title?: string;
  mascotMessage?: string;
  body?: string;
  bulletPoints?: string[];
  visual?: {
    type: 'animation' | 'comparison' | 'grid' | 'icon';
    data: unknown;
  };
  tip?: string;
  buttonText?: string;
}

export interface QuizScreenData {
  title?: string;
  intro?: string;
  questions: {
    id: string;
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
    explanation?: string;
  }[];
}

export interface SortingScreenData {
  title: string;
  instructions: string;
  categories: {
    id: string;
    label: string;
    color: string;
  }[];
  items: {
    id: string;
    content: string;
    correctCategory: string;
    explanation: string;
  }[];
}

export interface ScavengerScreenData {
  title: string;
  instructions: string;
  minItemsToComplete: number;
  items: {
    id: string;
    prompt: string;
    hint: string;
    exampleAnswers: string[];
  }[];
}

export interface ReflectionScreenData {
  title: string;
  mascotMessage?: string;
  prompt: string;
  placeholder?: string;
}

export interface CelebrationScreenData {
  title: string;
  message: string;
  achievements?: string[];
  xpEarned?: number;
  badgeEarned?: string;
  nextLessonId?: string;
  isModuleComplete?: boolean;
}

export interface DiscussionScreenData {
  title: string;
  intro?: string;
  questions: string[];
  thinkAbout?: string;
}

export interface LessonContent {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  badgeId?: string;
  prerequisite?: string;
  isProjectLesson?: boolean;
  screens: LessonScreen[];
}

// ============================================
// MODULE 1: AI All Around Us
// ============================================

export const LESSON_1_1: LessonContent = {
  id: 'lesson-1-1',
  moduleId: 'module-1',
  title: 'What is AI?',
  subtitle: 'Meet your new smart friend',
  duration: '8-10 minutes',
  difficulty: 'beginner',
  xpReward: 50,
  badgeId: 'first-lesson',
  screens: [
    // Screen 1: Introduction
    {
      id: '1-1-intro',
      type: 'content',
      mascotExpression: 'excited',
      data: {
        mascotMessage: "Hi there! I'm Sparky, and I'm SO excited to learn about AI with you! 🎉\n\nAI stands for Artificial Intelligence. That's a big fancy term, but don't worry — I'll explain it in a way that makes sense!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 2: What Does AI Mean?
    {
      id: '1-1-definition',
      type: 'content',
      mascotExpression: 'explaining',
      data: {
        title: "What Does AI Mean?",
        body: "Let's break down those big words:",
        bulletPoints: [
          "**Artificial** = Made by people (not natural)",
          "**Intelligence** = The ability to learn and think",
        ],
        tip: "So Artificial Intelligence means **smart technology made by people**!",
        visual: {
          type: 'animation',
          data: {
            steps: [
              { icon: '👨‍💻', label: 'A person building' },
              { icon: '💡', label: 'Intelligence' },
              { icon: '🤖', label: 'AI!' },
            ],
          },
        },
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 3: AI is Like a Helper
    {
      id: '1-1-helper',
      type: 'content',
      mascotExpression: 'happy',
      data: {
        mascotMessage: "Think of AI like a really helpful assistant that's SUPER good at certain things.\n\nAI can:\n🎵 Recognize songs (like Shazam!)\n🗣️ Understand what you say (like Siri or Alexa)\n🎬 Suggest videos you might like (like YouTube)\n🎮 Play games against you\n\nBut here's the cool part — AI had to LEARN how to do all these things!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 4: How AI Learns
    {
      id: '1-1-learning',
      type: 'content',
      mascotExpression: 'thinking',
      data: {
        title: "How AI Learns",
        body: "AI learns kind of like you do!\n\nRemember when you learned to recognize a cat? You saw LOTS of cats — big cats, small cats, orange cats, fluffy cats. After seeing enough cats, your brain learned the pattern!\n\nAI works the same way. People show it THOUSANDS of examples, and it learns the patterns.",
        visual: {
          type: 'grid',
          data: {
            images: ['🐱', '🐈', '😺', '🐈‍⬛', '😸', '😻'],
            result: 'Now AI knows: CAT! 🐱',
          },
        },
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 5: Quick Check Quiz
    {
      id: '1-1-quiz-1',
      type: 'quiz',
      data: {
        title: 'Quick Check',
        questions: [
          {
            id: 'q1',
            question: 'What does "Artificial Intelligence" mean?',
            options: [
              {
                text: 'A robot from a movie',
                isCorrect: false,
                feedback: "Not quite! AI isn't just robots — it's any smart technology made by people.",
              },
              {
                text: 'Smart technology made by people',
                isCorrect: true,
                feedback: "That's right! Artificial = made by people, Intelligence = ability to learn and think.",
              },
              {
                text: 'A really smart person',
                isCorrect: false,
                feedback: 'Good guess, but AI refers to technology, not people!',
              },
              {
                text: 'A type of video game',
                isCorrect: false,
                feedback: "AI is used IN video games, but it's not a game itself.",
              },
            ],
            explanation: "You got it! AI is smart technology that people create to help with different tasks.",
          },
        ],
      } as QuizScreenData,
    },
    // Screen 6: AI is NOT Magic
    {
      id: '1-1-not-magic',
      type: 'content',
      mascotExpression: 'explaining',
      data: {
        mascotMessage: "Here's something really important to remember:\n\nAI is NOT magic! ✨🚫\n\nReal people — engineers and scientists — build AI. They decide what it can do and teach it how to work.\n\nAI is a tool, just like a calculator or a search engine. A really SMART tool, but still a tool!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 7: Sorting Game - AI or Not AI?
    {
      id: '1-1-sorting',
      type: 'sorting',
      data: {
        title: "Is it AI? Let's find out!",
        instructions: "Drag each item to the correct side. Is it powered by AI, or is it regular technology?",
        categories: [
          { id: 'ai', label: 'Uses AI 🤖', color: '#3B82F6' },
          { id: 'not-ai', label: 'No AI ❌', color: '#9CA3AF' },
        ],
        items: [
          {
            id: 'siri',
            content: '🗣️ Siri answering your questions',
            correctCategory: 'ai',
            explanation: 'Siri uses AI to understand your voice and find answers!',
          },
          {
            id: 'lightswitch',
            content: '💡 A light switch',
            correctCategory: 'not-ai',
            explanation: 'A light switch just turns electricity on or off — no learning needed!',
          },
          {
            id: 'netflix',
            content: '🎬 Netflix suggesting shows',
            correctCategory: 'ai',
            explanation: 'Netflix AI learns what you like and suggests similar shows!',
          },
          {
            id: 'toaster',
            content: '🍞 A toaster',
            correctCategory: 'not-ai',
            explanation: "A toaster uses heat and a timer — it doesn't learn or think!",
          },
          {
            id: 'autocorrect',
            content: '📱 Your phone fixing typos',
            correctCategory: 'ai',
            explanation: 'Autocorrect uses AI to guess what word you meant to type!',
          },
          {
            id: 'bicycle',
            content: '🚲 A bicycle',
            correctCategory: 'not-ai',
            explanation: 'A bicycle is human-powered with no electronics at all!',
          },
          {
            id: 'faceid',
            content: '📷 Face ID unlocking your phone',
            correctCategory: 'ai',
            explanation: 'Face ID uses AI to recognize your unique face!',
          },
          {
            id: 'calculator',
            content: '🔢 A basic calculator',
            correctCategory: 'not-ai',
            explanation: "A calculator follows math rules but doesn't learn or adapt!",
          },
        ],
      } as SortingScreenData,
    },
    // Screen 8: Great Job!
    {
      id: '1-1-summary',
      type: 'content',
      mascotExpression: 'excited',
      data: {
        mascotMessage: "Woohoo! You're already becoming an AI expert! 🌟\n\nNow you know:\n✅ AI means smart technology made by people\n✅ AI learns from lots of examples\n✅ AI is a tool, not magic\n✅ Some things use AI, and some don't",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 9: Talk About It
    {
      id: '1-1-discussion',
      type: 'discussion',
      data: {
        title: 'Chat with a grown-up!',
        intro: 'Great learning deserves great conversations! Here are some things to talk about:',
        questions: [
          '"What AI do we use in our home?"',
          '"Did you have AI when you were a kid?"',
          '"What do you think is cool about AI?"',
        ],
        thinkAbout: 'What AI would you want to invent?',
      } as DiscussionScreenData,
    },
  ],
};

export const LESSON_1_2: LessonContent = {
  id: 'lesson-1-2',
  moduleId: 'module-1',
  title: 'AI vs Humans',
  subtitle: 'What makes us different?',
  duration: '10-12 minutes',
  difficulty: 'beginner',
  xpReward: 60,
  prerequisite: 'lesson-1-1',
  screens: [
    // Screen 1: Introduction
    {
      id: '1-2-intro',
      type: 'content',
      mascotExpression: 'excited',
      data: {
        mascotMessage: "Now that you know what AI is, let's talk about how AI and humans are different!\n\nSome things AI does REALLY well. Other things? Humans are the champions! 🏆\n\nLet's explore together!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 2: What AI Does Well
    {
      id: '1-2-ai-strengths',
      type: 'content',
      mascotExpression: 'explaining',
      data: {
        title: 'AI Superpowers ⚡',
        body: 'AI is AMAZING at:',
        bulletPoints: [
          '🚀 **Speed** — AI can look through millions of photos in seconds',
          '🔢 **Math** — AI never makes calculation mistakes',
          '🔁 **Repetition** — AI doesn\'t get bored doing the same thing 1000 times',
          '📊 **Patterns** — AI can spot tiny details humans might miss',
        ],
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 3: What Humans Do Well
    {
      id: '1-2-human-strengths',
      type: 'content',
      mascotExpression: 'happy',
      data: {
        title: 'Human Superpowers 💪',
        body: 'Humans are AMAZING at:',
        bulletPoints: [
          '💕 **Feelings** — Understanding emotions and caring for others',
          '🎨 **Creativity** — Coming up with brand new ideas',
          '🤔 **Common Sense** — Knowing what makes sense in the real world',
          '🔄 **Adapting** — Handling surprises and new situations',
        ],
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 4: The Comparison
    {
      id: '1-2-comparison',
      type: 'content',
      mascotExpression: 'thinking',
      data: {
        title: 'AI 🤖 vs Humans 🧑',
        visual: {
          type: 'comparison',
          data: {
            left: {
              title: 'AI',
              items: [
                '✓ Never gets tired',
                '✓ Super fast at math',
                '✓ Remembers everything',
                '✓ Finds patterns',
                '✓ No emotions to hurt',
              ],
            },
            right: {
              title: 'Humans',
              items: [
                '✓ Has feelings & empathy',
                '✓ Creative imagination',
                '✓ Common sense',
                '✓ Handles new situations',
                '✓ Understands context',
              ],
            },
          },
        },
        tip: "💡 AI and humans are BOTH amazing — just at different things! That's why they work best TOGETHER.",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 5: Who Did It Quiz
    {
      id: '1-2-quiz',
      type: 'quiz',
      data: {
        title: "Who Did It?",
        intro: "Let's play 'Who Did It?' — was it AI or a human?",
        questions: [
          {
            id: 'q1',
            question: "A doctor looks at a patient's face and can tell they're scared about their surgery. This understanding of emotions came from:",
            options: [
              {
                text: 'AI',
                isCorrect: false,
                feedback: "AI can recognize a smile, but understanding fear and giving comfort? That's a human superpower!",
              },
              {
                text: 'A human',
                isCorrect: true,
                feedback: 'Right! Understanding emotions and providing comfort is something humans do best.',
              },
            ],
          },
          {
            id: 'q2',
            question: 'A computer looked through 10 million photos in 2 minutes to find all the pictures of dogs. This was done by:',
            options: [
              {
                text: 'AI',
                isCorrect: true,
                feedback: 'Correct! Speed and pattern-finding are AI superpowers.',
              },
              {
                text: 'A human',
                isCorrect: false,
                feedback: 'A human could do this, but it would take YEARS, not minutes!',
              },
            ],
          },
          {
            id: 'q3',
            question: 'Someone painted a picture of a dragon playing basketball on the moon. This creative idea came from:',
            options: [
              {
                text: 'AI',
                isCorrect: false,
                feedback: 'AI can help make art, but the wild, creative idea came from a human imagination!',
              },
              {
                text: 'A human',
                isCorrect: true,
                feedback: 'Yes! Coming up with silly, creative, brand-new ideas is a human superpower.',
              },
            ],
          },
        ],
      } as QuizScreenData,
    },
    // Screen 6: Better Together
    {
      id: '1-2-together',
      type: 'content',
      mascotExpression: 'happy',
      data: {
        mascotMessage: "Here's the really cool thing: AI and humans are better together! 🤝\n\n• Doctors use AI to look at X-rays, but HUMANS decide how to help patients\n• AI can suggest songs you might like, but HUMANS create the music\n• AI can check your spelling, but HUMANS write the stories\n\nAI is like a super-powered helper. Humans are still the ones in charge!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 7: Quick Sort
    {
      id: '1-2-sorting',
      type: 'sorting',
      data: {
        title: "Who's better at this?",
        instructions: 'Drag each item to who does it better!',
        categories: [
          { id: 'ai-better', label: 'AI Does This Better 🤖', color: '#3B82F6' },
          { id: 'human-better', label: 'Humans Do This Better 🧑', color: '#EC4899' },
        ],
        items: [
          {
            id: 'counting',
            content: 'Counting to a million',
            correctCategory: 'ai-better',
            explanation: 'AI can count to any number instantly without mistakes!',
          },
          {
            id: 'hug',
            content: 'Giving a comforting hug',
            correctCategory: 'human-better',
            explanation: 'Hugs need human warmth and understanding of feelings!',
          },
          {
            id: 'faces',
            content: 'Scanning millions of faces',
            correctCategory: 'ai-better',
            explanation: 'AI can compare millions of faces in seconds!',
          },
          {
            id: 'joke',
            content: 'Making up a funny joke',
            correctCategory: 'human-better',
            explanation: "Humor requires understanding what humans find funny — that's hard for AI!",
          },
          {
            id: 'translate',
            content: 'Translating 100 languages',
            correctCategory: 'ai-better',
            explanation: 'AI can know hundreds of languages at once!',
          },
          {
            id: 'friend',
            content: 'Being a true friend',
            correctCategory: 'human-better',
            explanation: 'Real friendship needs human connection and care.',
          },
        ],
      } as SortingScreenData,
    },
    // Screen 8: Lesson Complete
    {
      id: '1-2-complete',
      type: 'celebration',
      data: {
        title: "You're crushing it! 🎉",
        message: 'Now you understand:',
        achievements: [
          'AI is great at speed, math, and patterns',
          'Humans are great at creativity, emotions, and common sense',
          'AI and humans work best together',
          'Humans are still in charge — AI is a tool to help us',
        ],
        xpEarned: 60,
      } as CelebrationScreenData,
    },
    // Screen 9: Talk About It
    {
      id: '1-2-discussion',
      type: 'discussion',
      data: {
        title: 'Chat with a grown-up!',
        questions: [
          '"What\'s something you do that AI could never do?"',
          '"What job would you want AI to help you with?"',
          '"Would you want a robot friend? Why or why not?"',
        ],
        thinkAbout: 'If you could teach an AI one thing, what would it be?',
      } as DiscussionScreenData,
    },
  ],
};

export const LESSON_1_3: LessonContent = {
  id: 'lesson-1-3',
  moduleId: 'module-1',
  title: 'AI Detective',
  subtitle: 'Find AI in the wild!',
  duration: '12-15 minutes',
  difficulty: 'beginner',
  xpReward: 75,
  badgeId: 'ai-detective',
  prerequisite: 'lesson-1-2',
  isProjectLesson: true,
  screens: [
    // Screen 1: Mission Briefing
    {
      id: '1-3-mission',
      type: 'content',
      mascotExpression: 'excited',
      data: {
        mascotMessage: "Agent, welcome to your first AI mission! 🕵️\n\nYour task: Find AI hiding in plain sight — in your own home!\n\nAI is EVERYWHERE once you know what to look for. Let's go hunting!",
        buttonText: 'Accept Mission',
      } as ContentScreenData,
    },
    // Screen 2: Detective Training
    {
      id: '1-3-training',
      type: 'content',
      mascotExpression: 'explaining',
      data: {
        title: 'How to Spot AI 🔍',
        body: 'Look for technology that:',
        bulletPoints: [
          '🗣️ Listens and responds to your voice',
          '👁️ Recognizes things like faces or songs',
          '🎯 Suggests things based on what you like',
          '📝 Predicts what you\'ll type or do next',
          '🎮 Plays against you and gets better',
        ],
        tip: 'If it LEARNS or ADAPTS, it probably has AI inside!',
        buttonText: 'Start Hunt',
      } as ContentScreenData,
    },
    // Screen 3: Warm-Up Quiz
    {
      id: '1-3-warmup',
      type: 'quiz',
      data: {
        title: 'Warm-Up Quiz',
        questions: [
          {
            id: 'q1',
            question: 'Which of these is a sign that something might use AI?',
            options: [
              { text: 'It has buttons', isCorrect: false, feedback: 'Lots of things have buttons, but that doesn\'t mean they use AI!' },
              { text: 'It needs electricity', isCorrect: false, feedback: 'Many devices need electricity but don\'t use AI.' },
              { text: 'It learns from how you use it', isCorrect: true, feedback: 'Yes! Learning and adapting is a key sign of AI.' },
              { text: 'It makes sounds', isCorrect: false, feedback: 'Sounds can come from any device, not just AI!' },
            ],
          },
          {
            id: 'q2',
            question: "You notice your music app plays songs you've never heard but really like. This is because:",
            options: [
              { text: "It's random luck", isCorrect: false, feedback: "Nope! It's not luck — it's smart technology." },
              { text: 'AI learned what kind of music you enjoy', isCorrect: true, feedback: 'Exactly! The AI studies your listening habits to make recommendations.' },
              { text: 'Someone is watching you', isCorrect: false, feedback: "No need to worry — it's just AI algorithms, not people!" },
              { text: 'The app only has certain songs', isCorrect: false, feedback: 'Music apps have millions of songs — AI helps pick the right ones for you!' },
            ],
          },
        ],
      } as QuizScreenData,
    },
    // Screen 4: The Hunt - Scavenger Hunt
    {
      id: '1-3-hunt',
      type: 'scavenger',
      data: {
        title: 'AI Detective Challenge',
        instructions: 'Find at least 5 examples of AI in or around your home. For each one, describe what you found!',
        minItemsToComplete: 5,
        items: [
          {
            id: 'voice',
            prompt: '🗣️ Find something you can TALK to',
            hint: 'It might answer your questions or play music when you ask!',
            exampleAnswers: ['Alexa', 'Siri', 'Google Home', 'smart speaker'],
          },
          {
            id: 'suggest',
            prompt: '🎬 Find something that SUGGESTS things for you',
            hint: 'Think about apps that recommend videos, songs, or shows!',
            exampleAnswers: ['Netflix', 'YouTube', 'Spotify', 'TikTok'],
          },
          {
            id: 'recognize',
            prompt: '📷 Find something that RECOGNIZES faces or objects',
            hint: 'Does anything unlock when it sees you?',
            exampleAnswers: ['Face ID', 'phone unlock', 'doorbell camera'],
          },
          {
            id: 'type',
            prompt: "⌨️ Find something that PREDICTS what you'll type",
            hint: 'Watch the keyboard on a phone or tablet!',
            exampleAnswers: ['autocorrect', 'predictive text', 'Gmail'],
          },
          {
            id: 'game',
            prompt: '🎮 Find a game where the computer plays against you',
            hint: 'The computer opponent that gets harder is using AI!',
            exampleAnswers: ['chess app', 'video game NPCs', 'puzzle games'],
          },
          {
            id: 'bonus',
            prompt: '⭐ BONUS: Find AI somewhere surprising!',
            hint: "AI is in cars, refrigerators, and places you might not expect!",
            exampleAnswers: ['car navigation', 'smart thermostat', 'robot vacuum'],
          },
        ],
      } as ScavengerScreenData,
    },
    // Screen 5: Detective Report (handled by scavenger completion)
    {
      id: '1-3-report',
      type: 'content',
      mascotExpression: 'excited',
      data: {
        title: 'Case File Complete! 📋',
        mascotMessage: "Wow, you found so much AI!\n\nBefore this lesson, did you know all these things used AI?\n\nMost people don't realize how much AI is already in their lives. Now YOU do!",
        buttonText: 'Continue',
      } as ContentScreenData,
    },
    // Screen 6: Reflection
    {
      id: '1-3-reflection',
      type: 'reflection',
      data: {
        title: 'Think About It',
        mascotMessage: "You've become a real AI Detective!",
        prompt: 'What surprised you most about where you found AI?',
        placeholder: 'Type your thoughts here...',
      } as ReflectionScreenData,
    },
    // Screen 7: Module 1 Complete!
    {
      id: '1-3-module-complete',
      type: 'celebration',
      data: {
        title: '🎉 MODULE 1 COMPLETE!',
        message: "AI All Around Us ✓\n\nYou've learned:",
        achievements: [
          'What AI means (smart tech made by people)',
          'How AI learns (from lots of examples)',
          'What AI vs humans do best',
          'How to spot AI in the real world',
        ],
        xpEarned: 75,
        badgeEarned: 'AI Detective',
        isModuleComplete: true,
        nextLessonId: 'lesson-2-1',
      } as CelebrationScreenData,
    },
    // Screen 8: Share with Family
    {
      id: '1-3-share',
      type: 'discussion',
      data: {
        title: '📤 Share Your Detective Work!',
        intro: 'Want to show your family what you found?',
        questions: [
          'Show them the AI examples you discovered',
          'Teach them how to spot AI in everyday life',
          'Ask them about AI they use at work',
        ],
        thinkAbout: 'What AI will you notice tomorrow that you never noticed before?',
      } as DiscussionScreenData,
    },
  ],
};

// Export all Module 1 lessons
export const MODULE_1_LESSONS: LessonContent[] = [
  LESSON_1_1,
  LESSON_1_2,
  LESSON_1_3,
];

// Helper to get lesson content by ID
export const getLessonContent = (lessonId: string): LessonContent | undefined => {
  return MODULE_1_LESSONS.find(lesson => lesson.id === lessonId);
};

// Get all lesson content
export const ALL_LESSON_CONTENT: Record<string, LessonContent> = {
  'lesson-1-1': LESSON_1_1,
  'lesson-1-2': LESSON_1_2,
  'lesson-1-3': LESSON_1_3,
};
