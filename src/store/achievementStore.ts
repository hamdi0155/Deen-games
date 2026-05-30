import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants/achievements';

interface AchievementStore {
  unlockedIds: string[];
  pendingToast: Achievement | null;

  checkAndUnlock: (id: string) => Achievement | null;
  clearPendingToast: () => void;
  getAll: () => Achievement[];
  isUnlocked: (id: string) => boolean;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      pendingToast: null,

      checkAndUnlock: (id) => {
        const { unlockedIds } = get();
        if (unlockedIds.includes(id)) return null;

        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (!achievement) return null;

        const unlocked: Achievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        };

        set({
          unlockedIds: [...unlockedIds, id],
          pendingToast: unlocked,
        });

        return unlocked;
      },

      clearPendingToast: () => {
        set({ pendingToast: null });
      },

      getAll: () => {
        const { unlockedIds } = get();
        return ACHIEVEMENTS.map((a) => {
          if (unlockedIds.includes(a.id)) {
            return { ...a, unlockedAt: new Date().toISOString() };
          }
          return a;
        });
      },

      isUnlocked: (id) => {
        return get().unlockedIds.includes(id);
      },
    }),
    {
      name: 'ascend-achievements-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
