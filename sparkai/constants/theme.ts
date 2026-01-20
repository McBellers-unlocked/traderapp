// SparkAI Theme Constants
// These mirror the Tailwind config for use in JavaScript

export const colors = {
  primary: '#6366F1',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',

  // Module-specific colors
  module1: '#3B82F6', // Blue - AI All Around Us
  module2: '#8B5CF6', // Purple - How AI Learns
  module3: '#EC4899', // Pink - Talking to AI
  module4: '#F59E0B', // Amber - AI Makes Mistakes
  module5: '#10B981', // Green - Using AI Responsibly
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Animation durations (ms)
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Touch target minimum size (iOS HIG recommends 44x44)
export const touchTarget = {
  min: 44,
} as const;

// Module theme mapping
export const moduleThemes = {
  '1': {
    color: colors.module1,
    gradient: ['#3B82F6', '#2563EB'],
    icon: '🌍',
    name: 'AI All Around Us',
  },
  '2': {
    color: colors.module2,
    gradient: ['#8B5CF6', '#7C3AED'],
    icon: '🧠',
    name: 'How AI Learns',
  },
  '3': {
    color: colors.module3,
    gradient: ['#EC4899', '#DB2777'],
    icon: '💬',
    name: 'Talking to AI',
  },
  '4': {
    color: colors.module4,
    gradient: ['#F59E0B', '#D97706'],
    icon: '🔍',
    name: 'AI Makes Mistakes',
  },
  '5': {
    color: colors.module5,
    gradient: ['#10B981', '#059669'],
    icon: '🛡️',
    name: 'Using AI Responsibly',
  },
} as const;

// Achievement badge colors
export const achievementColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
} as const;

export default {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  animation,
  touchTarget,
  moduleThemes,
  achievementColors,
};
