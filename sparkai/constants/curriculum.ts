import { Module } from '@/types';

export const CURRICULUM: Module[] = [
  {
    id: 'module-1',
    title: 'Your First AI Creation',
    description: 'Make something amazing in 5 minutes',
    color: '#8B5CF6',
    icon: '🚀',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'AI Art in 60 Seconds',
        description: 'Create your first AI artwork right now',
        duration_minutes: 5,
        icon: '🎨',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: "Let's Make Art!",
              body: "Type what you want to see, and AI will create it. Try: 'A dragon eating pizza in space' - be as wild as you want!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'AIArtCreator',
              props: {
                title: 'Create Your Art',
                starterPrompts: [
                  'A dragon eating pizza in space',
                  'A cat wearing a superhero cape',
                  'An underwater city with fish cars',
                  'A robot playing basketball on the moon',
                ],
                canSave: true,
                canShare: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Your AI Story Starter',
        description: 'Begin an adventure story with AI',
        duration_minutes: 8,
        icon: '📖',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Start Your Story',
              body: "Pick a character and a problem, and AI will help you write an exciting adventure. You're the author - AI is your helper!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'StoryBuilder',
              props: {
                title: 'Adventure Story Creator',
                characterOptions: ['A brave kid', 'A talking dog', 'A tiny robot', 'A friendly alien'],
                settingOptions: ['A magical forest', 'A future city', 'An underwater kingdom', 'A candy world'],
                problemOptions: ['Something is missing', 'A new friend needs help', 'A mystery to solve', 'A race to win'],
                canContinue: true,
                canSave: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'The Magic Words',
        description: 'Learn prompts that get amazing results',
        duration_minutes: 10,
        icon: '✨',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Secret Prompt Powers',
              body: "The way you ask AI changes what you get. Let's learn some magic words that make AI work way better!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PromptPowerUps',
              props: {
                title: 'Prompt Power-Ups',
                powerUps: [
                  { name: 'Be Specific', example: 'Draw a dog → Draw a fluffy golden retriever puppy playing in autumn leaves' },
                  { name: 'Add Style', example: 'Draw a castle → Draw a castle in the style of a cartoon, with bright colors' },
                  { name: 'Set the Mood', example: 'Write a story → Write a funny story that will make me laugh' },
                  { name: 'Give Examples', example: 'Make a joke → Make a joke like: Why did the chicken cross the road?' },
                ],
                practiceMode: true,
              },
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PromptChallenge',
              props: {
                title: 'Prompt Battle',
                challenges: [
                  { goal: 'Get AI to describe a rainbow in exactly 10 words', hints: ['Tell AI the exact number you want'] },
                  { goal: 'Get AI to write a haiku about pizza', hints: ['Tell AI the format you want'] },
                  { goal: 'Get AI to explain gravity like you\'re 5', hints: ['Tell AI who the audience is'] },
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
    title: 'AI Story Studio',
    description: 'Create stories, comics, and books',
    color: '#EC4899',
    icon: '📚',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Comic Creator',
        description: 'Make your own comic strip with AI',
        duration_minutes: 15,
        icon: '💥',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Create a Comic!',
              body: "You'll create a 4-panel comic strip. Write what happens in each panel, and AI will help you bring it to life!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ComicCreator',
              props: {
                title: 'My Comic Strip',
                panels: 4,
                canAddDialogue: true,
                styleOptions: ['superhero', 'manga', 'cartoon', 'pixel art'],
                canExport: true,
                canShare: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'Choose Your Adventure',
        description: 'Write a story where readers make choices',
        duration_minutes: 20,
        icon: '🔀',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Branching Stories',
              body: "Create a story where the reader decides what happens! At key moments, you'll write two different paths they can choose.",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'BranchingStory',
              props: {
                title: 'Choose Your Adventure',
                minBranches: 3,
                canPlaythrough: true,
                canShareLink: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-2-3',
        title: 'My Mini Book',
        description: 'Create an illustrated storybook',
        duration_minutes: 25,
        icon: '📕',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Author & Illustrator',
              body: "Write a short story (5-8 pages) and create illustrations for each page. At the end, you'll have a real book to share!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'BookCreator',
              props: {
                title: 'My Storybook',
                minPages: 5,
                maxPages: 8,
                includesCover: true,
                includesAuthorPage: true,
                canDownloadPDF: true,
                canPrint: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-3',
    title: 'AI Design Lab',
    description: 'Design characters, posters, and inventions',
    color: '#3B82F6',
    icon: '🎨',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Character Designer',
        description: 'Create your own original character',
        duration_minutes: 15,
        icon: '🦸',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Design a Character',
              body: "Create an original character with a name, backstory, and look. Use AI to visualize them in different poses and situations!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'CharacterDesigner',
              props: {
                title: 'Character Creator',
                attributes: ['appearance', 'personality', 'superpower', 'weakness', 'catchphrase'],
                poseOptions: ['hero pose', 'action scene', 'relaxing', 'with friends'],
                canCreateVariations: true,
                canSaveToGallery: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'Poster Maker',
        description: 'Design posters for real events',
        duration_minutes: 15,
        icon: '🪧',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Make a Poster',
              body: "Design a poster for something real - a birthday party, school event, or your bedroom wall. Make it look professional!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PosterDesigner',
              props: {
                title: 'Poster Studio',
                templates: ['party', 'event', 'motivational', 'movie poster', 'wanted poster'],
                canAddText: true,
                canChooseFonts: true,
                canDownload: true,
                canPrint: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-3-3',
        title: 'Invention Workshop',
        description: 'Design a crazy invention with AI',
        duration_minutes: 20,
        icon: '💡',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Invent Something New',
              body: "What problem would you solve? Design an invention - real or silly - and use AI to visualize it and write the instructions!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'InventionWorkshop',
              props: {
                title: 'Invention Lab',
                steps: ['identify problem', 'brainstorm solutions', 'design invention', 'name it', 'create ad'],
                canCreateBlueprint: true,
                canCreateCommercial: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-4',
    title: 'Code with AI',
    description: 'Build games, websites, and animations',
    color: '#10B981',
    icon: '💻',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'My First Website',
        description: 'Build a real website with AI help',
        duration_minutes: 20,
        icon: '🌐',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Build a Website!',
              body: "Tell AI what website you want, and it will write the code. You can see it live and share the link with anyone!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'WebsiteBuilder',
              props: {
                title: 'Website Creator',
                templates: ['about me', 'fan page', 'pet profile', 'recipe site', 'portfolio'],
                showsCode: true,
                canEditCode: true,
                canPublish: true,
                canShareLink: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-4-2',
        title: 'Animation Studio',
        description: 'Create moving pictures with code',
        duration_minutes: 20,
        icon: '🎬',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Animate It!',
              body: "Make things move! Create animations by telling AI what should happen - bouncing balls, flying spaceships, dancing characters!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'AnimationStudio',
              props: {
                title: 'Animation Creator',
                starterProjects: ['bouncing ball', 'solar system', 'fish tank', 'fireworks'],
                canPreview: true,
                canExportGif: true,
                showsCode: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-4-3',
        title: 'Game Maker',
        description: 'Build a simple game you can play',
        duration_minutes: 30,
        icon: '🎮',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Make a Game!',
              body: "Create a real game that you and your friends can play! Start with a simple idea and build it up with AI's help.",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'GameBuilder',
              props: {
                title: 'Game Creator',
                gameTypes: ['catch the falling items', 'maze runner', 'quiz game', 'clicker game', 'simple platformer'],
                canCustomize: true,
                canPlaytest: true,
                canShare: true,
                showsCode: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-4-4',
        title: 'Debug Detective',
        description: 'Learn to fix code with AI',
        duration_minutes: 15,
        icon: '🔧',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Find the Bug!',
              body: "Sometimes code breaks. Learn how to describe problems to AI and get them fixed. It's like being a code detective!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'DebugChallenge',
              props: {
                title: 'Bug Hunt',
                challenges: [
                  { broken: 'Button does nothing when clicked', skill: 'describing the problem' },
                  { broken: 'Colors are all wrong', skill: 'being specific about what\'s wrong' },
                  { broken: 'Game is too fast/slow', skill: 'explaining desired behavior' },
                ],
                showsFixProcess: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-5',
    title: 'AI Helper Projects',
    description: 'Build useful things for real life',
    color: '#F59E0B',
    icon: '🛠️',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Homework Helper',
        description: 'Use AI the right way for school',
        duration_minutes: 15,
        icon: '📝',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'AI for Learning',
              body: "AI shouldn't do your homework, but it's amazing for explaining hard things, checking your work, and helping you learn faster!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'HomeworkHelper',
              props: {
                title: 'Study Buddy',
                modes: ['explain this concept', 'check my answer', 'quiz me', 'make flashcards'],
                subjects: ['math', 'science', 'history', 'english', 'other'],
                emphasizesLearning: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-5-2',
        title: 'Family Recipe Book',
        description: 'Create a cookbook with family recipes',
        duration_minutes: 20,
        icon: '🍳',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Family Cookbook',
              body: "Interview family members about favorite recipes, then use AI to format them beautifully with illustrations. A great gift!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'CookbookCreator',
              props: {
                title: 'Family Recipe Book',
                includesInterviewPrompts: true,
                canAddPhotos: true,
                canAddStories: true,
                canCreateCover: true,
                canDownloadPDF: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-5-3',
        title: 'Presentation Pro',
        description: 'Make amazing slideshows with AI',
        duration_minutes: 20,
        icon: '📊',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Slides That Wow',
              body: "Got a school presentation? Learn to use AI to research, organize, and design slides that will impress your class!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PresentationBuilder',
              props: {
                title: 'Presentation Maker',
                steps: ['pick topic', 'research with AI', 'outline', 'create slides', 'add visuals', 'practice'],
                canExport: true,
                includesSpeakerNotes: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-5-4',
        title: 'Birthday Party Planner',
        description: 'Plan an amazing party with AI',
        duration_minutes: 15,
        icon: '🎂',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Party Planning',
              body: "Use AI to plan a themed party - invitations, decorations, games, and even a playlist. Impress your parents with your planning skills!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PartyPlanner',
              props: {
                title: 'Party Planner',
                elements: ['theme', 'invitations', 'decorations', 'games', 'food', 'playlist'],
                canCreateInvites: true,
                canCreateChecklist: true,
                canShare: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'module-6',
    title: 'AI Superpowers',
    description: 'Advanced techniques for amazing results',
    color: '#6366F1',
    icon: '⚡',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Chain Prompting',
        description: 'Build complex things step by step',
        duration_minutes: 15,
        icon: '🔗',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Prompt Chains',
              body: "For big projects, break them into steps. Ask AI for one piece, then use that answer to ask for the next. It's like building with LEGO!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'ChainBuilder',
              props: {
                title: 'Chain Prompting Lab',
                examples: [
                  { goal: 'Write a song', steps: ['topic', 'style', 'lyrics', 'title', 'album art'] },
                  { goal: 'Design a product', steps: ['problem', 'solution', 'features', 'name', 'packaging'] },
                ],
                canCreateOwn: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-6-2',
        title: 'AI Personas',
        description: 'Make AI act like different experts',
        duration_minutes: 15,
        icon: '🎭',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Expert Mode',
              body: "You can ask AI to be a specific expert - a scientist, chef, game designer, or storyteller. Different experts give different answers!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'PersonaSwitcher',
              props: {
                title: 'Expert Advisor',
                personas: [
                  { name: 'Chef', prompt: 'You are a friendly chef who loves teaching kids to cook' },
                  { name: 'Scientist', prompt: 'You are a scientist who explains things with fun experiments' },
                  { name: 'Game Designer', prompt: 'You are a game designer who thinks everything can be a game' },
                  { name: 'Storyteller', prompt: 'You are a storyteller who loves adventures and mysteries' },
                ],
                compareSameQuestion: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-6-3',
        title: 'Iteration Master',
        description: 'Make AI output better and better',
        duration_minutes: 15,
        icon: '🔄',
        type: 'interactive',
        content: [
          {
            type: 'text',
            data: {
              title: 'Make It Better',
              body: "The first answer isn't always the best. Learn to ask AI to improve, change, or remix what it made until it's perfect!",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'IterationLab',
              props: {
                title: 'Improvement Loop',
                techniques: [
                  'Make it shorter/longer',
                  'Make it funnier/more serious',
                  'Add more detail to [specific part]',
                  'Change the style to...',
                  'Keep X but change Y',
                ],
                tracksIterations: true,
                showsImprovement: true,
              },
            },
          },
        ],
      },
      {
        id: 'lesson-6-4',
        title: 'Capstone: Your Big Project',
        description: 'Create something amazing using everything you learned',
        duration_minutes: 45,
        icon: '🏆',
        type: 'project',
        content: [
          {
            type: 'text',
            data: {
              title: 'Your Masterpiece',
              body: "Time to combine everything! Pick a big project - a game, a book, a website, an invention - and bring it to life using all your AI skills.",
            },
          },
          {
            type: 'interactive',
            data: {
              component: 'CapstoneProject',
              props: {
                title: 'My Masterpiece',
                projectTypes: [
                  { name: 'Full Video Game', skills: ['coding', 'art', 'design'] },
                  { name: 'Illustrated Novel', skills: ['writing', 'art', 'design'] },
                  { name: 'Business Plan', skills: ['writing', 'research', 'design'] },
                  { name: 'Interactive Website', skills: ['coding', 'writing', 'design'] },
                  { name: 'Your Own Idea', skills: ['all'] },
                ],
                includesPlanning: true,
                includesReflection: true,
                canShowcase: true,
                generatesShareableLink: true,
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
