import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface UserState {
  user: User | null;
  session: Session | null;
  credits: number;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  credits: 0,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, session: null, credits: 0 });
  },
  refreshCredits: async () => {
    const { user } = get();
    if (!user) return;
    const supabase = createClient();
    // Assuming 'profiles' table has 'id' and 'credits'
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (data) {
      set({ credits: data.credits ?? 0 });
    }
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null });

      if (session?.user) {
        await get().refreshCredits();
      }

      // Setup listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          get().refreshCredits();
        }
      });
    } catch (e) {
      console.error("Session check failed", e);
    } finally {
      set({ isLoading: false });
    }
  }
}));