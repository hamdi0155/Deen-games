import { create } from 'zustand';
import { GameSession, UserProfile } from '@/types';
import { Question } from '@/types';

interface GameStore {
  session: GameSession | null;
  startSession: (questions: Question[]) => void;
  answerQuestion: (selectedIndex: number) => { correct: boolean; xpEarned: number };
  nextQuestion: () => void;
  endSession: () => void;
}

interface AuthStore {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  addXp: (amount: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  session: null,

  startSession: (questions) =>
    set({
      session: {
        questions,
        currentIndex: 0,
        score: 0,
        lives: 3,
        streak: 0,
        startedAt: Date.now(),
      },
    }),

  answerQuestion: (selectedIndex) => {
    const { session } = get();
    if (!session) return { correct: false, xpEarned: 0 };

    const question = session.questions[session.currentIndex];
    const correct = selectedIndex === question.correctIndex;
    const xpEarned = correct ? question.xpReward : 0;
    const streakBonus = correct && session.streak >= 2 ? Math.floor(xpEarned * 0.5) : 0;

    set({
      session: {
        ...session,
        score: session.score + (correct ? 1 : 0),
        lives: correct ? session.lives : session.lives - 1,
        streak: correct ? session.streak + 1 : 0,
      },
    });

    return { correct, xpEarned: xpEarned + streakBonus };
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, currentIndex: session.currentIndex + 1 } });
  },

  endSession: () => set({ session: null }),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  isLoading: true,

  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  addXp: (amount) =>
    set((state) => {
      if (!state.profile) return state;
      const totalXp = state.profile.totalXp + amount;
      const level = Math.floor(totalXp / 500) + 1;
      return { profile: { ...state.profile, totalXp, level } };
    }),
}));
