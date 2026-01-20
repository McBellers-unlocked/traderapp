// User & Auth Types
export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  parent_email: string | null;
  created_at: string;
}

export interface Parent {
  id: string;
  user_id: string;
  email: string;
  subscription_status: 'free' | 'premium' | 'family';
  subscription_expires_at: string | null;
  created_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  display_name: string;
  avatar_id: string | null;
  age: number | null;
  created_at: string;
}

// Progress & Achievements Types
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgress {
  id: string;
  child_id: string;
  lesson_id: string;
  module_id: string;
  status: LessonStatus;
  score: number | null;
  time_spent_seconds: number;
  completed_at: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  child_id: string;
  achievement_type: string;
  earned_at: string;
}

export interface Streak {
  id: string;
  child_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  child_id: string;
  project_type: string;
  title: string | null;
  data: Record<string, unknown>;
  created_at: string;
}

// Curriculum Types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  icon: string;
  type: 'interactive' | 'project' | 'quiz';
  content: LessonContent[];
}

export interface LessonContent {
  type: 'text' | 'video' | 'interactive' | 'quiz';
  data: TextContent | VideoContent | InteractiveContent | QuizContent;
}

export interface TextContent {
  title?: string;
  body: string;
}

export interface VideoContent {
  url: string;
  thumbnail?: string;
}

export interface InteractiveContent {
  component: string;
  props: Record<string, unknown>;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

// App State Types
export interface AuthState {
  user: Profile | null;
  parent: Parent | null;
  children: Child[];
  activeChild: Child | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  achievements: Achievement[];
  streak: Streak | null;
  projects: Project[];
}

// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'lesson/[id]': { id: string };
};

export type TabParamList = {
  learn: undefined;
  projects: undefined;
  achievements: undefined;
  profile: undefined;
};

// Avatar options for children
export const AVATAR_OPTIONS = [
  { id: 'robot-1', name: 'Sparky', emoji: '🤖' },
  { id: 'robot-2', name: 'Bolt', emoji: '⚡' },
  { id: 'star-1', name: 'Nova', emoji: '⭐' },
  { id: 'rocket-1', name: 'Astro', emoji: '🚀' },
  { id: 'brain-1', name: 'Brainiac', emoji: '🧠' },
  { id: 'lightbulb-1', name: 'Idea', emoji: '💡' },
] as const;

export type AvatarId = typeof AVATAR_OPTIONS[number]['id'];
