import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, CategoryId } from '../types';
import { useCharacterStore } from './characterStore';
import { todayString } from '../services/xpService';

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>) => void;
  updateHabit: (habitId: string, updates: Partial<Pick<Habit, 'title' | 'categoryId' | 'frequency' | 'xpReward' | 'icon'>>) => void;
  completeHabit: (habitId: string) => { xpGained: number; categoryId: CategoryId; leveledUp: boolean; newLevel: number; rankUp: boolean; newRank: string } | null;
  deleteHabit: (habitId: string) => void;
  runDailyReset: () => void;
  getTodaysHabits: () => Habit[];
}

function shouldCountStreak(freq: Habit['frequency'], date: Date): boolean {
  const day = date.getDay();
  if (freq === 'daily') return true;
  if (freq === 'weekdays') return day >= 1 && day <= 5;
  if (freq === 'weekends') return day === 0 || day === 6;
  if (freq === 'weekly') return day === 1;
  return true;
}

function wasYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          currentStreak: 0,
          longestStreak: 0,
          completions: [],
          createdAt: new Date().toISOString(),
          isCompletedToday: false,
        };
        set((state) => ({ habits: [newHabit, ...state.habits] }));
      },

      completeHabit: (habitId) => {
        const { habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit || habit.isCompletedToday) return null;

        const today = todayString();
        const newStreak = (wasYesterday(habit.lastCompletedDate ?? '') || habit.lastCompletedDate === today)
          ? habit.currentStreak + 1
          : 1;

        const updatedHabit: Habit = {
          ...habit,
          isCompletedToday: true,
          lastCompletedDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, habit.longestStreak),
          completions: [
            ...habit.completions.filter((c) => c.date !== today),
            { date: today, completedAt: new Date().toISOString() },
          ].slice(-90),
        };

        set((state) => ({
          habits: state.habits.map((h) => (h.id === habitId ? updatedHabit : h)),
        }));

        const lvl = useCharacterStore.getState().addXP(habit.categoryId, habit.xpReward);
        return { xpGained: habit.xpReward, categoryId: habit.categoryId, ...lvl };
      },

      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, ...updates } : h
          ),
        }));
      },

      deleteHabit: (habitId) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== habitId) }));
      },

      runDailyReset: () => {
        const today = todayString();
        const now = new Date();

        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.lastCompletedDate === today) return habit;

            const shouldHaveCompleted = shouldCountStreak(habit.frequency, now);
            const missedYesterday =
              shouldHaveCompleted &&
              habit.lastCompletedDate !== undefined &&
              !wasYesterday(habit.lastCompletedDate);

            return {
              ...habit,
              isCompletedToday: false,
              currentStreak: missedYesterday ? 0 : habit.currentStreak,
            };
          }),
        }));
      },

      getTodaysHabits: () => {
        const now = new Date();
        return get().habits.filter((h) => shouldCountStreak(h.frequency, now));
      },
    }),
    {
      name: 'ascend-habits-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
