import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Parent, Child, Profile } from '@/types';

interface AuthState {
  // State
  user: Profile | null;
  parent: Parent | null;
  children: Child[];
  activeChild: Child | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isParentMode: boolean;

  // Actions
  setUser: (user: Profile | null) => void;
  setParent: (parent: Parent | null) => void;
  setChildren: (children: Child[]) => void;
  setActiveChild: (child: Child | null) => void;
  setIsLoading: (loading: boolean) => void;
  toggleParentMode: () => void;

  // Async actions
  initialize: () => Promise<void>;
  fetchUserData: (userId: string) => Promise<void>;
  fetchChildren: (parentId: string) => Promise<void>;
  addChild: (child: Omit<Child, 'id' | 'created_at'>) => Promise<Child | null>;
  updateChild: (childId: string, updates: Partial<Child>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  parent: null,
  children: [],
  activeChild: null,
  isLoading: true,
  isAuthenticated: false,
  isParentMode: false,

  // Setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setParent: (parent) => set({ parent }),
  setChildren: (children) => set({ children }),
  setActiveChild: (child) => set({ activeChild: child }),
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleParentMode: () => set((state) => ({ isParentMode: !state.isParentMode })),

  // Initialize auth state on app load
  initialize: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Set authenticated immediately
        set({ isAuthenticated: true });
        await get().fetchUserData(session.user.id);
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch user profile and parent data
  fetchUserData: async (userId: string) => {
    try {
      // Set authenticated immediately since we have a valid user ID
      set({ isAuthenticated: true });

      // Fetch profile (optional - may not exist)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        set({ user: profile });
      }

      // Fetch parent record
      const { data: parent } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (parent) {
        set({ parent });
        // Fetch children
        await get().fetchChildren(parent.id);
      } else {
        // Create parent record if it doesn't exist
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const { data: newParent } = await supabase
            .from('parents')
            .insert({
              user_id: userId,
              email: user.email,
            })
            .select()
            .single();

          if (newParent) {
            set({ parent: newParent });
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  },

  // Fetch children for a parent
  fetchChildren: async (parentId: string) => {
    try {
      const { data: children } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });

      if (children) {
        set({ children });
        // Set first child as active if none selected
        if (children.length > 0 && !get().activeChild) {
          set({ activeChild: children[0] });
        }
      }
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  },

  // Add a new child profile
  addChild: async (childData) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .insert(childData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set((state) => ({
          children: [...state.children, data],
          activeChild: state.activeChild || data,
        }));
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to add child:', error);
      return null;
    }
  },

  // Update child profile
  updateChild: async (childId, updates) => {
    try {
      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId);

      if (error) throw error;

      set((state) => ({
        children: state.children.map((c) =>
          c.id === childId ? { ...c, ...updates } : c
        ),
        activeChild:
          state.activeChild?.id === childId
            ? { ...state.activeChild, ...updates }
            : state.activeChild,
      }));
    } catch (error) {
      console.error('Failed to update child:', error);
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        parent: null,
        children: [],
        activeChild: null,
        isAuthenticated: false,
        isParentMode: false,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  },
}));

// Auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();

  console.log('Auth state change:', event, !!session?.user);

  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
    // Set authenticated immediately, then fetch additional data
    useAuthStore.setState({ isAuthenticated: true });
    await store.fetchUserData(session.user.id);
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ isAuthenticated: false });
    store.setUser(null);
    store.setParent(null);
    store.setChildren([]);
    store.setActiveChild(null);
  }
});
