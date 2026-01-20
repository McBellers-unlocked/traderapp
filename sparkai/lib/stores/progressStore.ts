import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { LessonProgress, Achievement, Streak, Project, LessonStatus } from '@/types';

interface ProgressState {
  // State
  lessonProgress: Record<string, LessonProgress>;
  achievements: Achievement[];
  streak: Streak | null;
  projects: Project[];
  isLoading: boolean;

  // Getters
  getProgressForLesson: (lessonId: string) => LessonProgress | undefined;
  getCompletedLessons: () => string[];
  getTotalScore: () => number;
  getTotalTimeSpent: () => number;

  // Actions
  setIsLoading: (loading: boolean) => void;

  // Async actions
  fetchProgress: (childId: string) => Promise<void>;
  updateLessonProgress: (
    childId: string,
    lessonId: string,
    moduleId: string,
    updates: Partial<LessonProgress>
  ) => Promise<void>;
  completeLesson: (
    childId: string,
    lessonId: string,
    moduleId: string,
    score: number,
    timeSpent: number
  ) => Promise<void>;
  fetchAchievements: (childId: string) => Promise<void>;
  awardAchievement: (childId: string, achievementType: string) => Promise<void>;
  fetchStreak: (childId: string) => Promise<void>;
  updateStreak: (childId: string) => Promise<void>;
  fetchProjects: (childId: string) => Promise<void>;
  saveProject: (
    childId: string,
    projectType: string,
    title: string,
    data: Record<string, unknown>
  ) => Promise<Project | null>;
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  // Initial state
  lessonProgress: {},
  achievements: [],
  streak: null,
  projects: [],
  isLoading: false,

  // Getters
  getProgressForLesson: (lessonId) => get().lessonProgress[lessonId],

  getCompletedLessons: () => {
    const progress = get().lessonProgress;
    return Object.keys(progress).filter(
      (key) => progress[key].status === 'completed'
    );
  },

  getTotalScore: () => {
    const progress = get().lessonProgress;
    return Object.values(progress).reduce(
      (total, p) => total + (p.score || 0),
      0
    );
  },

  getTotalTimeSpent: () => {
    const progress = get().lessonProgress;
    return Object.values(progress).reduce(
      (total, p) => total + (p.time_spent_seconds || 0),
      0
    );
  },

  // Setters
  setIsLoading: (isLoading) => set({ isLoading }),

  // Fetch all progress for a child
  fetchProgress: async (childId) => {
    try {
      set({ isLoading: true });

      const { data } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('child_id', childId);

      if (data) {
        const progressMap: Record<string, LessonProgress> = {};
        data.forEach((p) => {
          progressMap[p.lesson_id] = p as LessonProgress;
        });
        set({ lessonProgress: progressMap });
      }

      // Also fetch achievements, streak, and projects
      await Promise.all([
        get().fetchAchievements(childId),
        get().fetchStreak(childId),
        get().fetchProjects(childId),
      ]);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update lesson progress
  updateLessonProgress: async (childId, lessonId, moduleId, updates) => {
    try {
      const existing = get().lessonProgress[lessonId];

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('lesson_progress')
          .update(updates)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('lesson_progress')
          .insert({
            child_id: childId,
            lesson_id: lessonId,
            module_id: moduleId,
            status: 'in_progress' as LessonStatus,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          set((state) => ({
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: data as LessonProgress,
            },
          }));
          return;
        }
      }

      // Update local state
      set((state) => ({
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: {
            ...state.lessonProgress[lessonId],
            ...updates,
          },
        },
      }));
    } catch (error) {
      console.error('Failed to update lesson progress:', error);
    }
  },

  // Complete a lesson
  completeLesson: async (childId, lessonId, moduleId, score, timeSpent) => {
    await get().updateLessonProgress(childId, lessonId, moduleId, {
      status: 'completed',
      score,
      time_spent_seconds: timeSpent,
      completed_at: new Date().toISOString(),
    });

    // Update streak
    await get().updateStreak(childId);
  },

  // Fetch achievements
  fetchAchievements: async (childId) => {
    try {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('child_id', childId)
        .order('earned_at', { ascending: false });

      if (data) {
        set({ achievements: data as Achievement[] });
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  },

  // Award an achievement
  awardAchievement: async (childId, achievementType) => {
    try {
      // Check if already awarded
      const existing = get().achievements.find(
        (a) => a.achievement_type === achievementType
      );
      if (existing) return;

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          child_id: childId,
          achievement_type: achievementType,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set((state) => ({
          achievements: [data as Achievement, ...state.achievements],
        }));
      }
    } catch (error) {
      console.error('Failed to award achievement:', error);
    }
  },

  // Fetch streak data
  fetchStreak: async (childId) => {
    try {
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('child_id', childId)
        .single();

      set({ streak: data as Streak | null });
    } catch (error) {
      // No streak record yet is okay
      set({ streak: null });
    }
  },

  // Update streak (call when completing a lesson)
  updateStreak: async (childId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentStreak = get().streak;

      if (!currentStreak) {
        // Create new streak record
        const { data, error } = await supabase
          .from('streaks')
          .insert({
            child_id: childId,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today,
          })
          .select()
          .single();

        if (error) throw error;
        set({ streak: data as Streak });
      } else {
        // Calculate if streak continues
        const lastDate = currentStreak.last_activity_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentStreak.current_streak;

        if (lastDate === today) {
          // Already active today, no change
          return;
        } else if (lastDate === yesterdayStr) {
          // Streak continues!
          newStreak += 1;
        } else {
          // Streak broken, start over
          newStreak = 1;
        }

        const newLongest = Math.max(newStreak, currentStreak.longest_streak);

        const { data, error } = await supabase
          .from('streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_activity_date: today,
          })
          .eq('id', currentStreak.id)
          .select()
          .single();

        if (error) throw error;
        set({ streak: data as Streak });

        // Check for streak achievements
        if (newStreak === 3) {
          await get().awardAchievement(childId, 'streak_3');
        } else if (newStreak === 7) {
          await get().awardAchievement(childId, 'streak_7');
        } else if (newStreak === 30) {
          await get().awardAchievement(childId, 'streak_30');
        }
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  },

  // Fetch projects
  fetchProjects: async (childId) => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (data) {
        set({ projects: data as Project[] });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  },

  // Save a project
  saveProject: async (childId, projectType, title, data) => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          child_id: childId,
          project_type: projectType,
          title,
          data,
        })
        .select()
        .single();

      if (error) throw error;

      if (project) {
        set((state) => ({
          projects: [project as Project, ...state.projects],
        }));

        // Award first project achievement
        if (get().projects.length === 1) {
          await get().awardAchievement(childId, 'first_project');
        }

        return project as Project;
      }
      return null;
    } catch (error) {
      console.error('Failed to save project:', error);
      return null;
    }
  },

  // Clear all progress (for sign out)
  clearProgress: () => {
    set({
      lessonProgress: {},
      achievements: [],
      streak: null,
      projects: [],
    });
  },
}));
