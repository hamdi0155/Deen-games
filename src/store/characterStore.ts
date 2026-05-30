import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, CategoryId, LevelUpResult, ActivityEntry } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { calcLevel, calcOverallLevel, getLifeRank, todayString } from '../services/xpService';
import { useAchievementStore } from './achievementStore';

interface CharacterStore {
  character: Character | null;
  isOnboarded: boolean;
  customCategoryXP: Record<string, { xp: number; level: number }>;
  activityLog: ActivityEntry[];
  createCharacter: (name: string, avatarEmoji: string) => void;
  addXP: (categoryId: CategoryId, amount: number) => LevelUpResult;
  addCustomCategoryXP: (categoryId: string, amount: number) => { xp: number; level: number };
  removeCustomCategoryXP: (categoryId: string) => void;
  updateName: (name: string) => void;
  updateAvatar: (avatarEmoji: string) => void;
  reset: () => void;
  resetCharacter: () => void;
  logActivity: (entry: Omit<ActivityEntry, 'id'>) => void;
  clearOldActivity: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: null,
      isOnboarded: false,
      customCategoryXP: {},
      activityLog: [],

      createCharacter: (name, avatarEmoji) => {
        const character: Character = {
          id: crypto.randomUUID(),
          name,
          avatarEmoji,
          createdAt: new Date().toISOString(),
          categories: { ...DEFAULT_CATEGORIES },
          totalXP: 0,
          overallLevel: 0,
          lifeRank: 'Wanderer',
          lastActiveDate: todayString(),
        };
        set({ character, isOnboarded: true });
      },

      addXP: (categoryId, amount) => {
        const { character } = get();
        if (!character) return { leveledUp: false, newLevel: 0, rankUp: false, newRank: '' };

        const cat = character.categories[categoryId];
        const oldLevel = cat.level;
        const newXP = cat.xp + amount;
        const newLevel = calcLevel(newXP);

        const newTotalXP = character.totalXP + amount;
        const newOverallLevel = calcOverallLevel(newTotalXP);
        const oldRank = character.lifeRank;
        const newRank = getLifeRank(newOverallLevel);

        set({
          character: {
            ...character,
            totalXP: newTotalXP,
            overallLevel: newOverallLevel,
            lifeRank: newRank,
            lastActiveDate: todayString(),
            categories: {
              ...character.categories,
              [categoryId]: {
                ...cat,
                xp: newXP,
                level: newLevel,
              },
            },
          },
        });

        // Achievement checks
        const ach = useAchievementStore.getState();
        if (newTotalXP >= 100) ach.checkAndUnlock('xp_100');
        if (newTotalXP >= 1000) ach.checkAndUnlock('xp_1000');
        if (newTotalXP >= 5000) ach.checkAndUnlock('xp_5000');
        if (newTotalXP >= 10000) ach.checkAndUnlock('xp_10000');
        if (newTotalXP >= 50000) ach.checkAndUnlock('xp_50000');

        if (newOverallLevel >= 5) ach.checkAndUnlock('level_5');
        if (newOverallLevel >= 10) ach.checkAndUnlock('level_10');
        if (newOverallLevel >= 20) ach.checkAndUnlock('level_20');
        if (newOverallLevel >= 50) ach.checkAndUnlock('level_50');

        // Category level achievements
        if (newLevel >= 5) ach.checkAndUnlock('cat_level_5');
        if (newLevel >= 10) ach.checkAndUnlock('cat_level_10');

        return {
          leveledUp: newLevel > oldLevel,
          newLevel,
          rankUp: newRank !== oldRank,
          newRank,
        };
      },

      addCustomCategoryXP: (categoryId, amount) => {
        const { customCategoryXP, character } = get();
        const prev = customCategoryXP[categoryId] ?? { xp: 0, level: 0 };
        const newXP = prev.xp + amount;
        const newLevel = calcLevel(newXP);
        const updated = { xp: newXP, level: newLevel };

        // Also add to totalXP on character
        if (character) {
          const newTotalXP = character.totalXP + amount;
          const newOverallLevel = calcOverallLevel(newTotalXP);
          const newRank = getLifeRank(newOverallLevel);
          set({
            customCategoryXP: { ...customCategoryXP, [categoryId]: updated },
            character: {
              ...character,
              totalXP: newTotalXP,
              overallLevel: newOverallLevel,
              lifeRank: newRank,
              lastActiveDate: todayString(),
            },
          });

          // Achievement checks for custom XP too
          const ach = useAchievementStore.getState();
          if (newTotalXP >= 100) ach.checkAndUnlock('xp_100');
          if (newTotalXP >= 1000) ach.checkAndUnlock('xp_1000');
          if (newTotalXP >= 5000) ach.checkAndUnlock('xp_5000');
          if (newTotalXP >= 10000) ach.checkAndUnlock('xp_10000');
          if (newTotalXP >= 50000) ach.checkAndUnlock('xp_50000');
          if (newOverallLevel >= 5) ach.checkAndUnlock('level_5');
          if (newOverallLevel >= 10) ach.checkAndUnlock('level_10');
          if (newOverallLevel >= 20) ach.checkAndUnlock('level_20');
          if (newOverallLevel >= 50) ach.checkAndUnlock('level_50');
        } else {
          set({ customCategoryXP: { ...customCategoryXP, [categoryId]: updated } });
        }

        return updated;
      },

      removeCustomCategoryXP: (categoryId) => {
        const { customCategoryXP } = get();
        const updated = { ...customCategoryXP };
        delete updated[categoryId];
        set({ customCategoryXP: updated });
      },

      updateName: (name) => {
        const { character } = get();
        if (!character) return;
        set({ character: { ...character, name } });
      },

      updateAvatar: (avatarEmoji) => {
        const { character } = get();
        if (!character) return;
        set({ character: { ...character, avatarEmoji } });
      },

      reset: () => set({ character: null, isOnboarded: false, customCategoryXP: {}, activityLog: [] }),

      resetCharacter: () => set({ character: null, isOnboarded: false, customCategoryXP: {}, activityLog: [] }),

      logActivity: (entry) => {
        const newEntry: ActivityEntry = { ...entry, id: crypto.randomUUID() };
        set((state) => ({
          activityLog: [newEntry, ...state.activityLog].slice(0, 50),
        }));
      },

      clearOldActivity: () => {
        set((state) => ({ activityLog: state.activityLog.slice(0, 50) }));
      },
    }),
    {
      name: 'ascend-character-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
